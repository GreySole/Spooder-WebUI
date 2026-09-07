import { useDispatch, useSelector } from 'react-redux';
import {
  _setNavigation,
  _setRememberLastTab,
  _setTab,
  _toggleNavigation,
} from '../slice/navigationSlice';
import { IRootState } from '../store';

export default function useNavigation() {
  const dispatch = useDispatch();
  const currentTab = useSelector((state: IRootState) => state.navigationSlice.currentTab);
  const currentFolder = useSelector((state: IRootState) => state.navigationSlice.currentFolder);
  const tabOptions = useSelector((state: IRootState) => state.navigationSlice.tabOptions);
  const deckTabOptions = useSelector((state: IRootState) => state.navigationSlice.deckTabOptions);
  const navigationOpen = useSelector((state: IRootState) => state.navigationSlice.navigationOpen);
  const rememberLastTab = useSelector((state: IRootState) => state.navigationSlice.rememberLastTab);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  function setTab(tabName: string, folderName?: string) {
    if (rememberLastTab) {
      localStorage.setItem('lastTab', tabName);
    }
    dispatch(_setTab({ tab: tabName, folder: folderName }));
  }

  function toggleNavigation() {
    dispatch(_toggleNavigation());
  }

  function setNavigation(isOpen: boolean) {
    dispatch(_setNavigation({ isOpen }));
  }

  function setRememberLastTab(isRemembering: boolean) {
    console.log('setRememberLastTab', isRemembering);
    if (isRemembering) {
      localStorage.setItem('lastTab', currentTab);
    } else {
      localStorage.removeItem('lastTab');
    }
    dispatch(_setRememberLastTab({ isRemembering }));
  }

  return {
    navigationOpen,
    setTab,
    toggleNavigation,
    setNavigation,
    tabOptions,
    deckTabOptions,
    currentTab,
    currentFolder,
    urlParams,
    rememberLastTab,
    setRememberLastTab,
  };
}
