import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useServer from './useServer';

const HEARTBEAT_INTERVAL_MS = 5_000;

// Registers this component instance as a subscriber to the backend's live OSC log feed for as
// long as `enabled` is true, renewing on a heartbeat so the server-side TTL sweep doesn't drop
// it, and unsubscribing on unmount or when `enabled` goes false. Each call site (OSC Monitor
// tab, OSC Receive node previews) gets its own id, so multiple instances - or multiple browser
// tabs - can watch at once and one closing never silences the others.
export default function useLiveLogging(enabled: boolean) {
  const { useLiveLoggingActions } = useServer();
  const { subscribeLiveLogging, unsubscribeLiveLogging } = useLiveLoggingActions();
  const clientIdRef = useRef<string>();
  if (!clientIdRef.current) {
    clientIdRef.current = uuidv4();
  }

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const clientId = clientIdRef.current as string;
    subscribeLiveLogging(clientId);
    const heartbeat = setInterval(() => subscribeLiveLogging(clientId), HEARTBEAT_INTERVAL_MS);

    return () => {
      clearInterval(heartbeat);
      unsubscribeLiveLogging(clientId);
    };
    // clientIdRef never changes after first render; subscribe/unsubscribe are RTK mutation
    // triggers, stable for the life of the component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}
