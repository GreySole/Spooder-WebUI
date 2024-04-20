import React, { createRef } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Timeline, TimelineRow } from '@xzdarcy/react-timeline-editor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faTrash,
	faAward,
	faCommentDots,
	faNetworkWired,
	faCaretDown,
	faCaretUp,
	faMagnifyingGlass,
	faCross,
	faCancel,
	faX,
	faLock,
	faPlug,
	faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import discordIcon from '../../icons/discord.svg';
import obsIcon from '../../icons/obs.svg';
import BoolSwitch from '../UI/BoolSwitch.js';
import LoadingCircle from '../UI/LoadingCircle';

class EventTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			stateLoaded: false,
		};
		if (props.data == null) {
			this.state.events = {};
		} else {
			this.state.events = Object.assign(props.data);
		}

		this.state._obs = {};
		this.state._udpClients = {};
		this.state._plugins = [];
		this.state._searchtext = '';
		this.state._eventexpands = {};
		this.state._zooms = {};
		for (let e in this.state.events) {
			this.state._eventexpands[e] = false;
			this.state._zooms[e] = 1;
		}

		this.handleChange = this.handleChange.bind(this);
		this.addCommand = this.addCommand.bind(this);
		this.addEvent = this.addEvent.bind(this);
		this.enterAddEvent = this.enterAddEvent.bind(this);
		this.enterAddGroup = this.enterAddGroup.bind(this);
		this.addGroup = this.addGroup.bind(this);
		this.saveCommands = this.saveCommands.bind(this);
		this.deleteCommand = this.deleteCommand.bind(this);
		this.deleteEvent = this.deleteEvent.bind(this);
		this.deleteGroup = this.deleteGroup.bind(this);
		this.getCustomRewards = this.getCustomRewards.bind(this);
		this.getOBSChannels = this.getOBSChannels.bind(this);
		this.getDiscordChannels = this.getDiscordChannels.bind(this);
		this.checkEventTaken = this.checkEventTaken.bind(this);
		this.searchText = this.searchText.bind(this);
		this.zoomTimeline = this.zoomTimeline.bind(this);
		this.onUpdateTimeline = this.onUpdateTimeline.bind(this);

		this.arrangeCommands = this.arrangeCommands.bind(this);
		this.checkCommandConflicts = this.checkCommandConflicts.bind(this);

		this.dragItem = createRef();
		this.dragOverItem = createRef();

		this.verifyResponseScript = this.verifyResponseScript.bind(this);
	}

	eventStructure = {
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

	componentDidMount() {
		fetch('/command_table')
			.then(response => response.json())
			.then(data => {
				let commandData = JSON.parse(data.express);

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
										}
									),
								}
							);
							delete commandData.events[e].triggers.redemption;
						}
						for (let ev in this.eventStructure) {
							if (ev == 'triggers') {
								for (let t in this.eventStructure[ev]) {
									if (commandData.events[e][ev][t] == null) {
										commandData.events[e][ev][t] = this.eventStructure[ev][t];
									} else {
										for (let tt in this.eventStructure[ev][t]) {
											if (commandData.events[e][ev][t][tt] == null) {
												commandData.events[e][ev][t][tt] = this.eventStructure[ev][t][tt];
											}
										}
									}
								}
							} else if (ev == 'commands') {
								for (let c in commandData.events[e][ev]) {
									for (let co in this.eventStructure[ev][commandData.events[e][ev][c].type]) {
										if (commandData.events[e][ev][c][co] == null) {
											commandData.events[e][ev][c][co] = this.eventStructure[ev][commandData.events[e][ev][c].type][co];
										}
									}
								}
							} else {
								if (commandData.events[e][ev] == null) {
									commandData.events[e][ev] = this.eventStructure[ev];
								}
							}
						}
					}

					if (commandData.groups == null) {
						commandData.groups = ['Default'];
					}
				}

				window.addEventListener('keydown', this.keyDown);
				this.setState(
					Object.assign(this.state, {
						stateLoaded: true,
						events: commandData.events ?? {},
						groups: commandData.groups ?? [],
						_udpClients: this.props.parentState.udp_clients ?? {},
						_plugins: commandData.plugins ?? {},
					})
				);
				this.getCustomRewards();
				this.getOBSChannels();
				this.getDiscordChannels();
			});
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.keyDown);
	}

	keyDown = e => {
		if (e.ctrlKey == true && e.key == 's') {
			e.preventDefault();
			this.saveCommands();
		}
	};

	zoomTimeline(e) {
		let newZooms = Object.assign({}, this.state._zooms);
		newZooms[e.target.name] = e.target.value;
		this.setState(Object.assign(this.state, { _zooms: newZooms }));
	}

	handleChange(e) {
		let eventName = e.target.closest('.command-element').id;
		let isCommand = e.target.closest('.command-fields') != null;
		let isTrigger = e.target.closest('.command-props.triggers') != null;

		let newState = Object.assign(this.state.events);
		let varname = e.target.name;
		let varVal = e.target.type == 'checkbox' ? e.target.checked : e.target.value;
		if (isCommand) {
			let commandIndex = e.target.closest('.command-fields').getAttribute('commandindex');
			if (e.target.type == 'checkbox') {
				newState[eventName].commands[commandIndex][varname] = e.target.checked;
			} else {
				newState[eventName].commands[commandIndex][varname] = e.target.value;
			}
		} else if (isTrigger) {
			let triggerType = e.target.closest('[triggertype]').getAttribute('triggertype');
			if (newState[eventName].triggers[triggerType] == null) {
				newState[eventName].triggers[triggerType] = {};
			}

			if (varname.includes('-')) {
				let splitVarname = varname.split('-');
				newState[eventName].triggers[triggerType][splitVarname[0]][splitVarname[1]] = varVal;
			} else {
				newState[eventName].triggers[triggerType][varname] = varVal;
			}
		} else {
			if (varname.includes('-')) {
				let splitVarname = varname.split('-');
				if (splitVarname.length == 2) {
					newState[eventName][splitVarname[0]][splitVarname[1]] = varVal;
				} else if (splitVarname.length == 3) {
					newState[eventName][splitVarname[0]][splitVarname[1]][splitVarname[2]] = varVal;
				}
			} else {
				newState[eventName][varname] = varVal;
			}
		}

		this.setState(Object.assign(this.state, { events: newState }));
	}

	enterAddGroup(e) {
		if (e.key == 'Enter') {
			this.addGroup(e);
		}
	}

	addGroup(e) {
		let newGroup = e.target.closest('.add-command-actions').querySelector("[name='groupname']").value;
		if (this.state.groups.includes(newGroup)) {
			return;
		}

		let newGroups = Object.assign(this.state.groups);
		newGroups.push(newGroup);
		this.setState(Object.assign(this.state, { groups: newGroups }));
	}

	enterAddEvent(e) {
		if (e.key == 'Enter') {
			this.addEvent(e);
		}
	}

	addEvent(e) {
		let newKey = e.currentTarget.parentElement.querySelector('#eventkey').value;
		if (this.state.events[newKey] != null) {
			return;
		}
		let eventGroup = e.currentTarget.getAttribute('groupname');

		let newEvent = {
			name: newKey,
			description: '',
			group: eventGroup,
			cooldown: 0,
			chatnotification: false,
			cooldownnotification: false,
			triggers: {
				chat: { enabled: true, command: '!' + newKey },
				twitch: { enabled: false, type: 'redeem', reward: { id: '', override: false } },
				osc: { enabled: false, address: '/', type: 'single', condition: '==', value: 0, condition2: '==', value2: 0 },
			},
			commands: [],
		};

		let newState = Object.assign(this.state.events);
		newState[newKey] = newEvent;
		this.setState(Object.assign(this.state, { events: newState }));
	}

	addCommand(e) {
		let eventName = e.target.getAttribute('eventname');
		let commandType = document.querySelector('#' + eventName + " .add-command [name='type']").value;
		let newCommand = {};
		switch (commandType) {
			case 'response':
				newCommand = {
					type: 'response',
					enabled: true,
					search: false,
					command: "return event.username+' has triggered this command!';",
					delay: 0,
				};
				break;
			case 'plugin':
				newCommand = {
					type: 'plugin',
					pluginname: '',
					eventname: '',
					etype: 'oneshot',
					stop_eventname: '',
					duration: 60,
					delay: 0,
				};
				break;
			case 'software':
				newCommand = {
					type: 'software',
					etype: 'timed',
					dest_udp: '-1',
					address: '/',
					valueOn: 1.0,
					valueOff: 0.0,
					duration: 60,
					delay: 0,
					priority: 0,
				};
				break;
			case 'obs':
				newCommand = {
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
				};
				break;
			case 'mod':
				newCommand = {
					type: 'mod',
					function: 'lock',
					targettype: 'event',
					target: '',
					etype: 'toggle',
					duration: 60,
					delay: 0,
				};
				break;
		}

		let newState = Object.assign(this.state.events);
		if (newState[eventName].commands == null) {
			newState[eventName].commands = [];
		}
		newState[eventName].commands.push(newCommand);
		this.setState(Object.assign(this.state, { events: newState }));
	}

	saveCommands() {
		let newEvents = Object.assign(this.state.events);
		for (let c in newEvents) {
			for (let n in newEvents[c]) {
				if (!isNaN(newEvents[c][n]) && typeof newEvents[c][n] != 'boolean') {
					newEvents[c][n] = parseFloat(newEvents[c][n]);
				}
			}
		}

		let newList = {
			events: newEvents,
			groups: this.state.groups,
		};

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			body: JSON.stringify(newList),
		};
		fetch('/saveCommandList', requestOptions)
			.then(response => response.json())
			.then(data => {
				if (data.status == 'SAVE SUCCESS') {
					this.props.setToast('COMMANDS SAVED!', 'save');
					document.querySelector('#saveStatusText').textContent = 'Commands are saved!';
					setTimeout(() => {
						document.querySelector('#saveStatusText').textContent = '';
					}, 5000);
				} else {
					document.querySelector('#saveStatusText').textContent = 'Error: ' + data.status;
				}
			});
	}

	deleteCommand(e) {
		let eventName = e.target.closest('.command-element').id;
		let cIndex = e.target.closest('.command-fields').getAttribute('commandindex');
		let newEvents = Object.assign(this.state.events);

		newEvents[eventName].commands.splice(cIndex, 1);

		this.setState(Object.assign(this.state, { events: newEvents }));
	}

	deleteEvent(e) {
		let eventName = e.target.closest('.command-element').id;
		window.setClass(e.target.closest('.command-element'), 'expanded', false);
		window.setClass(e.target.closest('.command-section'), 'hidden', true);

		let newState = Object.assign(this.state.events);
		delete newState[eventName];

		this.setState(Object.assign(this.state, { events: newState }));
	}

	deleteGroup(groupName) {
		if (confirm('All events assigned to this group will be deleted. Is that okay?')) {
			let newEvents = Object.assign(this.state.events);
			let newGroups = Object.assign(this.state.groups);
			for (let ev in newEvents) {
				if (newEvents[ev].group == groupName) {
					delete newEvents[ev];
				}
			}
			newGroups.splice(newGroups.indexOf(groupName), 1);
			this.setState(Object.assign(this.state, { groups: newGroups, events: newEvents }));
		}
	}

	toggleProps(eventkey) {
		let newExpands = Object.assign({}, this.state._eventexpands);
		newExpands[eventkey] = !newExpands[eventkey];
		this.setState(Object.assign(this.state, { _eventexpands: newExpands }));
	}

	toggleGroup(e) {
		let element = e.currentTarget.closest('.command-group').querySelector('.command-group-content');
		window.toggleClass(element, 'hidden');
		window.toggleClass(e.currentTarget.closest('.command-group'), 'expanded');
	}

	sortList() {
		var list, i, switching, b, shouldSwitch;
		list = document.getElementById('id01');
		switching = true;
		/* Make a loop that will continue until
	  no switching has been done: */
		while (switching) {
			// Start by saying: no switching is done:
			switching = false;
			b = list.getElementsByTagName('LI');
			// Loop through all list items:
			for (i = 0; i < b.length - 1; i++) {
				// Start by saying there should be no switching:
				shouldSwitch = false;
				/* Check if the next item should
		  switch place with the current item: */
				if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
					/* If next item is alphabetically lower than current item,
			mark as a switch and break the loop: */
					shouldSwitch = true;
					break;
				}
			}
			if (shouldSwitch) {
				/* If a switch has been marked, make the switch
		  and mark the switch as done: */
				b[i].parentNode.insertBefore(b[i + 1], b[i]);
				switching = true;
			}
		}
	}

	async verifyResponseScript(e) {
		e.preventDefault();
		let parentEl = e.target.closest('.command-props');
		let responseEl = parentEl.querySelector("[name='message']");
		let outputEl = parentEl.querySelector('.response-code-output');
		let inputEl = parentEl.querySelector('.response-code-input');
		let inputMessage = inputEl.value == '' ? 'TestMessage' : inputEl.value;
		let responseScript = responseEl.value;
		let eventData = this.state.events[e.currentTarget.getAttribute('eventname')];

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
					eventName: e.currentTarget.getAttribute('eventname'),
					event: eventData,
					message: testEvent,
					script: responseScript,
				}),
			}).then(response => response.json());
			if (response.status == 'ok') {
				console.log('SCRIPT RAN SUCCESSFULLY:', response);
				outputEl.textContent = response.response;
				window.setClass(outputEl, 'verified', true);
				window.setClass(outputEl, 'failed', false);
			} else {
				console.log('SCRIPT FAILED', response.response);
				outputEl.textContent = response.response;
				window.setClass(outputEl, 'verified', false);
				window.setClass(outputEl, 'failed', true);
			}
		} catch (e) {
			console.log(e);
		}
	}

	searchText(e) {
		this.setState(Object.assign(this.state, { _searchtext: e.target.value }));
	}

	checkEventTaken(e) {
		e.target.value = e.target.value.replace(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, '').replace(' ', '_');
		if (Object.keys(this.state.events).includes(e.target.value)) {
			window.setClass(e.target, 'error', true);
		} else {
			window.setClass(e.target, 'error', false);
		}
	}

	checkCommandConflicts(eventName, commandIndex) {
		let eventConflicts = [];
		let events = this.state.events;
		let checkAddress = events[eventName].commands[commandIndex].address;
		let checkValue = events[eventName].commands[commandIndex].valueOn;
		for (let e in events) {
			for (let c in events[e].commands) {
				if (e == eventName && c == commandIndex) {
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

	async getCustomRewards() {
		let rewardsRaw = await fetch('/twitch/get_channelpoint_rewards').then(response => response.json());

		if (rewardsRaw.message == 'OAuth token is missing') {
			console.log(
				"You need to set a broadcaster oauth token to get custom rewards. \
			If you're logged into chat with a bot account, you will need to log out of Twitch.tv and log in as your broadcaster.\
			Authorize the broadcaster account here. Then go to the Config tab and click 'Save Oauth to Broadcaster.'\
			Log out of Twitch and back in as the bot account. Close Spooder and run again with 'npm run start-noautologin'\
			Then you can authorize your bot account as the main token and keep the broadcaster token on file."
			);
		}

		if (rewardsRaw.data == null) {
			return;
		}

		let rewards = rewardsRaw.data.sort((a, b) => {
			if (a.title.toUpperCase() > b.title.toUpperCase()) {
				return 1;
			} else if (a.title.toUpperCase() < b.title.toUpperCase()) {
				return -1;
			} else {
				return 0;
			}
		});

		let newState = Object.assign(this.state);
		newState._rewards = rewards;
		this.setState(newState);
	}

	getOBSChannels() {
		fetch('/obs/get_scenes')
			.then(response => response.json())
			.then(data => {
				this.setState(Object.assign(this.state, { _obs: data }));
			})
			.catch(e => {
				console.log(e);
			});
	}

	getDiscordChannels() {
		fetch('/discord/get_channels')
			.then(response => response.json())
			.then(data => {
				this.setState(Object.assign(this.state, { _discord: data }));
			})
			.catch(e => {
				console.log(e);
			});
	}

	arrangeCommands(e) {
		let eventName = e.currentTarget.closest('.command-element').id;
		let direction = e.currentTarget.getAttribute('direction');
		let commandIndex = parseInt(e.currentTarget.closest('.command-fields').getAttribute('commandindex'));
		let newEvents = Object.assign(this.state.events);
		if (direction == 'up') {
			if (commandIndex <= 0) {
				return;
			}
			newEvents[eventName].commands[commandIndex] = newEvents[eventName].commands.splice(commandIndex - 1, 1, newEvents[eventName].commands[commandIndex])[0];
		} else {
			if (commandIndex >= newEvents[eventName].commands.length - 1) {
				return;
			}
			newEvents[eventName].commands[commandIndex] = newEvents[eventName].commands.splice(commandIndex + 1, 1, newEvents[eventName].commands[commandIndex])[0];
		}

		this.setState(Object.assign(this.state, { events: newEvents }));
	}

	onUpdateTimeline(frames) {
		let newEvents = Object.assign({}, this.state.events);
		for (let t in frames) {
			newEvents[frames[t].actions[0].eventname].commands[frames[t].actions[0].commandindex].delay = Math.floor(frames[t].actions[0].start * 1000);
			newEvents[frames[t].actions[0].eventname].commands[frames[t].actions[0].commandindex].duration = (
				Math.round((frames[t].actions[0].end - frames[t].actions[0].start) / 0.05) * 0.05
			).toFixed(2);
		}

		this.setState(Object.assign(this.state, { events: newEvents }));
	}

	eventsubs = {
		'channel.update': 'Channel Update',
		'channel.follow': 'Follow',
		'channel.subscribe': 'Subscribe',
		'channel.subscription.end': 'Subscription End',
		'channel.subscription.gift': 'Subscription Gift',
		'channel.subscription.message': 'Subscription Message',
		'channel.cheer': 'Cheer',
		'channel.raid': 'Raid',
		'channel.ban': 'Ban',
		'channel.unban': 'Unban',
		'channel.moderator.add': 'Mod Add',
		'channel.moderator.remove': 'Mod Remove',
		'channel.channel_points_custom_reward.add': 'Channel Points Custom Reward Add',
		'channel.channel_points_custom_reward.update': 'Channel Points Custom Reward Update',
		'channel.channel_points_custom_reward.remove': 'Channel Points Custom Reward Remove',
		'channel.poll.begin': 'Poll Begin',
		'channel.poll.progress': 'Poll Progress',
		'channel.poll.end': 'Poll End',
		'channel.prediction.begin': 'Prediction Begin',
		'channel.prediction.progress': 'Prediction Progress',
		'channel.prediction.lock': 'Prediction Lock',
		'channel.prediction.end': 'Prediction End',
		'channel.charity_campaign.donate': 'Charity Donate',
		'channel.charity_campaign.start': 'Charity Start',
		'channel.charity_campaign.progress': 'Charity Progress',
		'channel.charity_campaign.stop': 'Charity Stop',
		'drop.entitlement.grant': 'Drop Entitlement Grant',
		'extension.bits_transaction.create': 'Extension Bits Transaction Create',
		'channel.goal.begin': 'Goal Begin',
		'channel.goal.progress': 'Goal Progress',
		'channel.goal.end': 'Goal End',
		'channel.hype_train.begin': 'Hype Train Begin',
		'channel.hype_train.progress': 'Hype Train Progress',
		'channel.hype_train.end': 'Hype Train End',
		'channel.shield_mode.begin': 'Shield Mode Begin',
		'channel.shield_mode.end': 'Shield Mode End',
		'channel.shoutout.create': 'Shoutout Create',
		'channel.shoutout.receive': 'Shoutout Receive',
		'stream.online': 'Stream Online',
		'stream.offline': 'Stream Offline',
		'user.authorization.grant': 'User Authorization Grant',
		'user.authorization.revoke': 'User Authorization Revoke',
		'user.update': 'User Update',
	};

	render() {
		if (this.state.stateLoaded == false) {
			return <LoadingCircle></LoadingCircle>;
		}

		let udpHostOptions = [];
		if (this.state._udpClients != null) {
			if (Object.keys(this.state._udpClients).length > 0) {
				for (let u in this.state._udpClients) {
					udpHostOptions.push(<option value={u}>{this.state._udpClients[u].name}</option>);
				}
			}
		}

		let rewardOptions = [<option value="">Select a reward</option>];
		if (this.state._rewards != null) {
			let rewards = this.state._rewards;
			for (let r in rewards) {
				rewardOptions.push(<option value={rewards[r].id}>{rewards[r].title}</option>);
			}
		}

		let pluginOptions = [];
		if (this.state._plugins != null) {
			let plugins = this.state._plugins;
			let sortedPlugins = Object.values(plugins).sort();
			for (let p in sortedPlugins) {
				pluginOptions.push(<option value={sortedPlugins[p]}>{sortedPlugins[p]}</option>);
			}
		}

		let trashButton = <FontAwesomeIcon icon={faTrash} size="lg" className="delete-button" onClick={this.deleteCommand} />;

		var groups = this.state.groups.sort();
		let groupObjects = [];

		let groupOptions = [];
		for (let g in groups) {
			groupObjects[groups[g]] = [];
			groupOptions.push(<option value={groups[g]}>{groups[g]}</option>);
		}

		let propKeys = Object.keys(this.state.events);
		propKeys.sort((a, b) => {
			return this.state.events[a].name.toUpperCase() > this.state.events[b].name.toUpperCase() ? 1 : -1;
		});

		for (let p in propKeys) {
			let s = propKeys[p];

			let thisEvent = this.state.events;

			let eventName = thisEvent[s].name;

			if (s.startsWith('_')) {
				continue;
			}
			if (this.state._searchtext != '' && !s.startsWith(this.state._searchtext) && !eventName.startsWith(this.state._searchtext)) {
				continue;
			}

			let eventDesc = thisEvent[s].description;

			let groupName = thisEvent[s].group;
			if (groupName == null) {
				groupName = '';
			}

			let eventCooldown = thisEvent[s].cooldown;

			let chatNotification = thisEvent[s].chatnotification;
			let cooldownNotification = thisEvent[s].cooldownnotification;

			let eventTriggers = thisEvent[s].triggers;

			let triggerIcons = [];
			if (eventTriggers.chat.enabled) {
				triggerIcons.push(<FontAwesomeIcon icon={faCommentDots} />);
			}

			if (eventTriggers.twitch.enabled) {
				triggerIcons.push(<FontAwesomeIcon icon={faAward} />);
			}

			if (eventTriggers.osc?.enabled) {
				triggerIcons.push(<FontAwesomeIcon icon={faNetworkWired} />);
			}

			if (!this.state._eventexpands[s]) {
				let eventElement = (
					<div className={'command-element ' + (this.state._eventexpands[s] == true ? 'expanded' : '')} key={s} id={s}>
						<div className={'command-key ' + (this.state._eventexpands[s] == true ? 'expanded' : '')} onClick={() => this.toggleProps(s)}>
							<label key={`label-${s}`}>
								<h1>
									{eventName}
									{triggerIcons}
								</h1>
							</label>
						</div>
					</div>
				);
				groupObjects[groupName].push(eventElement);
				continue;
			}

			let redemptionTrigger = null;
			let redemptionContent = null;
			if (eventTriggers.twitch.enabled == true) {
				if (eventTriggers.twitch.type == 'redeem' && this.state._rewards != null) {
					redemptionContent = (
						<label triggertype="twitch" className="event-trigger">
							<label>
								Reward:
								<select name="reward-id" value={eventTriggers.twitch.reward.id} onChange={this.handleChange}>
									{rewardOptions}
								</select>
							</label>
							<label className="label-switch">
								Override Approval (Refundable):
								<BoolSwitch name="reward-override" checked={eventTriggers.twitch.reward.override} onChange={this.handleChange} />
							</label>
						</label>
					);
				}
			}

			let eventsubOptions = [];
			for (let e in this.eventsubs) {
				eventsubOptions.push(<option value={e}>{this.eventsubs[e]}</option>);
			}

			let twitchType =
				eventTriggers.twitch.enabled == true ? (
					<label className="label-switch">
						Type:
						<select name="type" defaultValue={eventTriggers.twitch.type} onChange={this.handleChange}>
							<option value="redeem">Channel Point Redeem</option>
							{eventsubOptions}
						</select>
					</label>
				) : null;
			redemptionTrigger = (
				<div triggertype="twitch">
					<label className="label-switch">
						Twitch:
						<BoolSwitch name="enabled" checked={eventTriggers.twitch.enabled} onChange={this.handleChange} />
					</label>
					{twitchType}
					{redemptionContent}
				</div>
			);

			let chatContent =
				eventTriggers.chat.enabled == true ? (
					<label triggertype="chat" className="event-trigger">
						<label className="label-switch">
							Broadcaster Only:
							<BoolSwitch name="broadcaster" checked={eventTriggers.chat.broadcaster} onChange={this.handleChange} />
						</label>
						<label className="label-switch">
							Mod Only:
							<BoolSwitch name="mod" checked={eventTriggers.chat.mod} onChange={this.handleChange} />
						</label>
						<label className="label-switch">
							Subscriber Only:
							<BoolSwitch name="sub" checked={eventTriggers.chat.sub} onChange={this.handleChange} />
						</label>
						<label className="label-switch">
							VIP Only:
							<BoolSwitch name="vip" checked={eventTriggers.chat.vip} onChange={this.handleChange} />
						</label>
						<label className="label-switch">
							Search and Match in Message:
							<BoolSwitch name="search" checked={eventTriggers.chat.search} onChange={this.handleChange} />
						</label>
						<label>
							Command:
							<input type="text" name="command" value={eventTriggers.chat.command} onChange={this.handleChange} />
						</label>
					</label>
				) : null;
			let chatTrigger = (
				<div triggertype="chat">
					<label className="label-switch">
						Chat:
						<BoolSwitch name="enabled" checked={eventTriggers.chat.enabled} onChange={this.handleChange} />
					</label>
					{chatContent}
				</div>
			);

			let oscTrigger = null;
			let oscContent = null;

			if (eventTriggers.osc?.handletype == 'search' && eventTriggers.osc?.enabled == true) {
				oscContent = (
					<label triggertype="osc" className="event-trigger">
						<label>
							Handle:
							<select name="handletype" value={eventTriggers.osc?.handletype} onChange={this.handleChange}>
								<option value="trigger">Trigger</option>
								<option value="toggle">Toggle</option>
								<option value="search">Search String</option>
							</select>
						</label>
						<label>
							Address:
							<input type="text" name="address" value={eventTriggers.osc?.address} onChange={this.handleChange} />
						</label>
						<label>
							Value:
							<input type="text" name="value" value={eventTriggers.osc?.value} onChange={this.handleChange} />
						</label>
					</label>
				);
			} else if (eventTriggers.osc?.type == 'double' && eventTriggers.osc?.enabled == true) {
				oscContent = (
					<label triggertype="osc" className="event-trigger">
						<label>
							Handle:
							<select name="handletype" value={eventTriggers.osc?.handletype} onChange={this.handleChange}>
								<option value="trigger">Trigger</option>
								<option value="toggle">Toggle</option>
								<option value="search">Search String</option>
							</select>
						</label>
						<label>
							Address:
							<input type="text" name="address" value={eventTriggers.osc?.address} onChange={this.handleChange} />
						</label>
						<label>
							Args:
							<select name="type" value={eventTriggers.osc?.type} onChange={this.handleChange}>
								<option value="single">Single</option>
								<option value="double">Double</option>
							</select>
						</label>
						<label>
							Condition 1:
							<select name="condition" value={eventTriggers.osc?.condition} onChange={this.handleChange}>
								<option value="==">Equals</option>
								<option value="!=">Not Equals</option>
								<option value=">=">Greater than or equal to</option>
								<option value="<=">Less than or equal to</option>
								<option value=">">Greater than</option>
								<option value="<">Less than</option>
							</select>
						</label>
						<label>
							Value 1:
							<input type="number" name="value" value={eventTriggers.osc?.value} onChange={this.handleChange} />
						</label>
						<label>
							Condition 2:
							<select name="condition2" value={eventTriggers.osc?.condition2} onChange={this.handleChange}>
								<option value="==">Equals</option>
								<option value="!=">Not Equals</option>
								<option value=">=">Greater than or equal to</option>
								<option value="<=">Less than or equal to</option>
								<option value=">">Greater than</option>
								<option value="<">Less than</option>
							</select>
						</label>
						<label>
							Value 2:
							<input type="number" name="value2" value={eventTriggers.osc?.value2} onChange={this.handleChange} />
						</label>
					</label>
				);
			} else if (eventTriggers.osc?.type == 'single' && eventTriggers.osc?.enabled == true) {
				oscContent = (
					<label triggertype="osc" className="event-trigger">
						<label>
							Handle:
							<select name="handletype" value={eventTriggers.osc?.handletype} onChange={this.handleChange}>
								<option value="trigger">Trigger</option>
								<option value="toggle">Toggle</option>
								<option value="search">Search String</option>
							</select>
						</label>
						<label>
							Address:
							<input type="text" name="address" value={eventTriggers.osc?.address} onChange={this.handleChange} />
						</label>
						<label>
							Args:
							<select name="type" value={eventTriggers.osc?.type} onChange={this.handleChange}>
								<option value="single">Single</option>
								<option value="double">Double</option>
							</select>
						</label>
						<label>
							Condition:
							<select name="condition" value={eventTriggers.osc?.condition} onChange={this.handleChange}>
								<option value="==">Equals</option>
								<option value="!=">Not Equals</option>
								<option value=">=">Greater than or equal to</option>
								<option value="<=">Less than or equal to</option>
								<option value=">">Greater than</option>
								<option value="<">Less than</option>
							</select>
						</label>
						<label>
							Value:
							<input type="number" name="value" value={eventTriggers.osc?.value} onChange={this.handleChange} />
						</label>
					</label>
				);
			}

			oscTrigger = (
				<div triggertype="osc">
					<label className="label-switch">
						OSC:
						<BoolSwitch name="enabled" checked={eventTriggers.osc?.enabled} onChange={this.handleChange} />
					</label>
					{oscContent}
				</div>
			);

			let triggerElement = (
				<div className="command-props triggers">
					{chatTrigger}
					{redemptionTrigger}
					{oscTrigger}
				</div>
			);

			let eventCommands = thisEvent[s].commands;
			let commandElements = [];
			let timelineData = [];
			let timelineEffectData = {};
			let maxDuration = 1;

			for (let c in eventCommands) {
				if (typeof eventCommands[c].delay == 'string') {
					eventCommands[c].delay = parseInt(eventCommands[c].delay);
				}
				if (typeof eventCommands[c].duration == 'string') {
					eventCommands[c].duration = parseFloat(eventCommands[c].duration);
				}

				maxDuration = Math.max(eventCommands[c].delay / 1000, eventCommands[c].duration);
				if (isNaN(maxDuration)) {
					maxDuration = 1;
				}

				let id = eventCommands[c].type + '-' + c;
				if (eventCommands[c].type == 'software') {
					id = eventCommands[c].address + '-' + eventCommands[c].valueOn + '|' + eventCommands[c].valueOff;
				} else if (eventCommands[c].type == 'obs' || eventCommands[c].type == 'mod') {
					id = eventCommands[c].function;
				}

				let delay = isNaN(eventCommands[c].delay) ? 0 : eventCommands[c].delay;
				let duration = isNaN(eventCommands[c].duration) ? 1 : eventCommands[c].duration;

				timelineData.push({
					id: c,
					actions: [
						{
							id: id,
							start: delay / 1000,
							end: eventCommands[c].etype == 'timed' ? delay / 1000 + duration : delay / 1000 + 1,
							eventname: s,
							eventtype: eventCommands[c].type,
							commandindex: c,
							effectId: eventCommands[c].etype == 'timed' ? 'timed' : 'nottimed',
						},
					],
				});

				timelineEffectData = {
					timed: {
						id: 'timed',
						name: 'Timed',
					},
					nottimed: {
						id: 'nottimed',
						name: 'nottimed',
					},
				};

				let element = null;
				let durationField =
					eventCommands[c].etype == 'timed' ? (
						<label>
							Duration (Seconds):
							<input type="number" name="duration" key={s} value={eventCommands[c].duration} onChange={this.handleChange} />
						</label>
					) : null;
				switch (eventCommands[c].type) {
					case 'response':
						element = (
							<div className="command-props response">
								<label className="response-code-ui field-section">
									<span>
										Message:{' '}
										<FontAwesomeIcon
											icon={faQuestionCircle}
											size="lg"
											onClick={e => window.toggleClass(e.currentTarget.parentElement?.parentElement?.querySelector('.response-cheatsheet'), 'hidden')}
										/>
									</span>
									<div className="response-cheatsheet hidden">
										Variables:
										<ul>
											<li>event:object - Data that triggered the event.</li>
											<li>extra:array - Extra event data (Can be search and match words or booleans for locked events/plugins)</li>
											<li>toUser:string - The second word in a message that's usually a user name.</li>
											<li>command:array - The message split by whitespace for processing arguments</li>
										</ul>
										Functions:
										<ul>
											<li>say(txt:string) - Respond on the platform and channel the message originated from.</li>
											<li>
												getVar(key:string, defaultVal=0:any) - Get a variable from the event storage that matches the key. Returns default value if not
												found.
											</li>
											<li>
												setVar(key:string, value:any, save=true:boolean) - Set a variable in the event storage for later. Save will write the event storage
												to file if true.
											</li>
											<li>getSharedVar(eventname:string, key:string, defaultVal=0:any) - Get a variable from another event's storage space.</li>
											<li>
												setSharedVar(eventname:string, key:string, value:any, save=true:boolean) - Each event has a storage space with their internal name
												as the key. This will set a var within a certain event's storage space. Handy for features with multiple commands
											</li>
											<li>chooseRandom(choices:array) - Returns a random element from the given array.</li>
											<li>sanitize(txt:string) - Removes special characters from a given text</li>
											<li>runEvent(eventName:string) - Run a spooder event. Event data from this event will be passed over.</li>
										</ul>
									</div>
									<CodeEditor
										className="response-code-editor"
										name="message"
										language="js"
										key={s}
										value={eventCommands[c].message}
										onChange={this.handleChange}
										placeholder="return 'Hello '+event.displayName"
									/>
									<input className="response-code-input" type="text" placeholder="Input text" />
									<div className="response-code-output"></div>
									<div className="verify-message">
										<button
											className="verify-message-button save-button"
											eventname={s}
											onKeyDown={(e => {
												if (e.code == 'Enter') {
													this.verifyResponseScript;
												}
											}).bind(this)}
											onClick={this.verifyResponseScript}>
											Verify Script
										</button>
									</div>
								</label>
								<label>
									Delay (Milliseconds):
									<input name="delay" key={s} value={eventCommands[c].delay} type="number" break="anywhere" onChange={this.handleChange} />
								</label>
							</div>
						);
						break;
					case 'plugin':
						let stopEventName =
							eventCommands[c].etype == 'timed' ? (
								<label>
									End Event Name:
									<input type="text" key={s} name="stop_eventname" value={eventCommands[c].stop_eventname} onChange={this.handleChange} />
								</label>
							) : null;
						element = (
							<div className="command-props plugin">
								<label>
									Plugin:
									<select name="pluginname" key={s} value={eventCommands[c].pluginname} onChange={this.handleChange}>
										{pluginOptions}
									</select>
								</label>
								<label>
									Event Type:
									<select name="etype" key={s} value={eventCommands[c].etype} onChange={this.handleChange}>
										<option value="timed">Timed</option>
										<option value="oneshot">One Shot</option>
									</select>
								</label>
								<label>
									Event Name:
									<input type="text" key={s} name="eventname" value={eventCommands[c].eventname} onChange={this.handleChange} />
								</label>
								{stopEventName}
								{durationField}
								<label>
									Delay (Milliseconds):
									<input name="delay" key={s} value={eventCommands[c].delay} type="number" break="anywhere" onChange={this.handleChange} />
								</label>
							</div>
						);
						break;
					case 'software':
						element = (
							<div className="command-props software">
								<label>
									Address:
									<input type="text" name="address" key={s} value={eventCommands[c].address} onChange={this.handleChange} />
								</label>
								<label>
									UDP:
									<select name="dest_udp" key={s} value={eventCommands[c].dest_udp} onChange={this.handleChange}>
										<option value={-1}>None</option>
										<option value={-2}>All</option>
										{udpHostOptions}
									</select>
								</label>
								<label>
									Value On:
									<input type="text" name="valueOn" key={s} value={eventCommands[c].valueOn} onChange={this.handleChange} />
								</label>
								<label>
									Value Off:
									<input type="text" name="valueOff" key={s} value={eventCommands[c].valueOff} onChange={this.handleChange} />
								</label>
								<label>
									Event Type:
									<select name="etype" key={s} value={eventCommands[c].etype} onChange={this.handleChange}>
										<option value="timed">Timed</option>
										<option value="button-press">Button Press</option>
										<option value="oneshot">One Shot</option>
									</select>
								</label>
								{duration}
								<label>
									Delay (Milliseconds):
									<input name="delay" key={s} value={eventCommands[c].delay} type="number" break="anywhere" onChange={this.handleChange} />
								</label>
								<label className="tooltip">
									<span className="tooltiptext">
										This is for overlapping events that use the same address. Higher priority will override the overlapping event.
									</span>
									Priority:
									<input name="priority" key={s} value={eventCommands[c].priority} type="number" break="anywhere" onChange={this.handleChange} />
								</label>
							</div>
						);
						break;
					case 'obs':
						if (Object.keys(this.state._obs).length == 0 || this.state._obs.status == 'notconnected') {
							element = (
								<div className="command-props software">
									<label>OBS not connected. Connect to OBS remote in Deck Mode and refresh. Saving now will not affect any settings in place.</label>
								</div>
							);
							break;
						}
						let oduration =
							eventCommands[c].etype == 'timed' ? (
								<label>
									Duration (Seconds):
									<input type="number" name="duration" key={s} value={eventCommands[c].duration} onChange={this.handleChange} />
								</label>
							) : null;
						let inputItemOptions = [];
						for (let i in this.state._obs.inputs) {
							inputItemOptions.push(<option value={this.state._obs.inputs[i].inputName}>{this.state._obs.inputs[i].inputName}</option>);
						}

						let sceneOptions = [];
						for (let s in this.state._obs.scenes) {
							sceneOptions.push(<option value={this.state._obs.scenes[s].sceneName}>{this.state._obs.scenes[s].sceneName}</option>);
						}

						let sceneItemOptions = [];
						for (let si in this.state._obs.sceneItems[eventCommands[c].scene]?.sceneItems) {
							sceneItemOptions.push(
								<option value={this.state._obs.sceneItems[eventCommands[c].scene].sceneItems[si].sceneItemId}>
									{this.state._obs.sceneItems[eventCommands[c].scene].sceneItems[si].sourceName}
								</option>
							);
						}
						let commandContent = null;
						switch (eventCommands[c].function) {
							case 'setinputmute':
								let valueOff =
									eventCommands[c].etype == 'timed' ? (
										<label>
											Value Off:
											<BoolSwitch key={s} name="valueOff" checked={eventCommands[c].valueOff} onChange={this.handleChange} />
										</label>
									) : null;
								commandContent = (
									<div className="command-content">
										<label>
											Item:
											<select name="item" key={s} value={eventCommands[c].item} onChange={this.handleChange}>
												{inputItemOptions}
											</select>
										</label>
										<label>
											Value On:
											<BoolSwitch key={s} name="valueOn" checked={eventCommands[c].valueOn} onChange={this.handleChange} />
										</label>
										{valueOff}
										<label>
											Event Type:
											<select name="etype" key={s} value={eventCommands[c].etype} onChange={this.handleChange}>
												<option value="timed">Timed</option>
												<option value="oneshot">One Shot</option>
											</select>
										</label>
										{oduration}
										<label>
											Delay (Milliseconds):
											<input name="delay" key={s} value={eventCommands[c].delay} type="number" break="anywhere" onChange={this.handleChange} />
										</label>
									</div>
								);
								break;
							case 'switchscenes':
								let sceneOff =
									eventCommands[c].etype == 'timed' ? (
										<label>
											Scene Off:
											<select name="itemOff" key={s} value={eventCommands[c].itemOff} onChange={this.handleChange}>
												{sceneOptions}
											</select>
										</label>
									) : null;
								commandContent = (
									<div className="command-content">
										<label>
											Scene On:
											<select name="itemOn" key={s} value={eventCommands[c].itemOn} onChange={this.handleChange}>
												{sceneOptions}
											</select>
										</label>
										{sceneOff}
										<label>
											Event Type:
											<select name="etype" key={s} value={eventCommands[c].etype} onChange={this.handleChange}>
												<option value="timed">Timed</option>
												<option value="oneshot">One Shot</option>
											</select>
										</label>
										{oduration}
										<label>
											Delay (Milliseconds):
											<input name="delay" key={s} value={eventCommands[c].delay} type="number" break="anywhere" onChange={this.handleChange} />
										</label>
									</div>
								);
								break;
							case 'enablesceneitem':
								let itemOff =
									eventCommands[c].etype == 'timed' ? (
										<label>
											Value Off:
											<BoolSwitch key={s} name="valueOff" checked={eventCommands[c].valueOff} onChange={this.handleChange} />
										</label>
									) : null;
								commandContent = (
									<div className="command-content">
										<label>
											Scene:
											<select name="scene" key={s} value={eventCommands[c].scene} onChange={this.handleChange}>
												{sceneOptions}
											</select>
										</label>
										<label>
											Item:
											<select name="item" key={s} value={eventCommands[c].item} onChange={this.handleChange}>
												{sceneItemOptions}
											</select>
										</label>
										<label>
											Value On:
											<BoolSwitch key={s} name="valueOn" checked={eventCommands[c].valueOn} onChange={this.handleChange} />
										</label>
										{itemOff}
										<label>
											Event Type:
											<select name="etype" key={s} value={eventCommands[c].etype} onChange={this.handleChange}>
												<option value="timed">Timed</option>
												<option value="oneshot">One Shot</option>
											</select>
										</label>
										{oduration}
										<label>
											Delay (Milliseconds):
											<input name="delay" key={s} value={eventCommands[c].delay} type="number" break="anywhere" onChange={this.handleChange} />
										</label>
									</div>
								);
								break;
						}

						let functionSelect = (
							<select name="function" key={s} value={eventCommands[c].function} onChange={this.handleChange}>
								<option value="setinputmute">Set Input Mute</option>
								<option value="switchscenes">Switch Scenes</option>
								<option value="enablesceneitem">Enable Scene Item</option>
							</select>
						);

						element = (
							<div className="command-props software">
								<label>Function: {functionSelect}</label>
								{commandContent}
							</div>
						);
						break;
					case 'mod':
						let mduration =
							eventCommands[c].etype == 'timed' ? (
								<label>
									Duration (Seconds):
									<input type="number" name="duration" key={s} value={eventCommands[c].duration} onChange={this.handleChange} />
								</label>
							) : null;
						let targetField = null;
						let targetOptions = [<option value="all">All</option>];
						let targetType = null;
						let handleType = null;
						if (eventCommands[c].targettype == 'event') {
							let sortedKeys = Object.keys(this.state.events).sort();

							for (let s in sortedKeys) {
								targetOptions.push(<option value={sortedKeys[s]}>{sortedKeys[s]}</option>);
							}
						} else if (eventCommands[c].targettype == 'plugin') {
							targetOptions = targetOptions.concat(pluginOptions);
						}
						if (eventCommands[c].targettype != 'all') {
							targetField = (
								<label>
									Target:
									<select name="target" key={s} value={eventCommands[c].target} onChange={this.handleChange}>
										{targetOptions}
									</select>
								</label>
							);
						}

						if (eventCommands[c].function != 'commercial') {
							targetType = (
								<label>
									Target Type:
									<select name="targettype" key={s} value={eventCommands[c].targettype} onChange={this.handleChange}>
										<option value="all">Everything</option>
										<option value="event">Event</option>
										<option value="plugin">Plugin</option>
									</select>
								</label>
							);
							handleType = (
								<label>
									Handle Type:
									<select name="etype" key={s} value={eventCommands[c].etype} onChange={this.handleChange}>
										<option value="toggle">Toggle</option>
										<option value="timed">Timed</option>
									</select>
								</label>
							);
						}

						element = (
							<div className="command-props software">
								<h3>Moderation chat commands are already built into Spooder. This is mainly so you can hook an OSC trigger for quick moderation actions.</h3>
								<label>
									Function:
									<select name="function" key={s} value={eventCommands[c].function} onChange={this.handleChange}>
										<option value="lock">Lock/Unlock</option>
										<option value="spamguard">Spam Guard</option>
										<option value="stop">Stop Event</option>
									</select>
								</label>
								{targetType}
								{targetField}
								{handleType}
								{mduration}
								<label>
									Delay (Milliseconds):
									<input name="delay" key={s} value={eventCommands[c].delay} type="number" break="anywhere" onChange={this.handleChange} />
								</label>
							</div>
						);
						break;
				}

				let typeLabel = <div>{eventCommands[c].type}</div>;
				let commandConflicts = null;

				if (eventCommands[c].type == 'software') {
					commandConflicts = this.checkCommandConflicts(s, c);
					if (commandConflicts.length > 0) {
						typeLabel = (
							<div className="type-label-conflicts">
								<label>
									{commandConflicts.length + ' event' + (commandConflicts.length == 1 ? '' : 's') + " share this address. Use 'priority' to handle the overlap"}
								</label>
								<label>Conflicts: {commandConflicts.join(', ')}</label>
							</div>
						);
					}
				}
				let commandArrows = null;
				if (eventCommands.length > 1) {
					if (c == 0) {
						commandArrows = (
							<div className="command-arrows">
								<div className="command-arrow" direction="down" onClick={this.arrangeCommands}>
									<FontAwesomeIcon icon={faCaretDown} size="2x" />
								</div>
							</div>
						);
					} else if (c == eventCommands.length - 1) {
						commandArrows = (
							<div className="command-arrows">
								<div className="command-arrow" direction="up" onClick={this.arrangeCommands}>
									<FontAwesomeIcon icon={faCaretUp} size="2x" />
								</div>
							</div>
						);
					} else {
						commandArrows = (
							<div className="command-arrows">
								<div className="command-arrow" direction="up" onClick={this.arrangeCommands}>
									<FontAwesomeIcon icon={faCaretUp} size="2x" />
								</div>
								<div className="command-arrow" direction="down" onClick={this.arrangeCommands}>
									<FontAwesomeIcon icon={faCaretDown} size="2x" />
								</div>
							</div>
						);
					}
				}

				commandElements.push(
					<div className="command-fields" key={c} commandindex={c}>
						{commandArrows}
						<label>
							{typeLabel}
							{element}
						</label>

						<div className="command-actions">{trashButton}</div>
					</div>
				);
			}

			let specialFields = null;
			if (eventTriggers.twitch.enabled == true && eventTriggers.twitch.type == 'stream.online') {
				let guildOptions = [<option value={''}>Select Guild</option>];
				let channelOptions = [<option value={''}>Select Channel</option>];
				for (let d in this.state._discord) {
					guildOptions.push(<option value={d}>{this.state._discord[d].name}</option>);
				}

				for (let c in this.state._discord[thisEvent[s].special?.discord?.guild]?.channels) {
					channelOptions.push(<option value={c}>{this.state._discord[thisEvent[s].special?.discord?.guild]?.channels[c].name}</option>);
				}

				specialFields = (
					<>
						<div className="config-variable-ui">
							<label className={'toggle-label'} style={{ display: 'flex', 'flex-flow': 'row', alignItems: 'center' }}>
								Send @everyone ping on Discord
								<BoolSwitch
									eventname={thisEvent[s].special?.discord?.enabled}
									name="special-discord-enabled"
									checked={thisEvent[s].special?.discord?.enabled}
									onChange={this.handleChange}
								/>
							</label>
							<div
								key={this.state.keyname + guildOptions.length + channelOptions.length + JSON.stringify(this.state.discord)}
								className={thisEvent[s].special?.discord?.enabled ? '' : 'hidden'}>
								<select
									eventname={thisEvent[s].special?.discord?.guild}
									name="special-discord-guild"
									defaultValue={thisEvent[s].special?.discord?.guild}
									onChange={this.handleChange}>
									{guildOptions}
								</select>
								<select
									eventname={thisEvent[s].special?.discord?.channel}
									name="special-discord-channel"
									defaultValue={thisEvent[s].special?.discord?.channel}
									onChange={this.handleChange}>
									{channelOptions}
								</select>
							</div>
						</div>
						<div className="command-props response">
							<label className="response-code-ui">
								<span>
									Reoccuring Message:{' '}
									<FontAwesomeIcon
										icon={faQuestionCircle}
										size="lg"
										onClick={e => window.toggleClass(e.currentTarget.parentElement?.parentElement?.querySelector('.response-cheatsheet'), 'hidden')}
									/>
								</span>
								<div className="response-cheatsheet hidden">
									Variables:
									<ul>
										<li>event:object - Data that triggered the event.</li>
										<li>extra:array - Extra event data (Can be search and match words or booleans for locked events/plugins)</li>
										<li>toUser:string - The second word in a message that's usually a user name.</li>
										<li>command:array - The message split by whitespace for processing arguments</li>
									</ul>
									Functions:
									<ul>
										<li>say(txt:string) - Respond on the platform and channel the message originated from.</li>
										<li>
											getVar(key:string, defaultVal=0:any) - Get a variable from the event storage that matches the key. Returns default value if not found.
										</li>
										<li>
											setVar(key:string, value:any, save=true:boolean) - Set a variable in the event storage for later. Save will write the event storage to
											file if true.
										</li>
										<li>getSharedVar(eventname:string, key:string, defaultVal=0:any) - Get a variable from another event's storage space.</li>
										<li>
											setSharedVar(eventname:string, key:string, value:any, save=true:boolean) - Each event has a storage space with their internal name as
											the key. This will set a var within a certain event's storage space. Handy for features with multiple commands
										</li>
										<li>chooseRandom(choices:array) - Returns a random element from the given array.</li>
										<li>sanitize(txt:string) - Removes special characters from a given text</li>
										<li>runEvent(eventName:string) - Run a spooder event. Event data from this event will be passed over.</li>
									</ul>
								</div>
								<CodeEditor
									className="response-code-editor"
									name="special-reoccuringmessage-message"
									language="js"
									key={s}
									value={thisEvent[s].special?.reoccuringmessage?.message}
									onChange={this.handleChange}
									placeholder="return 'Hello '+event.displayName"
								/>
								<input className="response-code-input" type="text" placeholder="Input text" />
								<div className="response-code-output"></div>
								<div className="verify-message">
									<button
										className="verify-message-button save-button"
										eventname={s}
										onKeyDown={(e => {
											if (e.code == 'Enter') {
												this.verifyResponseScript;
											}
										}).bind(this)}
										onClick={this.verifyResponseScript}>
										Verify Script
									</button>
								</div>
							</label>
							<label>
								Interval (Seconds):
								<input
									name="special-reoccuringmessage-interval"
									key={s}
									defaultValue={thisEvent[s].special?.reoccuringmessage?.interval}
									type="number"
									break="anywhere"
									onChange={this.handleChange}
								/>
							</label>
						</div>
					</>
				);
			}

			let addElement = (
				<label className="add-command field-section">
					<div className="add-command-fields">
						<label>
							Command Type:
							<select id="addCommandType" name="type">
								<option value={'response'}>Reponse</option>
								<option value={'plugin'}>Plugin</option>
								<option value={'software'}>Software</option>
								<option value={'obs'}>OBS</option>
								<option value={'mod'}>Moderation</option>
							</select>
						</label>
					</div>
					<div className="add-command-actions">
						<button type="button" id="addCommandButton" eventname={s} className="add-button" onClick={this.addCommand}>
							Add
						</button>
					</div>
				</label>
			);

			let timelineZoom = (
				<input
					name={s}
					type="range"
					min={1}
					max={120}
					defaultValue={this.state._zooms[s] == null ? maxDuration : this.state._zooms[s]}
                    className='timeline-zoom-slider'
					//style={{ width: '70%' }}
					onChange={this.zoomTimeline}
				/>
			);
			let eventElement = (
				<div className={'command-element ' + (this.state._eventexpands[s] == true ? 'expanded' : '')} key={s} id={s}>
					<div className={'command-key ' + (this.state._eventexpands[s] == true ? 'expanded' : '')} onClick={() => this.toggleProps(s)}>
						<label>
							<h1>
								{eventName}
								{triggerIcons}
							</h1>
						</label>
					</div>
					<div className={'command-section ' + (this.state._eventexpands[s] == false ? 'hidden' : '')}>
						<label>Internal Name: {s}</label>
						<label>
							Name:
							<input name="name" value={eventName} onChange={this.handleChange} />
						</label>
						<label>
							Description:
							<input name="description" value={eventDesc} onChange={this.handleChange} />
						</label>
						<label>
							Group:
							<select name="group" value={groupName} onChange={this.handleChange}>
								{groupOptions}
							</select>
						</label>
						<label>
							Cooldown (In Seconds):
							<input type="number" name="cooldown" value={eventCooldown} onChange={this.handleChange} />
						</label>
						<label className="label-switch">
							Notify Activation in Chat:
							<BoolSwitch name="chatnotification" checked={chatNotification} onChange={this.handleChange} />
						</label>
						<label className="label-switch">
							Tell How Much Time Left for Cooldown:
							<BoolSwitch name="cooldownnotification" checked={cooldownNotification} onChange={this.handleChange} />
						</label>
						<label className="field-section">
							Trigger:
							{triggerElement}
						</label>
						<label className="field-section">
							Commands:
							<Timeline
								key={s + this.state._zooms[s]}
								// style={{ width: '75%', height: '200px' }}
								editorData={timelineData}
								effects={timelineEffectData}
								onChange={this.onUpdateTimeline}
								autoScroll={true}
								scale={this.state._zooms[s] == null ? maxDuration : this.state._zooms[s]}
								dragLine={true}
								getActionRender={(action, row) => {
									switch (action.eventtype) {
										case 'response':
											return (
												<div className="prompt">
													<FontAwesomeIcon icon={faCommentDots} size={'2x'} />
												</div>
											);
										case 'plugin':
											return (
												<div className="prompt">
													<FontAwesomeIcon icon={faPlug} size={'lg'} />
													<label>{action.id}</label>
												</div>
											);
										case 'mod':
											return (
												<div className="prompt">
													<FontAwesomeIcon icon={faLock} size={'lg'} />
													<label>{action.id}</label>
												</div>
											);
										case 'obs':
											return (
												<div className="prompt">
													<img width={25} height={25} src={obsIcon} />
													<label>{action.id}</label>
												</div>
											);
										case 'discord':
											return (
												<div className="prompt">
													<img width={25} height={25} src={discordIcon} />
													<label>{action.id}</label>
												</div>
											);
										default:
											return (
												<div className="prompt">
													<FontAwesomeIcon icon={faNetworkWired} size={'lg'} />
													<label>{action.id}</label>
												</div>
											);
									}
								}}
							/>
							{timelineZoom}
							{specialFields}
							{commandElements}
							{addElement}
						</label>

						<div className="delete-event-div">
							<button type="button" className="delete-button" onClick={this.deleteEvent}>
								DELETE EVENT
							</button>
						</div>
					</div>
				</div>
			);

			if (groupObjects[groupName] == null) {
				groupObjects[groupName] = [];
			}

			groupObjects[groupName].push(eventElement);
		}

		let groupElements = [];

		let groupKeys = Object.keys(groupObjects).sort();

		let searchEnabled = this.state._searchtext != '';

		for (let go in groupKeys) {
			if (searchEnabled == true && groupObjects[groupKeys[go]].length == 0) {
				continue;
			}
			groupElements.push(
				<div className="command-group">
					<div className={'command-group-label' + (searchEnabled ? ' expanded' : '')} onClick={this.toggleGroup}>
						{groupKeys[go]}
					</div>
					<div className={'command-group-content' + (searchEnabled ? '' : ' hidden')}>
						<div
							className="command-group-actions"
							onClick={e => {
								e.stopPropagation();
							}}>
							<div>
								<input
									type="text"
									className="event-key-input"
									id="eventkey"
									placeholder="Event name"
									groupname={groupKeys[go]}
									onInput={this.checkEventTaken}
									onKeyDown={this.enterAddEvent}
								/>
								<button type="button" id="addEventButton" groupname={groupKeys[go]} className="add-button" onClick={this.addEvent}>
									Add
								</button>
							</div>
							<div className="delete-event-div">
								<button
									type="button"
									className="delete-button"
									onClick={() => {
										this.deleteGroup(groupKeys[go]);
									}}>
									DELETE GROUP
								</button>
							</div>
						</div>
						{groupObjects[groupKeys[go]]}
					</div>
				</div>
			);
		}

		return (
			<form className="event-table">
				<div className="event-search">
					<FontAwesomeIcon icon={faMagnifyingGlass} className="event-search-icon" size="lg" />
					<input type="search" className="event-search-bar" placeholder="Search Events..." onInput={this.searchText} />
				</div>
				<div className="event-container">{groupElements}</div>
				<div className="event-add field-section">
					<label>Add Group</label>
					<div className="add-command-actions">
						<input type="text" className="group-name-input" name="groupname" onKeyDown={this.enterAddGroup} />
						<button type="button" id="addGroupButton" className="add-button" onClick={this.addGroup}>
							Add
						</button>
					</div>
				</div>
				<div className="save-commands">
					<button type="button" id="saveCommandsButton" className="save-button" onClick={this.saveCommands}>
						Save
					</button>
					<div id="saveStatusText" className="save-status"></div>
				</div>
			</form>
		);
	}
}

export { EventTable };
