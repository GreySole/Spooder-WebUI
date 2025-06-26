import { Columns, TooltipButton, translateCondition } from '@greysole/spooder-component-library';
import { useFormContext } from 'react-hook-form';
import { usePluginSettingsContext } from '../context/PluginSettingsContext';
import React from 'react';
import PluginInput from './PluginInput';
import PluginMultiInput from './PluginMultiInput';

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

  console.log(
    'SHOW IF',
    `'${showIfValue}' ${translateCondition(form[formKeyVariable].showif?.condition ?? 'equals')} '${form[formKeyVariable].showif?.value}'`,
  );

  try {
    const shouldHide = !eval(
      `'${showIfValue}' ${translateCondition(form[formKeyVariable].showif?.condition ?? 'equals')} '${form[formKeyVariable].showif?.value}'`,
    );
    if (shouldHide) {
      return null;
    }
  } catch (e) {
    console.error(`Error evaluating showif condition for ${formKey}:`, e);
  }

  const input = form[formKeyVariable];
  if (input['multi-select']) {
    return (
      <Columns spacing='small'>
        <PluginMultiInput
          key={`custom-input-multi-${formKey}`}
          formKey={formKey}
          type={input.type}
          label={input.label}
          options={input.options}
        />
        {input.description ? (
          <TooltipButton tooltipText={input.description} iconSize='medium' />
        ) : null}
      </Columns>
    );
  } else {
    return (
      <Columns spacing='small'>
        <PluginInput
          key={`custom-input-${formKey}`}
          formKey={formKey}
          type={input.type}
          label={input.label}
          options={input.options}
        />
        {input.description ? (
          <TooltipButton tooltipText={input.description} iconSize='medium' />
        ) : null}
      </Columns>
    );
  }
}
