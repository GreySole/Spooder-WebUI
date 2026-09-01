import { combineReducers, configureStore, createDynamicMiddleware } from '@reduxjs/toolkit';
import type { ModuleApi } from '@spooder/webui-module-sdk';
import { configApi, serverApi } from '@spooder/webui-module-sdk';
import { eventApi } from './api/eventSlice';
import { moduleApi } from './api/moduleSlice';
import { pluginApi } from './api/pluginSlice';
import { recoveryApi } from './api/recoverySlice';
import { shareApi } from './api/shareSlice';
import { themeApi } from './api/themeSlice';
import { userApi } from './api/userSlice';
import footerSlice from './slice/footerSlice';
import navigationSlice from './slice/navigationSlice';

// A module's api arrives with the module, which in production is after the store has been
// created - so its reducer and middleware have to be added to a running store rather than
// listed here. RTK's dynamic middleware is the half that cannot be done any other way:
// configureStore's middleware chain is fixed once built, and an RTK Query api whose middleware
// never ran would fetch once and never refetch, invalidate, or cache-collect.
const dynamicMiddleware = createDynamicMiddleware();

const coreReducers = {
  navigationSlice,
  footerSlice,
  [themeApi.reducerPath]: themeApi.reducer,
  [recoveryApi.reducerPath]: recoveryApi.reducer,
  [eventApi.reducerPath]: eventApi.reducer,
  [configApi.reducerPath]: configApi.reducer,
  [moduleApi.reducerPath]: moduleApi.reducer,
  [pluginApi.reducerPath]: pluginApi.reducer,
  [serverApi.reducerPath]: serverApi.reducer,
  [shareApi.reducerPath]: shareApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
};

// Kept so replaceReducer can rebuild the root reducer with the module slices added. RTK's
// combineSlices exists for this, but it wants slice objects; an RTK Query api is a reducer
// keyed by reducerPath, so a plain map plus combineReducers is the simpler fit.
const injectedReducers: { [reducerPath: string]: any } = {};

const store = configureStore({
  reducer: coreReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(themeApi.middleware)
      .concat(recoveryApi.middleware)
      .concat(eventApi.middleware)
      .concat(configApi.middleware)
      .concat(moduleApi.middleware)
      .concat(pluginApi.middleware)
      .concat(serverApi.middleware)
      .concat(shareApi.middleware)
      .concat(userApi.middleware)
      .concat(dynamicMiddleware.middleware),
});

/**
 * Mounts one module api on the running store. Safe to call twice for the same api - a module
 * re-registering (a hot reload in development, a remote loaded twice) must not reset the cache
 * its components are already reading from.
 */
export function injectModuleApi(api: ModuleApi) {
  if (injectedReducers[api.reducerPath]) {
    return;
  }
  injectedReducers[api.reducerPath] = api.reducer;
  store.replaceReducer(combineReducers({ ...coreReducers, ...injectedReducers }));
  dynamicMiddleware.addMiddleware(api.middleware);
}

export default store;
export type IRootState = ReturnType<typeof store.getState>;
