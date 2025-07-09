import { Stack, BoolSwitch } from '@greysole/spooder-component-library';
import React from 'react';

interface ExportPluginModalContentProps {
  exportSource: boolean;
  setExportSource: (value: boolean) => void;
  exportAssets: boolean;
  setExportAssets: (value: boolean) => void;
}

export default function ExportPluginModalContent({
  exportSource,
  setExportSource,
  exportAssets,
  setExportAssets,
}: ExportPluginModalContentProps) {
  return (
    <Stack spacing='small'>
      <BoolSwitch
        label='Include Source'
        value={exportSource}
        onChange={() => setExportSource(!exportSource)}
      />
      <BoolSwitch
        label='Include Assets'
        value={exportAssets}
        onChange={() => setExportAssets(!exportAssets)}
      />
    </Stack>
  );
}
