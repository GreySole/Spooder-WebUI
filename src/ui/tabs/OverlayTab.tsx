import {
  Box,
  Button,
  Columns,
  NumberInput,
  SelectDropdown,
  Stack,
  TextInput,
  TypeFace,
  useTheme,
  useToast,
} from '@spooder/webui-component-library';
import React, { useEffect, useState } from 'react';
import {
  OverlayCanvasSize,
  OverlayLayer,
  useDeleteOverlayLayoutMutation,
  useGetOverlayContainerConfigQuery,
  useGetOverlayLayoutsQuery,
  useRenameOverlayLayoutMutation,
  useSaveOverlayContainerConfigMutation,
} from '../../app/api/overlayContainerSlice';
import PageCircleLoader from '../common/input/general/PageCircleLoader';
import OverlayCanvas from './overlayTab/OverlayCanvas';
import { MenuCategory, MenuOption } from './eventsTab/eventNodes/palette/CascadeMenu';
import OverlayLayerList from './overlayTab/OverlayLayerList';
import GraphSidePanel, { useGraphPanelWidth } from './eventsTab/eventNodes/GraphSidePanel';
import OverlayLayerSettings from './overlayTab/OverlayLayerSettings';

// Common OBS browser-source sizes. Anything else is entered as a custom width and height.
const CANVAS_PRESETS = [
  { label: '1920 x 1080 (16:9)', width: 1920, height: 1080 },
  { label: '1280 x 720 (16:9)', width: 1280, height: 720 },
  { label: '2560 x 1440 (16:9)', width: 2560, height: 1440 },
  { label: '3840 x 2160 (16:9)', width: 3840, height: 2160 },
  { label: '2560 x 1080 (21:9)', width: 2560, height: 1080 },
  { label: '1080 x 1920 (9:16)', width: 1080, height: 1920 },
  { label: '1080 x 1080 (1:1)', width: 1080, height: 1080 },
];

