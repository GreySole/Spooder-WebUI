import {
  faCircleInfo,
  faCog,
  faFile,
  faDownload,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { usePluginContext } from '../context/PluginTabFormContext';
import usePlugins from '../../../../app/hooks/usePlugins';
import { StyleSize } from '../../../Types';
import { Button, ButtonRow, TypeFace } from '@greysole/spooder-component-library';
import { StyleSizeButton } from '@greysole/spooder-component-library/dist/types/Types';
import { useDialogContext } from '../../../app/DialogContextProvider';

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
  const { openDialog, closeDialog } = useDialogContext();

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

  const confirmDeletePlugin = (pluginName: string) => {
    openDialog(
      `Delete ${pluginName}?`,
      <TypeFace>Are you sure you want to delete {pluginName}?</TypeFace>,
      [
        <Button
          label='Cancel'
          onClick={() => {
            closeDialog();
          }}
        />,
        <Button
          label='Delete'
          onClick={() => {
            deletePlugin(pluginName).then(() => {
              reloadPlugins();
              closeDialog();
            });
          }}
        />,
      ],
    );
  };

  return status == 'ok' ? (
    <ButtonRow
      buttonSize='medium'
      iconSize='xlarge'
      buttons={[
        {
          icon: faCircleInfo,
          color: 'gray',
          isActive: pluginInfoOpen === pluginName,
          onClick: () => pluginInfo(pluginName),
        },
        {
          icon: faCog,
          color: '#090',
          isActive: pluginSettingsOpen === pluginName,
          onClick: () => pluginSettings(pluginName),
        },
        {
          icon: faFile,
          color: '#008080',
          isActive: pluginAssetsOpen === pluginName,
          onClick: () => pluginAssets(pluginName),
        },
        {
          icon: faDownload,
          color: '#000',
          isLink: true,
          linkName: pluginName,
          link: '/plugin/export_plugin?pluginname=' + pluginName,
          isActive: false,
        },
        {
          icon: faTrash,
          color: '#8f2525',
          isActive: false,
          onClick: () => confirmDeletePlugin(pluginName),
        },
      ]}
    />
  ) : (
    <ButtonRow
      buttonSize='medium'
      iconSize='xlarge'
      buttons={[
        {
          icon: faCircleInfo,

          color: 'gray',
          isActive: pluginInfoOpen === pluginName,
          onClick: () => pluginInfo(pluginName),
        },
        {
          icon: faTrash,
          color: '#8f2525',
          isActive: false,
          onClick: () => confirmDeletePlugin(pluginName),
        },
      ]}
    />
  );
}
