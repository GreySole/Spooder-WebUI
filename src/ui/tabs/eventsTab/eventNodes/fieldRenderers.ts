import FormUdpSelectDropdown from '../../../common/input/form/FormUdpSelectDropdown';
import { modules } from '../../../../modules/registry';
import { CustomFieldRenderer, customFieldKey } from './customFieldRenderer';

export { customFieldKey };

// Renderers for `type: 'custom'` fields, keyed `${moduleName}.${options.component}`.
//
// Two sources feed it: core nodes (below) and anything a module contributes via
// ModuleDefinition.fieldRenderers. A custom field is for values a static form def can't
// describe - the UDP destination list comes from the user's config at runtime, and Discord's
// channel picker needs the live guild list - so `select`'s fixed options can't express them.
const CORE_FIELD_RENDERERS: { [componentKey: string]: CustomFieldRenderer } = {
  // FormUdpSelectDropdown takes { formKey, label }, a subset of CustomFieldRendererProps.
  udpSelect: { component: FormUdpSelectDropdown, height: 40 },
};

const registry: { [key: string]: CustomFieldRenderer } = {};

for (const [componentKey, renderer] of Object.entries(CORE_FIELD_RENDERERS)) {
  registry[`core.${componentKey}`] = renderer;
}
for (const m of modules) {
  for (const [componentKey, renderer] of Object.entries(m.fieldRenderers ?? {})) {
    registry[`${m.key}.${componentKey}`] = renderer;
  }
}

export function getCustomFieldRenderer(key: string): CustomFieldRenderer | undefined {
  return registry[key];
}

// Used by the layout math to size a custom field's row. Undefined means the key resolves to
// no renderer, in which case the card falls back to a labelled text input.
export function getCustomFieldHeight(key: string): number | undefined {
  return registry[key]?.height;
}
