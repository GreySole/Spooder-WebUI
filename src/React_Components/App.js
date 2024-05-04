import React from 'react';
import TabButton from './Tabs/TabButton';
import { EventTable } from './Tabs/EventTable.js';
import { ConfigTab } from './Tabs/ConfigTab.js';
import { PluginTab } from './Tabs/PluginTab.js';
import { OSCTunnelTab } from './Tabs/OSCTunnelTab.js';
import { TwitchTab } from './Tabs/TwitchTab.js';
import { ShareTab } from './Tabs/ShareTab.js';
import { UserTab } from './Tabs/UserTab.js';
import { ThemeTab } from './Tabs/ThemeTab.js';
import OSC from 'osc-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faArrowRight, faPlay, faStop, faTimes, faWarning, fa } from '@fortawesome/free-solid-svg-icons';

import { VolumeControl } from './Deck/VolumeControl.js';
import { OutputController } from './Deck/OutputController.js';
import { SceneController } from './Deck/SceneController.js';
import { SourceControl } from './Deck/SourceControl.js';
import { OSCMonitor } from './Deck/OSCMonitor.js';

import BoolSwitch from './UI/BoolSwitch.js';
import { DiscordTab } from './Tabs/DiscordTab.js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

var osc = null;

window.sendOSC = (address, value) => {
	if (osc != null) {
		osc.send(new OSC.Message(address, value));
	}
};

const RED = 0.2126;
const GREEN = 0.7152;
const BLUE = 0.0722;

const GAMMA = 2.4;

function luminance(r, g, b) {
	let a = [r, g, b].map(v => {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, GAMMA);
	});
	return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
}

function luma(color) {
	// color can be a hx string or an array of RGB values 0-255
	let rgb = typeof color === 'string' ? hexToRGBArray(color) : color;
	return luminance(rgb[0], rgb[1], rgb[2]);
}

function contrastingColor(color) {
	let lum1 = luma('#fff');
	let lum2 = luma(color);
	let brightest = Math.max(lum1, lum2);
	let darkest = Math.min(lum1, lum2);

	let contrastRatio = (brightest + 0.05) / (darkest + 0.05);

	return `#${contrastRatio <= 4.5 ? '000' : 'fff'}`;
}

const rgbToHex = (r, g, b) => `#${((r << 16) + (g << 8) + b).toString(16).padStart(6, '0')}`;

function hexToRGBArray(color) {
	color = color.replace('#', '');
	if (color.length === 3) color = color.charAt(0) + color.charAt(0) + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2);
	else if (color.length !== 6) throw 'Invalid hex color: ' + color;
	let rgb = [];
	for (let i = 0; i <= 2; i++) rgb[i] = parseInt(color.substr(i * 2, 2), 16);

	return rgb;
}

const rgbToHsl = (r, g, b) => {
	r /= 255;
	g /= 255;
	b /= 255;
	const l = Math.max(r, g, b);
	const s = l - Math.min(r, g, b);
	const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0;
	const hsl = [60 * h < 0 ? 60 * h + 360 : 60 * h, 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0), (100 * (2 * l - s)) / 2];

	return hsl;
};

const hslToRgb = (h, s, l) => {
	s /= 100;
	l /= 100;
	const k = n => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

	const rgb = [f(0), f(8), f(4)].map(v => Math.round(v * 255));

	return rgb;
};

let savedThemeColor = JSON.parse(localStorage.getItem('themeColor'));

savedThemeColor = savedThemeColor || '#006e6e';

const setThemeColors = (color = savedThemeColor) => {
	localStorage.setItem('themeColor', JSON.stringify(color));

	document.documentElement.style.setProperty('--color-primary', color);
	document.documentElement.style.setProperty('--button-font-color', contrastingColor(color));

	let cwAnalogousColor = rgbToHex(...hslToRgb(...rgbToHsl(...hexToRGBArray(color)).map((v, i) => (i === 0 ? (v + 30) % 360 : v))));
	let ccwAnalogousColor = rgbToHex(...hslToRgb(...rgbToHsl(...hexToRGBArray(color)).map((v, i) => (i === 0 ? (v - 30) % 360 : v))));

	document.documentElement.style.setProperty('--color-analogous-cw', cwAnalogousColor);
	document.documentElement.style.setProperty('--color-analogous-ccw', ccwAnalogousColor);
	document.documentElement.style.setProperty('--button-font-color-analogous-cw', contrastingColor(cwAnalogousColor));
	document.documentElement.style.setProperty('--button-font-color-analogous-ccw', contrastingColor(ccwAnalogousColor));
};

