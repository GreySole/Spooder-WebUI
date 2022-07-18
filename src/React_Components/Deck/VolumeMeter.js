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
            level:{
                l:0,
                r:0
            }
        }

        if(this.state.level.length>0){
            //console.log(this.state.meters.inputs[m].inputLevelsMul[0][1])
            levels = {
                level:{
                    l:Math.pow(this.state.level[0][1],0.2),
                    r:Math.pow(this.state.level[1][1],0.2),
                },
            }
            
        }else{
            levels = {
                level:{
                    l:0,
                    r:0,
                },
            }
        }

        let levelStyle = {
            level:{clipPath:`polygon(${scaleDim=="X"?(levels.level[this.state.lr]*100):100}% ${scaleDim=="Y"?(100-levels.level[this.state.lr]*100):0}%, 0% ${scaleDim=="Y"?(100-levels.level[this.state.lr]*100):0}%, 0% 100%, ${scaleDim=="X"?(levels.level[this.state.lr]*100):100}% 100%)`},
        }
        
        return <div className="deck-volume-meter-bar" >
                    <div className="deck-volume-meter-bar-peak"></div>
                    <div className="deck-volume-meter-bar-level" style={levelStyle.level}></div>
                    <div className="deck-volume-meter-bar-power"></div>
                </div>;
    }
}

export {VolumeMeter};