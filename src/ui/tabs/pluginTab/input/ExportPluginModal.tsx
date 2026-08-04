import { Box, LinkButton, Modal } from '@spooder/webui-component-library';
import React, { useState } from 'react';
import ExportPluginModalContent from './ExportPluginModalContent';
import { usePluginContext } from '../context/PluginTabFormContext';
import { set } from 'react-hook-form';

export default function ExportPluginModal() {
  const { pluginExportOpen, setPluginExportOpen } = usePluginContext();
  const [exportSource, setExportSource] = useState(false);
  const [exportAssets, setExportAssets] = useState(false);
  return (
    <Modal
      title='Export Plugin'
      isOpen={pluginExportOpen !== ''}
      onClose={() => {
        setPluginExportOpen('');
        setExportSource(false);
        setExportAssets(false);
      }}
      content={
        <ExportPluginModalContent
          exportSource={exportSource}
          setExportSource={setExportSource}
          exportAssets={exportAssets}
          setExportAssets={setExportAssets}
        />
      }
      footerContent={
        <Box width='100%' justifyContent='flex-end'>
          <LinkButton
            label='Export'
            mode='download'
            name={`${pluginExportOpen}`}
            link={`/plugin/export_plugin?pluginname=${pluginExportOpen}&include_source=${exportSource}&include_assets=${exportAssets}`}
          />
        </Box>
      }
    />
  );
}
