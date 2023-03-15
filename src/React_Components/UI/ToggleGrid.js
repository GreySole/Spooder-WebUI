import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCommentDots, faSpider} from '@fortawesome/free-solid-svg-icons';

class ToggleGrid extends React.Component{
    constructor(props){
        super(props);
        this.state = props;
    }

    toggleElement(key){
        console.log(this.state.selected);
        this.state.onToggleChange(this.state.type, key, !this.state.selected.includes(key));
    }

    render(){

        let data = this.state.data;
        let selected = this.state.selected;

        let elements = [];

        for(let d in data){
            elements.push(
                <div className={"toggle-grid-element "+(selected.includes(d)?"selected":"")} onClick={()=>this.toggleElement(d)}>
                    <FontAwesomeIcon icon={this.state.type=="commands"?faCommentDots:faSpider} size="2x"/>
                    <label>{data[d]}</label>
                </div>
            );
        }

        return <div className="toggle-grid">
            {elements}
        </div>
    }
}

export default ToggleGrid;