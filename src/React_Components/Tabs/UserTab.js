import React from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import BoolSwitch from '../UI/BoolSwitch.js';
import LoadingCircle from '../UI/LoadingCircle';

class UserTab extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            stateLoaded:false,
            nameChanges:{},
            users:{}
        }
    }

    componentDidMount(){
        fetch("/users")
        .then(response => response.json())
        .then(data => {
            console.log("USERS", data);
            let nameChanges = {};
            for(let p in data.permissions){
                nameChanges[p] = p;
            }
            this.setState(Object.assign(this.state, {users:data, nameChanges:nameChanges, stateLoaded:true}));
        });
    }

    keyDown = e=>{
		console.log(e);
		if(e.ctrlKey==true && e.key == 's'){
			e.preventDefault();
			this.saveConfig();
		}
	}

    saveUsers(){
		let newList = Object.assign({},this.state);
		
		const requestOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			body: JSON.stringify(newList)
		};
		
		fetch('/saveUsers', requestOptions)
		.then(response => response.json())
		.then(data => {
			document.querySelector("#saveStatusText").textContent = data.status;
			setTimeout(()=>{
				document.querySelector("#saveStatusText").textContent = "";
			}, 5000)
		});
	}

    handleNameChange(e){
        let newChanges = Object.assign({}, this.state.nameChanges);
        newChanges[e.currentTarget.name] = e.currentTarget.value;
        this.setState(Object.assign(this.state, {nameChanges:newChanges}));
    }

    handlePermissionChange(e){
        let newUsers = Object.assign({}, this.state.users);
        console.log(e.target.name, e.target.value, e.target.checked);
        if(e.target.checked == true){
            if(!newUsers.permissions[e.target.name].includes(e.target.value)){
                newUsers.permissions[e.target.name] += e.target.value;
            }  
        }else{
            newUsers.permissions[e.target.name] = newUsers.permissions[e.target.name].replace(e.target.value, "");
        }
        console.log(this.state.users.permissions);
        this.setState(Object.assign(this.state, {users:newUsers}));
    }

    handleTwitchChange(e){
        let newUsers = Object.assign({}, this.state.users);
        newUsers.twitch[e.target.name] = e.target.value;
        this.setState(Object.assign(this.state, {users:newUsers}));
    }

    handleDiscordChange(e){
        let newUsers = Object.assign({}, this.state.users);
        newUsers.discord[e.target.name] = e.target.value;
        this.setState(Object.assign(this.state, {users:newUsers}));
    }

    render(){
        if(this.state.stateLoaded == false){return <LoadingCircle></LoadingCircle>;}
        let userTable = [];
        for(let p in this.state.users.permissions){
            userTable.push(
                <div className="user-entry">
                    <label>Username
                        <input type="text" name={p} defaultValue={this.state.nameChanges[p]} onChange={this.handleNameChange.bind(this)} />
                    </label>
                    <div className="user-section">
                        <label>Admin
                            <BoolSwitch name={p} checked={this.state.users.permissions[p].includes("a")} value={"a"} onChange={this.handlePermissionChange.bind(this)} />
                        </label>
                        <label>Mod UI
                            <BoolSwitch name={p} checked={this.state.users.permissions[p].includes("m")} value={"m"} onChange={this.handlePermissionChange.bind(this)} />
                        </label>
                        {/*<label>Share Client
                            <BoolSwitch name={p} checked={this.state.users.permissions[p].includes("s")} value={"s"} onChange={this.handlePermissionChange.bind(this)} />
                        </label>*/}
                    </div>
                    <label>Twitch Username
                        <input type="text" name={p} defaultValue={this.state.users.twitch[p]} onChange={this.handleTwitchChange.bind(this)}/>
                    </label>
                    <label>Discord User ID
                        <input type="text" name={p} defaultValue={this.state.users.discord[p]} onChange={this.handleDiscordChange.bind(this)}/>
                    </label>
                </div>
            )
        }
        return <div className="users-tab">
            <div className="users-table">
                {userTable}
            </div>
            <div className="save-commands"><button type="button" id="saveCommandsButton" className="save-button" onClick={this.saveUsers}>Save</button><div id="saveStatusText" className="save-status"></div></div>
        </div>;
    }
}

export {UserTab};