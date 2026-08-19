import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Box, Button } from '@spooder/webui-component-library';
import React, { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import useEvents from '../../../app/hooks/useEvents';

export default function EventSaveButton() {
  const { getValues, formState } = useFormContext();
  const { getSaveEvents } = useEvents();
  const { saveEvents, isLoading } = getSaveEvents();
  const { getEvents } = useEvents();
  const { refetch } = getEvents();

  const saveEventsClick = () => {
    // Form root already mirrors the /save_event_graphs body: { graphs, groups, disabledGroups }.
    saveEvents(
      getValues(),
      'Events saved successfully!',
      'An error occurred while saving the events.',
    ).then((response) => {
      refetch();
    });
  };

  // What Ctrl+S runs, kept in a ref rather than closed over by the listener: getSaveEvents()
  // builds its mutation hook inline, so `saveEvents` is a new function every render and binding
  // it directly would tear down and re-register the listener each time.
  const shortcutSave = useRef(() => {});
  shortcutSave.current = () => {
    // Nothing to save, or a save already in flight - the second guard matters because the
    // shortcut is far easier to fire twice in a row than the button is.
    if (!formState.isDirty || isLoading) {
      return;
    }
    saveEventsClick();
  };

  // This component is only mounted while the event modal is open (MultiPageModal renders no
  // header when closed), so the shortcut is scoped to the editor without needing to test for it.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Compared on `key` rather than `code` so it stays the S key on a non-QWERTY layout.
      // `repeat` filters a held-down chord, which would otherwise post a save per key repeat.
      if (e.key.toLowerCase() !== 's' || !(e.ctrlKey || e.metaKey) || e.altKey || e.repeat) {
        return;
      }
      // Suppressed whether or not there's anything to save: inside the editor this chord means
      // "save the event", and the browser's Save Page dialog is never the intent.
      e.preventDefault();
      shortcutSave.current();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  if (!formState.isDirty) {
    return null;
  }

  return (
    <Box>
      <Button
        label='Save'
        icon={faSave}
        iconSize='large'
        onClick={saveEventsClick}
        tooltipText='Save (Ctrl+S)'
        className='save-button'
      />
    </Box>
  );
}
