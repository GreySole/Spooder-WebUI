// Position/size snapping for the overlay canvas - ported from the standalone edit-mode
// prototype at webui/overlay/container.js so both keep the same feel. All units are percent
// of the canvas, matching how OverlayContainerEntry stores x/y/width/height.

export const SNAP_PX = 8;
export const SAFE_AREAS = [10, 5]; // % inset guides: title-safe, action-safe

export interface OverlayGeometryEntry {
  pluginName: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function snapValue(value: number, targets: number[], threshold: number): number | null {
  let closest: number | null = null;
  let closestDist = threshold;
  for (const t of targets) {
    const dist = Math.abs(value - t);
    if (dist <= closestDist) {
      closest = t;
      closestDist = dist;
    }
  }
  return closest;
}

export function getSnapTargets(
  order: OverlayGeometryEntry[],
  excludeName: string,
  axis: 'x' | 'y',
): number[] {
  const targets = [0, 50, 100, ...SAFE_AREAS, ...SAFE_AREAS.map((a) => 100 - a)];
  for (const entry of order) {
    if (entry.pluginName === excludeName) continue;
    const pos = axis === 'x' ? entry.x : entry.y;
    const size = axis === 'x' ? entry.width : entry.height;
    targets.push(pos, pos + size, pos + size / 2);
  }
  return targets;
}

// Snaps a moving edge's left/center/right (or top/center/bottom) against targets. Returns the
// adjusted position (top-left) for that axis and the guide coordinate to show.
export function snapPosition(
  pos: number,
  size: number,
  targets: number[],
  threshold: number,
): { value: number; guide: number | null } {
  const left = pos;
  const center = pos + size / 2;
  const right = pos + size;

  const leftSnap = snapValue(left, targets, threshold);
  if (leftSnap !== null) return { value: leftSnap, guide: leftSnap };

  const centerSnap = snapValue(center, targets, threshold);
  if (centerSnap !== null) return { value: centerSnap - size / 2, guide: centerSnap };

  const rightSnap = snapValue(right, targets, threshold);
  if (rightSnap !== null) return { value: rightSnap - size, guide: rightSnap };

  return { value: pos, guide: null };
}

// Snaps a resizing edge (right or bottom) against targets, keeping the opposite edge fixed.
export function snapSize(
  pos: number,
  size: number,
  targets: number[],
  threshold: number,
): { value: number; guide: number | null } {
  const edge = pos + size;
  const edgeSnap = snapValue(edge, targets, threshold);
  if (edgeSnap !== null) return { value: edgeSnap - pos, guide: edgeSnap };
  return { value: size, guide: null };
}
