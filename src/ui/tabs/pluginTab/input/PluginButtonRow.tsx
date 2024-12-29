import {
  faCircleInfo,
  faCog,
  faFile,
  faDownload,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import ButtonRow from '../../../common/input/general/ButtonRow';
import { usePluginContext } from '../context/PluginTabFormContext';
import usePlugins from '../../../../app/hooks/usePlugins';
import { StyleSize } from '../../../Types';

interface PluginButtonRowProps {
  pluginName: string;
  status: string;
}

export default function PluginButtonRow(props: PluginButtonRowProps) {
  const { pluginName, status } = props;
  const {
    plugins,
    isReady,
    reloadPlugins,
    pluginInfoOpen,
    pluginSettingsOpen,
    pluginAssetsOpen,
    setPluginInfoOpen,
    setPluginSettingsOpen,
    setPluginAssetsOpen,
  } = usePluginContext();

  const { getDeletePlugin } = usePlugins();
  const { deletePlugin } = getDeletePlugin();

  function pluginInfo(plugin: string) {
    setPluginSettingsOpen('');
    setPluginAssetsOpen('');
    if (plugin == pluginInfoOpen) {
      setPluginInfoOpen('');
    } else {
      setPluginInfoOpen(plugin);
    }
  }

  function pluginAssets(plugin: string) {
    setPluginInfoOpen('');
    setPluginSettingsOpen('');
    if (plugin == pluginAssetsOpen) {
      setPluginAssetsOpen('');
    } else {
      setPluginAssetsOpen(plugin);
    }
  }

  function pluginSettings(plugin: string) {
    setPluginInfoOpen('');
    setPluginAssetsOpen('');
    if (plugin == pluginSettingsOpen) {
      setPluginSettingsOpen('');
    } else {
      setPluginSettingsOpen(plugin);
    }
  }

  const iconSize = StyleSize.xlarge;

  return status == 'ok' ? (
    <ButtonRow
      buttons={[
        {
          icon: faCircleInfo,
          iconSize: iconSize,
          color: 'gray',
          isActive: pluginInfoOpen === pluginName,
          onClick: () => pluginInfo(pluginName),
        },
        {
          icon: faCog,
          iconSize: iconSize,
          color: '#090',
          isActive: pluginSettingsOpen === pluginName,
          onClick: () => pluginSettings(pluginName),
        },
        {
          icon: faFile,
          iconSize: iconSize,
          color: '#008080',
          isActive: pluginAssetsOpen === pluginName,
          onClick: () => pluginAssets(pluginName),
        },
        {
          icon: faDownload,
          iconSize: iconSize,
          color: '#000',
          isLink: true,
          linkName: pluginName,
          link: '/export_plugin/' + pluginName,
          isActive: false,
        },
        {
          icon: faTrash,
          iconSize: iconSize,
          color: '#8f2525',
          isActive: false,
          onClick: () => deletePlugin(pluginName),
        },
      ]}
    />
  ) : (
    <ButtonRow
      buttons={[
        {
          icon: faCircleInfo,
          iconSize: '2x',
          color: 'gray',
          isActive: pluginInfoOpen === pluginName,
          onClick: () => pluginInfo(pluginName),
        },
        {
          icon: faTrash,
          iconSize: '2x',
          color: '#8f2525',
          isActive: false,
          onClick: () => deletePlugin(pluginName),
        },
      ]}
    />
  );
}
