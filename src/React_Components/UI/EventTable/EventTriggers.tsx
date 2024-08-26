import { faCommentDots, faAward, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormBoolSwitch from '../common/input/form/FormBoolSwitch';
import useTwitch from '../../../app/hooks/useTwitch';
import { useFormContext } from 'react-hook-form';
import { buildTriggerKey } from './FormKeys';

interface EventTriggersProps {
  eventName: string;
}

export default function EventTriggers(props: EventTriggersProps) {
  const { eventName } = props;
  const { watch } = useFormContext();

  let triggerElement = <div className='command-props triggers'></div>;

  return triggerElement;
}
