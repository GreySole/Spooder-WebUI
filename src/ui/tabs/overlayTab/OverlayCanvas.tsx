import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { OverlayContainerEntry } from '../../../app/api/overlayContainerSlice';
import { SAFE_AREAS, SNAP_PX, clamp, getSnapTargets, snapPosition, snapSize } from './overlayGeometry';

interface GuideState {
  v: number | null;
  h: number | null;
}

export default function OverlayCanvas({
  order,
  locked,
  onChange,
}: {
  order: OverlayContainerEntry[];
  locked: Set<string>;
  onChange: (
    pluginName: string,
    patch: Partial<Pick<OverlayContainerEntry, 'x' | 'y' | 'width' | 'height'>>,
  ) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [guide, setGuide] = useState<GuideState>({ v: null, h: null });

  const enabled = order.filter((entry) => entry.enabled);
  // Index within the full order, not just the enabled subset, so a box's stacking always
  // matches its row in OverlayLayerList - the top of that list renders in front, regardless of
  // which entries above it happen to be disabled right now.
  const zIndexFor = (pluginName: string) =>
    order.length - order.findIndex((e) => e.pluginName === pluginName);

  const onBoxPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
    entry: OverlayContainerEntry,
  ) => {
    event.preventDefault();
    const box = event.currentTarget;
    box.setPointerCapture(event.pointerId);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const startClientX = event.clientX;
    const startClientY = event.clientY;
    const startX = entry.x;
    const startY = entry.y;
    const thresholdX = (SNAP_PX / rect.width) * 100;
    const thresholdY = (SNAP_PX / rect.height) * 100;
    const targetsX = getSnapTargets(order, entry.pluginName, 'x');
    const targetsY = getSnapTargets(order, entry.pluginName, 'y');

    const onMove = (moveEvent: PointerEvent) => {
      const dxPercent = ((moveEvent.clientX - startClientX) / rect.width) * 100;
      const dyPercent = ((moveEvent.clientY - startClientY) / rect.height) * 100;
      const rawX = clamp(startX + dxPercent, 0, 100 - entry.width);
      const rawY = clamp(startY + dyPercent, 0, 100 - entry.height);

      const snapX = snapPosition(rawX, entry.width, targetsX, thresholdX);
      const snapY = snapPosition(rawY, entry.height, targetsY, thresholdY);

      onChange(entry.pluginName, {
        x: clamp(snapX.value, 0, 100 - entry.width),
        y: clamp(snapY.value, 0, 100 - entry.height),
      });
      setGuide({ v: snapX.guide, h: snapY.guide });
    };

    const onUp = (upEvent: PointerEvent) => {
      box.releasePointerCapture(upEvent.pointerId);
      box.removeEventListener('pointermove', onMove);
      box.removeEventListener('pointerup', onUp);
      setGuide({ v: null, h: null });
    };

    box.addEventListener('pointermove', onMove);
    box.addEventListener('pointerup', onUp);
  };

  const onHandlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
    entry: OverlayContainerEntry,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const startClientX = event.clientX;
    const startClientY = event.clientY;
    const startWidth = entry.width;
    const startHeight = entry.height;
    const thresholdX = (SNAP_PX / rect.width) * 100;
    const thresholdY = (SNAP_PX / rect.height) * 100;
    const targetsX = getSnapTargets(order, entry.pluginName, 'x');
    const targetsY = getSnapTargets(order, entry.pluginName, 'y');

    const onMove = (moveEvent: PointerEvent) => {
      const dwPercent = ((moveEvent.clientX - startClientX) / rect.width) * 100;
      const dhPercent = ((moveEvent.clientY - startClientY) / rect.height) * 100;
      const rawWidth = clamp(startWidth + dwPercent, 5, 100 - entry.x);
      const rawHeight = clamp(startHeight + dhPercent, 5, 100 - entry.y);

      const snapW = snapSize(entry.x, rawWidth, targetsX, thresholdX);
      const snapH = snapSize(entry.y, rawHeight, targetsY, thresholdY);

      onChange(entry.pluginName, {
        width: clamp(snapW.value, 5, 100 - entry.x),
        height: clamp(snapH.value, 5, 100 - entry.y),
      });
      setGuide({ v: snapW.guide, h: snapH.guide });
    };

    const onUp = (upEvent: PointerEvent) => {
      handle.releasePointerCapture(upEvent.pointerId);
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      setGuide({ v: null, h: null });
    };

    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0', width: '100%' }}>
      {/* Height comes from percentage padding-top (resolved against this element's own width),
          not the `aspect-ratio` property - as a flex item nested inside another flex item, the
          width this needs to derive a height from isn't reliably definite by the time
          `aspect-ratio` would need it, and the box was collapsing to zero height. */}
      <div style={{ position: 'relative', width: 'min(900px, 100%)' }}>
        <div style={{ paddingTop: '56.25%' }} />
        <div
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            background:
              '#111 repeating-conic-gradient(#181818 0% 25%, #111 0% 50%) 0 0 / 24px 24px',
            border: '1px solid #444',
            overflow: 'hidden',
          }}
        >
          {SAFE_AREAS.map((inset) => (
            <div
              key={inset}
              style={{
                position: 'absolute',
                inset: `${inset}%`,
                border: '1px dashed rgba(255,255,255,0.3)',
                pointerEvents: 'none',
              }}
            />
          ))}
          {guide.v !== null && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${guide.v}%`,
                width: 1,
                background: '#ff3b8d',
                pointerEvents: 'none',
                zIndex: 999,
              }}
            />
          )}
          {guide.h !== null && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${guide.h}%`,
                height: 1,
                background: '#ff3b8d',
                pointerEvents: 'none',
                zIndex: 999,
              }}
            />
          )}
          {enabled.map((entry) => {
            const isLocked = locked.has(entry.pluginName);
            return (
              <div
                key={entry.pluginName}
                // Locked boxes drop out of hit-testing entirely, so a click lands on whatever
                // (unlocked) box is next in the stack underneath instead of grabbing this one.
                onPointerDown={isLocked ? undefined : (e) => onBoxPointerDown(e, entry)}
                style={{
                  position: 'absolute',
                  left: `${entry.x}%`,
                  top: `${entry.y}%`,
                  width: `${entry.width}%`,
                  height: `${entry.height}%`,
                  zIndex: zIndexFor(entry.pluginName),
                  boxSizing: 'border-box',
                  border: isLocked ? '2px dashed #888' : '2px solid #4da6ff',
                  background: isLocked ? 'rgba(136, 136, 136, 0.18)' : 'rgba(77, 166, 255, 0.18)',
                  color: '#fff',
                  fontSize: 12,
                  padding: 4,
                  overflow: 'hidden',
                  cursor: isLocked ? 'default' : 'move',
                  userSelect: 'none',
                  touchAction: 'none',
                  pointerEvents: isLocked ? 'none' : 'auto',
                }}
              >
                {isLocked && <FontAwesomeIcon icon={faLock} style={{ marginRight: 4 }} />}
                {entry.displayName}
                {!isLocked && (
                  <div
                    onPointerDown={(e) => onHandlePointerDown(e, entry)}
                    style={{
                      position: 'absolute',
                      right: -6,
                      bottom: -6,
                      width: 12,
                      height: 12,
                      background: '#4da6ff',
                      border: '1px solid #1e1e1e',
                      borderRadius: 2,
                      cursor: 'nwse-resize',
                      touchAction: 'none',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
