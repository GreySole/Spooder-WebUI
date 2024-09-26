import { faSync } from '@fortawesome/free-solid-svg-icons';
import Button from '../../common/input/controlled/Button';
import { usePluginContext } from '../context/PluginTabFormContext';

export default function RefreshAllPluginsButton() {
  const { reloadPlugins } = usePluginContext();
  return (
    <div className='plugin-install-button'>
      <div className='save-div'>
        <Button label='Refresh All Plugins' onClick={reloadPlugins} icon={faSync} iconSize='lg' />
        <div className='save-status'></div>
      </div>
    </div>
  );
}
