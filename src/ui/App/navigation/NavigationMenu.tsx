import React from 'react';
import useNavigation from '../../../app/hooks/useNavigation';
import BoolSwitch from '../../common/input/controlled/BoolSwitch';
import usePlugins from '../../../app/hooks/usePlugins';
import TabButton from './TabButton';
import Button from '../../common/input/controlled/Button';
import useShare from '../../../app/hooks/useShare';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import useTwitch from '../../../app/hooks/useTwitch';
import Box from '../../common/layout/Box';
import TypeFace from '../../common/layout/TypeFace';
import Stack from '../../common/layout/Stack';
import Columns from '../../common/layout/Columns';

export default function NavigationMenu() {
  const { urlParams, tabOptions, deckTabOptions, navigationOpen, setStayHere } = useNavigation();
  const { getRefreshPlugins } = usePlugins();
  const { refreshPlugins } = getRefreshPlugins();
  const { getShares, getActiveShares } = useShare();
  const { data: shares, isLoading: sharesLoading } = getShares();
  const { data: activeShares, isLoading: activeSharesLoading } = getActiveShares();

  if (sharesLoading || activeSharesLoading) {
    return null;
  }

  let shareElements = [] as React.JSX.Element[];
  for (let s in shares) {
    shareElements.push(
      <Columns key={s} spacing='medium' padding='medium'>
        <TypeFace fontSize='large'>{shares[s].name}</TypeFace>
        <Button
          label=''
          icon={activeShares.includes(s) == false ? faPlay : faStop}
          iconSize='lg'
          onClick={() => {}}
        />
      </Columns>,
    );
  }

  const tabButtons = Object.keys(tabOptions).map((tab: string, index) => {
    const tabLabel = tabOptions[tab];
    return (
      <Box padding='small'>
        <TabButton key={tab} tabLable={tabLabel} tabName={tab} />
      </Box>
    );
  });

  const deckButtons = Object.keys(deckTabOptions).map((deck: string, index) => {
    const deckLabel = deckTabOptions[deck];
    return (
      <Box padding='small'>
        <TabButton key={deck} tabLable={deckLabel} tabName={deck} />
      </Box>
    );
  });

  return (
    <Box
      flexFlow='column'
      classes={['navigation-menu', navigationOpen ? 'open' : '']}
      overflow='auto'
      padding='medium'
      height='calc(100vh - 70px)'
    >
      <Box flexFlow='column'>
        <Stack spacing='medium' padding='small'>
          <TypeFace fontSize='large'>Setup</TypeFace>
          <Box flexFlow='row wrap' padding='small'>
            {tabButtons}
          </Box>
        </Stack>

        <Stack spacing='medium' padding='small'>
          <TypeFace fontSize='large'>Deck</TypeFace>
          <Box flexFlow='row wrap' padding='small'>
            {deckButtons}
          </Box>
        </Stack>
      </Box>
      <Stack padding='small' spacing='medium'>
        <BoolSwitch
          onChange={() => setStayHere(urlParams.get('tab') == null)}
          value={urlParams.get('tab') != null}
          label='Stay Here'
        />
        <Button label='Refresh Plugins' onClick={refreshPlugins} />
        <Button label='Restart Chat' onClick={() => {}} />
      </Stack>
      <Stack padding='small' spacing='small'>
        <TypeFace fontSize='large'>Shares</TypeFace>
        {shareElements}
      </Stack>
    </Box>
  );
}
