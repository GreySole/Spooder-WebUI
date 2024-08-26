import React from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import FormBoolSwitch from '../UI/common/input/form/FormBoolSwitch.js';
import LoadingCircle from '../UI/LoadingCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

class UserTab extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            stateLoaded:false,
            nameChanges:{},
            users:{}
        }

        this.saveUsers = this.saveUsers.bind(this);
        this.createUser = this.createUser.bind(this);
    }

    componentDidMount(){
        fetch("/users")
        .then(response => response.json())
        .then(data => {
            let nameChanges = {};
            for(let p in data.permissions){
                nameChanges[p] = p;
            }
            this.setState(Object.assign(this.state, {users:data, nameChanges:nameChanges, stateLoaded:true}));
        });
        window.addEventListener("keydown", this.keyDown);
    }

    componentWillUnmount(){
		window.removeEventListener("keydown", this.keyDown);
	}

    keyDown = e=>{
		if(e.ctrlKey==true && e.key == 's'){
			e.preventDefault();
			this.saveUsers();
		}
	}

    handleNameChange(e){
        let newChanges = Object.assign({}, this.state.nameChanges);
        newChanges[e.currentTarget.name] = e.currentTarget.value;
        this.setState(Object.assign(this.state, {nameChanges:newChanges}));
    }

    handlePermissionChange(e){
        let newUsers = Object.assign({}, this.state.users);
        
        if(e.target.checked == true){
            if(!newUsers.permissions[e.target.name].includes(e.target.value)){
                newUsers.permissions[e.target.name] += e.target.value;
            }  
        }else{
            newUsers.permissions[e.target.name] = newUsers.permissions[e.target.name].replace(e.target.value, "");
        }
        
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

    createUser(e){
        let newName = "newuser";
        let newState = Object.assign({}, this.state);
        let renameCount = 1;
		
		while(newState.users.permissions[newName+renameCount] != null){
            
            if(newState.users.permissions[newName+renameCount] == null){
                newName += renameCount;
                break;
            }else{
                renameCount++;
            }
        }
        if(newState.users.permissions[newName+renameCount] == null){
            newName += renameCount;
        }
        
        newState.users.permissions[newName] = "";
        newState.users.twitch[newName] = "";
        newState.users.discord[newName] = "";
        newState.nameChanges[newName] = newName;

        this.setState(newState);
    }

    saveUsers(){
		let newList = Object.assign({},this.state.users);
        let nameChanges = Object.assign({}, this.state.nameChanges);
		delete newList._hasPassword;
		const requestOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			body: JSON.stringify({users:newList, nameChanges:nameChanges})
		};
		
		fetch('/saveUsers', requestOptions)
		.then(response => response.json())
		.then(data => {
            this.props.setToast("USERS SAVED!", "save");
			document.querySelector("#saveStatusText").textContent = data.status;
			setTimeout(()=>{
				document.querySelector("#saveStatusText").textContent = "";
			}, 5000)
		});
	}

    deleteUser(p){
        let deleteConfirm = confirm(`Are you sure you want to delete ${p}?`);

        if(deleteConfirm == true){
            this.deleteUserPassword(p);
            let newUsers = Object.assign({}, this.state);
            delete newUsers.users.permissions[p];
            delete newUsers.users.twitch[p];
            delete newUsers.users.discord[p];
            delete newUsers.users._hasPassword[p];
            newUsers.nameChanges[p] = null;
            this.setState(Object.assign(newUsers));
        }
    }

    safeDeleteUserPassword(p){
        let deleteConfirm = confirm(`${p} will have to re-verify through their Twitch or Discord to set their password again. Is that okay?`);

        if(deleteConfirm == true){
            this.deleteUserPassword(p);
        }
    }

    deleteUserPassword(p){
        fetch('/users/resetPassword?username='+p)
            .then(response => response.json())
            .then((data => {
                let newUsers = Object.assign({}, this.state.users);
                newUsers._hasPassword[p] = false;
                this.setState(Object.assign(this.state, {users:newUsers}));
		    }).bind(this));
    }

    render(){
        if(this.state.stateLoaded == false){return <LoadingCircle></LoadingCircle>;}
        
        let userTable = [];
        for(let p in this.state.users.permissions){
            let trashButton = <FontAwesomeIcon icon={faTrash} size="lg" className="delete-button" name={p} onClick={()=>this.deleteUser(p)} />;
            let resetPasswordButton = <button className="delete-button" name={p} onClick={()=>this.safeDeleteUserPassword(p)}>Reset Password</button>;
            userTable.push(
                <div key={p} className="user-container">
                    <div className="user-entry">
                        <label>Username
                            <input type="text" name={p} defaultValue={this.state.nameChanges[p]} onChange={this.handleNameChange.bind(this)} />
                        </label>
                        <div className="user-section">
                            <label>Admin
                                <FormBoolSwitch name={p} checked={this.state.users.permissions[p].includes("a")} value={"a"} onChange={this.handlePermissionChange.bind(this)} />
                            </label>
                            <label>Mod UI
                                <FormBoolSwitch name={p} checked={this.state.users.permissions[p].includes("m")} value={"m"} onChange={this.handlePermissionChange.bind(this)} />
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
                    <div name={p} className="user-actions">
                            {trashButton}
                            {this.state.users._hasPassword[p] ? resetPasswordButton:null}
                    </div>
                </div>
                
            )
        }
        return <div className="users-tab">
            <div className="plugin-install-button">
                <button onClick={this.createUser}>Create User <FontAwesomeIcon icon={faPlusCircle} size="lg" /></button>
            </div>
            <div className="users-table">
                {userTable}
            </div>
            <div className="save-commands"><button type="button" id="saveCommandsButton" className="save-button" onClick={this.saveUsers}>Save</button><div id="saveStatusText" className="save-status"></div></div>
        </div>;
    }
}

export {UserTab};