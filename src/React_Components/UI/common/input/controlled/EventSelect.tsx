import useEvents from '../../../../../app/hooks/useEvents';
import SelectDropdown from './SelectDropdown';

interface EventSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function EventSelect(props: EventSelectProps) {
  const { label, value, onChange } = props;
  const { getEvents } = useEvents();
  const { events, isLoading, error } = getEvents();
  const eventOptions = [{ label: 'None', value: '' }];

  if (isLoading || error) {
    return null;
  }

  for (let e in events) {
    eventOptions.push({
      label: events[e],
      value: e,
    });
  }

  return (
    <SelectDropdown
      label={label}
      options={eventOptions}
      value={value}
      onChange={(dropDownValue) => onChange(dropDownValue)}
    />
  );
}
