import { Box, Button, SelectDropdown, Stack } from '@greysole/spooder-component-library';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import useEvents from '../../../../app/hooks/useEvents';
import { EventGraph, EventGraphNode, EventGraphNodeKind } from '../../../Types';
import { buildGraphKey } from '../FormKeys';
import { CORE_ACTION_DEFS, CORE_TRIGGER_DEFS } from './coreNodeDefs';

interface NodePaletteProps {
  eventName: string;
}

interface PaletteOption {
  value: string;
  label: string;
  kind: EventGraphNodeKind;
  moduleName: string;
  nodeTypeId: string;
  defaults: { [key: string]: any };
}

export default function NodePalette(props: NodePaletteProps) {
  const { eventName } = props;
  const { watch, setValue } = useFormContext();
  const { getNodeManifest, getOperationNodes } = useEvents();
  const { manifests } = getNodeManifest();
  const { operationNodes } = getOperationNodes();

  const [selectedOption, setSelectedOption] = useState<string>('');

  const triggerOptions: PaletteOption[] = [];
  const actionOptions: PaletteOption[] = [];
  const operationOptions: PaletteOption[] = [];

  for (const manifest of manifests ?? []) {
    for (const trigger of manifest.triggers) {
      triggerOptions.push({
        value: `callback::${manifest.moduleName}::${trigger.id}`,
        label: `${manifest.moduleName} - ${trigger.label}`,
        kind: 'callback',
        moduleName: manifest.moduleName,
        nodeTypeId: trigger.id,
        defaults: trigger.defaults,
      });
    }
    for (const action of manifest.actions) {
      actionOptions.push({
        value: `action::${manifest.moduleName}::${action.id}`,
        label: `${manifest.moduleName} - ${action.label}`,
        kind: 'action',
        moduleName: manifest.moduleName,
        nodeTypeId: action.id,
        defaults: action.defaults,
      });
    }
  }

  for (const trigger of CORE_TRIGGER_DEFS) {
    triggerOptions.push({
      value: `callback::core::${trigger.id}`,
      label: `Core - ${trigger.label}`,
      kind: 'callback',
      moduleName: 'core',
      nodeTypeId: trigger.id,
      defaults: trigger.defaults,
    });
  }
  for (const action of CORE_ACTION_DEFS) {
    actionOptions.push({
      value: `action::core::${action.id}`,
      label: `Core - ${action.label}`,
      kind: 'action',
      moduleName: 'core',
      nodeTypeId: action.id,
      defaults: action.defaults,
    });
  }

  for (const op of operationNodes ?? []) {
    operationOptions.push({
      value: `operation::${op.category}::${op.id}`,
      label: `${op.category} - ${op.label}`,
      kind: 'operation',
      moduleName: op.category,
      nodeTypeId: op.id,
      defaults: op.defaults,
    });
  }

  const allOptions = [...triggerOptions, ...actionOptions, ...operationOptions];

  function addNode() {
    const option = allOptions.find((o) => o.value === selectedOption);
    if (!option) {
      return;
    }
    const graph: EventGraph = watch(buildGraphKey(eventName));
    const nodes = graph?.nodes ?? [];
    const newNode: EventGraphNode = {
      id: uuidv4(),
      kind: option.kind,
      moduleName: option.moduleName,
      nodeTypeId: option.nodeTypeId,
      values: { ...option.defaults },
      delay: option.kind === 'action' ? 0 : undefined,
      position: {
        x: option.kind === 'callback' ? 40 : option.kind === 'action' ? 360 : 360,
        y: 40 + nodes.length * 110,
      },
    };
    setValue(`${buildGraphKey(eventName)}.nodes`, [...nodes, newNode], { shouldDirty: true });
    setSelectedOption('');
  }

  return (
    <Box flexFlow='column' padding='small'>
      <Stack spacing='small'>
        <SelectDropdown
          label='Add Node'
          value={selectedOption}
          onChange={setSelectedOption}
          options={[
            { label: 'Select node...', value: '' },
            ...(triggerOptions.length ? [{ label: '── Triggers ──', value: '__sep_triggers__' }] : []),
            ...triggerOptions,
            ...(actionOptions.length ? [{ label: '── Actions ──', value: '__sep_actions__' }] : []),
            ...actionOptions,
            ...(operationOptions.length ? [{ label: '── Operations ──', value: '__sep_operations__' }] : []),
            ...operationOptions,
          ]}
        />
        <Button label='Add' onClick={addNode} disabled={!selectedOption} />
      </Stack>
    </Box>
  );
}
