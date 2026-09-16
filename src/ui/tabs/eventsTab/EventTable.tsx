import React from 'react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { faBan, faComment, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import {
  Expandable,
  ExpandableIcon,
  Box,
  Columns,
  SearchBar,
  FilterButton,
  ResetButton,
  SaveButton,
  useTheme,
} from '@spooder/webui-component-library';
import useEvents from '../../../app/hooks/useEvents';
import useModules from '../../../modules/useModules';
import { Footer } from '../../app/Footer';
import AddEventInput from './eventCommand/input/AddEventInput';
import AddGroupInput from './eventCommand/input/AddGroupInput';
import DeleteGroupButton from './eventCommand/input/DeleteGroupButton';
import ToggleGroupButton from './eventCommand/input/ToggleGroupButton';
import EventElement from './EventElement';
import { TwitchIcon } from '../../common/icons/icons';
import ExportGroupButton from './eventCommand/input/ExportGroupButton';
import ImportGroupButton from './eventCommand/input/ImportGroupButton';
import { DISABLED_GROUP_KEY, GRAPH_KEY, GROUP_KEY } from './FormKeys';
import {
  GraphTriggerKind,
  getGraphTriggerKinds,
  orderTriggerKinds,
  triggerKindIcon,
} from './eventNodes/graphUtil';

export default function EventTable() {
  const [searchText, setSearchText] = useState<string>('');
  const [filter, setFilter] = useState<string[]>([]);

  const { watch } = useFormContext();
  const { themeConstants } = useTheme();
  const modules = useModules();
  const graphs = watch(GRAPH_KEY);
  const groups = watch(GROUP_KEY);
  const disabledGroups: string[] = watch(DISABLED_GROUP_KEY) ?? [];

  const searchEnabled = searchText !== '';
  const filterEnabled = filter.length > 0;

  // Filter out any stale/malformed entries (e.g. a key left behind mid-delete) before
  // sorting, since graphs[key] or its .name being null/undefined would otherwise crash
  // the whole tab here.
  const propKeys = Object.keys(graphs)
    .filter((key) => graphs[key]?.name != null)
    .sort((a, b) => {
      return graphs[a].name.toUpperCase() > graphs[b].name.toUpperCase() ? 1 : -1;
    });

  // What each group's header icons show - the full set of trigger kinds in the group, not just
  // what the current search/filter leaves visible, so the header doesn't flicker as you type.
  const groupTriggerKinds: { [groupName: string]: Set<GraphTriggerKind> } = {};
  for (const key of propKeys) {
    const graph = graphs[key];
    const kinds = (groupTriggerKinds[graph.group] ??= new Set());
    for (const kind of getGraphTriggerKinds(graph)) {
      kinds.add(kind);
    }
  }

  const groupObjects = groups.reduce((obj: any, key: string) => ({ ...obj, [key]: [] }), {
    Default: [],
  });

  for (let p in propKeys) {
    const s = propKeys[p];

    const thisGraph = graphs[s];

    const eventName = thisGraph.name;
    const groupName = thisGraph.group;

    if (filterEnabled && !getGraphTriggerKinds(thisGraph).some((kind) => filter.includes(kind))) {
      continue;
    }

    const internalEventName = eventName.toLowerCase().replace(/ /g, '');
    const eventNameLower = eventName.toLowerCase().replace(/ /g, '');

    if (
      searchEnabled &&
      !internalEventName.includes(searchText) &&
      !eventNameLower.includes(searchText)
    ) {
      continue;
    }

    if (groupObjects[groupName] == null) {
      groupObjects[groupName] = [];
    }

    groupObjects[groupName].push(<EventElement key={`event-${s}`} eventName={s} />);
  }

  const groupKeys = Object.keys(groupObjects).sort();

  const groupElements = groupKeys.map((groupName: string) => {
    if (searchEnabled == true && groupObjects[groupName].length == 0) {
      return null;
    }

    const groupIcons: ExpandableIcon[] = orderTriggerKinds(groupTriggerKinds[groupName] ?? []).map(
      (kind) => triggerKindIcon(kind, modules),
    );
    if (disabledGroups.includes(groupName)) {
      groupIcons.push({
        icon: faBan,
        iconColor: themeConstants.delete,
        tooltipText: 'This group is disabled',
      });
    }

    return (
      <Expandable
        key={`group-${groupName}`}
        label={groupName}
        forceOpen={searchEnabled || filterEnabled}
        icons={groupIcons}
      >
        <Box flexFlow='column'>
          <Box flexFlow='row wrap'>
            <AddEventInput groupName={groupName} />
            <ToggleGroupButton groupName={groupName} />
            <DeleteGroupButton groupName={groupName} />
            <ExportGroupButton groupName={groupName} />
          </Box>

          {groupObjects[groupName]}
        </Box>
      </Expandable>
    );
  });

  return (
    <Box flexFlow='column' width='inherit' marginBottom='var(--footer-height)'>
      <Box flexFlow='column'>
        <Box marginBottom='medium'>
          <AddGroupInput />
          <ImportGroupButton />
        </Box>
        {groupElements}
      </Box>
      <Footer showFooter>
        <SearchBar placeholder='Search Events...' value={searchText} onSearch={setSearchText} />
        <FilterButton
          options={[
            { label: 'Chat', icon: faComment, value: 'chat' },
            { label: 'OSC', icon: faNetworkWired, value: 'osc' },
            { label: 'Twitch', icon: TwitchIcon, value: 'twitch' },
          ]}
          selectedOptions={filter}
          onChange={(e) => (setFilter(e), console.log(e))}
        />
      </Footer>
    </Box>
  );
}

export { EventTable };
