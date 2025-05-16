import { translateCondition } from '@greysole/spooder-component-library';
import { useFormContext } from 'react-hook-form';
import { usePluginSettingsContext } from '../context/PluginSettingsContext';
import React from 'react';
import PluginInput from './PluginInput';
import PluginMultiInput from './PluginMultiInput';
import PluginSubform from '../PluginSubform';

interface PluginInputProcessorProps {
  formKey: string;
}

export default function PluginInputProcessor(props: PluginInputProcessorProps) {
  const { formKey } = props;
  const { form } = usePluginSettingsContext();
  const { watch } = useFormContext();

  const formKeyPrefix = formKey.includes('.')
    ? formKey.substring(0, formKey.lastIndexOf('.') + 1)
    : '';
  const formKeyVariable = formKey.includes('.')
    ? formKey.substring(formKey.lastIndexOf('.') + 1)
    : formKey;

  const showIfValue = watch(
    form[formKeyVariable].showif?.variable
      ? `${formKeyPrefix}${form[formKeyVariable].showif?.variable}`
      : '_null',
  );

  console.log('SHOW IF', formKeyVariable, showIfValue, formKeyPrefix, formKeyVariable);

  if (typeof showIfValue !== 'undefined') {
    const shouldHide = !eval(
      `${showIfValue} ${translateCondition(form[formKeyVariable].showif?.condition ?? 'equals')} ${form[formKeyVariable].showif?.value}`,
    );
    if (shouldHide) {
      return null;
    }
  }

  const input = form[formKeyVariable];
  console.log(input);
  if (input['multi-select']) {
    return (
      <PluginMultiInput
        key={`custom-input-multi-${formKey}`}
        formKey={formKey}
        type={input.type}
        label={input.label}
        options={input.options}
      />
    );
  } else {
    return (
      <PluginInput
        key={`custom-input-${formKey}`}
        formKey={formKey}
        type={input.type}
        label={input.label}
        options={input.options}
      />
    );
  }
}
