import { configureStore } from '@reduxjs/toolkit';
import { modules } from '../modules/registry';
import { configApi } from './api/configSlice';
import { eventApi } from './api/eventSlice';
import { moduleApi } from './api/moduleSlice';
import { pluginApi } from './api/pluginSlice';
import { recoveryApi } from './api/recoverySlice';
import { serverApi } from './api/serverSlice';
import { shareApi } from './api/shareSlice';
import { themeApi } from './api/themeSlice';
import { userApi } from './api/userSlice';
import footerSlice from './slice/footerSlice';
import navigationSlice from './slice/navigationSlice';

// A module declares either one api or several (OBS spans /obs, /obs/fetch and /obs/control).
const moduleApis = modules.flatMap((m) => (Array.isArray(m.api) ? m.api : [m.api]));

const moduleReducers = Object.fromEntries(
  moduleApis.map((api) => [api.reducerPath, api.reducer])
);

const store = configureStore({
  reducer: {
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
    ...moduleReducers,
  },
  middleware: (getDefaultMiddleware) => {
    let mw: any = getDefaultMiddleware()
      .concat(themeApi.middleware)
      .concat(recoveryApi.middleware)
      .concat(eventApi.middleware)
      .concat(configApi.middleware)
      .concat(moduleApi.middleware)
      .concat(pluginApi.middleware)
      .concat(serverApi.middleware)
      .concat(shareApi.middleware)
      .concat(userApi.middleware);
    for (const api of moduleApis) {
      mw = mw.concat(api.middleware);
    }
    return mw;
  },
});
export default store;
export type IRootState = ReturnType<typeof store.getState>;
