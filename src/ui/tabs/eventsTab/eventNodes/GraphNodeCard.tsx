import { FormSelectDropdown } from '@spooder/webui-component-library';
import React from 'react';
import { EventGraphNodeKind, KeyedObject, NodePortDataType } from '../../../Types';
import { buildNodeValueKey } from '../FormKeys';
import { colorForPort, EXEC_COLOR } from './canvas/portColors';
import {
  CARD_PADDING_X,
  HANDLE_SPACING,
  HEADER_HEIGHT,
  nodeCardHeight,
  NodePortLayout,
  TITLE_HEIGHT,
} from './canvas/nodeLayout';
import PortSocket from './canvas/PortSocket';
import { ResolvedNodeDef } from './nodeDefLookup';
import NodeFieldInput from './NodeFieldInput';
import { OscLiveValue, useOscLiveValue } from './OscLiveValues';

// One line of a code field's value for the card's preview row, which clips to a single line -
// a multi-line script would otherwise show only its blank first line, or overflow the clip.
function firstLine(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }
  const line = value.split('\n').find((l) => l.trim().length > 0);
  return line?.trim() ?? '';
}

export interface GraphNodeCardProps {
  id: string;
  kind: EventGraphNodeKind;
  moduleName: string;
  nodeTypeId: string;
  def?: ResolvedNodeDef;
  selected: boolean;
  // Computed by NodeGraphCanvas and shared with EdgeLayer, so the sockets drawn here and the
  // edge endpoints drawn there are guaranteed to be the same geometry.
  layout: NodePortLayout;
  // Resolved by NodeGraphCanvas (the user's own resize, this node type's declared nodeWidth, or
  // the standard width) and shared with EdgeLayer for the same reason as `layout`.
  width: number;
  // Identify this node's slot in the form so inline controls bind to the same keys the
  // inspector pane uses - editing on the card and in the pane drive one value.
  eventName: string;
  nodeIndex: number;
  // The node's current form values, for the readouts the card draws beside its outputs.
  values?: KeyedObject;
  // Set for a trigger whose exec output isn't wired to anything: the card flags it, since such
  // a graph looks finished but can never run.
  unlinked?: boolean;
  // Input port ids that currently have an edge landing on them - those sockets can be grabbed
  // to unhook the wire, so they advertise a grab cursor.
  connectedInputPorts?: Set<string>;
  // `additive` is a shift/ctrl-held click: the canvas toggles this node in the selection
  // instead of replacing it.
  onSelect: (nodeId: string, additive: boolean) => void;
  onNodePointerDown: (e: React.PointerEvent<HTMLDivElement>, nodeId: string) => void;
  onStartConnection: (
    e: React.PointerEvent,
    nodeId: string,
    portId: string,
    dataType: NodePortDataType | undefined,
  ) => void;
  // Returns true when a wire was actually detached, so the socket can swallow the event and
  // keep the card's body-drag from starting underneath it.
  onDetachConnection: (e: React.PointerEvent, nodeId: string, portId: string) => boolean;
  // Grabbing the card's right edge. `onResetWidth` is the double-click on the same handle,
  // dropping back to whatever width the node type asks for.
  onStartResize: (e: React.PointerEvent, nodeId: string, width: number) => void;
  onResetWidth: (nodeId: string) => void;
}

// Selection accent: the theme's two analogous colors (hue ±30, set by the component library's
// ThemeProvider), so a picked node reads in whatever hue the app is themed rather than a fixed
// yellow. The fallbacks keep the old yellow for any context without those variables.
const SELECTION_CW = 'var(--color-analogous-cw, #f1c40f)';
const SELECTION_CCW = 'var(--color-analogous-ccw, #f1c40f)';
// A border takes no gradient of its own, so the card paints two background layers: its normal
// surface color clipped to the padding box, and the gradient clipped to the border box - which
// leaves the gradient visible only in the 2px ring.
const SELECTION_BORDER_LAYERS =
  `linear-gradient(var(--color-background-near, #2a2a2a), var(--color-background-near, #2a2a2a)), ` +
  `linear-gradient(135deg, ${SELECTION_CW}, ${SELECTION_CCW})`;
