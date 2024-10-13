import React from 'react';
import useNavigation from '../../app/hooks/useNavigation';
import BoolSwitch from '../common/input/controlled/BoolSwitch';
import usePlugins from '../../app/hooks/usePlugins';
import TabButton from './TabButton';

export default function NavigationMenu() {
  const {
    urlParams,
    setTab,
    currentTab,
    tabOptions,
    deckTabOptions,
    navigationOpen,
    setStayHere,
    setNavigation,
  } = useNavigation();
  const { getRefreshPlugins } = usePlugins();
  const { refreshPlugins } = getRefreshPlugins();

  const tabButtons = Object.keys(tabOptions).map((tab: string, index) => {
    const tabLabel = tabOptions[tab];
    return <TabButton key={tab} tabLable={tabLabel} tabName={tab} />;
  });

  const deckButtons = [] as React.JSX.Element[];
  for (let d in deckTabOptions) {
    let tabName = deckTabOptions[d];
    deckButtons.push(
      <button
        type='button'
        name={d}
        className={'tab-button ' + (currentTab == d ? 'selected' : '')}
        onClick={() => {
          setTab(d);
          setNavigation(false);
        }}
        key={Math.random()}
      >
        {tabName}
      </button>,
    );
  }

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
          onChange={() => setStayHere(urlParams.get('tab') != null)}
          value={urlParams.get('tab') != null}
          label='Stay Here'
        />
        <div>
          Plugins{' '}
          <button type='button' className='nav-restart-chat-button' onClick={refreshPlugins}>
            Refresh Plugins
          </button>
        </div>
        <div>
          Chat{' '}
          <button type='button' className='nav-restart-chat-button' onClick={(restartChat) => {}}>
            Restart Chat
          </button>
        </div>
        <div>
          Shares
          <div className='nav-share-container'></div>
        </div>
      </div>
    </div>
  );
}
