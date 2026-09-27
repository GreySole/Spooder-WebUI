import React from 'react';
import { FormTextInput } from '@spooder/webui-component-library';
import { useHostComponents } from '../host';
import type { NodeGraphComponents } from '../host';

// The pickers the host supplies (see NodeGraphComponents). Each renders the host's when it has
// one and a plain field otherwise, so the editor works before an app has built them all.

type Props<K extends keyof NodeGraphComponents> = React.ComponentProps<NodeGraphComponents[K]>;

export function AssetSelectField(props: Props<'AssetSelect'>) {
  const { AssetSelect } = useHostComponents();
  return AssetSelect ? (
    <AssetSelect {...props} />
  ) : (
    <FormTextInput formKey={props.formKey} label={props.label} />
  );
}

export function MultiAssetSelectField(props: Props<'MultiAssetSelect'>) {
  const { MultiAssetSelect } = useHostComponents();
  return MultiAssetSelect ? (
    <MultiAssetSelect {...props} />
  ) : (
    <FormTextInput formKey={props.formKey} label={props.label} />
  );
}

export function UdpSelectField(props: Props<'UdpSelect'>) {
  const { UdpSelect } = useHostComponents();
  return UdpSelect ? (
    <UdpSelect {...props} />
  ) : (
    <FormTextInput formKey={props.formKey} label={props.label} />
  );
}

export function UdpServerManagerPanel() {
  const { UdpServerManager } = useHostComponents();
  return UdpServerManager ? <UdpServerManager /> : null;
}

export function PluginEventInputsField(props: Props<'PluginEventInputs'>) {
  const { PluginEventInputs } = useHostComponents();
  return PluginEventInputs ? <PluginEventInputs {...props} /> : null;
}