// box-shadow takes no gradient either, so the halo is two offset glows - clockwise from the top
// left, counter-clockwise from the bottom right - blending across the card into the same sweep
// the border shows.
const SELECTION_GLOW =
  `-4px -4px 12px -3px color-mix(in srgb, ${SELECTION_CW} 70%, transparent), ` +
  `4px 4px 12px -3px color-mix(in srgb, ${SELECTION_CCW} 70%, transparent)`;

// Reuses the theme's delete/danger red, so the warning reads as a problem in whatever hue the
// app is themed.
const UNLINKED_COLOR = 'var(--color-delete-border, #df1414)';

const KIND_COLOR: { [key in EventGraphNodeKind]: string } = {
  callback: '#8e44ad',
  action: '#2980b9',
  operation: '#16a085',
};

// Mirrors NodePortDataType. Used for outputs whose type the user assigns (the OSC trigger's
// args); the selected value drives both the socket color and this label's color.
const PORT_TYPE_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
];

// Renders one port's slice of the last received OSC message. Port ids are 'arg0'..'argN-1'
// (see buildOscTriggerOutputs), so the index is read straight off the id; 'address' and any
// other port has nothing live to show.
function formatLiveArg(live: OscLiveValue, portId: string): string {
  if (portId === 'address') {
    return '';
  }
  const match = /^arg(\d+)$/.exec(portId);
  if (!match) {
    return '';
  }
  const value = live.args[Number(match[1])];
  if (value === undefined) {
    return '—';
  }
  return typeof value === 'string' ? value : JSON.stringify(value);
}

// Concat's result, as far as it can be known while editing: literal slots read out as typed,
// and a slot fed by a wire stands in as its own slot label - '{A}', '{B}' - since its real
// value only exists when the graph runs. The placeholder names the slot rather than counting
// the wires so it points straight at the socket the value lands on: a preview reading
// 'hi {C}!' says which input to follow without counting rows.
function buildConcatPreview(
  form: { [fieldName: string]: any } | undefined,
  values: KeyedObject | undefined,
  connectedInputPorts?: Set<string>,
): string {
  return Object.entries(form ?? {})
    .map(([slot, field]) => {
      if (connectedInputPorts?.has(slot)) {
        // Same label the slot's own row draws, so the two always read as the same input.
        return `{${field?.label ?? slot.toUpperCase()}}`;
      }
      const value = values?.[slot];
      return value === undefined || value === null ? '' : String(value);
    })
    .join('');
}

const rowLabelStyle: React.CSSProperties = {
  position: 'absolute',
  height: HANDLE_SPACING,
  lineHeight: `${HANDLE_SPACING}px`,
  fontSize: '0.75rem',
  opacity: 0.8,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  // Every row already clips to its own box, which is sized from the card's width - so the label
  // just fills whatever it's given rather than carrying a width of its own.
  maxWidth: '100%',
  // Dragging a node sweeps the pointer across these labels, which would otherwise
  // select their text. Applied per text element rather than to the card so the inline
  // inputs and code editor stay selectable and editable.
  userSelect: 'none',
};

// The whole card body drags the node, so a pointerdown that lands on something the user means
// to operate (any inline control, which is always wrapped in `.node-inline-field`) must not
// start a drag - startDrag preventDefault()s, which would otherwise stop the control from
// focusing at all.
function isInteractiveTarget(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null;
  return Boolean(
    element?.closest?.(
      '.node-inline-field, input, textarea, select, button, [contenteditable="true"]',
    ),
  );
}

// Grab strip down the card's right edge - invisible, with the ew-resize cursor as its only
// hint, but wide enough to catch without aiming. The output sockets sit on the same edge and
// stay on top of it (see its z-index), so the finer target still wins where the two overlap.
const RESIZE_HANDLE_WIDTH = 8;

