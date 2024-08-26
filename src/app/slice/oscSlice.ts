import { createSlice } from '@reduxjs/toolkit';
import OSC from 'osc-js';

interface OSCListener {
  address: string;
  subId: number;
}

export const oscSlice = createSlice({
  name: 'osc',
  initialState: {
    oscListeners: [] as OSCListener[],
    monitorOSC: new OSC(),
  },
  reducers: {
    _initializeOSC: (state, action) => {
      const { host, port } = action.payload;
      state.monitorOSC = new OSC({
        plugin: new OSC.WebsocketClientPlugin({ host: host, port: port, secure: false }),
      });
    },
    _addOSCListener: (state, action) => {
      const { address, callback } = action.payload;

      const subId = state.monitorOSC.on(address, callback);
      state.oscListeners.push({ address: address, subId: subId });
    },
    _removeOSCListener: (state, action) => {
      const { address } = action.payload;
      let removeIndex = -1;
      const listener = state.oscListeners.find((listener, index) => {
        if (listener.address === address) {
          removeIndex = index;
          return listener;
        }
      });

      if (listener !== undefined) {
        state.oscListeners.splice(removeIndex, 1);
        state.monitorOSC.off(address, listener.subId);
      }
    },
    _sendOSCMessage: (state, action) => {
      const { address, value } = action.payload;
      state.monitorOSC.send(address, value);
    },
  },
});

export const { _initializeOSC, _addOSCListener, _removeOSCListener, _sendOSCMessage } =
  oscSlice.actions;

export default oscSlice.reducer;
