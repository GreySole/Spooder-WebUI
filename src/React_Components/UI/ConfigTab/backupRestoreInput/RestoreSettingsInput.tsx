import { faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import BoolSwitch from '../../common/input/controlled/BoolSwitch';
import useServer from '../../../../app/hooks/useServer';
import {
  useDeleteBackupSettingsMutation,
  useRestoreSettingsMutation,
} from '../../../../app/api/serverSlice';
import LoadingCircle from '../../LoadingCircle';
import SelectDropdown from '../../common/input/controlled/SelectDropdown';
import LinkButton from '../../LinkButton';
import Button from '../../common/input/controlled/Button';

export default function RestoreSettingsInput() {
  const { getSettingsBackups, getDeleteBackupSettings, getRestoreSettings } = useServer();
  const { data, isLoading, error } = getSettingsBackups();
  const { deleteBackupSettings } = getDeleteBackupSettings();
  const { restoreSettings } = getRestoreSettings();
  const [everythingChecked, setEverythingChecked] = useState<boolean>(true);
  const [selectedBackup, setSelectedBackup] = useState<string>('');

  if (isLoading) {
    return <LoadingCircle />;
  }

  const restoreSettingsOptions = data.map((pluginName: string) => ({
    label: pluginName,
    value: pluginName,
  }));

  restoreSettingsOptions.unshift({ label: 'Select Backup', value: '' });

  //TODO: Add checkboxes for each type of setting
  const checkboxes = everythingChecked ? (
    <div className='restore-settings-checkboxes'>
      <BoolSwitch
        label='Everything'
        value={everythingChecked}
        onChange={(value) => setEverythingChecked(value)}
      />
    </div>
  ) : (
    <div className='restore-settings-checkboxes'>
      <BoolSwitch
        label='Everything'
        value={everythingChecked}
        onChange={(value) => setEverythingChecked(value)}
      />
      <label>
        Config
        <input id='restoreConfig' type='checkbox' name='config' defaultChecked />
      </label>
      <label>
        Events
        <input id='restoreEvents' type='checkbox' name='commands' defaultChecked />
      </label>
      <label>
        EventSub
        <input id='restoreEventsub' type='checkbox' name='eventsub' defaultChecked />
      </label>
      <label>
        oAuth
        <input id='restoreOauth' type='checkbox' name='oauth' />
      </label>
      <label>
        OSC Tunnels
        <input id='restoreTunnels' type='checkbox' name='osc-tunnels' defaultChecked />
      </label>
      <label>
        Mod Data
        <input id='restoreModData' type='checkbox' name='mod' defaultChecked />
      </label>
      <label>
        Mod Blacklist
        <input id='restoreBlacklist' type='checkbox' name='mod-blacklist' defaultChecked />
      </label>
      <label>
        Event Storage
        <input id='restoreEventStorage' type='checkbox' name='eventstorage' defaultChecked />
      </label>
      <label>
        Shares
        <input id='restoreShares' type='checkbox' name='shares' defaultChecked />
      </label>
      <label>
        Themes
        <input id='restoreThemes' type='checkbox' name='themes' defaultChecked />
      </label>
    </div>
  );
  return (
    <div className='restore-settings-div'>
      <div className='restore-settings-select'>
        <SelectDropdown
          label='Select Backup'
          options={restoreSettingsOptions}
          onChange={(value) => setSelectedBackup(value)}
          value={restoreSettingsOptions.find((backupName: string) => {
            return backupName === selectedBackup;
          })}
        />
        <div className='restore-settings-button'>
          <Button
            label=''
            icon={faTrash}
            iconSize='2x'
            onClick={() => deleteBackupSettings(selectedBackup)}
          />
          <LinkButton
            mode='download'
            name={selectedBackup}
            text={selectedBackup}
            link={'/checkout_settings/' + selectedBackup}
          />
        </div>
      </div>
      {everythingChecked}
      <div className='restore-settings-button'>
        <button
          type='button'
          className='link-button-button'
          onClick={() => restoreSettings(selectedBackup, { everything: true })}
        >
          Restore Settings
        </button>
      </div>
    </div>
  );
}
