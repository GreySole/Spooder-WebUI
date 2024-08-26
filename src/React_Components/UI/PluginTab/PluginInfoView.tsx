import { faSync, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';
import useToast from '../../../app/hooks/useToast';
import { ToastType } from '../../Types';
import usePlugins from '../../../app/hooks/usePlugins';
import { usePluginContext } from './context/PluginTabFormContext';

interface PluginInfoViewProps {
  pluginName: string;
}

export default function PluginInfoView(props: PluginInfoViewProps) {
  const { pluginName } = props;
  const { showToast } = useToast();
  const { getPlugins, refreshPlugin, reinstallPlugin } = usePlugins();
  const { plugins, isReady } = usePluginContext();

  if (!isReady) {
    return null;
  }

  const plugin = plugins?.[pluginName];

  async function refreshSinglePluginClick(pluginName: string) {
    refreshPlugin(pluginName);
    showToast(`${pluginName} refreshed!`, ToastType.REFRESH);
  }

  const hiddenIconInput = useRef<HTMLInputElement>(null);
  function handleIconUploadClick() {
    if (hiddenIconInput.current) {
      hiddenIconInput.current.click();
    }
  }

  let dependenciesElements = null;
  let dependenciesElement = null;
  if (Object.keys(plugin.dependencies).length > 0) {
    dependenciesElements = [];
    for (let d in plugin.dependencies) {
      dependenciesElements.push(
        <div className='info-dependencies-entry'>
          {d}:{plugin.dependencies[d]}
        </div>,
      );
    }
    dependenciesElement = (
      <div className='info-dependencies'>
        <label>Dependencies</label>
        {dependenciesElements}
        <div>
          <label>
            <button
              type='button'
              className='add-button'
              onClick={() => reinstallPlugin(pluginName)}
            >
              Reinstall Dependencies
            </button>
          </label>
        </div>
      </div>
    );
  } else {
    dependenciesElement = (
      <div className='info-dependencies'>
        <label>Dependencies</label>
        None
      </div>
    );
  }
  return (
    <div className='info-container'>
      <div className='info-description'>
        <label>Description</label>
        {plugin.description}
      </div>
      {dependenciesElement}
      <div className='info-actions'>
        <div className='add-button' onClick={() => refreshSinglePluginClick(pluginName)}>
          <FontAwesomeIcon icon={faSync} size='lg' /> Refresh
        </div>
        <div className='add-button' onClick={handleIconUploadClick} plugin-name={name}>
          <FontAwesomeIcon icon={faImage} size='lg' /> Change Icon
        </div>
      </div>
    </div>
  );
}
