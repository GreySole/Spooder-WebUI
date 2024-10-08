import SettingsForm from '../../PluginSettings/SettingsForm';
import { PluginComponentProps } from '../../../Types';
import React from 'react';

export default function PluginSettings(props: PluginComponentProps) {
  const { pluginName } = props;

  return <SettingsForm pluginName={pluginName} />;
}
