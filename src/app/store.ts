import { configureStore } from '@reduxjs/toolkit';
import navigationSlice from './slice/navigationSlice';
import themeSlice from './slice/themeSlice';
import { eventApi } from './api/eventSlice';
import { configApi } from './api/configSlice';
import { discordApi } from './api/discordSlice';
import { obsApi } from './api/obsSlice';
import { twitchApi } from './api/twitchSlice';
import { pluginApi } from './api/pluginSlice';
import toastSlice from './slice/toastSlice';
import { serverApi } from './api/serverSlice';

const store = configureStore({
  reducer: {
    navigationSlice,
    themeSlice,
    toastSlice,
    [eventApi.reducerPath]: eventApi.reducer,
    [configApi.reducerPath]: configApi.reducer,
    [discordApi.reducerPath]: discordApi.reducer,
    [obsApi.reducerPath]: obsApi.reducer,
    [twitchApi.reducerPath]: twitchApi.reducer,
    [pluginApi.reducerPath]: pluginApi.reducer,
    [serverApi.reducerPath]: serverApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(eventApi.middleware)
      .concat(configApi.middleware)
      .concat(discordApi.middleware)
      .concat(obsApi.middleware)
      .concat(twitchApi.middleware)
      .concat(pluginApi.middleware)
      .concat(serverApi.middleware)
});
export default store;
export type IRootState = ReturnType<typeof store.getState>;
