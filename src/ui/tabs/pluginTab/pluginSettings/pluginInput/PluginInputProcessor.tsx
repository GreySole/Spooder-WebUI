import { Columns, TooltipButton, translateCondition } from '@spooder/webui-component-library';
import { useFormContext } from 'react-hook-form';
import React from 'react';
import PluginInput from './PluginInput';
import PluginMultiInput from './PluginMultiInput';

interface PluginInputProcessorProps {
  formKey: string;
  type: string;
  label: string;
  options?: any;
  description?: string;
  showif?: any;
  'multi-select'?: boolean;
}

export default function PluginInputProcessor(props: PluginInputProcessorProps) {
  const { formKey, type, label, options, description, showif, 'multi-select': multiSelect } = props;
  const { watch } = useFormContext();

  const formKeyPrefix = formKey.includes('.')
    ? formKey.substring(0, formKey.lastIndexOf('.') + 1)
    : '';

  // Helper to evaluate a single condition
  function evaluateShowIfCondition(condObj: any): boolean {
    const value = watch(condObj.variable ? `${formKeyPrefix}${condObj.variable}` : '_null');
    try {
      return eval(
        `'${value}' ${translateCondition(condObj.condition ?? 'equals')} '${condObj.value}'`,
      );
    } catch (e) {
      console.error(`Error evaluating showif condition for ${formKey}:`, e);
      return false;
    }
  }

  let shouldHide = false;
  if (Array.isArray(showif)) {
    // Hide if any condition is not met
    shouldHide = showif.some((condObj) => !evaluateShowIfCondition(condObj));
  } else if (showif) {
    shouldHide = !evaluateShowIfCondition(showif);
  }
  if (shouldHide) {
    return null;
  }
  if (multiSelect) {
    return (
      <Columns spacing='small'>
        <PluginMultiInput
          key={`custom-input-multi-${formKey}`}
          formKey={formKey}
          type={type}
          label={label}
          options={options}
        />
        {description ? <TooltipButton tooltipText={description} iconSize='medium' /> : null}
      </Columns>
    );
  } else {
    return (
      <Columns spacing='small'>
        <PluginInput
          key={`custom-input-${formKey}`}
          formKey={formKey}
          type={type}
          label={label}
          options={options}
        />
        {description ? <TooltipButton tooltipText={description} iconSize='medium' /> : null}
      </Columns>
    );
  }
}
