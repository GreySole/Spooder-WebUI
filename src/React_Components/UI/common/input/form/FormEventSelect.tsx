import useEvents from '../../../../../app/hooks/useEvents';
import FormSelectDropdown from './FormSelectDropdown';

interface FormEventSelectProps {
  formKey: string;
  label?: string;
}

export default function FormEventSelect(props: FormEventSelectProps) {
  const { formKey, label } = props;
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

  return <FormSelectDropdown formKey={formKey} label={label} options={eventOptions} />;
}
