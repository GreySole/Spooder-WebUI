import { useFormContext } from 'react-hook-form';
import { EVENT_KEY, GROUP_KEY } from '../../FormKeys';

interface DeleteGroupButtonProps {
  groupName: string;
}

export default function DeleteGroupButton(props: DeleteGroupButtonProps) {
  const { groupName } = props;
  function deleteGroup(groupName: string) {
    const { setValue, getValues } = useFormContext();

    if (confirm('All events assigned to this group will be deleted. Is that okay?')) {
      const events = getValues(EVENT_KEY);
      const groups = getValues(GROUP_KEY);
      let newEvents = Object.assign(events);
      let newGroups = Object.assign(groups);
      for (let ev in newEvents) {
        if (newEvents[ev].group == groupName) {
          delete newEvents[ev];
        }
      }
      newGroups.splice(newGroups.indexOf(groupName), 1);
      setValue(EVENT_KEY, newEvents);
      setValue(GROUP_KEY, newGroups);
    }
  }
  return (
    <div className='delete-event-div'>
      <button type='button' className='delete-button' onClick={() => deleteGroup(groupName)}>
        DELETE GROUP
      </button>
    </div>
  );
}
