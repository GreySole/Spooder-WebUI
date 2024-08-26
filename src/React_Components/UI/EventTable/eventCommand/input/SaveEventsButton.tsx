import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { HotkeysProvider, useHotkeys } from "../../../../../app/hooks/useHotkeys";
import useEvents from "../../../../../app/hooks/useEvents";

export default function SaveEventsButton() {
    const { getValues } = useFormContext();
    const { saveEvents } = useEvents();

    return (
        <HotkeysProvider save={()=>saveEvents(getValues())}>
            <div className='save-commands'>
            <button
                type='button'
                id='saveCommandsButton'
                className='save-button'
                onClick={() => saveEvents(getValues())}
            >
                Save
            </button>
            <div id='saveStatusText' className='save-status'></div>
        </div>
        </HotkeysProvider>
        
    )
}