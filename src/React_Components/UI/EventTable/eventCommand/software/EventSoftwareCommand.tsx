import { useFormContext } from 'react-hook-form';
import { buildCommandKey, buildKey } from '../../FormKeys';
import useConfig from '../../../../../app/hooks/useConfig';
import { EventCommandProps } from '../../../../Types';
import FormTextInput from '../../../common/input/form/FormTextInput';
import FormSelectDropdown from '../../../common/input/form/FormSelectDropdown';
import FormNumberInput from '../../../common/input/form/FormNumberInput';

function checkCommandConflicts(eventName: string, commandIndex: number) {
  const { getValues } = useFormContext();
  let eventConflicts = [];
  let events = getValues('events');
  let checkAddress = events[eventName].commands[commandIndex].address;
  let checkValue = events[eventName].commands[commandIndex].valueOn;
  for (let e in events) {
    for (let c in events[e].commands) {
      if (e == eventName && c == `${commandIndex}`) {
        continue;
      }
      if (events[e].commands[c].type == 'software') {
        if (events[e].commands[c].address == checkAddress) {
          if (isNaN(checkValue) && isNaN(events[e].commands[c].valueOn)) {
            if (checkValue.includes(',')) {
              if (events[e].commands[c].valueOn.includes(',')) {
                if (events[e].commands[c].valueOn.split(',')[0] == checkValue.split(',')[0]) {
                  eventConflicts.push(e + c);
                }
              }
            } else {
              eventConflicts.push(e + c);
            }
          }
        }
      }
    }
  }

  return eventConflicts;
}

export default function EventSoftwareCommand(props: EventCommandProps) {
  const { eventName, commandIndex } = props;
  const { watch, register } = useFormContext();

  const { getUdpClients } = useConfig();
  const {
    data: udpClients,
    isLoading: udpClientsLoading,
    error: udpClientsError,
  } = getUdpClients();
  if (udpClientsLoading) {
    return null;
  }

  const formKey = buildCommandKey(eventName, commandIndex);

  const addressFormKey = buildKey(formKey, 'address');
  const destUdpFormKey = buildKey(formKey, 'dest_udp');
  const valueOffFormKey = buildKey(formKey, 'valueOff');
  const valueOnFormKey = buildKey(formKey, 'valueOn');
  const eventTypeFormKey = buildKey(formKey, 'etype');
  const delayFormKey = buildKey(formKey, 'delay');
  const priorityFormKey = buildKey(formKey, 'priority');
  const durationFormKey = buildKey(formKey, 'duration');
  const duration = watch(durationFormKey, 0);

  const commandConflicts = checkCommandConflicts(eventName, commandIndex);
  const typeLabel =
    commandConflicts.length > 0 ? (
      <div className='type-label-conflicts'>
        <label>
          {commandConflicts.length +
            ' event' +
            (commandConflicts.length == 1 ? '' : 's') +
            " share this address. Use 'priority' to handle the overlap"}
        </label>
        <label>Conflicts: {commandConflicts.join(', ')}</label>
      </div>
    ) : null;

  const udpHostOptions = Object.keys(udpClients).map((udpKey) => ({
    label: udpClients[udpKey].name,
    value: udpKey,
  }));

  return (
    <div className='command-props software'>
      <FormTextInput label='Address:' formKey={addressFormKey} />
      <FormSelectDropdown
        label='UDP:'
        formKey={destUdpFormKey}
        options={[{ label: 'None', value: '-1' }, { label: 'All', value: '-2' }, ...udpHostOptions]}
      />
      <FormTextInput label='Value On:' formKey={valueOnFormKey} />
      <FormTextInput label='Value Off:' formKey={valueOffFormKey} />
      <FormSelectDropdown
        label='Event Type:'
        formKey={eventTypeFormKey}
        options={[
          { label: 'Timed', value: 'timed' },
          { label: 'Button Press', value: 'button-press' },
          { label: 'One Shot', value: 'oneshot' },
        ]}
      />
      {duration}
      <FormNumberInput label='Delay (Milliseconds):' formKey={delayFormKey} />
      <FormNumberInput label='Priority:' formKey={priorityFormKey} />
    </div>
  );
}
