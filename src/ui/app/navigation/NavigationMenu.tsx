import React, { ReactNode } from 'react';
import useNavigation from '../../../app/hooks/useNavigation';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import {
  Columns,
  TypeFace,
  Button,
  Box,
  Stack,
  BoolSwitch,
} from '@greysole/spooder-component-library';
import useShare from '../../../app/hooks/useShare';
import TabButton from './TabButton';

export default function NavigationMenu() {
  const { urlParams, tabOptions, deckTabOptions, navigationOpen, setStayHere } = useNavigation();
  const { getShares, getActiveShares } = useShare();
  const { data: shares, isLoading: sharesLoading } = getShares();
  const { data: activeShares, isLoading: activeSharesLoading } = getActiveShares();

  if (sharesLoading || activeSharesLoading) {
    return null;
  }

  let shareElements = [] as ReactNode[];
  for (let s in shares) {
    shareElements.push(
      <Columns key={`mini-share-${s}`} spacing='medium' padding='medium'>
        <TypeFace fontSize='large'>{shares[s].name}</TypeFace>
        <Button
          label=''
          icon={activeShares.twitch?.includes(s) ? faStop : faPlay}
          iconSize='large'
          onClick={() => {}}
        />
      </Columns>,
    );
  }

  const tabButtons = Object.keys(tabOptions).map((tab: string, index) => {
    const tabLabel = tabOptions[tab];
    return (
      <Box key={tab} padding='small'>
        <TabButton tabLabel={tabLabel} tabName={tab} index={index} />
      </Box>
    );
  });

  const deckButtons = Object.keys(deckTabOptions).map((deck: string, index) => {
    const deckLabel = deckTabOptions[deck];
    return (
      <Box key={deck} padding='small'>
        <TabButton tabLabel={deckLabel} tabName={deck} index={index} />
      </Box>
    );
  });

  return (
    <Box
      flexFlow='column'
      className={`navigation-menu ${navigationOpen ? 'open' : ''}`}
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
      {/* <Stack padding='small' spacing='medium'>
        <BoolSwitch
          onChange={() => setStayHere(urlParams.get('tab') == null)}
          value={urlParams.get('tab') != null}
          label='Stay Here'
        />
      </Stack> */}
      {shareElements.length > 0 && (
        <Stack padding='small' spacing='small'>
          <TypeFace fontSize='large'>Shares</TypeFace>
          {shareElements}
        </Stack>
      )}
    </Box>
  );
}
