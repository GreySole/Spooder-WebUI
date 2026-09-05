import { useOSC } from '@spooder/webui-component-library';
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import useLiveLogging from '../../../../app/hooks/useLiveLogging';

export interface OscLiveValue {
  args: any[];
  timestamp: string;
}

const OscLiveValuesContext = createContext<{ [address: string]: OscLiveValue }>({});

// How often the live readout re-renders. OSC sources like VRChat avatar parameters stream
// continuously, so committing every packet to state would re-render the whole graph dozens of
// times a second for no visible benefit. Messages are collected in a ref and flushed on this
// interval, and only when something actually arrived.
const FLUSH_INTERVAL_MS = 150;

interface OscLiveValuesProviderProps {
  // Only subscribe when the open graph actually has an OSC trigger; enabling the backend's
  // live log makes it broadcast every inbound OSC message, which isn't free.
  enabled: boolean;
  children: ReactNode;
}

// Single shared subscription to the backend's monitor feed, keyed by OSC address.
//
// It has to be shared: OscContext.removeListener(address) removes only the *first* listener
// registered for an address, so if every OSC node card subscribed to '/spooder/monitor/log'
// itself, unmounting one card would tear down another card's subscription.
export function OscLiveValuesProvider(props: OscLiveValuesProviderProps) {
  const { enabled, children } = props;
  const { addListener, removeListener, isReady } = useOSC();
  const [values, setValues] = useState<{ [address: string]: OscLiveValue }>({});
  const pending = useRef<{ [address: string]: OscLiveValue }>({});
  const dirty = useRef(false);

  // Registers this provider as its own subscriber (see MonitorService.subscribeLiveLogging),
  // separate from whatever the OSC Monitor tab is doing - so unmounting this one, or losing
  // its heartbeat, can no longer kill the Monitor tab's feed or vice versa.
  useLiveLogging(isReady && enabled);

  useEffect(() => {
    if (!isReady || !enabled) {
      return;
    }

    function onLog(message: any) {
      let logObj;
      try {
        logObj = JSON.parse(message.args[0]);
      } catch (e) {
        return;
      }
      // MonitorService logs every direction/protocol down this one address; only inbound UDP
      // is what an OSC trigger node reacts to.
      if (logObj.type !== 'udp' || logObj.direction !== 'receive') {
        return;
      }
      pending.current[logObj.address] = { args: logObj.args ?? [], timestamp: logObj.timestamp };
      dirty.current = true;
    }

    addListener('/spooder/monitor/log', onLog);

    const flush = setInterval(() => {
      if (!dirty.current) {
        return;
      }
      dirty.current = false;
      setValues((current) => ({ ...current, ...pending.current }));
      pending.current = {};
    }, FLUSH_INTERVAL_MS);

    return () => {
      clearInterval(flush);
      removeListener('/spooder/monitor/log');
    };
  }, [isReady, enabled, addListener, removeListener]);

  return <OscLiveValuesContext.Provider value={values}>{children}</OscLiveValuesContext.Provider>;
}

// Latest inbound OSC message for one address, or undefined if nothing has arrived yet.
export function useOscLiveValue(address: string | undefined): OscLiveValue | undefined {
  const values = useContext(OscLiveValuesContext);
  return address ? values[address] : undefined;
}
