import React, { MutableRefObject, useRef } from 'react';
import { usePluginContext } from './context/PluginTabFormContext';
import AlertToasterLink from './AlertToasterLink';
import PluginEntry from './PluginEntry';
import { FormLoader, KeyedObject, Modal, Stack } from '@greysole/spooder-component-library';
import PluginSettings from './input/PluginSettings';
import PluginAssetManager from './PluginAssetManager';
import PluginInfoView from './PluginInfoView';

export default function PluginList() {
  const {
    plugins,
    isReady,
    reloadPlugins,
    pluginAssetsOpen,
    pluginInfoOpen,
    pluginSettingsOpen,
    setPluginAssetsOpen,
    setPluginInfoOpen,
    setPluginSettingsOpen,
  } = usePluginContext();

  const pluginRefs = useRef({} as KeyedObject);

  if (!isReady) {
    return <FormLoader numRows={4} />;
  }

  const modalOpen = pluginAssetsOpen !== '' || pluginInfoOpen !== '' || pluginSettingsOpen !== '';
  const activePlugin = pluginAssetsOpen || pluginInfoOpen || pluginSettingsOpen;
  const onModalClose = () => {
    setPluginAssetsOpen('');
    setPluginInfoOpen('');
    setPluginSettingsOpen('');
    reloadPlugins().then(() => setTimeout(() => scrollToPlugin(activePlugin), 200));
  };

  const setPluginRef = (pluginName: string, ref: MutableRefObject<KeyedObject>) => {
    pluginRefs.current[pluginName] = ref;
  };

  const scrollToPlugin = (pluginName: string) => {
    console.log('scrolling to', pluginName);
    if (pluginRefs.current[pluginName]) {
      pluginRefs.current[pluginName].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const pluginList = [];
  const disabledPluginList = [];
  const sortedPluginKeys = Object.keys(plugins).sort();
  if (sortedPluginKeys.length == 0) {
    pluginList.push(<AlertToasterLink />);
  } else {
    for (let sp in sortedPluginKeys) {
      let p = sortedPluginKeys[sp];
      if (plugins[p] == null) {
        continue;
      }
      if (plugins[p].status == 'disabled') {
        disabledPluginList.push(<PluginEntry key={p} pluginName={p} setRef={setPluginRef} />);
      } else {
        pluginList.push(<PluginEntry key={p} pluginName={p} setRef={setPluginRef} />);
      }
    }
  }

  console.log(pluginSettingsOpen, activePlugin);

  return (
    <Stack spacing='medium' padding='medium'>
      <Modal
        title={plugins[activePlugin]?.name}
        isOpen={modalOpen}
        onClose={onModalClose}
        content={
          <>
            {pluginInfoOpen === activePlugin ? <PluginInfoView pluginName={activePlugin} /> : null}
            {pluginAssetsOpen === activePlugin ? (
              <PluginAssetManager pluginName={activePlugin} />
            ) : null}
          </>
        }
      />
      {pluginSettingsOpen === activePlugin ? <PluginSettings pluginName={activePlugin} /> : null}
      {pluginList}
      {disabledPluginList}
    </Stack>
  );
}
