import React from 'react';
import {
  faTriangleExclamation,
  faCircleInfo,
  faTrash,
  faSpider,
  faCog,
  faFile,
  faDownload,
  faPlug,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LinkButton from '../../common/input/general/LinkButton';
import usePlugins from '../../../app/hooks/usePlugins';
import useToast from '../../../app/hooks/useToast';
import { PluginComponentProps, ToastType } from '../../Types';
import PluginInfoView from './PluginInfoView';
import CircleLoader from '../../common/loader/CircleLoader';
import PluginSettings from './input/PluginSettings';
import { usePluginContext } from './context/PluginTabFormContext';
import PluginAssetManager from './PluginAssetManager';
import { setClass } from '../../util/deprecated_util';
import TypeFace from '../../common/layout/TypeFace';
import Columns from '../../common/layout/Columns';
import Button from '../../common/input/controlled/Button';
import Box from '../../common/layout/Box';
import Stack from '../../common/layout/Stack';
import ImageFile from '../../common/input/general/ImageFile';
import ButtonRow from '../../common/input/general/ButtonRow';
import { set } from 'react-hook-form';

interface Plugin {
  name: string;
  version: string;
  status: string;
  author: string;
  message: string;
  hasOverlay: boolean;
  hasUtility: boolean;
  hasExternalSettingsPage: boolean;
}

export default function PluginEntry(props: PluginComponentProps) {
  const { pluginName } = props;
  const { showToast } = useToast();
  const {
    getRefreshPlugins,
    getDeletePlugin,
    getUploadPluginIcon,
    getSavePlugin,
    getExportPlugin,
  } = usePlugins();
  const { refreshPlugins } = getRefreshPlugins();
  const { deletePlugin } = getDeletePlugin();
  const { uploadPluginIcon } = getUploadPluginIcon();
  const { savePlugin } = getSavePlugin();
  const { exportPlugin } = getExportPlugin();

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

  if (!isReady) {
    return null;
  }

  const plugin = plugins?.[pluginName];

  async function refreshPluginsClick() {
    refreshPlugins();
    showToast('Plugins refreshed', ToastType.REFRESH);
  }

  function pluginInfo(plugin: string) {
    setPluginSettingsOpen('');
    setPluginAssetsOpen('');
    if (plugin == pluginInfoOpen) {
      setPluginInfoOpen('');
    } else {
      setPluginInfoOpen(plugin);
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

  function pluginAssets(plugin: string) {
    setPluginInfoOpen('');
    setPluginSettingsOpen('');
    if (plugin == pluginAssetsOpen) {
      setPluginAssetsOpen('');
    } else {
      setPluginAssetsOpen(plugin);
    }
  }

  async function replacePluginIcon(pluginName: string, file: File | undefined) {
    if (file === undefined) {
      return;
    }
    var fd = new FormData();
    fd.append('file', file);

    const requestOptions = {
      method: 'POST',
      body: fd,
    };
    let uploadReq = await uploadPluginIcon(pluginName, fd);

    reloadPlugins();
  }

  async function exportPluginClick(pluginName: string) {
    exportPlugin(pluginName);
  }

  function deletePluginClick(pluginName: string) {
    let confirmation = window.confirm('Are you sure you want to delete ' + pluginName + '?');
    if (confirmation == false) {
      return;
    }

    deletePlugin(pluginName);
  }

  function imgError(event: React.SyntheticEvent<HTMLImageElement, Event>) {
    event.preventDefault();
    setClass(event.target as Element, 'default', true);
  }

  let pluginLinks = [];
  if (plugin.hasOverlay) {
    pluginLinks.push(
      <LinkButton
        name={pluginName + '-overlay'}
        label={'Copy Overlay URL'}
        mode='copy'
        link={window.location.origin + '/overlay/' + pluginName}
      />,
    );
  }
  if (plugin.hasUtility) {
    pluginLinks.push(
      <LinkButton
        name={pluginName + '-utility'}
        label={'Open Utility'}
        mode='newtab'
        link={window.location.origin + '/utility/' + pluginName}
      />,
    );
  }
  if (plugin.status == 'ok') {
    return (
      <Stack spacing='small'>
        <Box justifyContent='space-between' padding='small'>
          <Columns spacing='medium' padding='small'>
            <ImageFile
              src={window.location.origin + '/icons/' + pluginName + '.png'}
              fallbackIcon={faPlug}
            />
            <Stack spacing='medium'>
              <Columns spacing='medium'>
                <TypeFace fontSize='32px'>{plugin.name}</TypeFace>
                <TypeFace fontSize='18px'>{plugin.version + ' by ' + plugin.author}</TypeFace>
              </Columns>
              <div className='plugin-entry-links'>{pluginLinks}</div>
            </Stack>
          </Columns>
          <Columns spacing='none' padding='small'>
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
                  icon: faCog,
                  iconSize: '2x',
                  color: '#090',
                  isActive: pluginSettingsOpen === pluginName,
                  onClick: () => pluginSettings(pluginName),
                },
                {
                  icon: faFile,
                  iconSize: '2x',
                  color: '#008080',
                  isActive: pluginAssetsOpen === pluginName,
                  onClick: () => pluginAssets(pluginName),
                },
                {
                  icon: faDownload,
                  iconSize: '2x',
                  color: '#000',
                  isLink: true,
                  linkName: pluginName,
                  link: '/export_plugin/' + pluginName,
                  isActive: false,
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
          </Columns>
        </Box>
        {pluginInfoOpen === pluginName ? <PluginInfoView pluginName={pluginName} /> : null}
        {pluginSettingsOpen === pluginName ? <PluginSettings pluginName={pluginName} /> : null}
        {pluginAssetsOpen === pluginName ? <PluginAssetManager pluginName={pluginName} /> : null}
      </Stack>
    );
  } else if (plugin.status == 'failed') {
    return (
      <div className='plugin-entry' key={pluginName} id={pluginName}>
        <div className='plugin-entry-ui'>
          <div className='plugin-entry-icon'>
            <FontAwesomeIcon
              className='plugin-status-icon'
              icon={faTriangleExclamation}
              size='lg'
            />
          </div>
          <div className='plugin-entry-info'>
            <div className='plugin-entry-title'>
              <TypeFace>{plugin.name}</TypeFace>
              <TypeFace>{'by ' + plugin.author}</TypeFace>
            </div>
            <div className='plugin-entry-subtitle'>{plugin.message}</div>
          </div>
          <div className='plugin-button-ui'>
            <div className='plugin-button info' onClick={() => pluginInfo(pluginName)}>
              <FontAwesomeIcon icon={faCircleInfo} size='lg' />
            </div>
            <div className='plugin-button delete' onClick={() => deletePlugin(pluginName)}>
              <FontAwesomeIcon icon={faTrash} size='lg' />
            </div>
          </div>
        </div>
        <div className='plugin-info-view'>
          <PluginInfoView pluginName={pluginName} />
        </div>
      </div>
    );
  } else {
    return (
      <div className='plugin-entry' key={pluginName} id={pluginName}>
        <div className='plugin-entry-ui'>
          <div className='plugin-entry-icon spinning'>
            <CircleLoader />
          </div>
          <div className='plugin-entry-info'>
            <div className='plugin-entry-title'>
              {plugin.name}
              <div className='plugin-entry-subtitle'>{'by ' + plugin.author}</div>
            </div>
            <div className='plugin-entry-subtitle'>{plugin.message}</div>
          </div>
        </div>
      </div>
    );
  }
}
