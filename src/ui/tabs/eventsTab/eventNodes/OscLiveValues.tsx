import { useOSC } from '@spooder/webui-component-library';
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import useLiveLogging from '../../../../app/hooks/useLiveLogging';

export interface OscLiveValue {
  args: any[];
  timestamp: string;
}

const OscLiveValuesContext = createContext<{ [address: string]: OscLiveValue }>({});
// Debug: Text Display nodes' last value, keyed by node id rather than address - see
// MonitorService.addGraphDebugLog, which puts these on the same feed under a distinct `type`.
const GraphDebugLiveValuesContext = createContext<{ [nodeId: string]: string }>({});

// How often the live readout re-renders. OSC sources like VRChat avatar parameters stream
// continuously, so committing every packet to state would re-render the whole graph dozens of
// times a second for no visible benefit. Messages are collected in a ref and flushed on this
// interval, and only when something actually arrived.
const FLUSH_INTERVAL_MS = 150;

interface OscLiveValuesProviderProps {
  // Only subscribe when the open graph actually has an OSC trigger or a debug node; enabling
  // the backend's live log makes it broadcast every inbound OSC message, which isn't free.
  enabled: boolean;
  // Scopes the graph-debug side of the feed to the event currently open in the editor, so a
  // Debug node's id can't collide with one from some other event's graph.
  eventName?: string;
  children: ReactNode;
}

// Single shared subscription to the backend's monitor feed, fanning out into two contexts -
// OSC live values by address, and Debug: Text Display values by node id.
//
// It has to be one subscription: OscContext.removeListener(address) removes only the *first*
// listener registered for an address, so if every consumer subscribed to '/spooder/monitor/log'
// itself, unmounting one would tear down another's subscription.
export function OscLiveValuesProvider(props: OscLiveValuesProviderProps) {
  const { enabled, eventName, children } = props;
  const { addListener, removeListener, isReady } = useOSC();
  const [values, setValues] = useState<{ [address: string]: OscLiveValue }>({});
  const [debugValues, setDebugValues] = useState<{ [nodeId: string]: string }>({});
  const pending = useRef<{ [address: string]: OscLiveValue }>({});
  const pendingDebug = useRef<{ [nodeId: string]: string }>({});
  const dirty = useRef(false);

  // Registers this provider as its own subscriber (see MonitorService.subscribeLiveLogging),
  // separate from whatever the OSC Monitor tab is doing - so unmounting this one, or losing
  // its heartbeat, can no longer kill the Monitor tab's feed or vice versa.
  useLiveLogging(isReady && enabled);

  useEffect(() => {
    if (!isReady || !enabled) {
      return;
    }
    // A previous event's last debug values shouldn't linger under a node id this graph reuses.
    setDebugValues({});
    pendingDebug.current = {};

    function onLog(message: any) {
      let logObj;
      try {
        logObj = JSON.parse(message.args[0]);
      } catch (e) {
        return;
      }
      if (logObj.type === 'graph_debug') {
        if (logObj.eventId !== eventName) {
          return;
        }
        pendingDebug.current[logObj.nodeId] = logObj.value ?? '';
        dirty.current = true;
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
      // Snapshot and clear the refs *before* handing them to React: a functional setState
      // updater runs whenever React gets around to processing the update, not at the point
      // this is called, so an updater that reads `pending.current` directly would see whatever
      // the ref holds *then* - which, since the ref is cleared on the very next line every time,
      // is always `{}`. That silently turned every flush into a no-op merging nothing in,
      // regardless of what had actually arrived. Capturing the batch in a local first gives the
      // updater a stable object to close over instead of a mutable ref.
      const oscBatch = pending.current;
      pending.current = {};
      const debugBatch = pendingDebug.current;
      pendingDebug.current = {};
      setValues((current) => ({ ...current, ...oscBatch }));
      setDebugValues((current) => ({ ...current, ...debugBatch }));
    }, FLUSH_INTERVAL_MS);

    return () => {
      clearInterval(flush);
      removeListener('/spooder/monitor/log');
    };
  }, [isReady, enabled, eventName, addListener, removeListener]);

  return (
    <OscLiveValuesContext.Provider value={values}>
      <GraphDebugLiveValuesContext.Provider value={debugValues}>
        {children}
      </GraphDebugLiveValuesContext.Provider>
    </OscLiveValuesContext.Provider>
  );
}

// Latest inbound OSC message for one address, or undefined if nothing has arrived yet.
export function useOscLiveValue(address: string | undefined): OscLiveValue | undefined {
  const values = useContext(OscLiveValuesContext);
  return address ? values[address] : undefined;
}

// Latest value a Debug: Text Display node has shown, or undefined if it hasn't run yet.
export function useGraphDebugLiveValue(nodeId: string | undefined): string | undefined {
  const values = useContext(GraphDebugLiveValuesContext);
  return nodeId ? values[nodeId] : undefined;
}
