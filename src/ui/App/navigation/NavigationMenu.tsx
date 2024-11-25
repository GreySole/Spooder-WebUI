import React from 'react';
import useNavigation from '../../../app/hooks/useNavigation';
import BoolSwitch from '../../common/input/controlled/BoolSwitch';
import usePlugins from '../../../app/hooks/usePlugins';
import TabButton from './TabButton';
import Button from '../../common/input/controlled/Button';
import useShare from '../../../app/hooks/useShare';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import useTwitch from '../../../app/hooks/useTwitch';

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
      <div className='nav-share-entry' key={s}>
        <label>{shares[s].name}</label>
        <Button
          label=''
          icon={activeShares.includes(s) == false ? faPlay : faStop}
          iconSize='lg'
          onClick={() => {}}
        />
      </div>,
    );
  }

  const tabButtons = Object.keys(tabOptions).map((tab: string, index) => {
    const tabLabel = tabOptions[tab];
    return <TabButton key={tab} tabLable={tabLabel} tabName={tab} />;
  });

  const deckButtons = Object.keys(deckTabOptions).map((deck: string, index) => {
    const deckLabel = deckTabOptions[deck];
    return <TabButton key={deck} tabLable={deckLabel} tabName={deck} />;
  });

  const navigationTabs = (
    <div className='navigation-tabs-mobile'>
      <div className='navigation-tab-group'>
        <label>Setup</label>
        <div className='navigation-buttons'>{tabButtons}</div>
      </div>

      <div className='navigation-tab-group'>
        <label>Deck</label>
        <div className='navigation-buttons'>{deckButtons}</div>
      </div>
    </div>
  );

  return (
    <div className={'navigation-menu ' + (navigationOpen ? 'open' : '')}>
      {navigationTabs}
      <div className='chat-actions'>
        <BoolSwitch
          onChange={() => setStayHere(urlParams.get('tab') == null)}
          value={urlParams.get('tab') != null}
          label='Stay Here'
        />
        <Button label='Refresh Plugins' onClick={refreshPlugins} />
        <Button label='Restart Chat' onClick={() => {}} />
        <div>
          Shares
          <div className='nav-share-container'>{shareElements}</div>
        </div>
      </div>
    </div>
  );
}