class App extends React.Component {
	constructor(props) {
		super(props);
		let defaultTabs = localStorage.getItem('defaulttabs');
		let customSetupTab = localStorage.getItem('customtab');
		if (defaultTabs == null) {
			defaultTabs = 'nodefault';
			customSetupTab = 'commands';
		} else if (defaultTabs != 'nodefault') {
			if (customSetupTab == null) {
				customSetupTab = 'commands';
			}
		}

		if (urlParams.get('tab') != null) {
			customSetupTab = urlParams.get('tab');
		}

		setThemeColors();

		this.state = {
			stateLoaded: false,
			tab: customSetupTab,
			tabData: null,
			navOpen: false,
			themeColor: savedThemeColor,
			tabOptions: {
				commands: 'Events',
				plugins: 'Plugins',
				osctunnels: 'Tunnels',
				twitch: 'Twitch',
				discord: 'Discord',
				users: 'Users',
				sharing: 'Sharing',
				config: 'Config',
			},
			deckTabOptions: {
				obs: 'OBS Remote',
				osc: 'OSC Monitor',
				mod: 'Mod UI',
			},
			oscConnected: false,
			obsConnected: 0,
			toastText: '',
			isExternal: window.location.protocol != 'http:',
			obsLoginInfo: {},
			customSpooder: {
				bigeyeleft: 'o',
				bigeyeright: 'o',
				littleeyeleft: 'º',
				littleeyeright: 'º',
				fangleft: ' ',
				fangright: ' ',
				mouth: '\u03c9',
				colors: {
					bigeyeleft: 'white',
					bigeyeright: 'white',
					littleeyeleft: 'white',
					littleeyeright: 'white',
					fangleft: 'white',
					fangright: 'white',
					mouth: 'white',
					shortlegs: 'white',
					longlegs: 'white',
					body: 'white',
				},
			},
			udp_clients: {},
			plugins: [],
		};
	}

	selectTab = this.selectTab.bind(this);
	setTabContent = this.setTabContent.bind(this);
	navigationClick = this.navigationClick.bind(this);
	deckToggle = this.deckToggle.bind(this);
	handleObsInput = this.handleObsInput.bind(this);
	connectOBS = this.connectOBS.bind(this);
	stayHere = this.stayHere.bind(this);
	updateCustomSpooder = this.updateCustomSpooder.bind(this);
	saveCustomSpooder = this.saveCustomSpooder.bind(this);
	activateShare = this.activateShare.bind(this);
	deactivateShare = this.deactivateShare.bind(this);
	setToast = this.setToast.bind(this);
	changeThemeColor = this.changeThemeColor.bind(this);

	componentDidMount() {
		this.getServerState()
			.then(data => {
				let serverData = data;
				if (osc == null) {
					osc = new OSC({ plugin: new OSC.WebsocketClientPlugin({ host: serverData.host, port: serverData.port, secure: false }) });
					this.initOSC();
				}

				let shares = {};
				for (let s in serverData.shares) {
					if (serverData.activeShares != null) {
						if (serverData.activeShares.includes('#' + serverData.shares[s])) {
							shares[serverData.shares[s]] = true;
						} else {
							shares[serverData.shares[s]] = false;
						}
					}
				}
				serverData.shares = shares;
				serverData.stateLoaded = true;

				this.setState(Object.assign(this.state, serverData));
				this.setTabContent(this.state.tab);
			})
			.catch(err => console.log(err));
	}

