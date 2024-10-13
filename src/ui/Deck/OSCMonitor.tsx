import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import FormBoolSwitch from '../common/input/form/FormBoolSwitch';
import BoolSwitch from '../common/input/controlled/BoolSwitch';
import { KeyedObject } from '../Types';
import { useOSC } from '../../app/context/OscContext';

interface Log {
  name: string;
  timestamp: string;
  type: string;
  protocol: string;
  direction: string;
  message: string;
  data: {
    address: string;
    types: string;
    data: string;
  };
}

export default function OSCMonitor() {
  const { addListener, removeListener, sendOSC } = useOSC();
  const [typeFilters, setTypeFilters] = useState<String[]>([
    'tcp',
    'udp',
    'send',
    'receive',
    'plugin',
  ]);
  const [addressFilters, setAddressFilters] = useState<String[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [pluginLogs, setPluginLogs] = useState<Log[]>([]);
  const [addressInput, setAddressInput] = useState<string>('');
  const [variables, setVariables] = useState<KeyedObject>({});
  const [varMode, setVarMode] = useState<boolean>(false);
  const [scrollLock, setScrollLock] = useState<boolean>(false);

  useEffect(() => {
    addListener('/frontend/monitor/osc', getLog);
    addListener('/frontend/monitor/plugin', getPluginLog);
    addListener('/frontend/monitor/get/all', getAllLogs);

    sendOSC('/frontend/monitor/logging', 1);
    sendOSC('/frontend/monitor/get', 'all');

    return () => {
      removeListener('/frontend/monitor/osc');
      removeListener('/frontend/monitor/plugin');
      removeListener('/frontend/monitor/get/all');
    };
  });

  function getAllLogs(message: any) {
    let logObj = JSON.parse(message.args[0]);
    setLogs(logObj.logs);
    setPluginLogs(logObj.pluginLogs);
  }

  function getLog(message: any) {
    let logObj = JSON.parse(message.args[0]);

    let newVars = Object.assign(variables);
    if (logObj.direction == 'receive') {
      if (newVars[logObj.data.address] == null && !isNaN(logObj.data.data[0])) {
        newVars[logObj.data.address] = {
          min: logObj.data.data,
          max: logObj.data.data,
          value: logObj.data.data,
        };
      } else if (newVars[logObj.data.address] != null && !isNaN(logObj.data.data[0])) {
        newVars[logObj.data.address].value = logObj.data.data[0];
        if (logObj.data.data[0] < newVars[logObj.data.address].min) {
          newVars[logObj.data.address].min = logObj.data.data[0];
        }
        if (logObj.data.data[0] > newVars[logObj.data.address].max) {
          newVars[logObj.data.address].max = logObj.data.data[0];
        }
      }
    }

    let newLogs = Object.assign(logs);
    newLogs.push(logObj);
    if (newLogs.length > 500) {
      newLogs.shift();
    }
    setLogs(newLogs);
    setVariables(newVars);
  }

  function getPluginLog(message: any) {
    let logObj = JSON.parse(message.args[0]);
    let newLogs = Object.assign(pluginLogs);
    newLogs.push(logObj);
    if (newLogs.length > 500) {
      newLogs.shift();
    }
    setPluginLogs(newLogs);
  }

  function setFilter(filter: string) {
    let newFilters = Object.assign(typeFilters);

    if (newFilters.includes(filter)) {
      newFilters.splice(newFilters.indexOf(filter), 1);
    } else {
      newFilters.push(filter);
    }
    setTypeFilters(newFilters);
  }

  function handleAddressInput(e: any) {
    setAddressInput(e.currentTarget.value);
  }

  function setAddressFilter(e: any) {
    let newAddresses = Object.assign(addressFilters);
    newAddresses.push(addressInput);
    setAddressFilters(newAddresses);
  }

  function removeAddressFilter(af: any) {
    let newAddresses = Object.assign(addressFilters);
    newAddresses.splice(newAddresses.indexOf(af), 1);
    setAddressFilters(newAddresses);
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

  if (varMode == false) {
    let logList = [
      <div className='monitor-log top'>
        <div className='monitor-log-protocol'>Protocol</div>
        <div className='monitor-log-direction'>Direction</div>
        <div className='monitor-log-types'>Types</div>
        <div className='monitor-log-address'>Address</div>
        <div className='monitor-log-data'>Data</div>
      </div>,
    ];

    let finalLogs = [] as Log[];
    finalLogs = finalLogs.concat(logs, pluginLogs);
    finalLogs.sort((a: any, b: any) => {
      return a.timestamp - b.timestamp;
    });

    for (let l in finalLogs) {
      if (finalLogs[l].type == 'osc') {
        if (
          typeFilters.includes(finalLogs[l].protocol) &&
          typeFilters.includes(finalLogs[l].direction)
        ) {
          let aFilterPass = true;
          if (addressFilters.length > 0) {
            aFilterPass = false;
            for (let af in addressFilters) {
              let thisFilter = addressFilters[af];
              if (thisFilter.endsWith('/*')) {
                if (
                  finalLogs[l].data.address.startsWith(
                    thisFilter.substring(0, thisFilter.length - 2),
                  )
                ) {
                  aFilterPass = true;
                }
              } else if (thisFilter == finalLogs[l].data.address) {
                aFilterPass = true;
              }
            }
          }
          if (aFilterPass) {
            logList.push(
              <div className='monitor-log'>
                <div className='monitor-log-protocol'>{finalLogs[l].protocol}</div>
                <div className='monitor-log-direction'>{finalLogs[l].direction}</div>
                <div className='monitor-log-types'>{finalLogs[l].data.types}</div>
                <div className='monitor-log-address'>{finalLogs[l].data.address}</div>
                <div className='monitor-log-data'>{finalLogs[l].data.data}</div>
              </div>,
            );
          }
        }
      } else if (finalLogs[l].type == 'error' && typeFilters.includes('plugin')) {
        logList.push(
          <div className='monitor-log'>
            <div className='monitor-log-protocol'>Plugin</div>
            <div className='monitor-log-direction'></div>
            <div className='monitor-log-types'>{finalLogs[l].type}</div>
            <div className='monitor-log-address'>{finalLogs[l].name}</div>
            <div className='monitor-log-data'>{finalLogs[l].message}</div>
          </div>,
        );
      }
    }

    let addressFilterElements = [] as React.JSX.Element[];

    for (let a in addressFilters) {
      addressFilterElements.push(
        <div className='filters-address-entry'>
          {addressFilters[a]}
          <button onClick={() => removeAddressFilter(addressFilters[a])}>X</button>
        </div>,
      );
    }

    let scrollDownButton =
      scrollLock == false ? (
        <button
          className={'monitor-filters-button scroll-to-bottom enabled'}
          onClick={() => scrollToBottom()}
        >
          <FontAwesomeIcon icon={faArrowDown} size='1x' />
        </button>
      ) : null;

    return (
      <div className='deck-osc-monitor log'>
        <div className='osc-monitor-filters'>
          <div className='osc-monitor-controls-1'>
            <div className='monitor-filters-buttons'>
              <button
                className={
                  'monitor-filters-button ' + (typeFilters.includes('tcp') ? 'enabled' : '')
                }
                onClick={() => setFilter('tcp')}
              >
                TCP
              </button>
              <button
                className={
                  'monitor-filters-button ' + (typeFilters.includes('udp') ? 'enabled' : '')
                }
                onClick={() => setFilter('udp')}
              >
                UDP
              </button>
              <button
                className={
                  'monitor-filters-button ' + (typeFilters.includes('send') ? 'enabled' : '')
                }
                onClick={() => setFilter('send')}
              >
                Send
              </button>
              <button
                className={
                  'monitor-filters-button ' + (typeFilters.includes('receive') ? 'enabled' : '')
                }
                onClick={() => setFilter('receive')}
              >
                Receive
              </button>
              <button
                className={
                  'monitor-filters-button ' + (typeFilters.includes('plugin') ? 'enabled' : '')
                }
                onClick={() => setFilter('plugin')}
              >
                Plugin
              </button>
            </div>
            <div className='monitor-variables-switch'>
              <BoolSwitch label='Variables:' value={varMode} onChange={switchModes} />
            </div>
          </div>

          <div className='osc-monitor-controls-2'>
            <div className={'monitor-filters-address-input'}>
              Address Filter
              <input
                name='address'
                type='text'
                onInput={handleAddressInput}
                placeholder='/something/somethinginside'
                defaultValue={addressInput}
              />
              <button
                className='monitor-filters-button-address'
                onClick={() => setAddressFilter(addressInput)}
              >
                Add
              </button>
            </div>
            <div className='monitor-filters-address'>{addressFilterElements}</div>
          </div>
        </div>
        {scrollDownButton}
        <div className='osc-monitor-logs' onScroll={scrollToLock}>
          {logList}
        </div>
      </div>
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
            <div className='monitor-filters-buttons'>
              <button
                className={
                  'monitor-filters-button ' + (typeFilters.includes('tcp') ? 'enabled' : '')
                }
                onClick={() => setFilter('tcp')}
              >
                TCP
              </button>
              <button
                className={
                  'monitor-filters-button ' + (typeFilters.includes('udp') ? 'enabled' : '')
                }
                onClick={() => setFilter('udp')}
              >
                UDP
              </button>
              <button
                className={
                  'monitor-filters-button ' + (typeFilters.includes('send') ? 'enabled' : '')
                }
                onClick={() => setFilter('send')}
              >
                Send
              </button>
              <button
                className={
                  'monitor-filters-button ' + (typeFilters.includes('receive') ? 'enabled' : '')
                }
                onClick={() => setFilter('receive')}
              >
                Receive
              </button>
            </div>
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
