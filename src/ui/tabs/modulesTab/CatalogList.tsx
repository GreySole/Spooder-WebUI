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
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import React, { useMemo, useState } from 'react';
import { CatalogEntry, RestartVia, useInstallEntryMutation } from '../../../app/api/registrySlice';
import { DiscordIcon, ObsIcon, TwitchIcon } from '../../common/icons/icons';
import ModuleDetailsModal from './ModuleDetailsModal';

// The registry catalogue doesn't carry real icon assets for these, so the same marks the
// modules' own tabs use (see src/ui/common/icons/icons.tsx) stand in here too.
const KNOWN_MODULE_ICONS: { [id: string]: IconProp | string } = {
  twitch: TwitchIcon,
  discord: DiscordIcon,
  obs: ObsIcon,
};

// What the button offers, and why it might not. Only plugins go through this card now -
// modules get their own section in ModuleDetailsModal.
function actionFor(entry: CatalogEntry): { label: string; enabled: boolean; note?: string } {
  if (entry.installed) {
    return { label: 'Installed', enabled: false };
  }
  if (!entry.compatible) {
    return { label: 'Unavailable', enabled: false, note: `Needs Spooder ${entry.spooder}` };
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
  const { showSuccess, showError } = useToast();
  const action = actionFor(entry);

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

  return (
    <Border>
      <Box padding="small" width="100%">
        <Stack spacing="small" width="100%">
          <Columns spacing="small">
            <TypeFace fontSize="large">{entry.name}</TypeFace>
            <Button
              label={isLoading ? 'Building…' : action.label}
              onClick={onInstall}
              disabled={!action.enabled || isLoading}
            />
          </Columns>
          <TypeFace fontSize="medium">{entry.summary}</TypeFace>
          {action.note && <TypeFace fontSize="medium">{action.note}</TypeFace>}
          <TypeFace fontSize="medium">
            {entry.author} · {entry.license} · from {entry.source.name}
            {entry.tags?.length ? ` · ${entry.tags.join(', ')}` : ''}
          </TypeFace>
        </Stack>
      </Box>
    </Border>
  );
}

// One icon button per module. Its own section lives in a modal rather than inline, since a
// module's install state, notes and widget links are too much to show for every entry at once
// in what's meant to be a scannable grid.
function ModuleIcon({ entry, onOpen }: { entry: CatalogEntry; onOpen: () => void }) {
  return (
    <Box padding="small">
      <Button
        width="10rem"
        label={entry.name}
        icon={KNOWN_MODULE_ICONS[entry.id] ?? entry.icon}
        iconSize='8rem'
        fallbackIcon={faPuzzlePiece}
        iconPosition="top"
        onClick={onOpen}
        truncate
      />
    </Box>
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
  // Holds the open module's id rather than a plain boolean, so the same state both drives the
  // modal and picks which entry it should describe.
  const [openModuleId, setOpenModuleId] = useState('');

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
      <TypeFace fontSize="medium">
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
        <TypeFace fontSize="medium">Nothing matches that search.</TypeFace>
      )}

      {modules.length > 0 && (
        <Stack spacing="small" width="100%">
          <TypeFace fontSize="large">Modules</TypeFace>
          <Box flexFlow="row wrap">
            {modules.map((e) => (
              <ModuleIcon key={`${e.source.id}:${e.id}`} entry={e} onOpen={() => setOpenModuleId(e.id)} />
            ))}
          </Box>
          <ModuleDetailsModal
            entry={modules.find((e) => e.id === openModuleId)}
            isOpen={openModuleId !== ''}
            onClose={() => setOpenModuleId('')}
            onRestartNeeded={onRestartNeeded}
          />
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