	initOSC() {
		console.log('OPENING OSC');

		osc.on('open', () => {
			console.log('OSC OPEN', osc.status());
			osc.send(new OSC.Message('/frontend/connect', 1.0));
		});
		osc.on('/frontend/*', message => {
			if (message.address == '/frontend/connect/success') {
				this.setState(Object.assign(this.state, { oscConnected: true }));
				osc.send(new OSC.Message('/obs/get/obslogininfo', 1.0));
			}
		});
		osc.on('/obs/status/connection', message => {
			this.setState(Object.assign(this.state, { obsConnected: message.args[0] }));
		});
		osc.on('/obs/get/obslogininfo', message => {
			let obsLoginInfo = JSON.parse(message.args[0]);
			this.setState(Object.assign(this.state, { obsLoginInfo: obsLoginInfo }));
		});
		osc.on('/share/activate', message => {
			let newShares = Object.assign({}, this.state.shares);
			newShares[message.args[0]] = true;
			this.setState(Object.assign(this.state, { shares: newShares }));
		});
		osc.on('/share/deactivate', message => {
			let newShares = Object.assign({}, this.state.shares);
			newShares[message.args[0]] = false;
			this.setState(Object.assign(this.state, { shares: newShares }));
		});
		osc.open();
	}

	getServerState = async () => {
		const response = await fetch('/server_state');
		const serverStateRaw = await response.json();
		return serverStateRaw;
	};

	applyStyle = theme => {
		for (let t in theme) {
			document.documentElement.style.setProperty(t, theme[t]);
		}
	};

	stayHere(e) {
		if (e.currentTarget.checked == true) {
			let urlState = {};
			urlState.tab = this.state.tab;
			if (history.pushState) {
				var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?tab=' + urlState.tab;
			}
		} else {
			var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname;
		}
		window.history.pushState({ path: newurl }, '', newurl);
	}

	selectTab(tab) {
		this.setTabContent(tab);
	}

	setTabContent(tab) {
		this.setState(
			Object.assign(this.state, {
				tab: tab,
				navOpen: false,
			})
		);
		if (localStorage.getItem('defaulttabs') == 'rememberlast') {
			localStorage.setItem('customtab', tab);
		}
		return;
	}

	navigationClick(e) {
		this.setState(Object.assign(this.state, { navOpen: !this.state.navOpen }));
	}

	deckToggle(e) {
		this.setState(
			Object.assign(this.state, {
				navOpen: !this.state.navOpen,
				mode: this.state.mode == 'deck' ? 'setup' : 'deck',
			})
		);
		this.selectTab(this.state.mode == 'setup' ? this.state.tab : this.state.decktab);
	}

	handleObsInput(e) {
		let newLoginInfo = Object.assign(this.state.obsLoginInfo);
		if (e.target.type == 'checkbox') {
			newLoginInfo[e.target.name] = e.target.checked;
		} else {
			newLoginInfo[e.target.name] = e.target.value;
		}

		this.setState(Object.assign(this.state, { obsLoginInfo: newLoginInfo }));
	}

	connectOBS() {
		let rememberLogin = this.state.obsLoginInfo.remember != null ? this.state.obsLoginInfo.remember : false;
		osc.send(
			new OSC.Message(
				'/obs/connectSocket',
				JSON.stringify({
					url: this.state.obsLoginInfo.url,
					port: this.state.obsLoginInfo.port,
					password: this.state.obsLoginInfo.password,
					remember: rememberLogin,
				})
			)
		);
	}

	async connectChatChannel(e) {
		let channel = document.querySelector('.chat-actions input[name=channel]').value;
		let leaveMessage = document.querySelector('.chat-actions input[name=leavemessage]').value;
		let joinMessage = document.querySelector('.chat-actions input[name=joinmessage]').value;

		const response = await fetch('/twitch/chat_channel?channel=' + channel + '&leavemessage=' + leaveMessage + '&joinmessage=' + joinMessage).then(response => response.json());
		if (response.status == 'SUCCESS') {
			e.target.innerText = 'Done!';
			setTimeout(() => {
				e.target.innerText = 'Connect';
			}, 3000);
		}
	}

