import { FieldValues, useFormContext } from 'react-hook-form';
import { HotkeysProvider } from '../../../../../app/hooks/useHotkeys';

interface SaveButtonProps {
  saveFunction: (form: FieldValues) => void;
}

export default function SaveButton(props: SaveButtonProps) {
  const { getValues } = useFormContext();
  const { saveFunction } = props;

  return (
    <HotkeysProvider save={() => saveFunction(getValues())}>
      <div className='save-commands'>
        <button type='button' className='save-button' onClick={() => saveFunction(getValues())}>
          Save
        </button>
        <div id='saveStatusText' className='save-status'></div>
      </div>
    </HotkeysProvider>
  );
}
