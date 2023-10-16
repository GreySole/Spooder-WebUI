import React, { createRef } from 'react';
import './ShareTab.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash, faPlusCircle, faPlay, faStop} from '@fortawesome/free-solid-svg-icons';
import BoolSwitch from '../UI/BoolSwitch.js';
import ToggleGrid from '../UI/ToggleGrid';
import LinkButton from '../UI/LinkButton';
import LoadingCircle from '../UI/LoadingCircle';

class ShareTab extends React.Component{
    constructor(props){
        super(props);
        this.state = {stateLoaded:false}
        this.state.openSettings = {};
        this.state.openCreate = false;
        this.state.openDiscord = false;
        this.state.unsavedChanges = false;
        this.state.activeSubs = {};
        console.log("SHARE STATE", this.state);
        this.openShareCommands = this.openShareCommands.bind(this);
        this.openSharePlugins = this.openSharePlugins.bind(this);
        this.closeShare = this.closeShare.bind(this);
        this.addShareEntry = this.addShareEntry.bind(this);
        this.removeShareEntry = this.removeShareEntry.bind(this);
        this.activateShare = this.activateShare.bind(this);
        this.deactivateShare = this.deactivateShare.bind(this);
        this.onShareChanged = this.onShareChanged.bind(this);
        this.onShareMessageChanged = this.onShareMessageChanged.bind(this);
        this.saveShares = this.saveShares.bind(this);
        this.openCreateShare = this.openCreateShare.bind(this);
        this.openAddDiscord = this.openAddDiscord.bind(this);
        this.verifyShareUser = this.verifyShareUser.bind(this);
        this.verifyDiscordUser = this.verifyDiscordUser.bind(this);
        this.removeDiscord = this.removeDiscord.bind(this);

        this.verifyAutoShare = this.verifyAutoShare.bind(this);
        this.setAutoShare = this.setAutoShare.bind(this);
    }

    componentDidMount(){
        fetch("/shares")
        .then(response => response.json())
        .then(data => {
            console.log("SHARE DATA", data);
            window.addEventListener("keydown", this.keyDown)
            this.setState(Object.assign(this.state, 
            {
                stateLoaded:true,
                shares:data.shareData,
                activeShares: data.activeShares ?? [],
                chatCommands:data.commandData,
                activePlugins: data.activePlugins
            }), (()=>{
                for(let s in this.state.shares){
                    if(this.state.shares[s].profilepic == null || this.state.shares[s].twitchid == null){
                        this.verifyShareUser(s);
                    }
                    this.verifyAutoShare(s);
                }
            }).bind(this));
        })
    }

    componentWillUnmount(){
        window.removeEventListener("keydown", this.keyDown)
    }

    keyDown = e=>{
		console.log(e);
		if(e.ctrlKey==true && e.key == 's'){
			e.preventDefault();
			this.saveShares();
		}
	}

    addShareEntry(e){
        e.preventDefault();
        console.log(e.target.username);
        //return;
        let newShareUser = e.target.username.value.toLowerCase();
        this.verifyShareUser(newShareUser)
        .then(userInfo=>{
            let newShares = Object.assign({}, this.state.shares);
            
            this.setState(Object.assign(this.state, {shares:newShares}));
        })
        .catch(e=>{
            alert("Could not verify share target with Twitch");
        })
    }

    removeShareEntry(shareUser){
        let deleteConfirm = confirm("Are you sure you want to delete "+shareUser+"?");
        if(deleteConfirm == true){
            let newShares = Object.assign({}, this.state.shares);
            delete newShares[shareUser];
            this.setState(Object.assign(this.state, {shares:newShares}));
        }
    }

