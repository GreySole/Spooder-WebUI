import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
  useRef,
} from 'react';
import OSC from '@greysole/osc-js';
import { KeyedObject } from '../Types';
import osc from 'osc-js';

export const OscContext = createContext({
  isReady: false,
  addListener: (address: string, callback: (message: any) => void) => {},
  removeListener: (address: string) => {},
  sendOSC: (address: string, value: any) => {},
});

interface OscProviderProps {
  host: string;
  port: number;
  children: ReactNode;
}

export function OscProvider(props: OscProviderProps) {
  const { host, port, children } = props;
  const [isReady, setIsReady] = useState(false);
  const oscRef = useRef<OSC | undefined>(undefined);
  const oscListenersRef = useRef<KeyedObject[]>([]);

  useEffect(() => {
    console.log('OSC Provider', host, port);
    const url = port ? `ws://${host}:${port}/osc` : `wss://${host}/osc`;
    const osc = new OSC({
      plugin: new OSC.WebsocketClientPlugin({
        url: url,
      }),
    });
    osc.on('open', () => {
      console.log('OSC Connected');
      setIsReady(true);
    });
    osc.on('close', () => {
      console.log('OSC Disconnected');
      setIsReady(false);
    });
    osc.open();
    oscRef.current = osc;

    return () => {
      osc.close();
      oscRef.current = undefined;
      setIsReady(false);
      oscListenersRef.current = [];
    };
  }, [host, port]);

  const addListener = useCallback((address: string, callback: (message: any) => void) => {
    if (!oscRef.current) {
      return;
    }
    const subId = oscRef.current.on(address, callback);
    console.log('SUB ID', subId);
    oscListenersRef.current = [...oscListenersRef.current, { address: address, subId: subId }];
  }, []);

  const removeListener = useCallback((address: string) => {
    if (!oscRef.current) {
      return;
    }
    let removeIndex = -1;
    const listener = oscListenersRef.current.find((listener, index) => {
      if (listener.address === address) {
        removeIndex = index;
        return listener;
      }
    });

    if (listener !== undefined) {
      oscListenersRef.current = oscListenersRef.current.splice(removeIndex, 1);
      console.log(listener);
      oscRef.current.off(listener.address, listener.subId);
    }
  }, []);

  function sendOSC(address: string, value: any) {
    console.log('SEND OSC', address, value, oscRef.current?.status());
    if (!osc) {
      return;
    }
    oscRef.current?.send(new OSC.Message(address, value));
  }

  const value = {
    isReady,
    addListener,
    removeListener,
    sendOSC,
  };

  return <OscContext.Provider value={value}>{children}</OscContext.Provider>;
}

export function useOSC() {
  const context = useContext(OscContext);
  if (!context) {
    throw new Error('useOSC must be used within a OSCProvider');
  }
  return context;
}
