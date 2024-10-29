import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import useNavigation from '../../app/hooks/useNavigation';
import useServer from '../../app/hooks/useServer';
import ModUI from '../deck/ModUI';
import OSCMonitor from '../deck/OSCMonitor';
import PluginTab from '../tabs/PluginTab';
import LoadingCircle from '../common/LoadingCircle';
import BoolSwitch from '../common/input/controlled/BoolSwitch';
import usePlugins from '../../app/hooks/usePlugins';
import { useOSC } from '../../app/context/OscContext';
import EventTab from '../tabs/EventTab';
import ConfigTab from '../tabs/ConfigTab';
import OSCTunnelTab from '../tabs/OSCTunnelTab';
import ShareTab from '../tabs/ShareTab';
import UserTab from '../tabs/UserTab';
import TwitchTab from '../tabs/TwitchTab';
import AppHeader from './AppHeader';
import NavigationMenu from './NavigationMenu';
import NavigationTabs from './NavigationTabs';
import OBS from '../deck/OBS';
import DiscordTab from '../tabs/DiscordTab';
import DashboardTab from '../tabs/DashboardTab';

export default function App() {
  const { urlParams, currentTab, stayHere, navigationOpen, setStayHere } = useNavigation();
  const { getServerState } = useServer();
  const { data: serverData, isLoading: serverLoading, error: serverError } = getServerState();
  const { addListener, removeListener } = useOSC();
  const { getRefreshPlugins } = usePlugins();
  const { refreshPlugins } = getRefreshPlugins();

  useEffect(() => {
    addListener('/obs/status/connection', (message: any) => {});

    return () => {
      removeListener('/obs/status/connection');
    };
  }, []);

  if (serverLoading) {
    return <LoadingCircle />;
  }

  if (serverData.isExternal) {
    return (
      <div className='App'>
        <div className='locals-only'>
          <h1 className='App-title'>/╲/\( º^ ω ^º; )/\╱\</h1>
          <h1>Sorry, locals only</h1>
        </div>
      </div>
    );
  }

  if (serverData.stateLoaded == false) {
    return (
      <div className='App'>
        <div className='locals-only'>
          <h1 className='App-title'>/╲/\( ºO ω Oº )/\╱\</h1>
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  let tabContent = <div>404</div>;
  let appMode = 'setup';
  console.log(currentTab);
  switch (currentTab) {
    case 'dashboard':
      tabContent = <DashboardTab />;
      break;
    case 'commands':
      tabContent = <EventTab />;
      break;
    case 'config':
      tabContent = <ConfigTab />;
      break;
    case 'plugins':
      tabContent = <PluginTab />;
      break;
    case 'osctunnels':
      tabContent = <OSCTunnelTab />;
      break;
    case 'sharing':
      tabContent = <ShareTab />;
      break;
    case 'users':
      tabContent = <UserTab />;
      break;
    case 'discord':
      tabContent = <DiscordTab />;
      break;
    case 'twitch':
      tabContent = <TwitchTab />;
      break;
    case 'obs':
      tabContent = <OBS />;
      break;
    case 'osc':
      tabContent = <OSCMonitor />;
      break;
    case 'mod':
      tabContent = <ModUI />;
      break;
  }

  const appContent = (
    <div className={'App-content ' + appMode}>
      <div id='tabContent'>{tabContent}</div>
    </div>
  );
  let shareElements = [] as React.JSX.Element[];
  for (let s in serverData.shares) {
    shareElements.push(
      <div className='nav-share-entry' key={s}>
        <label>{s}</label>
        <button
          name={s}
          className={
            'nav-share-button ' + (serverData.shares[s] == false ? 'save-button' : 'delete-button')
          }
          onClick={() => {}}
        >
          <FontAwesomeIcon icon={serverData.shares[s] == false ? faPlay : faStop} size='lg' />
        </button>
      </div>,
    );
  }

  return (
    <div className='App'>
      <AppHeader />
      <div className={'navigation-menu ' + (navigationOpen ? 'open' : '')}>
        <NavigationTabs />
        <NavigationMenu />
        <div className='chat-actions'>
          <BoolSwitch
            onChange={() => setStayHere(urlParams.get('tab') == null)}
            value={urlParams.get('tab') != null}
            label='Stay Here'
          />
          <div>
            Plugins{' '}
            <button type='button' className='nav-restart-chat-button' onClick={refreshPlugins}>
              Refresh Plugins
            </button>
          </div>
          <div>
            Chat{' '}
            <button type='button' className='nav-restart-chat-button' onClick={() => {}}>
              Restart Chat
            </button>
          </div>
          <div>
            Shares
            <div className='nav-share-container'>{shareElements}</div>
          </div>
        </div>
      </div>

      {appContent}
    </div>
  );
}
