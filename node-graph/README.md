# @spooder/webui-node-graph

The Spooder node graph editor: the canvas, palette, inspector and node editors that edit one
event's graph. It is written against a **host** - the app it's embedded in supplies the data and
the pickers, so the same editor runs in the main WebUI and the mod UI.

## Using it

```tsx
import { EventNodes, NodeGraphHostProvider, setModuleSource } from '@spooder/webui-node-graph';

// Once, before the first graph renders: where installed WebUI modules come from.
setModuleSource({ getModules, subscribe });

<FormProvider {...form}>            {/* the event graphs form - see the module SDK's form keys */}
  <NodeGraphHostProvider host={host}>
    <EventNodes eventName={eventId} />
  </NodeGraphHostProvider>
</FormProvider>
```

Render it inside the component library's `<ThemeProvider>`; the stylesheet is bundled with the
package and reads the theme variables that provider sets.

## The host

`NodeGraphHost` (see `src/host.tsx`) is everything the editor needs from the app:

- `events` - node manifest, operation nodes, trigger-now and response-script verification.
- `plugins` - the plugin list and a plugin's custom events form.
- `useResponseHandlers`, `useLiveLogging` - for the response-script cheat sheet and live OSC values.
- `components` - optional pickers only the app can build (assets, UDP servers, plugin event
  inputs). A missing one falls back to a plain field, or to nothing.

Each `get*`/`use*` function is called as a hook during render.

## Modules

WebUI modules contribute node inspectors, test panels and field renderers. The editor reads them
from the `ModuleSource` set with `setModuleSource`, so it needs no registry of its own.
