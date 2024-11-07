import { faTrash } from '@fortawesome/free-solid-svg-icons';
import SelectDropdown from '../../../common/input/controlled/SelectDropdown';
import React, { useState } from 'react';
import Button from '../../../common/input/controlled/Button';
import LinkButton from '../../../common/input/general/LinkButton';
import useRecovery from '../../../../app/hooks/useRecovery';
import FormLoader from '../../../common/loader/FormLoader';

export default function RestorePluginsInput() {
  const { getPluginsBackups, getDeleteBackupPlugins, getRestorePlugins } = useRecovery();
  const { data, isLoading, error } = getPluginsBackups();
  const { deleteBackupPlugins } = getDeleteBackupPlugins();
  const { restorePlugins } = getRestorePlugins();
  const [selectedBackup, setSelectedBackup] = useState<string>('');

  if (isLoading) {
    return <FormLoader numRows={4} />;
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
            label={selectedBackup}
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
