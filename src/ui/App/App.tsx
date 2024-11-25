import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import useNavigation from '../../app/hooks/useNavigation';
import useServer from '../../app/hooks/useServer';
import ModUI from '../deck/ModUI';
import OSCMonitor from '../deck/OSCMonitor';
import PluginTab from '../tabs/PluginTab';
import CircleLoader from '../common/loader/CircleLoader';
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
import NavigationMenu from './navigation/NavigationMenu';
import NavigationTabs from './navigation/NavigationTabs';
import OBS from '../deck/OBS';
import DiscordTab from '../tabs/DiscordTab';
import DashboardTab from '../tabs/DashboardTab';
import useTheme from '../../app/hooks/useTheme';
import FormLoader from '../common/loader/FormLoader';
import ModuleTab from '../tabs/ModuleTab';

export default function App() {
  const { currentTab } = useNavigation();
  const { setCustomSpooder, refreshThemeColors } = useTheme();
  const { getServerState } = useServer();
  const { data: serverData, isLoading: serverLoading, error: serverError } = getServerState();
  const { addListener, removeListener } = useOSC();
  const { getRefreshPlugins } = usePlugins();

  useEffect(() => {
    addListener('/obs/status/connection', (message: any) => {});
    ``;
    refreshThemeColors();
    if (serverData?.themes?.spooderpet) {
      setCustomSpooder(serverData.themes.spooderpet.parts, serverData.themes.spooderpet.colors);
    }

    return () => {
      removeListener('/obs/status/connection');
    };
  }, [serverData]);

  if (serverLoading) {
    return <CircleLoader />;
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
    case 'module':
      tabContent = <ModuleTab />;
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

  return (
    <div className='App'>
      <AppHeader />
      <NavigationTabs />
      <NavigationMenu />

      {appContent}
    </div>
  );
}
