// The stored-value setters. They arrive as core *actions* rather than operation nodes because
// they have execution flow (an operation node is pure and runs wherever its output is read),
// so the palette would file them under 'core' while the Get * Value nodes they pair with sit
// under Storage Operations. Listed here so useNodePalette can route them across.
export const STORAGE_ACTION_NODE_IDS = [
  'set_string_value',
  'set_number_value',
  'set_boolean_value',
  'set_array_value',
];

// Must match the key/label the operation loop builds for `category: 'storage'`.
export const STORAGE_CATEGORY_KEY = 'operation:storage';
export const STORAGE_CATEGORY_LABEL = 'storage operations';
