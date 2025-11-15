import React from 'react';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import { Box, Button, useTheme } from '@greysole/spooder-component-library';
import { useFormContext } from 'react-hook-form';

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
          const events = getValues('events');
          const groupEvents = Object.values(events).filter(
            (event: any) => event.group === groupName,
          );
          const groupFileContent = JSON.stringify(
            {
              _meta: {
                groupName: groupName,
              },
              events: groupEvents,
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
