import React, { useEffect } from 'react';
import {
  Button,
  Stack,
  TooltipButton,
  TypeFace,
  useDialog,
  useOSC,
  Grid,
  CustomSpooder,
} from '@greysole/spooder-component-library';
import { useTheme } from '@greysole/spooder-component-library';
import useNavigation from '../../app/hooks/useNavigation';
import useServer from '../../app/hooks/useServer';
import { Box } from '@greysole/spooder-component-library';
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
import NavigationMenu from './navigation/NavigationMenu';
import PageCircleLoader from '../common/input/general/PageCircleLoader';
import TwitchTab from '../tabs/TwitchTab';
import DiscordTab from '../tabs/DiscordTab';

export default function App() {
  const { currentTab, navigationOpen } = useNavigation();
  const { openDialog, closeDialog } = useDialog();
  const { setCustomSpooder, refreshThemeColors, isMobileDevice } = useTheme();

  const { getServerState } = useServer();
  const { data: serverData, isLoading: serverLoading, error: serverError } = getServerState();
  const { addListener, removeListener } = useOSC();
  const tutorialDialog = localStorage.getItem('tutorial');

  useEffect(() => {
    addListener('/obs/status/connection', (message: any) => {});
    refreshThemeColors();

    return () => {
      removeListener('/obs/status/connection');
    };
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
    case 'twitch':
      tabContent = <TwitchTab />;
      break;
    case 'discord':
      tabContent = <DiscordTab />;
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
        flexFlow='column'
        alignItems='end'
        overflow='hidden scroll'
        width={'100%'}
        style={{ maxWidth: '1200px' }}
      >
        <Box paddingTop='smedium'>
          <CustomSpooder />
        </Box>
        {tabContent}
      </Box>
    </Grid>
  );
}
