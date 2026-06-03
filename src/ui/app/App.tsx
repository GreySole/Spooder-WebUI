import {
  Box,
  CustomSpooder,
  Grid,
  useOSC,
  useTheme
} from '@greysole/spooder-component-library';
import React, { useEffect } from 'react';
import { useScrollContext } from '../../app/context/ScrollContext';
import useNavigation from '../../app/hooks/useNavigation';
import useServer from '../../app/hooks/useServer';
import { modules } from '../../modules/registry';
import PageCircleLoader from '../common/input/general/PageCircleLoader';
import ModUI from '../deck/ModUI';
import OBS from '../deck/OBS';
import OSCMonitor from '../deck/OSCMonitor';
import ConfigTab from '../tabs/ConfigTab';
import DashboardTab from '../tabs/DashboardTab';
import EventTab from '../tabs/EventTab';
import OSCTunnelTab from '../tabs/OSCTunnelTab';
import PluginTab from '../tabs/PluginTab';
import ShareTab from '../tabs/ShareTab';
import ThemeTab from '../tabs/ThemeTab';
import UserTab from '../tabs/UserTab';
import Header from './Header';

const moduleMap = Object.fromEntries(modules.map((m) => [m.key, m.Component]));

export default function App() {
  const { currentTab, navigationOpen } = useNavigation();
  const { refreshThemeColors, isMobileDevice } = useTheme();
  const { scrollContainerRef } = useScrollContext();

  const { getServerState } = useServer();
  const { data: serverData, isLoading: serverLoading, error: serverError } = getServerState();
  const { addListener, removeListener } = useOSC();
  const tutorialDialog = localStorage.getItem('tutorial');

  useEffect(() => {
    refreshThemeColors();
  }, [serverData, tutorialDialog]);

  if (serverLoading) {
    return <PageCircleLoader />;
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
    default: {
      const ModuleComponent = moduleMap[currentTab];
      if (ModuleComponent) tabContent = <ModuleComponent />;
      break;
    }
  }

  return (
    <Grid
      className='app-container'
      columns={`${!isMobileDevice || navigationOpen ? 'var(--menu-width)' : '0'} 1fr`}
      rows={'1fr'}
      spacing='medium'
      height={'100dvh'}
      overflow='hidden'
      justifyContent='center'
      justifyItems='center'
      alignItems='stretch'
    >
      <Header />
      <Box
        ref={scrollContainerRef}
        flexFlow='column'
        alignItems='end'
        overflow='hidden scroll'
        width={'100%'}
        style={{ maxWidth: '1200px' }}
      >
        <Box paddingTop='smedium' paddingBottom='smedium'>
          <CustomSpooder />
        </Box>
        {tabContent}
      </Box>
    </Grid>
  );
}
