import { Box, Button, Columns, Stack, TypeFace } from '@spooder/webui-component-library';
import React, { useState } from 'react';
import {
  RestartVia,
  useGetCatalogQuery,
  useRefreshCatalogMutation,
} from '../../app/api/registrySlice';
import { useModuleFailures } from '../../modules/useModules';
import { Border } from '@spooder/webui-component-library';
import PageCircleLoader from '../common/input/general/PageCircleLoader';
import CatalogList from './modulesTab/CatalogList';
import InstallFromUrl from './modulesTab/InstallFromUrl';
import RegistrySources from './modulesTab/RegistrySources';
import RestartNotice from './modulesTab/RestartNotice';

export default function ModulesTab() {
  const { data, isLoading, error } = useGetCatalogQuery();
  const [refresh, { isLoading: refreshing }] = useRefreshCatalogMutation();
  // Held at this level rather than on the card: the card is about to be re-rendered by the
  // catalogue refetch, and the notice has to outlive that.
  const [pendingRestart, setPendingRestart] = useState<{ what: string; via: RestartVia } | null>(
    null,
  );
  // Modules that were served but could not be loaded. They have no tab of their own, so this
  // is the only place their failure can be seen.
  const failures = useModuleFailures();

  if (isLoading) {
    return <PageCircleLoader />;
  }

  if (error || !data) {
    return <TypeFace fontSize="large">Couldn't read the registries.</TypeFace>;
  }

  return (
    <Box padding="medium" width="100%">
      <Stack spacing="large" width="100%">
        <Columns spacing="small">
          <TypeFace fontSize="xlarge">Modules &amp; Plugins</TypeFace>
          <Button
            label={refreshing ? 'Checking…' : 'Check for updates'}
            onClick={() => refresh()}
          />
        </Columns>

        {data.duplicates.length > 0 && (
          <TypeFace fontSize="medium">
            {data.duplicates
              .map(
                (d) =>
                  `'${d.id}' is offered by ${d.alsoIn.join(', ')} as well — using the one from ${d.usedFrom}.`,
              )
              .join(' ')}
          </TypeFace>
        )}

        {failures.length > 0 && (
          <Border>
            <Box padding="small" width="100%">
              <Stack spacing="small" width="100%">
                <TypeFace fontSize="large">
                  {failures.length === 1
                    ? "A module didn't load"
                    : `${failures.length} modules didn't load`}
                </TypeFace>
                <TypeFace fontSize="medium">
                  Installed, but Spooder couldn't start them, so they have no tab. Usually this
                  means the module needs an update to match this version of Spooder.
                </TypeFace>
                {failures.map((f) => (
                  <TypeFace key={f.key} fontSize="medium">
                    {f.key} — {f.message}
                  </TypeFace>
                ))}
              </Stack>
            </Box>
          </Border>
        )}

        {pendingRestart && (
          <RestartNotice
            what={pendingRestart.what}
            via={pendingRestart.via}
            onDismiss={() => setPendingRestart(null)}
          />
        )}

        <CatalogList
          entries={data.entries}
          onRestartNeeded={(what, via) => setPendingRestart({ what, via })}
        />
        <InstallFromUrl onInstalled={() => refresh()} />
        <RegistrySources sources={data.sources} />
      </Stack>
    </Box>
  );
}
