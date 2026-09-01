// The types a module needs to describe itself and its fields. These are the definitions -
// the WebUI's own ui/Types re-exports them from here so host and modules cannot drift onto
// two different shapes of the same thing.

export interface KeyedObject {
  [key: string]: any;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export type NodePortDataType = 'string' | 'number' | 'boolean' | 'any';

export interface NodeFieldDef {
  label: string;
  description?: string;
  // 'custom' renders a module-provided component: options.component must name a
  // renderer registered by the owning module via ModuleDefinition.fieldRenderers.
  // 'port' is a wire-only input: it draws a labelled socket and nothing else, for values that
  // can only sensibly come from another node (an array, an object) and have no typeable form.
  // 'textarea' is a multi-line block of plain text. It is always edited in the inspector, since
  // no node card row is tall enough to write a paragraph in - the card shows a preview instead.
  type:
    | 'asset'
    | 'boolean'
    | 'color'
    | 'code'
    | 'select'
    | 'text'
    | 'textarea'
    | 'number'
    | 'custom'
    | 'port';
  options?: KeyedObject;
  showif?: { variable: string; condition: string; value: any };
  // When set, this field is also a connectable input port of the given data type: the
  // frontend renders it as an inline editable value when unwired, or as a socket fed by
  // another node's output when a data edge targets it.
  portType?: NodePortDataType;
  // Edited in the inspector rather than on the node card, which draws a one-line preview of the
  // value in its place. For a field that would cost more card height than it earns there - a
  // grown list of them, especially - where the row still has to exist for its socket. See
  // fieldEditedInInspector in canvas/nodeLayout.ts.
  editInInspector?: boolean;
  // One slot of a self-extending list (e.g. Concat's C..H inputs): hidden until every field
  // before it is filled or wired, so the node offers exactly one empty slot at a time. See
  // growableFieldVisible in nodeFieldVisibility.ts.
  growable?: boolean;
}

export interface TriggerTestDef {
  params: TriggerTestParam[];
  // Shown above the controls: what firing this test actually does, where that isn't obvious.
  note?: string;
}

export interface TriggerTestParam {
  id: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  selections?: { [value: string]: string };
  default?: string | number | boolean;
  description?: string;
}
