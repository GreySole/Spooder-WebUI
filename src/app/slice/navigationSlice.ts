import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowsSplitUpAndLeft,
  faClapperboard,
  faDashboard,
  faGears,
  faHammer,
  faLayerGroup,
  faPaintRoller,
  faPerson,
  faPlug,
  faStore,
  faShareNodes,
  faTv
} from '@fortawesome/free-solid-svg-icons';
import { createSlice } from '@reduxjs/toolkit';

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

// Module tabs are not known when this file loads - in production the modules are federated
// remotes that arrive later - so the core tabs are split around the slot module tabs occupy,
// and _setModuleTabs rebuilds the lists once modules register. Rebuilding rather than
// appending is what keeps a module tab in its place rather than after Users/Config or below
// the built-in decks.
const CORE_MAIN_TABS_BEFORE_MODULES: TabOptions = {
  dashboard: { label: 'Dashboard', icon: faDashboard },
  commands: { label: 'Events', icon: faClapperboard },
  plugins: { label: 'Plugins', icon: faPlug },
  modules: { label: 'Modules', icon: faStore },
  osctunnels: { label: 'Tunnels', icon: faArrowsSplitUpAndLeft },
};

const CORE_MAIN_TABS_AFTER_MODULES: TabOptions = {
  users: { label: 'Users', icon: faPerson },
  sharing: { label: 'Share', icon: faShareNodes },
  theme: { label: 'Theme', icon: faPaintRoller },
  config: { label: 'Config', icon: faGears },
};

// Exported so NavigationTabs can tell where the deck's own module tabs end and these built-in
// tool tabs begin, to draw the second divider between them.
export const CORE_DECK_TABS: TabOptions = {
  osc: { label: 'OSC Monitor', icon: faTv },
  mod: { label: 'Mod UI', icon: faHammer },
  overlay: { label: 'Overlays', icon: faLayerGroup },
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    tabOptions: {
      ...CORE_MAIN_TABS_BEFORE_MODULES,
      ...CORE_MAIN_TABS_AFTER_MODULES,
    } as TabOptions,
    deckTabOptions: { ...CORE_DECK_TABS } as TabOptions,
    currentTab:
      new URLSearchParams(window.location.search).get('tab') ??
      localStorage.getItem('lastTab') ??
      'dashboard',
    currentFolder: undefined,
    navigationOpen: false,
    // Desktop-only: whether the mouse is over the collapsed icon rail, which is the one thing
    // that widens it back out to show labels. Unused on mobile, where navigationOpen already
    // drives the full slide-out instead.
    navRailHovered: false,
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
    _setNavRailHovered: (state, action) => {
      state.navRailHovered = action.payload.isHovered;
    },
    _setRememberLastTab: (state, action) => {
      state.rememberLastTab = action.payload.isRemembering;
    },
    // Payload is the module tabs split by where they belong: `main` sits with Dashboard and
    // Events, `deck` below the divider with OSC Monitor and Mod UI. Both lists are rebuilt
    // from scratch so registration order never reorders the menu.
    _setModuleTabs: (state, action) => {
      state.tabOptions = {
        ...CORE_MAIN_TABS_BEFORE_MODULES,
        ...action.payload.main,
        ...CORE_MAIN_TABS_AFTER_MODULES,
      };
      state.deckTabOptions = { ...action.payload.deck, ...CORE_DECK_TABS };
    },
  },
});

export const {
  _setTab,
  _toggleNavigation,
  _setNavigation,
  _setNavRailHovered,
  _setRememberLastTab,
  _setModuleTabs,
} = navigationSlice.actions;

export default navigationSlice.reducer;
