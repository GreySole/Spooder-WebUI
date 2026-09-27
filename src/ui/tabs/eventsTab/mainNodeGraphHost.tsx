import React from 'react';
import { NodeGraphComponents, NodeGraphHost, setModuleSource } from '@spooder/webui-node-graph';
import useEvents from '../../../app/hooks/useEvents';
import useLiveLogging from '../../../app/hooks/useLiveLogging';
import useModule from '../../../app/hooks/useModule';
import usePlugins from '../../../app/hooks/usePlugins';
import { getModules, subscribeToModules } from '../../../modules/registry';
import FormAssetSelect from '../../common/input/form/FormAssetSelect';
import FormMultiAssetSelect from '../../common/input/form/FormMultiAssetSelect';
import FormUdpSelectDropdown from '../../common/input/form/FormUdpSelectDropdown';
import UdpServerManager from '../../common/udp/UdpServerManager';
import PluginSettingsContextProvider from '../pluginTab/pluginSettings/context/PluginSettingsContext';
import PluginInputsList from '../pluginTab/pluginSettings/pluginInput/PluginInputsList';

// The main WebUI's side of the node graph editor: its own API hooks and pickers, handed to the
// editor through the host contract. Each entry calls the app's hook when the editor calls it, so
// it runs as a hook in the editor's component, exactly as before the editor was its own package.

// The editor reads installed modules (their inspectors, test panels and field renderers) from
// the same registry the rest of the app does.
setModuleSource({ getModules, subscribe: subscribeToModules });

const mainNodeGraphHost: NodeGraphHost = {
  events: {
    getNodeManifest: () => useEvents().getNodeManifest(),
    getOperationNodes: () => useEvents().getOperationNodes(),
    getTriggerNow: () => useEvents().getTriggerNow(),
    getVerifyResponseScript: () => useEvents().getVerifyResponseScript(),
  },
  plugins: {
    getPlugins: () => usePlugins().getPlugins(),
    getPluginEventsForm: (pluginName) => usePlugins().getPluginEventsForm(pluginName),
  },
  useResponseHandlers: () => useModule().getResponseHandlers(),
  useLiveLogging,
  components: {
    // The editor may not know a field's folder, which these treat as required.
    AssetSelect: FormAssetSelect as NodeGraphComponents['AssetSelect'],
    MultiAssetSelect: FormMultiAssetSelect as NodeGraphComponents['MultiAssetSelect'],
    UdpSelect: FormUdpSelectDropdown,
    UdpServerManager,
    PluginEventInputs: ({ pluginName, form, defaults, baseFormKey }) => (
      <PluginSettingsContextProvider pluginName={pluginName} form={form} defaults={defaults}>
        <PluginInputsList baseFormKey={baseFormKey} />
      </PluginSettingsContextProvider>
    ),
  },
};

export default mainNodeGraphHost;
