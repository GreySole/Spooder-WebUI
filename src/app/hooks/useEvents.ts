import { FieldValues, useFormContext } from 'react-hook-form';
import {
  useGetChatCommandsQuery,
  useGetEventsQuery,
  useSaveEventsMutation,
  useVerifyResponseScriptMutation,
} from '../api/eventSlice';
import { useToast, ToastType } from '@spooder/webui-component-library';

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

  const { showError, showSuccess } = useToast();

  function getEvents() {
    const { data, isLoading, error, refetch } = useGetEventsQuery(null);
    return {
      events: data?.events,
      groups: data?.groups,
      isLoading,
      error,
      refetch,
    };
  }

  function getChatCommands() {
    const { data, isLoading, error } = useGetChatCommandsQuery(null);
    return {
      data,
      isLoading,
      error,
    };
  }

  function getSaveEvents() {
    const [saveEventsMutation, { isLoading, isSuccess, error }] = useSaveEventsMutation();
    function saveEvents(form: FieldValues, successText: string, errorText: string) {
      return saveEventsMutation(form).then((response) => {
        if (response.error) {
          showError(errorText);
        } else {
          showSuccess(successText);
        }
      });
    }

    return { saveEvents, isLoading, isSuccess, error };
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

  function getVerifyResponseScript() {
    const [verifyResponseScriptMutation, { isLoading, isSuccess, error }] =
      useVerifyResponseScriptMutation();

    function verifyResponseScript(command: string, inputMessage: string, script: string) {
      const response = verifyResponseScriptMutation({
        command,
        message: inputMessage,
        script,
      });
      return response;
    }

    return { verifyResponseScript, isLoading, isSuccess, error };
  }

  return {
    getEvents,
    getChatCommands,
    getSaveEvents,
    getVerifyResponseScript,
  };
}
