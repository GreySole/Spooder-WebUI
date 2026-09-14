import { Box, Button, Columns, LinkButton, Modal, Stack, TypeFace, useToast } from '@spooder/webui-component-library';
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  CatalogEntry,
  RestartVia,
  useInstallEntryMutation,
  useUninstallEntryMutation,
} from '../../../app/api/registrySlice';
import { useGetModuleWidgetsQuery } from '../../../app/api/moduleSlice';
import { _setTab } from '../../../app/slice/navigationSlice';
import useNavigation from '../../../app/hooks/useNavigation';
import { unregisterModule } from '../../../modules/registry';

// Same eligibility/labelling rules as the catalogue's install button - kept in step with
// CatalogList's own copy since a module and a plugin card show the same states differently.
function actionFor(entry: CatalogEntry): { label: string; enabled: boolean; note?: string } {
  if (entry.installed) {
    return { label: 'Installed', enabled: false };
  }
  if (!entry.compatible) {
    return { label: 'Unavailable', enabled: false, note: `Needs Spooder ${entry.spooder}` };
  }
  return {
    label: 'Install',
    enabled: true,
    note: 'Takes a minute to build, then needs a restart.',
  };
}

export default function ModuleDetailsModal({
  entry,
  isOpen,
  onClose,
  onRestartNeeded,
}: {
  entry: CatalogEntry | undefined;
  isOpen: boolean;
  onClose: () => void;
  onRestartNeeded: (what: string, via: RestartVia) => void;
}) {
  const [install, { isLoading }] = useInstallEntryMutation();
  const [uninstall, { isLoading: removing }] = useUninstallEntryMutation();
  const { showSuccess, showError } = useToast();
  const { currentTab } = useNavigation();
  const dispatch = useDispatch();
  // A module only ships widgets once it's actually loaded, so there's nothing to look up for
  // one that isn't installed yet - skip rather than 503 on a module list that isn't ready.
  const { data: widgetsByModule } = useGetModuleWidgetsQuery(undefined, {
    skip: !entry?.installed,
  });

  if (!entry) {
    return <Modal title="" isOpen={false} onClose={onClose} content={null} />;
  }

  const action = actionFor(entry);
  const busy = isLoading || removing;
  const widgets = widgetsByModule?.[entry.id] ?? [];

  const onInstall = async () => {
    const result: any = await install({ id: entry.id });
    if (result?.error) {
      showError(result.error.data?.error ?? `Could not install ${entry.name}.`);
      return;
    }
    if (result.data?.restartRequired) {
      onRestartNeeded(entry.name, result.data.restartVia ?? 'manual');
      return;
    }
    showSuccess(`${entry.name} installed.`);
  };

  const onUninstall = async () => {
    const result: any = await uninstall({ id: entry.id });
    if (result?.error) {
      showError(result.error.data?.error ?? `Could not remove ${entry.name}.`);
      return;
    }
    // The backend is gone, but this page still has the module registered from when it loaded,
    // so its tab would sit there until a restart. Drop it now - and step off it first, or the
    // current tab points at a module that no longer renders anything.
    if (currentTab === entry.id) {
      dispatch(_setTab({ tab: 'modules', folder: undefined }));
    }
    unregisterModule(entry.id);
    onRestartNeeded(`${entry.name} (removed)`, result.data?.restartVia ?? 'manual');
  };

  return (
    <Modal
      title={entry.name}
      isOpen={isOpen}
      onClose={onClose}
      content={
        <Stack spacing="medium" width="100%">
          <TypeFace fontSize="medium">{entry.summary}</TypeFace>

          <Columns spacing="small">
            {entry.installed ? (
              <Button label={removing ? 'Removing…' : 'Remove'} onClick={onUninstall} disabled={busy} />
            ) : (
              <Button
                label={isLoading ? 'Building…' : action.label}
                onClick={onInstall}
                disabled={!action.enabled || busy}
              />
            )}
          </Columns>
          {action.note && <TypeFace fontSize="medium">{action.note}</TypeFace>}
          {entry.installed && entry.webuiInstalled === false && (
            <TypeFace fontSize="medium">Installed, but its tab hasn't been downloaded yet.</TypeFace>
          )}

          <TypeFace fontSize="medium">
            {entry.author} · {entry.license} · from {entry.source.name}
            {entry.tags?.length ? ` · ${entry.tags.join(', ')}` : ''}
          </TypeFace>

          {widgets.length > 0 && (
            <Box>
              <Stack spacing="small" width="100%">
                <TypeFace fontSize="large">Widgets</TypeFace>
                <Columns spacing="small">
                  {widgets.map((w) => (
                    <LinkButton
                      key={w.id}
                      name={`${entry.id}-widget-${w.id}`}
                      label={w.label}
                      mode="newtab"
                      link={window.location.origin + w.url}
                    />
                  ))}
                </Columns>
              </Stack>
            </Box>
          )}
        </Stack>
      }
    />
  );
}