    activateShare(shareUser){
        if(this.state.unsavedChanges){
            let saveConfirm = confirm("You have unsaved changes! Want to save and then activate share?");
            if(saveConfirm == false){return;}
        }
        fetch("/setShare", {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                shareuser:shareUser,
                enabled:true,
                message:this.state.shares[shareUser].joinMessage
            })
        })
        .then(response=>response.json())
        .then(data=>{
            if(data.status == "ok"){
                let newActiveShares = this.state.activeShares.slice();
                newActiveShares.push("#"+shareUser);
                this.setState(Object.assign(this.state, {activeShares:newActiveShares}));
            }
        });
    }

    deactivateShare(shareUser){
        fetch("/setShare", {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                shareuser:shareUser,
                enabled:false,
                message:this.state.shares[shareUser].leaveMessage
            })
        })
        .then(response=>response.json())
        .then(data=>{
            if(data.status == "ok"){
                let newActiveShares = this.state.activeShares.slice();
                newActiveShares.splice(newActiveShares.indexOf("#"+shareUser), 1);
                this.setState(Object.assign(this.state, {activeShares:newActiveShares}));
            }
        })
    }

    openShareCommands(shareUser){
        this.setState(Object.assign(this.state, {openSettings:{share:shareUser, type:"commands"}}))
    }

    openSharePlugins(shareUser){
        this.setState(Object.assign(this.state, {openSettings:{share:shareUser, type:"plugins"}}))
    }

    closeShare(){
        this.setState(Object.assign(this.state, {openSettings:{}}))
    }

    saveShares(){
        console.log("SAVE SHARES", this.state.shares);
        const requestOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			body: JSON.stringify(this.state.shares)
		};
		fetch('/saveShares', requestOptions)
		.then(response => response.json())
		.then(data => {
			if(data.status == "ok"){
                this.props.setToast("SHARES SAVED!", "save");
				document.querySelector(".save-status").textContent = "Shares are saved!";
				setTimeout(()=>{
					document.querySelector(".save-status").textContent = "";
				}, 5000)
			}else{
				document.querySelector(".save-status").textContent = "Error: "+data.status;
			}
            this.setState(Object.assign(this.state, {unsavedChanges:false}));
		});

    }

    onShareChanged(type, key, value){
        console.log(type, key, value);
        
        let newShares = Object.assign({}, this.state.shares);
        if(value == true){
            newShares[this.state.openSettings.share][type].push(key);
        }else{
            newShares[this.state.openSettings.share][type].splice(newShares[this.state.openSettings.share][type].indexOf(key), 1);
        }
        

        this.setState(Object.assign(this.state, {shares:newShares, unsavedChanges:true}));
    }

    onShareMessageChanged(e){
        
        let sharename = e.target.name.split("-");
        console.log(sharename[0], sharename[1], e.target.value);
        let newShares = Object.assign({}, this.state.shares);
        newShares[sharename[0]][sharename[1]] = e.target.value;
        this.setState(Object.assign(this.state, {shares:newShares}));
    }

    async setAutoShare(shareUser){
        if(this.state.activeSubs[shareUser]?.["stream.online"] != null){
            await fetch("/twitch/delete_eventsub?id="+this.state.activeSubs[shareUser]["stream.online"].id);
            if(this.state.activeSubs[shareUser]?.["stream.offline"] != null){
                await fetch("/twitch/delete_eventsub?id="+this.state.activeSubs[shareUser]["stream.offline"].id);
            }
            this.verifyAutoShare(shareUser);
        }else{
            let onlineSub = await fetch("/twitch/init_eventsub?type=stream.online&user_id="+this.state.shares[shareUser].twitchid);
            let offlineSub = await fetch("/twitch/init_eventsub?type=stream.offline&user_id="+this.state.shares[shareUser].twitchid);

            this.verifyAutoShare(shareUser);
        }
    }

    verifyAutoShare(shareUser){
        fetch("/twitch/get_eventsubs_by_user?twitchid="+this.state.shares[shareUser].twitchid)
            .then(async data=>{
                let eventInfo = await data.json();
                //console.log("EVENTSUBS", shareUser, eventInfo);
                let newSubs = Object.assign({},this.state.activeSubs);
                newSubs[shareUser] = {};
                for(let d in eventInfo.data){
                    newSubs[shareUser][eventInfo.data[d].type] = eventInfo.data[d];
                }
                //console.log("NEW SUBS", newSubs);
                this.setState(Object.assign(this.state, {activeSubs:newSubs}));
            })
    }

    verifyShareUser(shareUser){
        return new Promise((res, rej) => {
            fetch("/verifyShareTarget?shareuser="+shareUser)
            .then(async data=>{
                let userInfo = await data.json();
                //console.log("GOT USER INFO", userInfo);
                let newShares = Object.assign({}, this.state.shares);
                if(newShares[shareUser] == null){
                    newShares[shareUser] = {
                        commands:[],
                        plugins:[],
                        joinMessage:"",
                        leaveMessage:""
                    };
                }
                newShares[shareUser].twitchid = userInfo.info[0].id;
                newShares[shareUser].profilepic = userInfo.info[0].profile_image_url;
                newShares[shareUser].displayName = userInfo.info[0].display_name;
                res(userInfo.info);
                this.setState(Object.assign(this.state, {shares:newShares}));
                
            }).catch(e=>{
                rej(e);
            })
        })
        
    }

    verifyDiscordUser(e){
        e.preventDefault();
        let discordId = e.target.discordid.value;
        let shareUser = e.target.discordid.id.split("-")[0];
        
        return new Promise((res, rej) => {
            fetch("/discord/user?userid="+discordId)
            .then(async data=>{
                let userInfo = await data.json();
                let newShares = Object.assign({}, this.state.shares);
                newShares[shareUser].discordId = discordId;
                newShares[shareUser].discordName = userInfo.userInfo.username;
                this.setState(Object.assign(this.state, {shares:newShares, openDiscord:false}));
            })
        })
    }

    removeDiscord(shareUser){
        let newShares = Object.assign({}, this.state.shares);
        newShares[shareUser].discordId = null;
        newShares[shareUser].discordName = null;
        this.setState(Object.assign(this.state, {shares:newShares}));
    }

    openCreateShare(){
        this.setState(Object.assign(this.state, {openCreate:!this.state.openCreate}));
    }

    openAddDiscord(e){
        
        this.setState(Object.assign(this.state, {openDiscord:e.currentTarget.name}));
    }

    render(){
        if(this.state.stateLoaded == false){
			return <LoadingCircle></LoadingCircle>
		}
        let entries = [];
        for(let s in this.state.shares){
            
            let shareContent = null;
            if(this.state.openSettings.share == s){
                let gridData = this.state.openSettings.type=="commands"?this.state.chatCommands:this.state.activePlugins;
                let selectedData = this.state.openSettings.type=="commands"?this.state.shares[s].commands:this.state.shares[s].plugins;
                shareContent = <div className={"share-entry-content-"+this.state.openSettings.type}>
                    <ToggleGrid data={gridData} selected={selectedData} type={this.state.openSettings.type} onToggleChange={this.onShareChanged}/>
                    <button className='save-button' onClick={this.closeShare}>Done</button>
                </div>
            }else{
                shareContent = <div className="share-entry-content-overview">
                    <div className="share-entry-commands">
                        <div className="share-entry-label">Commands <button className="add-button" onClick={()=>{this.openShareCommands(s)}}>Set</button></div>
                        {this.state.shares[s].commands.join(", ")}
                    </div>
                    <div className="share-entry-plugins">
                        <div className="share-entry-label">Plugins <button className="add-button" onClick={()=>{this.openSharePlugins(s)}}>Set</button></div>
                        {this.state.shares[s].plugins.join(", ")}
                    </div>
                </div>;
            }

            let joinButton = !this.state.activeShares.includes("#"+s)?
            <button className="save-button join-button" onClick={()=>this.activateShare(s)}><FontAwesomeIcon icon={faPlay} size="2x"/></button>:
            <button className="delete-button leave-button"><FontAwesomeIcon icon={faStop} size="2x" onClick={()=>this.deactivateShare(s)}/></button>;
            
            let discordForm = null;
            if(this.state.shares[s].discordId == null && this.state.openDiscord != s){
                discordForm = <button name={s} type="button" className="add-button" onClick={this.openAddDiscord}>Add Discord</button>;
            }else if(this.state.shares[s].discordId == null && this.state.openDiscord == s){
                discordForm = <form id={s+"-"+"discordForm"} onSubmit={this.verifyDiscordUser} className="share-discord-form"><input id={s+"-"+"did"} name="discordid" type="text" placeholder="Discord ID, not the name!"/><button type="submit" form={s+"-"+"discordForm"} className="add-button">Add</button></form>
            }else{
                discordForm = <div className="share-discord-label">Discord: {this.state.shares[s].discordName}<button className="delete-button discord-delete" onClick={()=>this.removeDiscord(s)}><FontAwesomeIcon icon={faTrash} /></button></div>;
            }

            let autoShareEnabled = this.state.activeSubs[s]?.["stream.online"] != null;
            console.log(s, autoShareEnabled);
            entries.push(
                <div className="share-entry" key={s}>
                    <div className="share-entry-info">
                        <div className="share-entry-user">
                            <div className="share-entry-user-pfp">
                                <img src={this.state.shares[s].profilepic} width={100} height={100}/>
                            </div>
                            <div className="share-entry-user-info">
                                <div className="share-entry-user-name"><div className="label">{this.state.shares[s].displayName?
                                this.state.shares[s].displayName:s} <LinkButton iconOnly={true} mode="newtab" link={"https://twitch.tv/"+s} /></div> {discordForm} <div className="share-discord-label">Live Auto Share: <BoolSwitch name="autoswitch" key={s+JSON.stringify(this.state.activeSubs[s])} checked={autoShareEnabled} onChange={()=>this.setAutoShare(s)}/></div></div>
                                <label>Join Message<br/>
                                    <input type="text" name={s+"-"+"joinMessage"} placeholder="Say in target's chat when joined." defaultValue={this.state.shares[s].joinMessage} onChange={this.onShareMessageChanged}/>
                                </label>
                                <label>Leave Message<br/>
                                    <input type="text" name={s+"-"+"leaveMessage"} sharename={s} placeholder="Say in target's chat before leaving." defaultValue={this.state.shares[s].leaveMessage} onChange={this.onShareMessageChanged}/>
                                </label>
                            </div>
                            <div className="share-entry-actions">
                                {joinButton}
                                <button className="delete-button" onClick={()=>this.removeShareEntry(s)}><FontAwesomeIcon icon={faTrash} size="2x"/></button>
                            </div>
                        </div>
                        <div className="share-entry-content">
                            {shareContent}
                        </div>
                    </div>
                    
                </div>
            )
        }
        let createPluginForm = 
        <div className="share-tab-create-element">
                <form autoComplete="off" onSubmit={this.addShareEntry}>
                    <input name="username" type="search" placeholder="Twitch username" required={true}/>
                    <button className="add-button" type="submit">Add</button>
                </form>
            </div>;
        
        return <div className="share-tab-content">
            <div className="plugin-install-button">
                <button onClick={this.openCreateShare}>Create Share <FontAwesomeIcon icon={faPlusCircle} size="lg" /></button>
            </div>
                
            {this.state.openCreate?createPluginForm:null}
            {entries}
            <div className="save-div"><button className="save-button" onClick={this.saveShares}>Save</button><div className="save-status"></div></div>
        </div>
    }
}

export {ShareTab};