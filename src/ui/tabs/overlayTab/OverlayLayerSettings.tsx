import {
  BoolSwitch,
  Box,
  ColorInput,
  NumberInput,
  SelectDropdown,
  Stack,
  TextInput,
  TypeFace,
} from '@spooder/webui-component-library';
import React from 'react';
import { OverlayLayer, OverlayWidgetDef } from '../../../app/api/overlayContainerSlice';

// Settings for a widget layer. The form comes from the backend's widget manifest, so each
// field is drawn from its declared type rather than per widget.
export default function OverlayLayerSettings({
  layer,
  widget,
  eventKeys,
  onChange,
}: {
  layer: OverlayLayer;
  widget: OverlayWidgetDef;
  eventKeys: { [eventName: string]: string[] };
  onChange: (settings: { [key: string]: any }) => void;
}) {
  const settings = { ...widget.defaults, ...(layer.settings ?? {}) };
  const set = (field: string, value: any) => onChange({ ...settings, [field]: value });

  return (
    <Box padding="small" width="100%">
      <Stack spacing="small" width="100%">
        <TypeFace fontSize="large">{widget.label} Settings</TypeFace>
        <TypeFace fontSize="medium">{widget.description}</TypeFace>
        {Object.entries(widget.form).map(([field, def]) => {
          // A field can depend on another (the fixed min/max only apply while the range isn't
          // dynamic), so it's hidden while its condition doesn't hold.
          if (def.showIf && !!settings[def.showIf.field] !== !!def.showIf.equals) {
            return null;
          }
          const value = settings[field];
          switch (def.type) {
            case 'number':
              return (
                <NumberInput
                  key={field}
                  width="8rem"
                  label={def.label}
                  value={Number(value)}
                  onInput={(next) => set(field, Number(next))}
                />
              );
            case 'boolean':
              return (
                <Box key={field} spacing="small" alignItems="center">
                  <TypeFace fontSize="medium">{def.label}</TypeFace>
                  <BoolSwitch value={!!value} onChange={(next) => set(field, next)} />
                </Box>
              );
            case 'color':
              return (
                <ColorInput
                  key={field}
                  label={def.label}
                  value={String(value ?? '#ffffff')}
                  onChange={(next) => set(field, next)}
                />
              );
            case 'select': {
              let options = def.options ?? [];
              if (def.optionsFrom === 'eventKeys') {
                // Keys the chosen event holds. The saved key stays listed even when it's gone
                // from storage, so opening the panel never silently changes the setting.
                const keys = eventKeys[String(settings[def.dependsOn ?? ''] ?? '')] ?? [];
                options = [...new Set([...keys, ...(value ? [String(value)] : [])])].map((key) => ({
                  label: key,
                  value: key,
                }));
              }
              return (
                <SelectDropdown
                  key={field}
                  label={def.label}
                  options={options}
                  value={String(value ?? '')}
                  onChange={(next) => set(field, next)}
                />
              );
            }
            default:
              return (
                <TextInput
                  key={field}
                  width="100%"
                  label={def.label}
                  value={String(value ?? '')}
                  onInput={(next) => set(field, next)}
                />
              );
          }
        })}
      </Stack>
    </Box>
  );
}
