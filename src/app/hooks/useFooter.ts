import { useSelector } from 'react-redux';
import { _setReset, _setSave, _unsetReset, _unsetSave } from '../slice/footerSlice';

export default function useFooter() {
  function setSave(saveFunction: Function) {
    _setSave({ saveFunction });
  }

  function setReset(resetFunction: Function) {
    _setReset({ resetFunction });
  }

  function unsetSave() {
    _unsetSave();
  }

  function unsetReset() {
    _unsetReset();
  }

  const saveFunction = useSelector((state: any) => state.footerSlice.save);
  const resetFunction = useSelector((state: any) => state.footerSlice.reset);

  const showFooter = useSelector((state: any) => state.footerSlice.showFooter);

  return { setSave, setReset, unsetSave, unsetReset, saveFunction, resetFunction, showFooter };
}
