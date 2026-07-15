import React from 'react';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import { Box, Button, useTheme } from '@greysole/spooder-component-library';
import { useFormContext } from 'react-hook-form';
import { GRAPH_KEY } from '../../FormKeys';

interface ExportGroupButtonProps {
  groupName: string;
}

export default function ExportGroupButton(props: ExportGroupButtonProps) {
  const { groupName } = props;
  const { getValues } = useFormContext();
  const { isMobileDevice } = useTheme();

  return (
    <Box padding='medium'>
      <Button
        label={isMobileDevice ? 'Export' : 'Export Group'}
        icon={faFileExport}
        iconSize='large'
        onClick={() => {
          const graphs = getValues(GRAPH_KEY);
          const groupGraphs = Object.values(graphs).filter(
            (graph: any) => graph.group === groupName,
          );
          const groupFileContent = JSON.stringify(
            {
              _meta: {
                groupName: groupName,
              },
              graphs: groupGraphs,
            },
            null,
          );
          const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(groupFileContent);
          const downloadAnchorNode = document.createElement('a');
          downloadAnchorNode.setAttribute('href', dataStr);
          downloadAnchorNode.setAttribute('download', `${groupName}_events.json`);
          document.body.appendChild(downloadAnchorNode);
          downloadAnchorNode.click();
          downloadAnchorNode.remove();
        }}
      />
    </Box>
  );
}
