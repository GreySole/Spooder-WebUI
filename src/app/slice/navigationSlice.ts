import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowsSplitUpAndLeft,
  faClapperboard,
  faDashboard,
  faGears,
  faHammer,
  faPaintRoller,
  faPerson,
  faPlug,
  faShareNodes,
  faTv
} from '@fortawesome/free-solid-svg-icons';
import { createSlice } from '@reduxjs/toolkit';
import { modules } from '../../modules/registry';

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

const moduleMainTabs: TabOptions = {};
const moduleDeckTabs: TabOptions = {};
for (const m of modules) {
  const tab = { label: m.tabConfig.label, icon: m.tabConfig.icon };
  // Modules sit with the decks below the divider. 'main' is the only opt-out, putting a
  // module up with Dashboard/Events/etc; the legacy 'module' value lands in the decks too,
  // since the Modules folder it used to nest under is gone.
  if (m.tabConfig.parentTab === 'main') {
    moduleMainTabs[m.key] = tab;
  } else {
    moduleDeckTabs[m.key] = tab;
  }
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
      ...moduleMainTabs,
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
      // Module tabs (OBS, Twitch, Discord) come first, above the built-in decks.
      ...moduleDeckTabs,
      osc: {
        label: 'OSC Monitor',
        icon: faTv,
      },
      mod: {
        label: 'Mod UI',
        icon: faHammer,
      },
    } as TabOptions,
    currentTab:
      new URLSearchParams(window.location.search).get('tab') ??
      localStorage.getItem('lastTab') ??
      'dashboard',
    currentFolder: undefined,
    navigationOpen: false,
    rememberLastTab: localStorage.getItem('lastTab') != null,
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
    _setRememberLastTab: (state, action) => {
      state.rememberLastTab = action.payload.isRemembering;
    },
  },
});

export const { _setTab, _toggleNavigation, _setNavigation, _setRememberLastTab } =
  navigationSlice.actions;

export default navigationSlice.reducer;
