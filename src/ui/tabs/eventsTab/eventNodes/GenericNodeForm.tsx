import React from 'react';
import { useFormContext } from 'react-hook-form';
import { NodeForm } from '../../../Types';
import { buildNodeValueKey } from '../FormKeys';
import NodeFieldInput from './NodeFieldInput';
import { fieldSatisfiesShowif } from './nodeFieldVisibility';

interface GenericNodeFormProps {
  eventName: string;
  nodeIndex: number;
  moduleName: string;
  form: NodeForm;
}

export default function GenericNodeForm(props: GenericNodeFormProps) {
  const { eventName, nodeIndex, moduleName, form } = props;
  const { watch } = useFormContext();
  const values = watch(buildNodeValueKey(eventName, nodeIndex)) ?? {};

  return (
    <>
      {Object.entries(form).map(([fieldName, field]) => {
        if (!fieldSatisfiesShowif(field.showif, values)) {
          return null;
        }
        return (
          <NodeFieldInput
            key={fieldName}
            formKey={buildNodeValueKey(eventName, nodeIndex, fieldName)}
            field={field}
            moduleName={moduleName}
          />
        );
      })}
    </>
  );
}
