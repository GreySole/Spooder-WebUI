import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import OSC from 'osc-js';
import { KeyedObject } from '../../ui/Types';

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

export function useOSC() {
  return useContext(OscContext);
}

export function OscProvider(props: OscProviderProps) {
  const { host, port, children } = props;
  const [osc, setOsc] = useState<OSC | undefined>(undefined);
  const [isReady, setIsReady] = useState(false);
  const [oscListeners, setOscListeners] = useState<KeyedObject[]>([]);

  useEffect(() => {
    console.log('OSC Provider', host, port);
    const newOsc = new OSC({
      plugin: new OSC.WebsocketClientPlugin({ host: host, port: port, secure: false }),
    });
    newOsc.on('open', () => {
      console.log('OSC Connected');
      setIsReady(true);
    });
    newOsc.on('close', () => {
      console.log('OSC Disconnected');
      setIsReady(false);
    });
    newOsc.open();
    setOsc(newOsc);
    return () => {
      osc?.close();
    };
  }, []);

  function addListener(address: string, callback: (message: any) => void) {
    if (!osc) {
      return;
    }
    const subId = osc?.on(address, callback);
    console.log('SUB ID', subId);
    setOscListeners([...oscListeners, { address: address, subId: subId }]);
  }

  function removeListener(address: string) {
    if (!osc) {
      return;
    }
    let removeIndex = -1;
    const listener = oscListeners.find((listener, index) => {
      if (listener.address === address) {
        removeIndex = index;
        return listener;
      }
    });

    if (listener !== undefined) {
      setOscListeners(oscListeners.splice(removeIndex, 1));
      console.log(listener);
      osc?.off(listener.address, listener.subId);
    }
  }

  function sendOSC(address: string, value: any) {
    console.log('SEND OSC', address, value, osc?.status());
    if (!osc) {
      return;
    }
    osc?.send(new OSC.Message(address, value));
  }

  const value = {
    isReady,
    addListener,
    removeListener,
    sendOSC,
  };

  return <OscContext.Provider value={value}>{children}</OscContext.Provider>;
}
