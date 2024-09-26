import { useDispatch, useSelector } from 'react-redux';
import { _setNavigation, _setStayHere, _setTab, _toggleNavigation } from '../slice/navigationSlice';
import { IRootState } from '../store';

export default function useNavigation() {
  const dispatch = useDispatch();
  const currentTab = useSelector((state: IRootState) => state.navigationSlice.currentTab);
  const tabOptions = useSelector((state: IRootState) => state.navigationSlice.tabOptions);
  const deckTabOptions = useSelector((state: IRootState) => state.navigationSlice.deckTabOptions);
  const navigationOpen = useSelector((state: IRootState) => state.navigationSlice.navigationOpen);
  const stayHere = useSelector((state: IRootState) => state.navigationSlice.stayHere);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  function setTab(tabName: string) {
    dispatch(_setTab({ tab: tabName }));
  }

  function toggleNavigation() {
    dispatch(_toggleNavigation());
  }

  function setNavigation(isOpen: boolean) {
    console.log('SETTING NAV', isOpen);
    dispatch(_setNavigation(isOpen));
  }

  function setStayHere(stayHere: boolean) {
    dispatch(_setStayHere(stayHere));
  }

  return {
    navigationOpen,
    setTab,
    toggleNavigation,
    setNavigation,
    setStayHere,
    stayHere,
    tabOptions,
    deckTabOptions,
    currentTab,
    urlParams,
  };
}
