import { FormSelectDropdown } from '@spooder/webui-component-library';
import React from 'react';
import { EventGraphNodeKind, KeyedObject, NodePortDataType } from '../../../Types';
import { buildNodeValueKey } from '../FormKeys';
import { colorForPort } from './canvas/portColors';
import {
  HANDLE_SPACING,
  HEADER_HEIGHT,
  nodeCardHeight,
  NODE_WIDTH,
  NodePortLayout,
  TITLE_HEIGHT
} from './canvas/nodeLayout';
import PortSocket from './canvas/PortSocket';
import { ResolvedNodeDef } from './nodeDefLookup';
import NodeFieldInput from './NodeFieldInput';
import { OscLiveValue, useOscLiveValue } from './OscLiveValues';

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
  // Identify this node's slot in the form so inline controls bind to the same keys the
  // inspector pane uses - editing on the card and in the pane drive one value.
  eventName: string;
  nodeIndex: number;
  // The node's current form values, for the readouts the card draws beside its outputs.
  values?: KeyedObject;
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
// and a slot fed by a wire stands in as '{node_1}', '{node_2}', ... numbered in wire order,
// since its real value only exists when the graph runs.
function buildConcatPreview(
  form: { [fieldName: string]: any } | undefined,
  values: KeyedObject | undefined,
  connectedInputPorts?: Set<string>,
): string {
  let wired = 0;
  return Object.keys(form ?? {})
    .map((slot) => {
      if (connectedInputPorts?.has(slot)) {
        wired += 1;
        return `{node_${wired}}`;
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
  maxWidth: NODE_WIDTH - 24,
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
  return Boolean(element?.closest?.('.node-inline-field, input, textarea, select, button, [contenteditable="true"]'));
}

export default function GraphNodeCard(props: GraphNodeCardProps) {
  const {
    id,
    kind,
    moduleName,
    nodeTypeId,
    def,
    selected,
    layout,
    eventName,
    nodeIndex,
    values,
    connectedInputPorts,
    onSelect,
    onNodePointerDown,
    onStartConnection,
    onDetachConnection,
  } = props;
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
  // Operation/callback outputs render as wireable sockets below (via computeNodePortLayout);
  // only action-node outputs (not resolved by the executor yet, so no socket exists for them)
  // fall back to plain read-only text.
  const readOnlyOutputs = kind === 'action' ? (def?.outputs ?? []) : [];
  // Named exec branches (an 'if' node's then/else) sit right at the top of the card, in the
  // same header/title band, by convention - so unlike data ports they can't be aligned to
  // their dot's `top` without overlapping the title. They keep the old normal-flow rendering.
  const execBranchRows = outputs.filter((p) => p.label);
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
        width: NODE_WIDTH,
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
        boxShadow: selected ? SELECTION_GLOW : 'none',
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

      {(readOnlyOutputs.length > 0 || execBranchRows.length > 0) && (
        <div style={{ padding: '0 8px 8px', fontSize: '0.75rem', opacity: 0.8, userSelect: 'none' }}>
          {readOnlyOutputs.map((output) => (
            <div key={output.id}>out: {output.label} (not wireable)</div>
          ))}
          {execBranchRows.map((p) => (
            <div key={p.portId}>out: {p.label}</div>
          ))}
        </div>
      )}

      {fieldRows.map((row) => (
        <div
          key={row.fieldName}
          style={{
            position: 'absolute',
            top: row.top,
            left: 12,
            width: NODE_WIDTH - 24,
            height: row.height,
            // Guarantees a control that renders taller than its declared CONTROL_HEIGHTS
            // entry gets clipped rather than pushing the next row out of alignment.
            overflow: 'hidden',
            paddingLeft:'0.35rem',
            paddingRight:'0.35rem'
          }}
        >
          <div style={{ ...rowLabelStyle, position: 'static', maxWidth: '100%' }}>{row.field.label ?? row.fieldName}</div>
          {row.showsControl ? (
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
            right: 12,
            width: NODE_WIDTH - 24,
            height: row.height,
            overflow: 'hidden',
            textAlign: 'right',
          }}
        >
          <div
            style={{
              ...rowLabelStyle,
              position: 'static',
              maxWidth: '100%',
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
              return (
                <span
                  style={{
                    flex: '0 1 auto',
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontFamily: 'monospace',
                    opacity: 0.65,
                  }}
                  title={liveArgs ? 'Last received value' : readout}
                >
                  {readout}
                </span>
              );
            })()}
            <span
              style={{
                flex: '0 0 auto',
                // Type-coded to match this port's socket, so an arg's type reads at a glance.
                color: colorForPort(row.dataType),
              }}
            >
              {row.label}
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
