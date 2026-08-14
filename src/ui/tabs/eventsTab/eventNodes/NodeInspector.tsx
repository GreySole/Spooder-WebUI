import { Box, Button, FormNumberInput, Stack, TypeFace } from '@spooder/webui-component-library';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import useEvents from '../../../../app/hooks/useEvents';
import { EventGraph } from '../../../Types';
import { buildGraphKey, buildKey, buildNodeKey } from '../FormKeys';
import { resolveNodeDef } from './nodeDefLookup';
import OscTriggerNodeEditor from './oscTrigger/OscTriggerNodeEditor';
import ResponseNodeEditor from './responseAction/ResponseNodeEditor';
import PluginNodeEditor from './pluginAction/PluginNodeEditor';
import ModNodeEditor from './modAction/ModNodeEditor';
import SoftwareNodeEditor from './softwareAction/SoftwareNodeEditor';

interface NodeInspectorProps {
  eventName: string;
  selectedNodeId: string;
  onDeselect: () => void;
  onDeleteNode: (nodeId: string) => void;
}

export default function NodeInspector(props: NodeInspectorProps) {
  const { eventName, selectedNodeId, onDeselect, onDeleteNode } = props;
  const { watch } = useFormContext();
  const { getNodeManifest, getOperationNodes } = useEvents();
  const { manifests } = getNodeManifest();
  const { operationNodes } = getOperationNodes();

  const graph: EventGraph = watch(buildGraphKey(eventName));
  const nodeIndex = graph?.nodes.findIndex((n) => n.id === selectedNodeId) ?? -1;
  const node = nodeIndex >= 0 ? graph.nodes[nodeIndex] : undefined;

  if (!node) {
    return (
      <Box padding='medium'>
        <TypeFace>Select a node to edit it.</TypeFace>
      </Box>
    );
  }

  const def = resolveNodeDef(node, manifests, operationNodes);

  function deleteNode() {
    onDeleteNode(selectedNodeId);
    onDeselect();
  }

  let editor: React.ReactNode = null;
  if (node.moduleName === 'core' && node.nodeTypeId === 'osc_trigger') {
    editor = <OscTriggerNodeEditor eventName={eventName} nodeIndex={nodeIndex} />;
  } else if (node.moduleName === 'core' && node.nodeTypeId === 'response') {
    editor = <ResponseNodeEditor eventName={eventName} nodeIndex={nodeIndex} />;
  } else if (node.moduleName === 'core' && node.nodeTypeId === 'plugin') {
    editor = <PluginNodeEditor eventName={eventName} nodeIndex={nodeIndex} />;
  } else if (node.moduleName === 'core' && node.nodeTypeId === 'mod') {
    editor = <ModNodeEditor eventName={eventName} nodeIndex={nodeIndex} />;
  } else if (node.moduleName === 'core' && node.nodeTypeId === 'software') {
    editor = <SoftwareNodeEditor eventName={eventName} nodeIndex={nodeIndex} />;
  } else if (!def) {
    editor = <TypeFace>Unknown node type '{node.moduleName}/{node.nodeTypeId}'.</TypeFace>;
  }
  // No generic branch: form fields are edited inline on the node card. Rendering them here
  // too would bind two controls to the same form key, and the shared Form* components derive
  // their DOM id from that key - the duplicate ids break label/input association and make the
  // field look unresponsive. The panels above are only for what a static form def can't
  // express; everything else is identity, Delay and Delete below.

  return (
    <Stack spacing='medium' padding='medium'>
      <Box justifyContent='space-between' alignItems='center'>
        <Stack spacing='none'>
          <TypeFace fontSize='large'>{def?.label ?? node.nodeTypeId}</TypeFace>
          <TypeFace fontSize='small'>
            {node.moduleName} / {node.kind}
          </TypeFace>
        </Stack>
        <Button icon={faTrash} label='Delete Node' className='delete-button' onClick={deleteNode} />
      </Box>
      {def?.description ? <TypeFace fontSize='small'>{def.description}</TypeFace> : null}

      {editor}

      {node.kind === 'action' ? (
        <FormNumberInput
          label='Delay (Milliseconds):'
          formKey={buildKey(buildNodeKey(eventName, nodeIndex), 'delay')}
        />
      ) : null}
    </Stack>
  );
}
