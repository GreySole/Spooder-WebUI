import { faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useServer from '../../../../app/hooks/useServer';
import LoadingCircle from '../../LoadingCircle';
import SelectDropdown from '../../common/input/controlled/SelectDropdown';
import { useState } from 'react';
import { useRestorePluginsMutation } from '../../../../app/api/serverSlice';
import Button from '../../common/input/controlled/Button';
import LinkButton from '../../LinkButton';

export default function RestorePluginsInput() {
  const { getPluginsBackups, getDeleteBackupPlugins, getRestorePlugins } = useServer();
  const { data, isLoading, error } = getPluginsBackups();
  const { deleteBackupPlugins } = getDeleteBackupPlugins();
  const { restorePlugins } = getRestorePlugins();
  const [selectedBackup, setSelectedBackup] = useState<string>('');

  if (isLoading) {
    return <LoadingCircle />;
  }

  const restorePluginsOptions = data.map((pluginName: string) => ({
    label: pluginName,
    value: pluginName,
  }));

  restorePluginsOptions.unshift({ label: 'Select Backup', value: '' });

  return (
    <div className='restore-plugins-div'>
      <div className='restore-plugins-select'>
        <SelectDropdown
          label='Select Backup'
          options={restorePluginsOptions}
          onChange={(value) => setSelectedBackup(value)}
          value={restorePluginsOptions.find((backupName: string) => {
            return backupName === selectedBackup;
          })}
        />
        <div className='restore-plugins-button'>
          <Button
            label=''
            icon={faTrash}
            iconSize='2x'
            onClick={() => deleteBackupPlugins(selectedBackup)}
          />
          <LinkButton
            mode='download'
            name={selectedBackup}
            text={selectedBackup}
            link={'/checkout_plugins/' + selectedBackup}
          />
        </div>
      </div>
      <div className='restore-plugins-button'>
        <Button
          label='Restore Plugins'
          onClick={() => restorePlugins(selectedBackup, { everything: true })}
        />
      </div>
    </div>
  );
}