	async restartChat(e) {
		const response = await fetch('/twitch/chat_restart').then(response => response.json());
		if (response.status == 'SUCCESS') {
			e.target.innerText = 'Done!';
			setTimeout(() => {
				e.target.innerText = 'Restart Chat';
			}, 3000);
		}
	}

	async refreshPlugins(e) {
		const response = await fetch('/refresh_plugins').then(response => response.json());
		console.log(response);
		if (response.status == 'Refresh Success!') {
			e.target.innerText = 'Done!';
			setTimeout(() => {
				e.target.innerText = 'Refresh Plugins';
			}, 3000);
		}
	}

	updateCustomSpooder(e) {
		let newSpooder = Object.assign(this.state.themes);
		if (e.currentTarget.type == 'text') {
			newSpooder.spooderpet[e.currentTarget.name] = e.currentTarget.value;
		} else if (e.target.type == 'color') {
			newSpooder.spooderpet.colors[e.currentTarget.name] = e.currentTarget.value;
		}
		this.setState(Object.assign(this.state, { themes: newSpooder }));
	}

	saveCustomSpooder(e) {
		let newSpooder = Object.assign(this.state.customSpooder);
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			body: JSON.stringify(newSpooder),
		};
		fetch('/saveCustomSpooder', requestOptions)
			.then(response => response.json())
			.then(data => {
				document.querySelector('#spooderSaveStatusText').textContent = data.status;
				setTimeout(() => {
					document.querySelector('#spooderSaveStatusText').textContent = '';
				}, 5000);
			});
	}

	activateShare(e) {
		let shareUser = e.currentTarget.name;
		fetch('/setShare', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				shareuser: shareUser,
				enabled: true,
				message: null,
			}),
		})
			.then(response => response.json())
			.then(data => {
				if (data.status == 'ok') {
					let newShares = Object.assign({}, this.state.shares);
					newShares[shareUser] = true;
					this.setState(Object.assign(this.state, { shares: newShares }));
				}
			});
	}

	deactivateShare(e) {
		let shareUser = e.currentTarget.name;
		fetch('/setShare', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				shareuser: shareUser,
				enabled: false,
				message: null,
			}),
		})
			.then(response => response.json())
			.then(data => {
				if (data.status == 'ok') {
					let newShares = Object.assign({}, this.state.shares);
					newShares[shareUser] = false;
					this.setState(Object.assign(this.state, { shares: newShares }));
				}
			});
	}

	setToast(txt, tClass, dur) {
		if (dur == null) {
			dur = 3000;
		}
		setTimeout(() => {
			this.setState(Object.assign(this.state, { toastText: '', toastClass: '' }));
		}, dur);
		this.setState(Object.assign(this.state, { toastText: txt, toastClass: tClass }));
	}

	changeThemeColor(e) {
		this.setState(Object.assign(this.state, { themeColor: e.target.value }));
		setThemeColors(e.target.value);
	}

	render() {
		if (this.state.isExternal) {
			return (
				<div className="App">
					<div className="locals-only">
						<h1 className="App-title">/╲/\( º^ ω ^º; )/\╱\</h1>
						<h1>Sorry, locals only</h1>
					</div>
				</div>
			);
		}

		if (this.state.stateLoaded == false) {
			return (
				<div className="App">
					<div className="locals-only">
						<h1 className="App-title">/╲/\( ºO ω Oº )/\╱\</h1>
						<h1>Loading...</h1>
					</div>
				</div>
			);
		}

		let tabContent = null;
		let appMode = 'setup';

		switch (this.state.tab) {
			case 'commands':
				tabContent = <EventTable parentState={this.state} setToast={this.setToast} />;
				break;
			case 'config':
				tabContent = (
					<ConfigTab
						parentState={this.state}
						setToast={this.setToast}
						osc={osc}
						updateCustomSpooder={this.updateCustomSpooder}
						saveCustomSpooder={this.saveCustomSpooder}
					/>
				);
				break;
			case 'plugins':
				tabContent = <PluginTab parentState={this.state} setToast={this.setToast} osc={osc} />;
				break;
			case 'osctunnels':
				tabContent = <OSCTunnelTab parentState={this.state} setToast={this.setToast} />;
				break;
			case 'sharing':
				tabContent = <ShareTab parentState={this.state} setToast={this.setToast} />;
				break;
			case 'discord':
				tabContent = <DiscordTab parentState={this.state} setToast={this.setToast} />;
				break;
			case 'twitch':
				tabContent = <TwitchTab parentState={this.state} setToast={this.setToast} />;
				break;
			case 'users':
				tabContent = <UserTab parentState={this.state} setToast={this.setToast} />;
				break;
			case 'obs':
				appMode = 'deck';
				if (this.state.oscConnected && this.state.obsConnected) {
					tabContent = (
						<div className="App-content deck">
							<OutputController osc={osc} />
							<SceneController osc={osc} />
							<SourceControl osc={osc} />
							<VolumeControl osc={osc} />
						</div>
					);
				} else {
					if (!this.state.oscConnected) {
						tabContent = <h1>Hold on...we're connecting to OSC</h1>;
					} else if (!this.state.obsConnected) {
						let obsLoginEl = null;
						obsLoginEl = (
							<div className="obs-login-info">
								<label>
									IP Address
									<input name="url" type="text" onInput={this.handleObsInput} defaultValue={this.state.obsLoginInfo.url} />
								</label>
								<label>
									Port
									<input name="port" type="text" onInput={this.handleObsInput} defaultValue={this.state.obsLoginInfo.port} />
								</label>
								<label>
									Password
									<input name="password" type="password" onInput={this.handleObsInput} defaultValue={this.state.obsLoginInfo.password} />
								</label>
								<label>
									Remember
									<input name="remember" onInput={this.handleObsInput} type="checkbox" />
								</label>
								<button type="button" className="save-button" onClick={this.connectOBS}>
									Connect
								</button>
							</div>
						);

						tabContent = (
							<div className="App-content deck">
								<h1 style={{ fontSize: '24px' }}>OBS not connected!</h1>
								<br></br>
								<p>
									OBS is connected by Spooder itself. So only one connect is needed for all your Web UI clients. Check 'Remember' to save this info on file and
									Spooder will automatically attempt to connect to OBS when starting up.
								</p>
								{obsLoginEl}
							</div>
						);
					}
				}
				break;
			case 'osc':
				appMode = 'deck';
				if (!this.state.oscConnected) {
					tabContent = <h1>Hold on...we're connecting to OSC</h1>;
				} else {
					tabContent = (
						<div className="App-content deck">
							<OSCMonitor osc={osc} />
						</div>
					);
				}
				break;
			case 'mod':
				appMode = 'deck';
				tabContent = (
					<div className="App-content deck">
						<iframe id="ModUIViewer" src="/mod" />
					</div>
				);
				break;
			/*case "theme":
				tabContent = <ThemeTab data={tabData.data} />;
			break;*/
		}

		let appContent = null;
		let navigationTabs = null;

		const tabButtons = Object.keys(this.state.tabOptions).map((tab, index) => {
			const tabLabel = this.state.tabOptions[tab];
			return (
				<TabButton tabState={this.state.tab} tabName={tab} onClick={() => this.selectTab(tab)} key={`tab-button-${tabLabel}-${Math.random()}`}>
					{tabLabel}
				</TabButton>
			);
		});

		let deckButtons = [];
		for (let d in this.state.deckTabOptions) {
			let tabName = this.state.deckTabOptions[d];
			deckButtons.push(
				<button type="button" name={d} className={'tab-button ' + (this.state.tab == d ? 'selected' : '')} onClick={() => this.selectTab(d)} key={Math.random()}>
					{tabName}
				</button>
			);
		}
		navigationTabs = (
			<div className="navigation-tabs-mobile">
				<div className="navigation-tab-group">
					<label>Setup</label>
					<div className="navigation-buttons">{tabButtons}</div>
				</div>

				<div className="navigation-tab-group">
					<label>Deck</label>
					<div className="navigation-buttons">{deckButtons}</div>
				</div>
			</div>
		);

		appContent = (
			<div className={'App-content ' + appMode}>
				<div className="navigation-tabs">{tabButtons}</div>
				<div id="tabContent">{tabContent}</div>
			</div>
		);
		let shareElements = [];
		for (let s in this.state.shares) {
			shareElements.push(
				<div className="nav-share-entry" key={s}>
					<label>{s}</label>
					<button
						name={s}
						className={'nav-share-button ' + (this.state.shares[s] == false ? 'save-button' : 'delete-button')}
						onClick={this.state.shares[s] == false ? this.activateShare : this.deactivateShare}>
						<FontAwesomeIcon icon={this.state.shares[s] == false ? faPlay : faStop} size="lg" />
					</button>
				</div>
			);
		}

		return (
			<div className="App">
				<div className={'navigation-menu ' + (this.state.navOpen ? 'open' : '')}>
					{navigationTabs}
					<div className="chat-actions">
							<BoolSwitch name="stayhere" onChange={this.stayHere} checked={urlParams.get('tab') != null} label="Stay Here"/>
						<div>
							Plugins{' '}
							<button type="button" className="nav-restart-chat-button" onClick={this.refreshPlugins}>
								Refresh Plugins
							</button>
						</div>
						<div>
							Chat{' '}
							<button type="button" className="nav-restart-chat-button" onClick={this.restartChat}>
								Restart Chat
							</button>
						</div>
						<div>
							Shares
							<div className="nav-share-container">{shareElements}</div>
						</div>
					</div>
				</div>
				<div className="App-header">
					<div className={'top-header' + (this.state.toastClass ? ` ${this.state.toastClass}` : '')} onClick={this.navigationClick}>
						<div className="navigation-open-button">
							<FontAwesomeIcon icon={this.state.navOpen ? faTimes : faBars} size="2x" />
						</div>
						<div className="toast-text">{this.state.toastText}</div>
						<label>
							Theme Color:
							<input type="color" value={this.state.themeColor} onChange={this.changeThemeColor} title="Change Theme Color" onClick={e => e.stopPropagation()} />
                            {/* {(luma(this.state.themeColor) < .01) && <FontAwesomeIcon icon={faWarning} size="1x" />} */}
						</label>
						<h1 className="App-title">
							<span style={{ color: this.state.themes.spooderpet.colors.longlegleft }}>{this.state.themes.spooderpet.longlegleft}</span>
							<span style={{ color: this.state.themes.spooderpet.colors.shortlegleft }}>{this.state.themes.spooderpet.shortlegleft}</span>
							<span style={{ color: this.state.themes.spooderpet.colors.bodyleft }}>{this.state.themes.spooderpet.bodyleft}</span>
							<span> </span>
							<span style={{ color: this.state.themes.spooderpet.colors.littleeyeleft }}>{this.state.themes.spooderpet.littleeyeleft}</span>
							<span style={{ color: this.state.themes.spooderpet.colors.bigeyeleft }}>{this.state.themes.spooderpet.bigeyeleft}</span>
							<span style={{ color: this.state.themes.spooderpet.colors.fangleft }}>{this.state.themes.spooderpet.fangleft}</span>
							<span style={{ color: this.state.themes.spooderpet.colors.mouth }}>{this.state.themes.spooderpet.mouth}</span>
							<span style={{ color: this.state.themes.spooderpet.colors.fangright }}>{this.state.themes.spooderpet.fangright}</span>
							<span style={{ color: this.state.themes.spooderpet.colors.bigeyeright }}>{this.state.themes.spooderpet.bigeyeright}</span>
							<span style={{ color: this.state.themes.spooderpet.colors.littleeyeright }}>{this.state.themes.spooderpet.littleeyeright}</span>
							<span> </span>
							<span style={{ color: this.state.themes.spooderpet.colors.bodyright }}>{this.state.themes.spooderpet.bodyright}</span>
							<span style={{ color: this.state.themes.spooderpet.colors.shortlegright }}>{this.state.themes.spooderpet.shortlegright}</span>
							<span style={{ color: this.state.themes.spooderpet.colors.longlegright }}>{this.state.themes.spooderpet.longlegright}</span>
						</h1>
					</div>
				</div>
				{appContent}
			</div>
		);
	}
}
export default App;
