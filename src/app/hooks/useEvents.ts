import { FieldValues, useFormContext } from 'react-hook-form';
import { useGetEventsQuery, useSaveEventsMutation } from '../api/eventSlice';
import { buildEventKey, buildKey } from '../../React_Components/UI/EventTable/FormKeys';
import { EVENTS } from 'react-hook-form/dist/constants';
import useToast from './useToast';
import { ToastType } from '../../React_Components/Types';

interface Event {
  name: string;
  description: string;
  group: string;
  cooldown: number;
  chatnoficiation: boolean;
  cooldownnotification: boolean;
  triggers: any;
  commands: any;
}

export default function useEvents() {
  const eventStructure: any = {
    name: '',
    description: '',
    group: 'Default',
    cooldown: 60,
    chatnotification: false,
    cooldownnotification: false,
    triggers: {
      chat: {
        enabled: false,
        search: false,
        command: '',
        vip: false,
        mod: false,
        sub: false,
        broadcaster: false,
      },
      twitch: {
        enabled: false,
        type: 'redeem',
        reward: {
          reward: '',
          override: false,
        },
      },
      osc: {
        enabled: false,
        handle: 'trigger',
        address: '/',
        type: 'single',
        condition: '==',
        value: '0',
        condition2: '==',
        value2: '0',
      },
    },
    commands: {
      response: {
        message: '',
        delay: 0,
      },
      plugin: {
        pluginname: '',
        eventname: '',
        stop_eventname: '',
        etype: 'oneshot',
        duration: 60,
        delay: 0,
      },
      software: {
        type: 'software',
        etype: 'timed',
        dest_udp: '-1',
        address: '',
        valueOn: '1',
        valueOff: '0',
        duration: 60,
        delay: 0,
        priority: 0,
      },
      obs: {
        type: 'obs',
        function: 'setinputmute',
        etype: 'timed',
        scene: '',
        item: '',
        valueOn: 1,
        valueOff: 0,
        itemOn: '',
        itemOff: '',
        duration: 60,
        delay: 0,
      },
      mod: {
        type: 'mod',
        function: 'lock',
        targettype: 'event',
        target: '',
        etype: 'toggle',
        duration: 60,
        delay: 0,
      },
    },
  };

  const {showToast} = useToast();

  function getEvents() {
    const { data, isLoading, error } = useGetEventsQuery(null);
    return {
      events: data?.events,
      groups: data?.groups,
      isLoading,
      error,
    };
  }

  function saveEvents(form: FieldValues) {
    const [saveEvents, { isLoading, isSuccess, error }] = useSaveEventsMutation();
    const formData = new FormData();
    for (const [key, value] of Object.entries(form)) {
      formData.append(key, value);
    }

    saveEvents(form).then((response) => {
      showToast("Events Saved!", ToastType.SAVE);
    })

    return { isLoading, isSuccess, error };
  }

  function fixEventForm(rawData: any) {
    let commandData = Object.assign({}, rawData);
    if (commandData.events != null) {
      //Auto-fix/upgrade events to current structure
      for (let e in commandData.events) {
        if (commandData.events[e].triggers['redemption'] != null) {
          commandData.events[e].triggers.twitch = Object.assign(
            {},
            {
              enabled: commandData.events[e].triggers.redemption.enabled,
              type: 'redeem',
              reward: Object.assign(
                {},
                {
                  id: commandData.events[e].triggers.redemption.id,
                  override: commandData.events[e].triggers.redemption.override,
                },
              ),
            },
          );
          delete commandData.events[e].triggers.redemption;
        }
        for (let ev in eventStructure) {
          if (ev == 'triggers') {
            for (let t in eventStructure[ev]) {
              if (commandData.events[e][ev][t] == null) {
                commandData.events[e][ev][t] = eventStructure[ev][t];
              } else {
                for (let tt in eventStructure[ev][t]) {
                  if (commandData.events[e][ev][t][tt] == null) {
                    commandData.events[e][ev][t][tt] = eventStructure[ev][t][tt];
                  }
                }
              }
            }
          } else if (ev == 'commands') {
            for (let c in commandData.events[e][ev]) {
              for (let co in eventStructure[ev][commandData.events[e][ev][c].type]) {
                if (commandData.events[e][ev][c][co] == null) {
                  commandData.events[e][ev][c][co] =
                    eventStructure[ev][commandData.events[e][ev][c].type][co];
                }
              }
            }
          } else {
            if (commandData.events[e][ev] == null) {
              commandData.events[e][ev] = eventStructure[ev];
            }
          }
        }
      }

      if (commandData.groups == null) {
        commandData.groups = ['Default'];
      }
    }
    return commandData;
  }

  async function verifyResponseScript(eventName: string, script: string, inputMessage: string) {
    const { getValues } = useFormContext();
    const eventData = getValues(buildEventKey(eventName));

    //Usually event.username is the uncapitalized version of a username.
    //Spooder replaces this with the capitalized version in runCommands()
    let testEvent = {
      timestamp: '2022-05-05T17:06:31.505Z',
      command: 'PRIVMSG',
      event: 'PRIVMSG',
      channel: '#testchannel',
      username: 'testchannel',
      displayName: 'TestChannel',
      message: inputMessage,
      tags: {
        badgeInfo: 'subscriber/1',
        badges: { broadcaster: true, subscriber: 0 },
        clientNonce: '00000000000000000000000000000000',
        color: '#1E90FF',
        displayName: 'TestChannel',
        emotes: [],
        firstMsg: '0',
        flags: '',
        id: '00000000-0000-0000-0000-000000000000',
        mod: '0',
        roomId: '000000000',
        subscriber: '1',
        tmiSentTs: '0000000000000',
        turbo: '0',
        userId: '000000000',
        userType: '',
        bits: undefined,
        emoteSets: [],
        username: 'testchannel',
        isModerator: false,
      },
    };

    try {
      let response = await fetch('/verifyResponseScript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          eventName: eventName,
          event: eventData,
          message: testEvent,
          script: script,
        }),
      }).then((response) => response.json());
      if (response.status == 'ok') {
        console.log('SCRIPT RAN SUCCESSFULLY:', response);
        return {
          status: 'ok',
          message: response.response,
        };
      } else {
        console.log('SCRIPT FAILED', response.response);
        return {
          status: 'fail',
          message: response.response,
        };
      }
    } catch (e) {
      console.log(e);
    }
  }

  return {
    getEvents,
    saveEvents,
    verifyResponseScript,
  };
}
