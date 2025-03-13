import {
  faArrowDown,
  faArrowUp,
  faNetworkWired,
  faPlug,
  faT,
  faU,
} from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { KeyedObject, StyleSize } from '../Types';
import {
  BoolSwitch,
  Border,
  Box,
  Button,
  ButtonRow,
  CircleLoader,
  Columns,
  FilterButton,
  Stack,
  TypeFace,
  useOSC,
} from '@greysole/spooder-component-library';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useServer from '../../app/hooks/useServer';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { Footer } from '../app/Footer';
import ExpandableLog from './oscMonitor/ExpandableLog';

export interface Log {
  timestamp: string;
  type: string;
  direction: string;
  address: string;
  args: any[];
}

interface MasterLog {
  tcp: Log[];
  udp: Log[];
  plugin: Log[];
  liveLogging: number;
}

export default function OSCMonitor() {
  const { addListener, removeListener, sendOSC, isReady } = useOSC();
  const { getMonitorLogs } = useServer();
  const { data, isLoading, error } = getMonitorLogs();
  /*const [typeFilters, setTypeFilters] = useState<String[]>([
    'tcp',
    'udp',
    'send',
    'receive',
    'plugin',
  ]);*/
  const [addressFilters, setAddressFilters] = useState<String[]>([]);
  const [tcpLogs, setTcpLogs] = useState<Log[]>([]);
  const [udpLogs, setUdpLogs] = useState<Log[]>([]);
  const [pluginLogs, setPluginLogs] = useState<Log[]>([]);
  const [addressInput, setAddressInput] = useState<string>('');
  const [variables, setVariables] = useState<KeyedObject>({});
  const [varMode, setVarMode] = useState<boolean>(false);
  const [scrollLock, setScrollLock] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('tcp');
  const [selectedTypeFilters, setSelectedTypeFilters] = useState<string[]>(['send', 'receive']);

  const typeFilters = [
    { label: 'Send', icon: faArrowUp, value: 'send' },
    { label: 'Receive', icon: faArrowDown, value: 'receive' },
    { label: 'Plugin', icon: faPlug, value: 'plugin' },
  ];

  useEffect(() => {
    if (data) {
      setTcpLogs([...data.tcp, ...data.tcp]);
      setUdpLogs(data.udp);
      setPluginLogs(data.plugin);
    }
    addListener('/spooder/monitor/log', getLog);
    sendOSC('/spooder/monitor/logging', 1);

    return () => {
      removeListener('/spooder/monitor/log');
    };
  }, [data]);

  if (!isReady) {
    return <h1>Hold on...we're connecting to OSC</h1>;
  }

  if (isLoading) {
    return <CircleLoader />;
  }

  function getLog(message: any) {
    let logObj = JSON.parse(message.args[0]);
    console.log(logObj);

    switch (logObj.type) {
      case 'tcp':
        setTcpLogs([...tcpLogs, logObj]);
        break;
      case 'udp':
        setUdpLogs([...udpLogs, logObj]);
        break;
      case 'plugin':
        setPluginLogs([...pluginLogs, logObj]);
        break;
    }
  }

  function scrollToBottom() {
    const monitorLog = document.querySelector('.osc-monitor-logs');
    if (monitorLog) {
      monitorLog.scrollTop = monitorLog.scrollHeight;
    }
  }

  function scrollToLock(e: any) {
    if (
      e.currentTarget.scrollTop >=
      e.currentTarget.scrollHeight - e.currentTarget.getBoundingClientRect().height
    ) {
      setScrollLock(true);
    } else {
      setScrollLock(false);
    }
  }

  function switchModes(e: any) {
    setVarMode(e.currentTarget.checked);
  }

  let displayLogs = [] as Log[];
  if (selectedTab == 'tcp') {
    displayLogs = tcpLogs;
  } else if (selectedTab == 'udp') {
    displayLogs = udpLogs;
  } else if (selectedTab == 'plugin') {
    displayLogs = pluginLogs;
  }

  if (varMode == false) {
    return (
      <Box flexFlow='column'>
        <Box height='100%' flexFlow='column' padding='medium' marginBottom='var(--footer-height)'>
          {displayLogs.map((log, index) => (
            <ExpandableLog log={log} key={index} />
          ))}
        </Box>
        <Footer showFooter={true}>
          <Box
            width='100%'
            flexFlow='row'
            justifyContent='space-between'
            alignItems='center'
            padding='small'
          >
            <Columns spacing='small'>
              <ButtonRow
                buttonSize='large'
                iconSize='large'
                buttons={[
                  { icon: faT, onClick: () => setSelectedTab('tcp') },
                  { icon: faU, onClick: () => setSelectedTab('udp') },
                  {
                    icon: faPlug,
                    onClick: () => setSelectedTab('plugin'),
                  },
                ]}
              />
              <FilterButton
                options={typeFilters}
                selectedOptions={selectedTypeFilters}
                onChange={(newSelections) => {
                  setSelectedTypeFilters(newSelections);
                }}
              />
            </Columns>
            {scrollLock ? null : <Button icon={faArrowDown} onClick={() => scrollToBottom()} />}
          </Box>
        </Footer>
      </Box>
    );
  } else {
    let varDivs = [] as React.JSX.Element[];
    for (let v in variables) {
      let percentage =
        Math.floor(
          ((Math.abs(variables[v].min) + variables[v].value) /
            (Math.abs(variables[v].min) + Math.abs(variables[v].max))) *
            100,
        ) + '%';

      varDivs.push(
        <div
          className='osc-monitor-variable'
          key={v + variables[v].value}
          style={{
            background:
              'linear-gradient(90deg, rgb(0,128,0) ' + percentage + ', rgb(0,70,0) ' + percentage,
          }}
        >
          <label>{v}</label>
          <div className='monitor-variable-numbers'>
            <div className='monitor-variable-numbers-content'>{variables[v].min}</div>
            <div className='monitor-variable-numbers-content'>{variables[v].value}</div>
            <div className='monitor-variable-numbers-content'>{variables[v].max}</div>
          </div>
        </div>,
      );
    }
    if (varDivs.length == 0) {
      varDivs = [<label>Send OSC to display variables</label>];
    }
    return (
      <div className='deck-osc-monitor variable'>
        <div className='osc-monitor-filters'>
          <div className='osc-monitor-controls-1'>
            <div className='monitor-variables-switch'>
              <BoolSwitch label='Variables:' value={varMode} onChange={switchModes} />
            </div>
          </div>
        </div>
        <div className='osc-monitor-variables'>{varDivs}</div>
      </div>
    );
  }
}
