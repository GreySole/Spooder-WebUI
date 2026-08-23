import { Stack, TypeFace } from '@spooder/webui-component-library';
import { buildNodeValueKey } from '../FormKeys';
import { ResolvedNodeDef } from './nodeDefLookup';
import { fieldEditedInInspector } from './canvas/nodeLayout';
import { fieldSatisfiesShowif } from './nodeFieldVisibility';
import NodeFieldInput from './NodeFieldInput';
import { KeyedObject } from '../../../Types';

interface InspectorTextFieldsProps {
  eventName: string;
  nodeIndex: number;
  moduleName: string;
  def: ResolvedNodeDef;
  values?: KeyedObject;
  connectedInputPorts?: Set<string>;
}

// Editors for the fields a node card can't host usefully. Two reasons a field lands here: it
// holds more than a row can show - a Template's text, a Text block, a plugin node's `code`
// input, all written rather than glanced at against a 56px scroll box - or there are simply too
// many of them, which is how an interaction node's per-button label and style arrive.
//
// The card draws a one-line preview in their place, so exactly one control stays bound to each
// form key - see fieldEditedInInspector for why they move rather than being duplicated.
export default function InspectorTextFields(props: InspectorTextFieldsProps) {
  const { eventName, nodeIndex, moduleName, def, values, connectedInputPorts } = props;

  const fields = Object.entries(def.form ?? {}).filter(
    ([fieldName, field]) =>
      fieldEditedInInspector(field, def.isPluginNode) &&
      fieldSatisfiesShowif(field.showif, values ?? {}) &&
      // A wired input takes its value from the edge, so editing one here would be writing to
      // something the executor overwrites - the card hides its control for the same reason.
      !connectedInputPorts?.has(fieldName),
  );

  if (fields.length === 0) {
    return null;
  }

  return (
    <Stack spacing='medium'>
      {fields.map(([fieldName, field]) => (
        <Stack key={fieldName} spacing='none'>
          <NodeFieldInput
            formKey={buildNodeValueKey(eventName, nodeIndex, fieldName)}
            field={field}
            moduleName={moduleName}
            label={field.label ?? fieldName}
          />
          {field.description ? <TypeFace>{field.description}</TypeFace> : null}
        </Stack>
      ))}
    </Stack>
  );
}
