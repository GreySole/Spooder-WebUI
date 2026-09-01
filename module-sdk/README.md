# @spooder/webui-module-sdk

The contract a [Spooder](https://github.com/GreySole/Spooder) WebUI module is written against — what
a module exports, the host state it can read, and the shared pieces it renders with.

A module is a React tab plus its RTK Query api, built in its own repository as a
[Module Federation](https://module-federation.io) remote and loaded by the Spooder WebUI at
runtime. This package is what lets that module compile without a checkout of the WebUI.

## Writing a module

A module's entry point default-exports one `ModuleDefinition`:

```ts
import type { ModuleDefinition } from '@spooder/webui-module-sdk';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import MyTab from './MyTab';
import { myApi } from './mySlice';

const MyModule: ModuleDefinition = {
  key: 'mymodule',
  tabConfig: { label: 'My Module', icon: faGamepad },
  Component: MyTab,
  api: myApi,
};

export default MyModule;
```

`key` names the module everywhere — its tab, and the `/mymodule` route prefix its backend
counterpart serves. `api` is one RTK Query api, or several when the backend spans more than one
route prefix. Everything past that is optional, and each field extends a different part of the
host rather than adding another tab:

| Field | What it adds |
| --- | --- |
| `pluginInputs` | Field types plugins can ask for in their settings manifest |
| `fieldRenderers` | Components for node fields declared `type: 'custom'` |
| `nodeInspectors` | An inspector panel for one of your node types |
| `nodeTestPanel` | The panel that fires any trigger node whose backend def declares `test` |

## Reading host state

`useConfig` and `useServer` read the host's configuration and server state through the host's own
RTK Query cache — the same cache the rest of the WebUI renders from, so a module never fetches
what the host already has:

```ts
import { useServer, PageCircleLoader } from '@spooder/webui-module-sdk';

export default function MyTab() {
  const { getServerState } = useServer();
  const { data, isLoading } = getServerState();

  if (isLoading) return <PageCircleLoader />;
  return <div>Spooder is on {data.host}:{data.port}</div>;
}
```

Also exported: `buildKey` / `buildNodeValueKey` for writing into the event form, `panelStyle` so a
popover matches the host's, and the shared types (`KeyedObject`, `SelectOption`, `NodeFieldDef`,
`TriggerTestParam`).

## This package must be a singleton

The hooks above are bound to the api instances defined here. A module that bundles its own copy of
this package builds a second `configApi`, whose reducer the host's store never mounted — the hooks
then read a slice that does not exist. So a module's federation config must share it, and must not
bundle a fallback:

```ts
shared: {
  '@spooder/webui-module-sdk': { singleton: true, import: false, requiredVersion: '^0.6.0' },
  react: { singleton: true, import: false, requiredVersion: '^18.0.0' },
  // ...react-dom, react-redux, @reduxjs/toolkit, react-hook-form,
  //    @spooder/webui-component-library — all singleton, all import: false
}
```

`import: false` means no fallback copy is bundled: the host provides these or the module fails to
load, which is the honest outcome. A module that quietly ran on its own React would break hooks in
ways far harder to trace.

`requiredVersion` is the compatibility gate. Bump this package's minor version when the contract
changes, and a module built against an older one refuses to load rather than half-working.

## Versioning

This package is developed in the [Spooder-WebUI](https://github.com/GreySole/Spooder-WebUI)
repository under `module-sdk/`, and published from there. The host and every module resolve the
same version at runtime, so its version is effectively the WebUI's module API version.
