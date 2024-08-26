import React from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import FormBoolSwitch from '../UI/common/input/form/FormBoolSwitch.js';
import LoadingCircle from '../UI/LoadingCircle';

class DiscordTab extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            stateLoaded:false,
        }

        this.saveDiscord = this.saveDiscord.bind(this);
    }

    componentDidMount(){
        fetch("/discord/config")
        .then(response => response.json())
        .then(data => {
            window.addEventListener("keydown", this.keyDown)
            this.setState(Object.assign(this.state, {stateLoaded: true, config:data.config, guilds:data.guilds}));
        });
    }

    componentWillUnmount(){
        window.removeEventListener("keydown", this.keyDown)
    }

    keyDown = e=>{
		if(e.ctrlKey==true && e.key == 's'){
			e.preventDefault();
			this.saveDiscord();
		}
	}

    handleDiscordChange = (s) => {
		let name = s.target.name;
		let newDiscord = Object.assign({},this.state);
		if(name.includes("-")){
			name = name.split("-");
			if(newDiscord.config[name[0]] == null){newDiscord.config[name[0]] = {}}
			if(s.target.type == "checkbox"){
				newDiscord.config[name[0]][name[1]] = s.target.checked;
			}else{
				newDiscord.config[name[0]][name[1]] = s.target.value;
			}

		}else{
            if(s.target.type == "checkbox"){
				newDiscord.config[name] = s.target.checked;
			}else{
				newDiscord.config[name] = s.target.value;
			}
		}
		this.setState(Object.assign(this.state, newDiscord))
	}

    saveDiscord(){
		let newDiscord = Object.assign({},this.state.config);
		const requestOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			body: JSON.stringify(newDiscord)
		};

		fetch('/discord/saveDiscordConfig', requestOptions)
		.then(response => response.json())
		.then(data => {
            this.props.setToast("DISCORD SAVED!", "save");
			document.querySelector("#discordSaveStatusText").textContent = data.status;
			setTimeout(()=>{
				document.querySelector("#discordSaveStatusText").textContent = "";
			}, 5000)
		});
	}

    render(){
        if(this.state.stateLoaded == false){
			return <LoadingCircle></LoadingCircle>
		}
        let guildOptions = [<option value={""}>Select Guild</option>];
        let channelOptions = [<option value={""}>Select Channel</option>];

        if(this.state.guilds != null){
            if(this.state.config.autosendngrok?.enabled){
                for(let g in this.state.guilds){
                    guildOptions.push(
                        <option value={g}>{this.state.guilds[g].name}</option>
                    )
                }
            }

            if(this.state.config.autosendngrok?.enabled){
                if(this.state.config.autosendngrok.destguild != null && this.state.config.autosendngrok.destguild != ""){
                    for(let c in this.state.guilds[this.state.config.autosendngrok.destguild].channels){
                        channelOptions.push(
                            <option value={c}>{this.state.guilds[this.state.config.autosendngrok.destguild].channels[c].name}</option>
                        )
                    }
                }
            }
        }

        let autoNgrokFields = this.state.config?.autosendngrok?.enabled != false?<div className="config-variable">
                <label>
                    Server
                    <select name="autosendngrok-destguild" defaultValue={this.state.config.autosendngrok?.destguild} onChange={this.handleDiscordChange}>
                        {guildOptions}
                    </select>
                </label>
                <label>
                    Channel
                    <select name="autosendngrok-destchannel" defaultValue={this.state.config.autosendngrok?.destchannel} onChange={this.handleDiscordChange}>
                        {channelOptions}
                    </select>
                </label>
            </div>:null;

        let loginFields = <>
                    <div className="config-variable">
                        <label>
                            Master User
                            <input name="master" type="text" defaultValue={this.state.config?.master} onChange={this.handleDiscordChange}/>
                        </label>
                    </div>
                    <div className="config-variable">
                        <label>
                            Bot token
                            <input name="token" type="password" defaultValue={this.state.config?.token} onChange={this.handleDiscordChange}/>
                        </label>
                    </div>
                </>;

        let configFields = <>
            {this.state.guilds!=null ?
            <>
                <div className="config-variable">
                    <label>
                        Send Ngrok Link to Channel on Startup
                        <FormBoolSwitch name="autosendngrok-enabled" checked={this.state.config.autosendngrok?.enabled} onChange={this.handleDiscordChange}/>
                    </label>
                    {this.state.config.autosendngrok?.enabled ? autoNgrokFields:null}
                </div>
                <div className="config-variable">
                    <label>
                        Auto Share DM Notification
                        <FormBoolSwitch name="sharenotif" checked={this.state.config.sharenotif} onChange={this.handleDiscordChange}/>
                    </label>
                </div>
                <div className="config-variable">
                    <label>
                        DM Crash Report
                        <FormBoolSwitch name="crashreport" checked={this.state.config.crashreport} onChange={this.handleDiscordChange}/>
                    </label>
                </div>
            </>
            :<div className="config-variable">
                Discord isn't logged in. Input your bot token and invite the bot to your server to assign a channel to auto send Ngrok links.
            </div>}
        </>;

        let discord = <div className="config-discord">
                {this.state.config != null ? "":"Create an app on Discord Developers to make a bot token. Then add your Discord user ID as the master."}
                {loginFields}
                {this.state.config != null ? configFields:null}
                <div className="save-commands"><button type="button" id="saveDiscordButton" className="save-button" onClick={this.saveDiscord}>Save</button><div id="discordSaveStatusText" className="save-status"></div></div>
            </div>;

        return discord;
    }
}

export {DiscordTab}