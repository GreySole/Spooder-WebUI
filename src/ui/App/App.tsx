import React, { useEffect } from 'react';
import { useOSC } from '@greysole/spooder-component-library';
import { useTheme } from '@greysole/spooder-component-library';
import useNavigation from '../../app/hooks/useNavigation';
import useServer from '../../app/hooks/useServer';
import { CircleLoader, Box } from '@greysole/spooder-component-library';
import useFooter from '../../app/hooks/useFooter';
import ModUI from '../deck/ModUI';
import OBS from '../deck/OBS';
import OSCMonitor from '../deck/OSCMonitor';
import ConfigTab from '../tabs/ConfigTab';
import DashboardTab from '../tabs/DashboardTab';
import EventTab from '../tabs/EventTab';
import ModuleTab from '../tabs/ModuleTab';
import OSCTunnelTab from '../tabs/OSCTunnelTab';
import PluginTab from '../tabs/PluginTab';
import ShareTab from '../tabs/ShareTab';
import ThemeTab from '../tabs/ThemeTab';
import UserTab from '../tabs/UserTab';
import Header from './Header';
import NavigationMenu from './navigation/NavigationMenu';

export default function App() {
  const { currentTab } = useNavigation();
  const { setCustomSpooder, refreshThemeColors, isMobileDevice } = useTheme();

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

  console.log('APP RENDER');

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
