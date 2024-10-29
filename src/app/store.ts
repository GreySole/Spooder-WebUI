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
import { shareApi } from './api/shareSlice';
import { userApi } from './api/userSlice';
import { recoveryApi } from './api/recoverySlice';

const store = configureStore({
  reducer: {
    navigationSlice,
    themeSlice,
    toastSlice,
    [recoveryApi.reducerPath]: recoveryApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [configApi.reducerPath]: configApi.reducer,
    [discordApi.reducerPath]: discordApi.reducer,
    [obsApi.reducerPath]: obsApi.reducer,
    [twitchApi.reducerPath]: twitchApi.reducer,
    [pluginApi.reducerPath]: pluginApi.reducer,
    [serverApi.reducerPath]: serverApi.reducer,
    [shareApi.reducerPath]: shareApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(recoveryApi.middleware)
      .concat(eventApi.middleware)
      .concat(configApi.middleware)
      .concat(discordApi.middleware)
      .concat(obsApi.middleware)
      .concat(twitchApi.middleware)
      .concat(pluginApi.middleware)
      .concat(serverApi.middleware)
      .concat(shareApi.middleware)
      .concat(userApi.middleware),
});
export default store;
export type IRootState = ReturnType<typeof store.getState>;
