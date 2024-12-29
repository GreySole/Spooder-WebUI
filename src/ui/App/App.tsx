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
import Header from './Header';
import NavigationMenu from './navigation/NavigationMenu';
import NavigationTabs from './navigation/NavigationTabs';
import OBS from '../deck/OBS';
import DashboardTab from '../tabs/DashboardTab';
import useTheme from '../../app/hooks/useTheme';
import ModuleTab from '../tabs/ModuleTab';
import Box from '../common/layout/Box';
import useFooter from '../../app/hooks/useFooter';
import ThemeTab from '../tabs/ThemeTab';

export default function App() {
  const { currentTab } = useNavigation();
  const { setCustomSpooder, refreshThemeColors, isMobileDevice } = useTheme();
  const { getServerState } = useServer();
  const { data: serverData, isLoading: serverLoading, error: serverError } = getServerState();
  const { addListener, removeListener } = useOSC();
  const { showFooter } = useFooter();

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
    case 'theme':
      tabContent = <ThemeTab />;
      break;
  }

  const height = `calc(100dvh - var(--header-height)${isMobileDevice ? '' : ' - var(--navigation-tabs-height)'})`;

  return (
    <Box flexFlow='column'>
      <Header />
      <NavigationMenu />
      <Box
        width='100%'
        height={height}
        marginTop={
          isMobileDevice
            ? 'calc(var(--header-height)'
            : 'calc(var(--header-height) + var(--navigation-tabs-height))'
        }
        flexFlow='column'
        overflow='auto'
      >
        {tabContent}
      </Box>
    </Box>
  );
}
