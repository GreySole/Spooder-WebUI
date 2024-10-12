import { useSelector } from 'react-redux';
import { ToastType } from '../../ui/Types';
import { _showToast } from '../slice/toastSlice';
import { IRootState } from '../store';

export default function useToast() {
  const toastText = useSelector((state: IRootState) => state.toastSlice.text);
  const toastType = useSelector((state: IRootState) => state.toastSlice.type);
  const toastOpen = useSelector((state: IRootState) => state.toastSlice.toastOpen);
  function showToast(text: string, type: ToastType, duration?: number) {
    if (!duration) {
      duration = 3000;
    }
    _showToast({ text, type, duration });
  }

  return {
    showToast,
    toastOpen,
    toastText,
    toastType,
  };
}
