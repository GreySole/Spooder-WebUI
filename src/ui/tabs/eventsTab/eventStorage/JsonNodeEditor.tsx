import React, { useState } from 'react';
import { faChevronDown, faChevronRight, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  BoolSwitch,
  Box,
  Button,
  Columns,
  NumberInput,
  SelectDropdown,
  Stack,
  TextInput,
  TypeFace,
} from '@spooder/webui-component-library';

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

type JsonKind = 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';

function kindOf(value: JsonValue): JsonKind {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'string';
}

function defaultForKind(kind: JsonKind): JsonValue {
  switch (kind) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'object':
      return {};
    case 'array':
      return [];
    case 'null':
      return null;
  }
}

const KIND_OPTIONS = [
  { label: 'String', value: 'string' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Object', value: 'object' },
  { label: 'Array', value: 'array' },
  { label: 'Null', value: 'null' },
];

interface JsonNodeEditorProps {
  value: JsonValue;
  onChange: (value: JsonValue) => void;
  // Absent only for the root node - nothing above it to remove it from.
  onDelete?: () => void;
  label?: string;
}

// Recursively edits one JSON value in place. Every node (object/array/leaf) gets a type
// dropdown so a key can be reshaped - e.g. a string a node left behind turned into the object
// a later version of that node expects - without deleting and recreating it.
export default function JsonNodeEditor(props: JsonNodeEditorProps) {
  const { value, onChange, onDelete, label } = props;
  const kind = kindOf(value);
  const isContainer = kind === 'object' || kind === 'array';
  const [expanded, setExpanded] = useState(true);
  const [newChildKey, setNewChildKey] = useState('');

  function changeKind(nextKind: string) {
    if (nextKind === kind) {
      return;
    }
    onChange(defaultForKind(nextKind as JsonKind));
  }

  function addChild() {
    if (kind === 'array') {
      onChange([...(value as JsonValue[]), '']);
      return;
    }
    const key = newChildKey.trim();
    if (key.length === 0 || Object.prototype.hasOwnProperty.call(value, key)) {
      return;
    }
    onChange({ ...(value as { [key: string]: JsonValue }), [key]: '' });
    setNewChildKey('');
  }

  function updateChild(childKey: string | number, childValue: JsonValue) {
    if (kind === 'array') {
      const next = [...(value as JsonValue[])];
      next[childKey as number] = childValue;
      onChange(next);
      return;
    }
    onChange({ ...(value as { [key: string]: JsonValue }), [childKey as string]: childValue });
  }

  function deleteChild(childKey: string | number) {
    if (kind === 'array') {
      onChange((value as JsonValue[]).filter((_, i) => i !== childKey));
      return;
    }
    const next = { ...(value as { [key: string]: JsonValue }) };
    delete next[childKey as string];
    onChange(next);
  }

  const childKeys = kind === 'object' ? Object.keys(value as object).sort() : [];

  return (
    <Stack spacing='small'>
      <Columns spacing='small'>
        {isContainer ? (
          <Button icon={expanded ? faChevronDown : faChevronRight} onClick={() => setExpanded(!expanded)} />
        ) : null}
        {label != null ? (
          <TypeFace width='10rem' truncate>
            {label}
          </TypeFace>
        ) : null}
        <SelectDropdown width='7rem' options={KIND_OPTIONS} value={kind} onChange={(v) => changeKind(v)} />
        {kind === 'string' ? (
          <TextInput width='100%' value={value as string} onInput={(v) => onChange(v)} />
        ) : null}
        {kind === 'number' ? (
          <NumberInput width='100%' value={value as number} onInput={(v) => onChange(v)} />
        ) : null}
        {kind === 'boolean' ? <BoolSwitch value={value as boolean} onChange={(v) => onChange(v)} /> : null}
        {kind === 'object' ? <TypeFace fontSize='small'>{`{ ${childKeys.length} }`}</TypeFace> : null}
        {kind === 'array' ? (
          <TypeFace fontSize='small'>{`[ ${(value as JsonValue[]).length} ]`}</TypeFace>
        ) : null}
        {onDelete ? <Button icon={faTrash} onClick={() => onDelete()} /> : null}
      </Columns>
      {isContainer && expanded ? (
        <Box paddingLeft='medium'>
          <Stack spacing='small'>
            {kind === 'array'
              ? (value as JsonValue[]).map((item, index) => (
                  <JsonNodeEditor
                    key={index}
                    label={`[${index}]`}
                    value={item}
                    onChange={(v) => updateChild(index, v)}
                    onDelete={() => deleteChild(index)}
                  />
                ))
              : childKeys.map((childKey) => (
                  <JsonNodeEditor
                    key={childKey}
                    label={childKey}
                    value={(value as { [key: string]: JsonValue })[childKey]}
                    onChange={(v) => updateChild(childKey, v)}
                    onDelete={() => deleteChild(childKey)}
                  />
                ))}
            {kind === 'array' ? (
              <Button label='Add Item' icon={faPlus} onClick={() => addChild()} />
            ) : (
              <Columns spacing='small'>
                <TextInput
                  width='100%'
                  placeholder='New property'
                  value={newChildKey}
                  onInput={(v) => setNewChildKey(v)}
                  jsonFriendly
                />
                <Button icon={faPlus} onClick={() => addChild()} disabled={!newChildKey.trim()} />
              </Columns>
            )}
          </Stack>
        </Box>
      ) : null}
    </Stack>
  );
}
