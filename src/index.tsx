import React from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import store from './app/store';
import InitLayer from './InitLayer';
import startModuleBootstrap from './modules/bootstrap';
import registerSourceModules from './modules/devModules';
import loadRemoteModules from './modules/loadRemoteModules';
import ThemeLayer from './ThemeLayer';

// Mirror the registry into the store before anything renders, then register whatever was
// compiled in. Remotes are fetched after first paint on purpose: the app should not wait on
// the network to draw its own tabs, and a module appears as it arrives.
startModuleBootstrap();
registerSourceModules();
loadRemoteModules();

const rootElement = document.getElementById('app');
const root = createRoot(rootElement!);
root.render(
  <Provider store={store}>
    <ThemeLayer />
  </Provider>,
);
