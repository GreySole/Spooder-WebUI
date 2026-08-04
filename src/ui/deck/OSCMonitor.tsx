import {
  faArrowDown,
  faArrowUp,
  faNetworkWired,
  faPlug,
  faT,
  faU,
} from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  SearchBar,
  Stack,
  TypeFace,
  useOSC,
  useTheme,
} from '@spooder/webui-component-library';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useServer from '../../app/hooks/useServer';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { Footer } from '../app/Footer';
import ExpandableLog from './oscMonitor/ExpandableLog';
import PageCircleLoader from '../common/input/general/PageCircleLoader';
import { useScrollContext } from '../../app/context/ScrollContext';

export interface Log {
  timestamp: string;
  type: string;
  direction: string;
  address: string;
  args: any[] | any;
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
  const { isMobileDevice } = useTheme();
  /*const [typeFilters, setTypeFilters] = useState<String[]>([
    'tcp',
    'udp',
    'send',
    'receive',
    'plugin',
  ]);*/
  const [tcpLogs, setTcpLogs] = useState<Log[]>([]);
  const [udpLogs, setUdpLogs] = useState<Log[]>([]);
  const [pluginLogs, setPluginLogs] = useState<Log[]>([]);
  const [addressInput, setAddressInput] = useState<string>('');
  const [scrollLock, setScrollLock] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('tcp');
  const [selectedTypeFilters, setSelectedTypeFilters] = useState<string[]>(['send', 'receive']);
  const { scrollToBottom, scrollContainerRef, getScrollPosition, isAtBottom } = useScrollContext();

  const getLog = useCallback(
    (message: any) => {
      console.log('Received log message:', message);
      const logObj = JSON.parse(message.args[0]);

      switch (logObj.type) {
        case 'tcp':
          setTcpLogs((prevTcpLogs) => [...prevTcpLogs, logObj]);
          break;
        case 'udp':
          setUdpLogs((prevUdpLogs) => [...prevUdpLogs, logObj]);
          break;
        case 'plugin':
          setPluginLogs((prevPluginLogs) => [...prevPluginLogs, logObj]);
          break;
      }
    },
    [tcpLogs, udpLogs, pluginLogs],
  );

  useEffect(() => {
    if (data) {
      setTcpLogs(data.tcp);
      setUdpLogs(data.udp);
      setPluginLogs(data.plugin);
    }
    addListener('/spooder/monitor/log', getLog);
    sendOSC('/spooder/monitor/live_logging', 1);

    return () => {
      removeListener('/spooder/monitor/log');
    };
  }, [data]);

  useEffect(() => {
    const checkScrollLock = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = getScrollPosition();
        const isAtBottomNow = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
        if (!scrollLock) {
          setScrollLock(isAtBottomNow);
        }
      }
    };

    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener('wheel', checkScrollLock);
    }

    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener('wheel', checkScrollLock);
      }
    };
  }, [scrollContainerRef, getScrollPosition]);

  useEffect(() => {
    if (scrollLock) {
      scrollToBottom();
    }
  }, [tcpLogs, udpLogs, pluginLogs]);

  if (!isReady) {
    return null;
  }

  if (isLoading) {
    return <PageCircleLoader />;
  }

  function scrollToBottomClick() {
    scrollToBottom();
    setScrollLock(true);
  }

  let displayLogs = [] as Log[];
  if (selectedTab == 'tcp') {
    displayLogs = tcpLogs;
  } else if (selectedTab == 'udp') {
    displayLogs = udpLogs;
  } else if (selectedTab == 'plugin') {
    displayLogs = pluginLogs;
  }

  return (
    <Box flexFlow='column' width={'100%'}>
      <Box flexFlow='column' overflow='auto' width='100%' paddingBottom={'var(--footer-height)'}>
        {displayLogs.map((log, index) => (
          <ExpandableLog log={log} key={index} />
        ))}
      </Box>
      <Footer showFooter={true}>
        <Box padding='none' spacing='medium'>
          <SearchBar
            placeholder='Filter by address...'
            value={addressInput}
            onSearch={(e) => setAddressInput(e)}
          />
          <ButtonRow
            buttonSize='small'
            iconSize='medium'
            buttons={[
              {
                icon: faT,
                onClick: () => setSelectedTab('tcp'),
                isActive: selectedTab == 'tcp',
              },
              {
                icon: faU,
                onClick: () => setSelectedTab('udp'),
                isActive: selectedTab == 'udp',
              },
              {
                icon: faPlug,
                onClick: () => setSelectedTab('plugin'),
                isActive: selectedTab == 'plugin',
              },
            ]}
          />
          <ButtonRow
            buttonSize='small'
            iconSize='medium'
            buttons={[
              {
                icon: faArrowUp,
                onClick: () => {
                  if (selectedTypeFilters.includes('send')) {
                    setSelectedTypeFilters(
                      selectedTypeFilters.filter((filter) => filter !== 'send'),
                    );
                  } else {
                    setSelectedTypeFilters([...selectedTypeFilters, 'send']);
                  }
                },
                isActive: selectedTypeFilters.includes('send'),
              },
              {
                icon: faArrowDown,
                onClick: () => {
                  if (selectedTypeFilters.includes('receive')) {
                    setSelectedTypeFilters(
                      selectedTypeFilters.filter((filter) => filter !== 'receive'),
                    );
                  } else {
                    setSelectedTypeFilters([...selectedTypeFilters, 'receive']);
                  }
                },
                isActive: selectedTypeFilters.includes('receive'),
              },
            ]}
          />
          {scrollLock ? null : <Button icon={faArrowDown} onClick={() => scrollToBottomClick()} />}
        </Box>
      </Footer>
    </Box>
  );
}