export default function OverlayTab() {
  const [layout, setLayout] = useState('');
  const [nameInput, setNameInput] = useState('');
  // currentData rather than data: while a newly picked layout loads, data still holds the
  // previous layout's response, which would seed the canvas with the wrong one.
  const {
    currentData: data,
    isLoading,
    error,
  } = useGetOverlayContainerConfigQuery(layout, { skip: layout === '' });
  const { data: layoutList, refetch: refetchLayouts } = useGetOverlayLayoutsQuery();
  const [save, { isLoading: saving }] = useSaveOverlayContainerConfigMutation();
  const [rename] = useRenameOverlayLayoutMutation();
  const [deleteLayout] = useDeleteOverlayLayoutMutation();
  const { showError } = useToast();
  const { isMobileDevice } = useTheme();
  // Seeded once from the server response - after that this screen is the source of truth for
  // what's on the canvas until Save, the same way the vanilla prototype's editor worked.
  const [order, setOrder] = useState<OverlayLayer[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelWidth, setPanelWidth, persistPanelWidth] = useGraphPanelWidth();
  const [canvasSize, setCanvasSize] = useState<OverlayCanvasSize | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  // Which layers ignore canvas drags right now - a session-only editing aid, not saved with the
  // layout, so a layer you're fighting to reach doesn't stay unreachable next time you open this.
  const [locked, setLocked] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (data && order === null) {
      setOrder(data.layers);
      setCanvasSize(data.canvas ?? { width: 1920, height: 1080 });
    }
  }, [data, order]);

  const layoutNames = layoutList?.layouts ?? [];
  // There's no built-in layout: the editor opens on the first one the user made, and on none at
  // all until they create one. This also moves off a layout that was just deleted or renamed.
  useEffect(() => {
    if (layoutList && !layoutList.layouts.includes(layout)) {
      setLayout(layoutList.layouts[0] ?? '');
      setOrder(null);
      setCanvasSize(null);
    }
  }, [layoutList, layout]);

  const nameIsValid = /^[a-z0-9_-]{1,40}$/.test(nameInput);
  const nameTaken = layoutNames.includes(nameInput);

  const switchLayout = (name: string) => {
    setOrder(null);
    setCanvasSize(null);
    setSelectedId(null);
    setLayout(name);
  };

  // A new layout starts blank: the server lists every installed overlay in it, switched off, so
  // nothing is copied from whatever was being edited (other than the canvas shape).
  const onCreate = async () => {
    const result: any = await save({
      layout: nameInput,
      canvas: canvasSize ?? { width: 1920, height: 1080 },
      layers: [],
    });
    if (result?.error) {
      showError('Could not create the layout.');
      return;
    }
    // The list must already contain the new name when the selection moves to it, or the
    // effect above would treat it as unknown and jump back to the first layout.
    await refetchLayouts();
    setNameInput('');
    switchLayout(nameInput);
  };

  if (!layoutList) {
    return <PageCircleLoader />;
  }

  if (layoutNames.length === 0) {
    return (
      <Box padding="medium" width="100%">
        <Stack spacing="medium" width="100%">
          <TypeFace fontSize="xlarge">Overlays</TypeFace>
          <TypeFace fontSize="medium">
            No overlay layouts yet. Create one to place overlays on it - each layout gets its own
            URL, at /overlays/&lt;name&gt;.
          </TypeFace>
          <Columns spacing="small">
            <TextInput placeholder="Layout name" value={nameInput} onInput={(value) => setNameInput(value.toLowerCase())} />
            <Button label="Create" onClick={onCreate} disabled={!nameIsValid || saving} />
          </Columns>
          {nameInput !== '' && !nameIsValid ? (
            <TypeFace fontSize="medium">
              Layout names can use lowercase letters, numbers, - and _ (up to 40 characters).
            </TypeFace>
          ) : null}
        </Stack>
      </Box>
    );
  }

  if (isLoading || order === null || canvasSize === null) {
    return <PageCircleLoader />;
  }

  if (error) {
    return <TypeFace fontSize="large">Couldn't load the overlay layout.</TypeFace>;
  }

  const onToggleLock = (pluginName: string) => {
    setLocked((current) => {
      const next = new Set(current);
      if (next.has(pluginName)) {
        next.delete(pluginName);
      } else {
        next.add(pluginName);
      }
      return next;
    });
  };

  const updateEntry = (
    id: string,
    patch: Partial<Pick<OverlayLayer, 'x' | 'y' | 'width' | 'height' | 'settings'>>,
  ) => {
    setOrder((current) =>
      current!.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    );
  };

  // What the Add a layer menu offers, grouped: overlays (uncategorized ones directly, the rest
  // under their plugin's `overlay_category`) and widgets by their category. Plugins already on the
  // layout are left out - a plugin can be placed once - while widgets can be added repeatedly.
  const categoryOf = <T extends { category?: string }>(items: T[]) => {
    const byCategory = new Map<string, T[]>();
    for (const item of items) {
      const key = item.category ?? '';
      byCategory.set(key, [...(byCategory.get(key) ?? []), item]);
    }
    return byCategory;
  };
  const overlayGroups = categoryOf(
    (data?.plugins ?? []).filter((plugin) => !order.some((layer) => layer.id === plugin.pluginName)),
  );
  const widgetGroups = categoryOf(data?.widgets ?? []);
  const addCategories: MenuCategory<MenuOption>[] = [];
  if (overlayGroups.size > 0) {
    addCategories.push({
      key: 'overlays',
      label: 'Overlays',
      options: (overlayGroups.get('') ?? []).map((plugin) => ({
        label: plugin.displayName,
        value: `plugin:${plugin.pluginName}`,
      })),
      subcategories: [...overlayGroups.entries()]
        .filter(([category]) => category !== '')
        .map(([category, plugins]) => ({
          key: `overlays:${category}`,
          label: category,
          options: plugins.map((plugin) => ({
            label: plugin.displayName,
            value: `plugin:${plugin.pluginName}`,
          })),
        })),
    });
  }
  if (widgetGroups.size > 0) {
    addCategories.push({
      key: 'widgets',
      label: 'Widgets',
      options: (widgetGroups.get('') ?? []).map((widget) => ({
        label: widget.label,
        value: `widget:${widget.id}`,
      })),
      subcategories: [...widgetGroups.entries()]
        .filter(([category]) => category !== '')
        .map(([category, widgets]) => ({
          key: `widgets:${category}`,
          label: category,
          options: widgets.map((widget) => ({ label: widget.label, value: `widget:${widget.id}` })),
        })),
    });
  }

  const onAddLayer = (value: string) => {
    const [kind, key] = [value.slice(0, value.indexOf(':')), value.slice(value.indexOf(':') + 1)];
    let layer: OverlayLayer | null = null;
    if (kind === 'plugin') {
      const plugin = data?.plugins.find((p) => p.pluginName === key);
      if (plugin) {
        layer = {
          id: plugin.pluginName,
          type: 'plugin',
          pluginName: plugin.pluginName,
          displayName: plugin.displayName,
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        };
      }
    } else if (kind === 'widget') {
      const widget = data?.widgets.find((w) => w.id === key);
      if (widget) {
        layer = {
          // Not crypto.randomUUID: the editor is often opened over plain http on a LAN address,
          // which isn't a secure context.
          id: `w-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
          type: 'widget',
          widgetType: widget.id,
          displayName: widget.label,
          settings: { ...widget.defaults },
          x: 5,
          y: 5,
          ...widget.defaultSize,
        };
      }
    }
    if (layer) {
      // New layers go in front.
      setOrder((current) => [layer!, ...current!]);
      setSelectedId(layer.id);
    }
  };

  const onRemoveLayer = (id: string) => {
    setOrder((current) => current!.filter((layer) => layer.id !== id));
    setSelectedId((current) => (current === id ? null : current));
  };

  const selectedLayer = order.find((layer) => layer.id === selectedId);
  const selectedWidget =
    selectedLayer?.type === 'widget'
      ? data?.widgets.find((w) => w.id === selectedLayer.widgetType)
      : undefined;

  const onSave = async () => {
    const result: any = await save({
      layout,
      canvas: canvasSize!,
      layers: order!.map(({ id, type, pluginName, widgetType, settings, x, y, width, height }) => ({
        id,
        type,
        pluginName,
        widgetType,
        settings,
        x,
        y,
        width,
        height,
      })),
    });
    if (result?.error) {
      showError('Could not save the overlay layout.');
      return;
    }
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  };

  const onRename = async () => {
    const result: any = await rename({ from: layout, to: nameInput });
    if (result?.error) {
      showError(result.error?.data?.error ?? 'Could not rename the layout.');
      return;
    }
    await refetchLayouts();
    setNameInput('');
    switchLayout(nameInput);
  };

  const onDelete = async () => {
    if (!window.confirm(`Delete the '${layout}' layout?`)) {
      return;
    }
    const result: any = await deleteLayout({ layout });
    if (result?.error) {
      showError(result.error?.data?.error ?? 'Could not delete the layout.');
      return;
    }
    switchLayout('');
  };

  const layoutUrl = `${window.location.origin}/overlays/${layout}`;

  return (
    <Box padding="medium" width="100%">
      <Stack spacing="large" width="100%">
        <Columns spacing="small">
          <TypeFace fontSize="xlarge">Overlays</TypeFace>
          <Button
            label={saving ? 'Saving…' : justSaved ? 'Saved!' : 'Save'}
            onClick={onSave}
            disabled={saving}
          />
        </Columns>
        <Stack spacing="small" width="100%">
          <Columns spacing="small">
            <SelectDropdown
              label="Layout:"
              options={layoutNames.map((name) => ({ label: name, value: name }))}
              value={layout}
              onChange={switchLayout}
            />
            <TextInput
              placeholder="Layout name"
              value={nameInput}
              onInput={(value) => setNameInput(value.toLowerCase())}
            />
            <Button label="New" onClick={onCreate} disabled={!nameIsValid || nameTaken || saving} />
            <Button
              label="Rename"
              onClick={onRename}
              disabled={!nameIsValid || nameTaken}
            />
            <Button label="Delete" onClick={onDelete} />
          </Columns>
          {nameInput !== '' && !nameIsValid ? (
            <TypeFace fontSize="medium">
              Layout names can use lowercase letters, numbers, - and _ (up to 40 characters).
            </TypeFace>
          ) : null}
          {nameTaken ? <TypeFace fontSize="medium">'{nameInput}' already exists.</TypeFace> : null}
          <Columns spacing="small">
            <SelectDropdown
              label="Canvas:"
              options={[
                ...CANVAS_PRESETS.map((p) => ({ label: p.label, value: p.label })),
                { label: 'Custom', value: 'Custom' },
              ]}
              value={
                CANVAS_PRESETS.find(
                  (p) => p.width === canvasSize.width && p.height === canvasSize.height,
                )?.label ?? 'Custom'
              }
              onChange={(label) => {
                const preset = CANVAS_PRESETS.find((p) => p.label === label);
                if (preset) {
                  setCanvasSize({ width: preset.width, height: preset.height });
                }
              }}
            />
            <NumberInput
              width="6rem"
              label="Width:"
              value={canvasSize.width}
              onInput={(width) => setCanvasSize({ ...canvasSize, width: Number(width) || canvasSize.width })}
            />
            <NumberInput
              width="6rem"
              label="Height:"
              value={canvasSize.height}
              onInput={(height) => setCanvasSize({ ...canvasSize, height: Number(height) || canvasSize.height })}
            />
          </Columns>
          <TypeFace fontSize="medium">Overlay URL: {layoutUrl}</TypeFace>
        </Stack>
        <TypeFace fontSize="medium">
          Add plugin overlays and widgets as layers, drag a layer to position it, and use its corner handle to resize. Boxes snap to center,
          safe-area guides, and each other. Drag a layer to change front-to-back order - the top
          of the list renders in front. Lock a layer to stop it from catching drags meant for
          whatever's behind it.
        </TypeFace>

        <Box
          flexFlow={isMobileDevice ? 'column' : 'row'}
          alignItems={isMobileDevice ? 'stretch' : 'flex-start'}
          spacing="medium"
          width="100%"
        >
          <Box width={isMobileDevice ? '100%' : '280px'} style={{ flexShrink: 0 }}>
            <Stack spacing="medium" width="100%">
              <OverlayLayerList
                order={order}
                locked={locked}
                selectedId={selectedId}
                addCategories={addCategories}
                onAdd={onAddLayer}
                onSelect={setSelectedId}
                onReorder={setOrder}
                onRemove={onRemoveLayer}
                onToggleLock={onToggleLock}
              />
            </Stack>
          </Box>
          {/* flex + minWidth:0 rather than just width:'100%' - as a flex item alongside the
              fixed-width sidebar, it needs an explicit basis to actually receive space and
              shrink into it, or its aspect-ratio child below has no definite width to derive
              a height from and collapses to zero. */}
          <Box width="100%" style={{ flex: 1, minWidth: 0, position: 'relative', minHeight: 520 }}>
            <OverlayCanvas
              order={order}
              locked={locked}
              selectedId={selectedId}
              onSelect={setSelectedId}
              canvasSize={canvasSize}
              onChange={updateEntry}
            />
            {/* Docked over the canvas like the node inspector, reusing its panel. */}
            {selectedLayer && selectedWidget ? (
              <GraphSidePanel
                width={panelWidth}
                onResize={setPanelWidth}
                onResizeEnd={persistPanelWidth}
                zIndex={2000}
                onClose={() => setSelectedId(null)}
              >
                <OverlayLayerSettings
                  layer={selectedLayer}
                  widget={selectedWidget}
                  eventKeys={data?.eventKeys ?? {}}
                  onChange={(settings) => updateEntry(selectedLayer.id, { settings })}
                />
              </GraphSidePanel>
            ) : null}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
