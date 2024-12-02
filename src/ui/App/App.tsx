import React, { useEffect } from 'react';
import useNavigation from '../../app/hooks/useNavigation';
import useServer from '../../app/hooks/useServer';
import ModUI from '../deck/ModUI';
import OSCMonitor from '../deck/OSCMonitor';
import PluginTab from '../tabs/PluginTab';
import CircleLoader from '../common/loader/CircleLoader';
import { useOSC } from '../../app/context/OscContext';
import EventTab from '../tabs/EventTab';
import ConfigTab from '../tabs/ConfigTab';
import OSCTunnelTab from '../tabs/OSCTunnelTab';
import ShareTab from '../tabs/ShareTab';
import UserTab from '../tabs/UserTab';
import AppHeader from './AppHeader';
import NavigationMenu from './navigation/NavigationMenu';
import NavigationTabs from './navigation/NavigationTabs';
import OBS from '../deck/OBS';
import DashboardTab from '../tabs/DashboardTab';
import useTheme from '../../app/hooks/useTheme';
import ModuleTab from '../tabs/ModuleTab';
import Box from '../common/layout/Box';

export default function App() {
  const { currentTab } = useNavigation();
  const { setCustomSpooder, refreshThemeColors } = useTheme();
  const { getServerState } = useServer();
  const { data: serverData, isLoading: serverLoading, error: serverError } = getServerState();
  const { addListener, removeListener } = useOSC();

  useEffect(() => {
    addListener('/obs/status/connection', (message: any) => {});
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

  return (
    <Box classes={['App']} flexFlow='column'>
      <AppHeader />
      <NavigationTabs />
      <NavigationMenu />
      <Box padding='medium' width='100%'>
        {tabContent}
      </Box>
    </Box>
  );
}