export default function GraphNodeCard(props: GraphNodeCardProps) {
  const {
    id,
    kind,
    moduleName,
    nodeTypeId,
    def,
    selected,
    layout,
    width,
    eventName,
    nodeIndex,
    values,
    unlinked,
    connectedInputPorts,
    onSelect,
    onNodePointerDown,
    onStartConnection,
    onDetachConnection,
    onStartResize,
    onResetWidth,
  } = props;
  const rowWidth = width - CARD_PADDING_X * 2;
  const label = def?.label ?? nodeTypeId;

  const { inputs, outputs, fieldRows, outputRows } = layout;
  // Live readout for OSC triggers: keyed on the address this node listens to, so the
  // card shows what actually arrived. Undefined for every other node type.
  const isOscTrigger = moduleName === 'core' && nodeTypeId === 'osc_trigger';
  const liveArgs = useOscLiveValue(isOscTrigger ? values?.address : undefined);
  // Concat shows what it will produce right beside its Result socket, so a chain of wires and
  // literals can be read off the card without running the event.
  const concatPreview =
    kind === 'operation' && nodeTypeId === 'concat'
      ? buildConcatPreview(def?.form, values, connectedInputPorts)
      : '';
  // The preview is the only readout on a card that routinely outruns the row it sits in - it's
  // the entire string the node will produce. Clicking it opens the full text in a panel below
  // the Result row instead of growing the row, because every socket offset on this card is
  // computed from the row heights nodeLayout hands down: a row that sized itself to its content
  // would drift out of sync with that math and detach this node's edges from their dots.
  const [previewExpanded, setPreviewExpanded] = React.useState(false);
  // The panel hangs past the card's bottom edge over the canvas, so left open it would sit on
  // top of whatever the user moved on to - it belongs to the node being worked on. The render
  // below gates on `selected` so it's gone the same frame the node is deselected; this resets
  // the state behind it, so coming back to the node starts collapsed rather than having the
  // panel spring open again on its own.
  React.useEffect(() => {
    if (!selected) {
      setPreviewExpanded(false);
    }
  }, [selected]);
  // Every output - wireable data port, named exec branch, or an action's read-only output -
  // is an absolutely positioned row from the layout. Exec branches used to render in normal
  // document flow under the title instead, which put them straight on top of the first field
  // row's label (the If node drew 'out: Then' over 'Condition').
  //
  // Field rows and output rows are positioned at the exact analytical `top` the layout
  // computed (rather than left to stack in normal document flow) so a row and its dot always
  // land on the same pixel. Normal flow's per-row height depends on font metrics and control
  // sizing, which would drift out of sync with the sockets and detach the edges.
  const cardHeight = nodeCardHeight(layout);

  return (
    <div
      onPointerDown={(e) => {
        // Left button only: a middle press is a pan gesture that starts wherever the cursor
        // happens to be (including on top of a card), and a right press opens the node menu -
        // neither should reshuffle the selection on its way through.
        if (e.button !== 0) {
          return;
        }
        onSelect(id, e.shiftKey || e.ctrlKey);
        // Sockets stop propagation themselves when they start/detach a wire, so anything that
        // reaches here is either the header, the title, a label, or bare card background.
        if (isInteractiveTarget(e.target)) {
          return;
        }
        onNodePointerDown(e, id);
      }}
      style={{
        position: 'relative',
        cursor: 'grab',
        width,
        minHeight: cardHeight,
        borderRadius: 6,
        // The ring keeps its width either way, so selecting a node never nudges its layout:
        // when selected the border turns transparent and the gradient layers below show through
        // it instead of a flat color.
        border: `2px solid ${selected ? 'transparent' : KIND_COLOR[kind]}`,
        backgroundColor: 'var(--color-background-near, #2a2a2a)',
        backgroundImage: selected ? SELECTION_BORDER_LAYERS : undefined,
        backgroundOrigin: 'border-box',
        backgroundClip: selected ? 'padding-box, border-box' : undefined,
        color: 'var(--color-text, #eee)',
        // Drawn as an outline rather than a border so it sits outside the card and can't fight
        // the selection ring for the same 2px, and both can show at once.
        outline: unlinked ? `2px solid ${UNLINKED_COLOR}` : undefined,
        outlineOffset: 2,
        boxShadow: selected
          ? SELECTION_GLOW
          : unlinked
            ? `0 0 10px -2px color-mix(in srgb, ${UNLINKED_COLOR} 70%, transparent)`
            : 'none',
        // Nothing on the card is selectable by default, so a pointer sweep that starts
        // anywhere on it can't drag-select label text. The inline controls opt back in via
        // `.node-inline-field` in EventTab.scss so their values stay editable.
        userSelect: 'none',
      }}
    >
      <div
        style={{
          height: HEADER_HEIGHT,
          boxSizing: 'border-box',
          background: KIND_COLOR[kind],
          padding: '4px 8px',
          borderRadius: '4px 4px 0 0',
          fontSize: '0.7rem',
          opacity: 0.85,
          cursor: 'grab',
          userSelect: 'none',
        }}
      >
        {moduleName}
        {unlinked ? (
          <span
            title="This trigger's exec output isn't connected, so nothing will run when it fires."
            style={{ float: 'right', color: UNLINKED_COLOR, fontWeight: 'bold' }}
          >
            ⚠ not connected
          </span>
        ) : null}
      </div>
      <div
        style={{
          height: TITLE_HEIGHT,
          boxSizing: 'border-box',
          padding: '8px',
          fontWeight: 'bold',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
        // The inspector panel stays shut for node types with nothing to configure there, so a
        // node's description would otherwise have nowhere left to appear.
        title={def?.description ? `${label} - ${def.description}` : label}
      >
        {label}
      </div>

      {fieldRows.map((row) => (
        <div
          key={row.fieldName}
          style={{
            position: 'absolute',
            top: row.top,
            left: CARD_PADDING_X,
            width: rowWidth,
            height: row.height,
            // Guarantees a control that renders taller than its declared CONTROL_HEIGHTS
            // entry gets clipped rather than pushing the next row out of alignment.
            overflow: 'hidden',
            paddingLeft: '0.35rem',
            paddingRight: '0.35rem',
          }}
        >
          <div style={{ ...rowLabelStyle, position: 'static' }}>
            {row.field.label ?? row.fieldName}
          </div>
          {row.showsControl && row.previewOnly ? (
            // The editor for this field is in the inspector; the card shows the first line of
            // what's there so the node is still identifiable at a glance.
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                opacity: 0.6,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title='Select this node to edit in the inspector'
            >
              {firstLine(values?.[row.fieldName]) || 'Select the node to edit'}
            </div>
          ) : row.showsControl ? (
            // .node-inline-field (EventTab.scss) shrinks the shared Form* controls to the
            // fixed row heights nodeLayout computes socket offsets from.
            <div className='node-inline-field'>
              <NodeFieldInput
                formKey={buildNodeValueKey(eventName, nodeIndex, row.fieldName)}
                field={row.field}
                moduleName={moduleName}
                label=''
                compact
              />
            </div>
          ) : null}
        </div>
      ))}
      {outputRows.map((row) => (
        <div
          key={row.portId}
          style={{
            position: 'absolute',
            top: row.top,
            right: CARD_PADDING_X,
            width: rowWidth,
            height: row.height,
            overflow: 'hidden',
            textAlign: 'right',
          }}
        >
          <div
            style={{
              ...rowLabelStyle,
              position: 'static',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 6,
            }}
          >
            {/* Readout sits on the label's own line so row heights - and therefore every
                socket offset - stay exactly as nodeLayout computed them. */}
            {(() => {
              const readout = liveArgs
                ? formatLiveArg(liveArgs, row.portId)
                : row.portId === 'result'
                  ? concatPreview
                  : '';
              if (!readout) {
                return null;
              }
              const readoutStyle: React.CSSProperties = {
                flex: '0 1 auto',
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontFamily: 'monospace',
                opacity: 0.65,
              };
              if (liveArgs || row.portId !== 'result') {
                return (
                  <span style={readoutStyle} title={liveArgs ? 'Last received value' : readout}>
                    {readout}
                  </span>
                );
              }
              return (
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewExpanded((open) => !open);
                  }}
                  style={{
                    ...readoutStyle,
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'inherit',
                    // A button opts out of inherited text metrics, and the row's are what keep
                    // this sitting on the label's line.
                    fontSize: 'inherit',
                    lineHeight: 'inherit',
                    textAlign: 'right',
                    // The only thing saying there's more behind the ellipsis.
                    textDecoration: 'underline dotted',
                    cursor: 'pointer',
                  }}
                  // Keeps the hover readout the plain <span> gave, with the new gesture
                  // appended - a short preview is still fastest to read without clicking.
                  title={`${readout}\n\n${previewExpanded ? 'Click to hide' : 'Click to show in full'}`}
                >
                  {readout}
                </button>
              );
            })()}
            <span
              style={{
                flex: '0 0 auto',
                // Type-coded to match this port's socket, so an arg's type reads at a glance.
                // An exec branch has no data type, and takes the exec socket's own colour.
                color: row.isExec ? EXEC_COLOR : colorForPort(row.dataType),
                // Nothing can wire to a read-only output, so it reads as an aside rather than
                // as a port someone is meant to reach for.
                opacity: row.readOnly ? 0.6 : 1,
              }}
            >
              {row.label}
              {row.readOnly ? ' (not wireable)' : ''}
            </span>
          </div>
          {row.typeValuePath ? (
            <div className='node-inline-field'>
              <FormSelectDropdown
                formKey={buildNodeValueKey(eventName, nodeIndex, ...row.typeValuePath)}
                options={PORT_TYPE_OPTIONS}
              />
            </div>
          ) : null}
        </div>
      ))}

      {/* The expanded preview. A sibling of the output rows rather than a child of the Result
          row, because that row clips to the exact height nodeLayout gave it - anything drawn
          inside it is cut off at one line. Sized off the row instead of stacked after it for
          the same reason: it hangs below the card, overlapping the canvas, so opening it moves
          nothing on the card and no socket shifts under a live wire. */}
      {selected && previewExpanded && concatPreview
        ? (() => {
            const resultRow = outputRows.find((row) => row.portId === 'result');
            if (!resultRow) {
              return null;
            }
            return (
              <div
                // Swallows the press so it neither reselects the node nor starts a body-drag,
                // leaving the text free to be selected and copied.
                onPointerDown={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  top: resultRow.top + resultRow.height + 2,
                  left: CARD_PADDING_X,
                  width: rowWidth,
                  boxSizing: 'border-box',
                  padding: '6px 8px',
                  borderRadius: 4,
                  border: '1px solid var(--color-border, #444)',
                  // The card's own surface, not the canvas's: the panel hangs past the card's
                  // bottom edge, so matching the card is what reads it as part of this node
                  // rather than as something painted on the graph behind it.
                  backgroundColor: 'var(--color-background-near, #2a2a2a)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.45)',
                  fontFamily: 'monospace',
                  fontSize: '0.7rem',
                  opacity: 0.95,
                  // Long literals wrap; a slot holding one unbroken token breaks mid-word rather
                  // than pushing a scrollbar sideways.
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                  // Tall enough for a paragraph, past which it scrolls rather than covering the
                  // graph below it.
                  maxHeight: 180,
                  overflowY: 'auto',
                  // Over the card body and its resize strip; the sockets it could reach sit at
                  // z-index 2 on an edge this panel is inset from.
                  zIndex: 3,
                  // The card sets userSelect: 'none' wholesale - the point of this panel is to
                  // read the string, so it opts back in.
                  userSelect: 'text',
                  cursor: 'text',
                }}
              >
                {concatPreview}
              </div>
            );
          })()
        : null}

      <div
        title='Drag to resize - double click to reset'
        onPointerDown={(e) => onStartResize(e, id, width)}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onResetWidth(id);
        }}
        style={{
          position: 'absolute',
          top: HEADER_HEIGHT,
          right: 0,
          bottom: 0,
          width: RESIZE_HANDLE_WIDTH,
          cursor: 'ew-resize',
          // Below the sockets (z-index 2), which sit on this same edge and are the finer target.
          zIndex: 1,
        }}
      />

      {inputs.map((p) => (
        <PortSocket
          key={`in:${p.portId}`}
          nodeId={id}
          portId={p.portId}
          side='in'
          top={p.top}
          dataType={p.dataType}
          connected={connectedInputPorts?.has(p.portId)}
          onDetachConnection={onDetachConnection}
        />
      ))}
      {outputs.map((p) => (
        <PortSocket
          key={`out:${p.portId}`}
          nodeId={id}
          portId={p.portId}
          side='out'
          top={p.top}
          dataType={p.dataType}
          label={p.label}
          onStartConnection={onStartConnection}
        />
      ))}
    </div>
  );
}
