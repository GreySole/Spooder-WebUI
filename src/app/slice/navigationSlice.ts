import { createSlice } from '@reduxjs/toolkit';

interface TabOptions {
  [key: string]: string;
}

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    tabOptions: {
      dashboard: 'Dashboard',
      commands: 'Events',
      plugins: 'Plugins',
      osctunnels: 'Tunnels',
      twitch: 'Twitch',
      discord: 'Discord',
      users: 'Users',
      sharing: 'Sharing',
      config: 'Config',
    } as TabOptions,
    deckTabOptions: {
      obs: 'OBS Remote',
      osc: 'OSC Monitor',
      mod: 'Mod UI',
    } as TabOptions,
    currentTab: new URLSearchParams(window.location.search).get('tab') ?? 'dashboard',
    navigationOpen: false,
    stayHere: window.location.search.includes('tab'),
  },
  reducers: {
    _setTab: (state, action) => {
      state.currentTab = action.payload.tab;
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
