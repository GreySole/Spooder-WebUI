import SettingsForm from '../../../PluginSettings/SettingsForm';
import { PluginComponentProps } from '../../../Types';

export default function PluginSettings(props: PluginComponentProps) {
  const { pluginName } = props;

  return (
    <SettingsForm
      pluginName={pluginName}
    />
  );
}
