import { createSlice, current } from '@reduxjs/toolkit';
import { themeSlice } from './themeSlice';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faDashboard,
  faClapperboard,
  faPlug,
  faArrowsSplitUpAndLeft,
  faPuzzlePiece,
  faPerson,
  faShareNodes,
  faPaintRoller,
  faGears,
  faGamepad,
  faTv,
  faHammer,
  faQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { DiscordIcon, TwitchIcon } from '../../ui/common/icons/icons';

interface TabOptions {
  [key: string]: Tab | FolderTab;
}

interface Tab {
  label: string;
  icon: IconProp;
}

interface FolderTab {
  label: string;
  icon: IconProp;
  subTabs: TabOptions;
}

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    tabOptions: {
      dashboard: {
        label: 'Dashboard',
        icon: faDashboard,
      },
      commands: {
        label: 'Events',
        icon: faClapperboard,
      },
      plugins: {
        label: 'Plugins',
        icon: faPlug,
      },
      osctunnels: {
        label: 'Tunnels',
        icon: faArrowsSplitUpAndLeft,
      },
      module: {
        label: 'Modules',
        icon: faPuzzlePiece,
        subTabs: {
          twitch: {
            label: 'Twitch',
            icon: TwitchIcon,
          },
          discord: {
            label: 'Discord',
            icon: DiscordIcon,
          },
        },
      },
      users: {
        label: 'Users',
        icon: faPerson,
      },
      sharing: {
        label: 'Share',
        icon: faShareNodes,
      },
      theme: {
        label: 'Theme',
        icon: faPaintRoller,
      },
      config: {
        label: 'Config',
        icon: faGears,
      },
    } as TabOptions,
    deckTabOptions: {
      obs: {
        label: 'OBS Remote',
        icon: faGamepad,
      },
      osc: {
        label: 'OSC Monitor',
        icon: faTv,
      },
      mod: {
        label: 'Mod UI',
        icon: faHammer,
      },
    } as TabOptions,
    currentTab: new URLSearchParams(window.location.search).get('tab') ?? 'dashboard',
    currentFolder: undefined,
    navigationOpen: false,
    stayHere: window.location.search.includes('tab'),
  },
  reducers: {
    _setTab: (state, action) => {
      state.currentTab = action.payload.tab;
      state.currentFolder = action.payload.folder;
    },
    _toggleNavigation: (state) => {
      state.navigationOpen = !state.navigationOpen;
    },
    _setNavigation: (state, action) => {
      state.navigationOpen = action.payload.isOpen;
    },
    _setStayHere: (state, action) => {
      console.log('SETTING STATE', action.payload.stayHere);
      state.stayHere = action.payload.stayHere;
    },
  },
});

export const { _setTab, _toggleNavigation, _setNavigation, _setStayHere } = navigationSlice.actions;

export default navigationSlice.reducer;
