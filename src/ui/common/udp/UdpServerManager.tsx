import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  Border,
  Box,
  Button,
  Expandable,
  NumberInput,
  Stack,
  TextInput,
  TypeFace,
  useDialog,
} from '@spooder/webui-component-library';
import { useState } from 'react';
import useConfig from '../../../app/hooks/useConfig';
import { KeyedObject } from '../../Types';

// The destination list an OSC node sends to, editable from wherever that node is being wired.
// The config tab's UdpServerSection edits the same list through the whole-config form; this
// posts just the map (/config/save_udp_servers), so it works outside that form context - the
// events tab's form holds graphs, not config.
//
// Adds and deletes only. Renaming a server or moving its IP is a config-tab job: the key is
// what saved nodes store as their destination, so changing one out from under a graph is a
// different, wider operation than adding somewhere new to send.

// Same slug rule AddUdpServer uses, so a name typed here produces the key it would there.
function udpServerKey(name: string) {
  return name
    .replace(/\s+/g, '_')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '');
}

export default function UdpServerManager() {
  const { getUdpServers, getSaveUdpServers } = useConfig();
  const { data: udpServers, isLoading, error } = getUdpServers();
  const { saveUdpServers, isLoading: isSaving } = getSaveUdpServers();
  const { openDialog, closeDialog } = useDialog();

  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState(9000);

  if (isLoading || error) {
    return null;
  }

  const servers: KeyedObject = udpServers ?? {};
  const newKey = udpServerKey(name);
  // A blank key would be unaddressable and an existing one would silently overwrite the
  // server a node already points at, so neither is offered as an add.
  const canAdd = newKey.length > 0 && ip.trim().length > 0 && servers[newKey] == null;

  function addUdpServer() {
    if (!canAdd) {
      return;
    }
    saveUdpServers({ ...servers, [newKey]: { name, ip: ip.trim(), port } }).then((saved) => {
      if (!saved) {
        return;
      }
      setName('');
      setIp('');
      setPort(9000);
    });
  }

  function deleteUdpServer(key: string) {
    const next = { ...servers };
    delete next[key];
    openDialog(
      'Delete UDP Server',
      <TypeFace>
        {`Delete '${servers[key]?.name ?? key}'? Any node sending to it will stop sending.`}
      </TypeFace>,
      [
        <Button label='Cancel' onClick={() => closeDialog()} />,
        <Button
          label='Delete'
          className='delete-button'
          onClick={() => {
            closeDialog();
            saveUdpServers(next);
          }}
        />,
      ],
    );
  }

  const serverKeys = Object.keys(servers);

  return (
    <Expandable label='UDP Servers'>
      <Stack spacing='small' padding='small' width='100%'>
        {serverKeys.length === 0 ? (
          <TypeFace>No UDP servers configured yet.</TypeFace>
        ) : (
          serverKeys.map((key) => (
            <Border borderBottom key={key}>
              <Box flexFlow='row' justifyContent='space-between' alignItems='center' width='100%'>
                <Stack spacing='none' overflow='hidden'>
                  <TypeFace truncate>{servers[key].name ?? key}</TypeFace>
                  <TypeFace truncate>
                    {`${servers[key].ip}:${servers[key].port}`}
                  </TypeFace>
                </Stack>
                <Button icon={faTrash} onClick={() => deleteUdpServer(key)} />
              </Box>
            </Border>
          ))
        )}
        {/* Stacked rather than in a row: this panel is 240-320px wide, which three inputs
            side by side would overflow. */}
        <TextInput
          width='100%'
          label='Name:'
          value={name}
          onInput={(value) => setName(value)}
          placeholder='Display Name'
        />
        <TextInput
          width='100%'
          label='IP:'
          value={ip}
          onInput={(value) => setIp(value)}
          placeholder='Client local IP'
        />
        <NumberInput width='6rem' label='Port:' value={port} onInput={(value) => setPort(value)} />
        {newKey.length > 0 && servers[newKey] != null ? (
          <TypeFace fontSize='small'>{`'${newKey}' already exists. Pick another name.`}</TypeFace>
        ) : null}
        <Box width='100%' justifyContent='right'>
          <Button
            label='Add UDP Server'
            disabled={!canAdd || isSaving}
            onClick={() => addUdpServer()}
          />
        </Box>
      </Stack>
    </Expandable>
  );
}
