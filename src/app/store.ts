import { configureStore } from '@reduxjs/toolkit';
import { modules } from '../modules/registry';
import { configApi } from './api/configSlice';
import { eventApi } from './api/eventSlice';
import { moduleApi } from './api/moduleSlice';
import { obsControlApi } from './api/obsControlSlice';
import { obsFetchApi } from './api/obsFetchSlice';
import { obsApi } from './api/obsSlice';
import { pluginApi } from './api/pluginSlice';
import { recoveryApi } from './api/recoverySlice';
import { serverApi } from './api/serverSlice';
import { shareApi } from './api/shareSlice';
import { themeApi } from './api/themeSlice';
import { userApi } from './api/userSlice';
import footerSlice from './slice/footerSlice';
import navigationSlice from './slice/navigationSlice';

const moduleReducers = Object.fromEntries(
  modules.map((m) => [m.api.reducerPath, m.api.reducer])
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
    [obsApi.reducerPath]: obsApi.reducer,
    [obsFetchApi.reducerPath]: obsFetchApi.reducer,
    [obsControlApi.reducerPath]: obsControlApi.reducer,
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
      .concat(obsApi.middleware)
      .concat(obsFetchApi.middleware)
      .concat(obsControlApi.middleware)
      .concat(pluginApi.middleware)
      .concat(serverApi.middleware)
      .concat(shareApi.middleware)
      .concat(userApi.middleware);
    for (const m of modules) {
      mw = mw.concat(m.api.middleware);
    }
    return mw;
  },
});
export default store;
export type IRootState = ReturnType<typeof store.getState>;
