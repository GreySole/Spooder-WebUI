import React from "react";
import tinycolor from "tinycolor2";

class ColorEditor extends React.Component{
    constructor(props){
        super(props);
        let inputStyle = tinycolor(props.inputStyle);
        this.state = {
            name:props.cssvarname,
            color:inputStyle.toHexString(),
            alpha:inputStyle.getAlpha(),
            onColorChanged:props.onColorChanged
        }

        this.onColorChanged = this.onColorChanged.bind(this);
        this.onAlphaChanged = this.onAlphaChanged.bind(this);
    }

    onColorChanged(e){
        this.setState(Object.assign(this.state, {color:e.currentTarget.value}));
        this.state.onColorChanged(this.state.name, tinycolor(this.state.color).setAlpha(this.state.alpha).toRgbString());
    }

    onAlphaChanged(e){
        this.setState(Object.assign(this.state, {alpha:e.currentTarget.value/100}));
        this.state.onColorChanged(this.state.name, tinycolor(this.state.color).setAlpha(this.state.alpha).toRgbString());
    }

    render(){
        return <div className="theme-color-edit">
            <input name="color" type="color" value={this.state.color} onChange={this.onColorChanged}/>
            <input name="alpha" type="range" min="0" max="100" value={this.state.alpha*100} onChange={this.onAlphaChanged}/>
        </div>
    }
}

export default ColorEditor;