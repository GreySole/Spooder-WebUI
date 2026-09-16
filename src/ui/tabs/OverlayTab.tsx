import {
  Box,
  Button,
  Columns,
  Stack,
  TypeFace,
  useTheme,
  useToast,
} from '@spooder/webui-component-library';
import React, { useEffect, useState } from 'react';
import {
  OverlayContainerEntry,
  useGetOverlayContainerConfigQuery,
  useSaveOverlayContainerConfigMutation,
} from '../../app/api/overlayContainerSlice';
import PageCircleLoader from '../common/input/general/PageCircleLoader';
import OverlayCanvas from './overlayTab/OverlayCanvas';
import OverlayLayerList from './overlayTab/OverlayLayerList';

export default function OverlayTab() {
  const { data, isLoading, error } = useGetOverlayContainerConfigQuery();
  const [save, { isLoading: saving }] = useSaveOverlayContainerConfigMutation();
  const { showError } = useToast();
  const { isMobileDevice } = useTheme();
  // Seeded once from the server response - after that this screen is the source of truth for
  // what's on the canvas until Save, the same way the vanilla prototype's editor worked.
  const [order, setOrder] = useState<OverlayContainerEntry[] | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  // Which layers ignore canvas drags right now - a session-only editing aid, not saved with the
  // layout, so a layer you're fighting to reach doesn't stay unreachable next time you open this.
  const [locked, setLocked] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (data && order === null) {
      setOrder(data.order);
    }
  }, [data, order]);

  if (isLoading || order === null) {
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
    pluginName: string,
    patch: Partial<Pick<OverlayContainerEntry, 'x' | 'y' | 'width' | 'height' | 'enabled'>>,
  ) => {
    setOrder((current) =>
      current!.map((entry) => (entry.pluginName === pluginName ? { ...entry, ...patch } : entry)),
    );
  };

  const onSave = async () => {
    const result: any = await save({
      order: order!.map(({ pluginName, enabled, x, y, width, height }) => ({
        pluginName,
        enabled,
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

  if (order.length === 0) {
    return (
      <TypeFace fontSize="medium">
        No installed plugin ships an overlay yet - a plugin needs its own overlay page before it
        can be placed here.
      </TypeFace>
    );
  }

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
        <TypeFace fontSize="medium">
          Drag an overlay to position it, and its corner handle to resize. Boxes snap to center,
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
            <OverlayLayerList
              order={order}
              locked={locked}
              onReorder={setOrder}
              onToggle={(pluginName, enabled) => updateEntry(pluginName, { enabled })}
              onToggleLock={onToggleLock}
            />
          </Box>
          {/* flex + minWidth:0 rather than just width:'100%' - as a flex item alongside the
              fixed-width sidebar, it needs an explicit basis to actually receive space and
              shrink into it, or its aspect-ratio child below has no definite width to derive
              a height from and collapses to zero. */}
          <Box width="100%" style={{ flex: 1, minWidth: 0 }}>
            <OverlayCanvas order={order} locked={locked} onChange={updateEntry} />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
