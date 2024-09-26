import {
  faTriangleExclamation,
  faCircleInfo,
  faTrash,
  faSpider,
  faCog,
  faFile,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LinkButton from '../LinkButton';
import usePlugins from '../../../app/hooks/usePlugins';
import useToast from '../../../app/hooks/useToast';
import { PluginComponentProps, ToastType } from '../../Types';
import PluginInfoView from './PluginInfoView';
import LoadingCircle from '../LoadingCircle';
import PluginSettings from './input/PluginSettings';
import { usePluginContext } from './context/PluginTabFormContext';
import PluginAssetManager from './PluginAssetManager';
import { setClass } from '../Helpers';
import { useHotkeys } from '../../../app/hooks/useHotkeys';

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
    if (plugin == pluginInfoOpen) {
      setPluginInfoOpen('');
    } else {
      setPluginInfoOpen(plugin);
    }
  }

  function pluginSettings(plugin: string) {
    if (plugin == pluginSettingsOpen) {
      setPluginSettingsOpen('');
    } else {
      setPluginSettingsOpen(plugin);
    }
  }

  function pluginAssets(plugin: string) {
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

  /*async function savePluginClick(pluginName: string, newData: any) {
    await savePlugin(pluginName, newData);
    if (!error) {
      showToast(`${pluginName} saved!`, ToastType.SAVE);
    } else {
      showToast(`${pluginName} save failed!`, ToastType.ERROR);
    }
  }*/

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
        text={'Copy Overlay URL'}
        mode='copy'
        link={window.location.origin + '/overlay/' + pluginName}
      />,
    );
  }
  if (plugin.hasUtility) {
    pluginLinks.push(
      <LinkButton
        name={pluginName + '-utility'}
        text={'Open Utility'}
        mode='newtab'
        link={window.location.origin + '/utility/' + pluginName}
      />,
    );
  }
  if (plugin.status) {
    if (plugin.status == 'failed') {
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
                {plugin.name}
                <div className='plugin-entry-subtitle'>{'by ' + plugin.author}</div>
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
              <LoadingCircle />
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
  } else {
    return (
      <div className='plugin-entry' key={pluginName} id={pluginName}>
        <div className='plugin-entry-ui'>
          <div className='plugin-entry-icon'>
            <img
              src={window.location.origin + '/icons/' + pluginName + '.png'}
              onError={imgError}
            />
            <FontAwesomeIcon icon={faSpider} size='lg' className='plugin-default-icon' />
          </div>
          <div className='plugin-entry-info'>
            <div className='plugin-entry-title'>
              {plugin.name}
              <div className='plugin-entry-subtitle'>{plugin.version + ' by ' + plugin.author}</div>
            </div>
            <div className='plugin-entry-links'>{pluginLinks}</div>
          </div>
          <div className='plugin-button-ui'>
            <div className='plugin-button info' onClick={() => pluginInfo(pluginName)}>
              <FontAwesomeIcon icon={faCircleInfo} size='lg' />
            </div>
            <div className='plugin-button settings' onClick={() => pluginSettings(pluginName)}>
              <FontAwesomeIcon icon={faCog} size='lg' />
            </div>
            <div className='plugin-button upload' onClick={() => pluginAssets(pluginName)}>
              <FontAwesomeIcon icon={faFile} size='lg' />
            </div>
            <a
              className='link-override'
              href={'/export_plugin/' + pluginName}
              download={pluginName + '.zip'}
            >
              <div className='plugin-button export'>
                <FontAwesomeIcon icon={faDownload} size='lg' />
              </div>
            </a>
            <div className='plugin-button delete' onClick={() => deletePlugin(pluginName)}>
              <FontAwesomeIcon icon={faTrash} size='lg' />
            </div>
            <input
              type='file'
              id='input-icon'
              plugin-name={pluginName}
              onChange={(e) => replacePluginIcon(pluginName, e?.target?.files?.[0])}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        <div className='plugin-info-view'>
          {pluginInfoOpen === pluginName ? <PluginInfoView pluginName={pluginName} /> : null}
        </div>
        <div className='plugin-entry-settings'>
          {pluginSettingsOpen === pluginName ? <PluginSettings pluginName={pluginName} /> : null}
        </div>
        <div className='plugin-asset-manager'>
          {pluginAssetsOpen === pluginName ? <PluginAssetManager pluginName={pluginName} /> : null}
        </div>
      </div>
    );
  }
}
