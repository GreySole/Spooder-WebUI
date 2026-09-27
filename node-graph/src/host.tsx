import React, { ComponentType, createContext, ReactNode, useContext } from 'react';
import type { KeyedObject } from '@spooder/webui-module-sdk';
import type { NodeManifest, OperationNodeDef } from './types';

// Everything the editor needs from the app it's embedded in. The editor never talks to a server
// or a store itself: the app implements this once (over its own API and hooks) and wraps the
// editor in a NodeGraphHostProvider. Every function here that starts with `use` or `get*` is
// called as a hook during render.

interface QueryResult<T> {
  data?: T;
  isLoading: boolean;
  error?: unknown;
}

export interface NodeGraphHostEvents {
  getNodeManifest: () => { manifests?: NodeManifest[]; isLoading: boolean; error?: unknown };
  getOperationNodes: () => {
    operationNodes?: OperationNodeDef[];
    isLoading: boolean;
    error?: unknown;
  };
  // Fires a trigger node's branch once, without waiting for its real trigger.
  getTriggerNow: () => { triggerNow: (eventName: string, nodeId: string) => Promise<unknown> };
  getVerifyResponseScript: () => {
    verifyResponseScript: (command: string, inputMessage: string, script: string) => Promise<any>;
  };
}

export interface NodeGraphHostPlugins {
  getPlugins: () => QueryResult<KeyedObject>;
  getPluginEventsForm: (pluginName: string) => QueryResult<KeyedObject>;
}

// Pickers and panels only the app can build, because they sit on its own API. Each is optional:
// a missing one falls back to a plain field (or to nothing), so an app can start without them.
export interface NodeGraphComponents {
  AssetSelect: ComponentType<{
    formKey: string;
    label?: string;
    assetType?: string;
    assetFolderPath?: string;
    pluginName: string;
  }>;
  MultiAssetSelect: ComponentType<{
    formKey: string;
    label?: string;
    assetType?: string;
    assetFolderPath?: string;
    pluginName: string;
  }>;
  UdpSelect: ComponentType<{ formKey: string; label?: string }>;
  UdpServerManager: ComponentType<{}>;
  // The inputs of a plugin's custom event form, rooted at `baseFormKey`.
  PluginEventInputs: ComponentType<{
    pluginName: string;
    form: KeyedObject;
    defaults: KeyedObject;
    baseFormKey: string;
  }>;
}

export interface NodeGraphHost {
  events: NodeGraphHostEvents;
  plugins: NodeGraphHostPlugins;
  // The variables and handlers a response script can use, for its cheat sheet.
  useResponseHandlers: () => { data?: { [moduleName: string]: string[] }; isLoading: boolean };
  // Subscribes to the server's live OSC feed while `enabled`.
  useLiveLogging: (enabled: boolean) => void;
  components?: Partial<NodeGraphComponents>;
}

const NodeGraphHostContext = createContext<NodeGraphHost | null>(null);

export function NodeGraphHostProvider(props: { host: NodeGraphHost; children: ReactNode }) {
  return (
    <NodeGraphHostContext.Provider value={props.host}>
      {props.children}
    </NodeGraphHostContext.Provider>
  );
}

export function useNodeGraphHost(): NodeGraphHost {
  const host = useContext(NodeGraphHostContext);
  if (!host) {
    throw new Error('The node graph editor must be rendered inside a NodeGraphHostProvider.');
  }
  return host;
}

// Same names the app's own hooks used, so the editor's call sites read as they always did.
export const useEvents = () => useNodeGraphHost().events;
export const usePlugins = () => useNodeGraphHost().plugins;
export const useLiveLogging = (enabled: boolean) => useNodeGraphHost().useLiveLogging(enabled);
export const useResponseHandlers = () => useNodeGraphHost().useResponseHandlers();
export const useHostComponents = () => useNodeGraphHost().components ?? {};
