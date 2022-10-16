import React from 'react';

class VolumeMeter extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            level:props.level,
            lr:props.lr
        }
    }

    
    render(){
        let scaleDim = window.innerWidth<600?"X":"Y";
        let levels = {
            level:0
        }

        if(this.state.level){
            levels.level = Math.pow(this.state.level[1], 0.2);
            
        }else{
            levels = {
                level:0
            }
        }

        let levelStyle = {
            level:{clipPath:`polygon(${scaleDim=="X"?(levels.level*100):100}% ${scaleDim=="Y"?(100-levels.level*100):0}%, 0% ${scaleDim=="Y"?(100-levels.level*100):0}%, 0% 100%, ${scaleDim=="X"?(levels.level*100):100}% 100%)`},
        }
        
        /*return <div className="deck-volume-meter-bar" >
                    <div className="deck-volume-meter-bar-peak"></div>
                    <div className="deck-volume-meter-bar-level" style={levelStyle.level}></div>
                    <div className="deck-volume-meter-bar-power"></div>
                </div>;*/
        return <div className="deck-volume-meter-bar" >
                <div className="deck-volume-meter-bar-peak"></div>
                <div className="deck-volume-meter-bar-level" style={levelStyle.level}></div>
                <div className="deck-volume-meter-bar-power"></div>
            </div>;
    }
}

export {VolumeMeter};