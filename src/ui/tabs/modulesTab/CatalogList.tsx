import {
  Border,
  Box,
  Button,
  Columns,
  SelectDropdown,
  Stack,
  TextInput,
  TypeFace,
  useToast,
} from '@spooder/webui-component-library';
import React, { useMemo, useState } from 'react';
import {
  CatalogEntry,
  RestartVia,
  useInstallEntryMutation,
  useUninstallEntryMutation,
} from '../../../app/api/registrySlice';

// What the button offers, and why it might not. A module is compiled by Spooder's own build,
// so installing one takes a minute and a restart - said on the card rather than discovered
// when the page appears to hang.
function actionFor(entry: CatalogEntry): { label: string; enabled: boolean; note?: string } {
  if (entry.installed) {
    return { label: 'Installed', enabled: false };
  }
  if (!entry.compatible) {
    return { label: 'Unavailable', enabled: false, note: `Needs Spooder ${entry.spooder}` };
  }
  if (entry.kind === 'module') {
    return {
      label: 'Install',
      enabled: true,
      note: 'Takes a minute to build, then needs a restart.',
    };
  }
  return { label: 'Install', enabled: true };
}

function EntryCard({
  entry,
  onRestartNeeded,
}: {
  entry: CatalogEntry;
  onRestartNeeded: (what: string, via: RestartVia) => void;
}) {
  const [install, { isLoading }] = useInstallEntryMutation();
  const [uninstall, { isLoading: removing }] = useUninstallEntryMutation();
  const { showSuccess, showError } = useToast();
  const action = actionFor(entry);
  const busy = isLoading || removing;

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
    onRestartNeeded(`${entry.name} (removed)`, result.data?.restartVia ?? 'manual');
  };

  return (
    <Border>
      <Box padding="small" width="100%">
        <Stack spacing="small" width="100%">
          <Columns spacing="small">
            <TypeFace fontSize="medium">{entry.name}</TypeFace>
            {entry.installed && entry.kind === 'module' ? (
              <Button
                label={removing ? 'Removing…' : 'Remove'}
                onClick={onUninstall}
                disabled={busy}
              />
            ) : (
              <Button
                label={isLoading ? 'Building…' : action.label}
                onClick={onInstall}
                disabled={!action.enabled || busy}
              />
            )}
          </Columns>
          <TypeFace fontSize="small">{entry.summary}</TypeFace>
          {action.note && <TypeFace fontSize="small">{action.note}</TypeFace>}
          {entry.installed && entry.kind === 'module' && entry.webuiInstalled === false && (
            <TypeFace fontSize="small">Installed, but its tab hasn't been downloaded yet.</TypeFace>
          )}
          <TypeFace fontSize="small">
            {entry.kind} · {entry.author} · {entry.license} · from {entry.source.name}
            {entry.tags?.length ? ` · ${entry.tags.join(', ')}` : ''}
          </TypeFace>
        </Stack>
      </Box>
    </Border>
  );
}

export default function CatalogList({
  entries,
  onRestartNeeded,
}: {
  entries: CatalogEntry[];
  onRestartNeeded: (what: string, via: RestartVia) => void;
}) {
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');

  const tags = useMemo(() => {
    const all = new Set<string>();
    for (const e of entries) {
      for (const t of e.tags ?? []) {
        all.add(t);
      }
    }
    return [...all].sort();
  }, [entries]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return entries.filter((e) => {
      if (tag && !(e.tags ?? []).includes(tag)) {
        return false;
      }
      if (!needle) {
        return true;
      }
      // Author included on purpose: "everything by so-and-so" is how people actually look.
      return (
        e.name.toLowerCase().includes(needle) ||
        e.summary.toLowerCase().includes(needle) ||
        e.author.toLowerCase().includes(needle) ||
        (e.tags ?? []).some((t) => t.includes(needle))
      );
    });
  }, [entries, search, tag]);

  if (entries.length === 0) {
    return (
      <TypeFace fontSize="small">
        Nothing to show yet. Either no registry is turned on, or none of them could be reached.
      </TypeFace>
    );
  }

  const modules = filtered.filter((e) => e.kind === 'module');
  const plugins = filtered.filter((e) => e.kind === 'plugin');

  return (
    <Stack spacing="medium" width="100%">
      <Columns spacing="small">
        <TextInput
          value={search}
          onChange={(value: string) => setSearch(value)}
          placeholder="Search"
        />
        {tags.length > 0 && (
          <SelectDropdown
            value={tag}
            onChange={(value: string) => setTag(value)}
            options={[
              { label: 'All tags', value: '' },
              ...tags.map((t) => ({ label: t, value: t })),
            ]}
          />
        )}
      </Columns>

      {filtered.length === 0 && (
        <TypeFace fontSize="small">Nothing matches that search.</TypeFace>
      )}

      {modules.length > 0 && (
        <Stack spacing="small" width="100%">
          <TypeFace fontSize="large">Modules</TypeFace>
          {modules.map((e) => (
            <EntryCard
              key={`${e.source.id}:${e.id}`}
              entry={e}
              onRestartNeeded={onRestartNeeded}
            />
          ))}
        </Stack>
      )}
      {plugins.length > 0 && (
        <Stack spacing="small" width="100%">
          <TypeFace fontSize="large">Plugins</TypeFace>
          {plugins.map((e) => (
            <EntryCard
              key={`${e.source.id}:${e.id}`}
              entry={e}
              onRestartNeeded={onRestartNeeded}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
