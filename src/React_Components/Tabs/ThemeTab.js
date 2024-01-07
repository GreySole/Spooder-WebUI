import React from 'react';
import ColorEditor from '../UI/ColorEditor.js';
import LoadingCircle from '../UI/LoadingCircle';

var cStyle = getComputedStyle(document.querySelector(":root"));
class ThemeTab extends React.Component{
	constructor(props){
        super(props);
        let savedTheme = null;
        try{
            savedTheme = JSON.parse(localStorage.getItem("theme"));
        }catch(e){
            console.log("No saved theme found");
        }
        
        let resetStyle = Object.assign(props.editStyle);
        if(savedTheme == null){
            savedTheme=Object.assign(props.editStyle);
        }
        
        this.state = {
            resetStyle: resetStyle,
            editTime:Date.now(),
            currentTheme:savedTheme,
            syncTheme:props.syncTheme
        };

        this.updateVar = this.updateVar.bind(this);
        this.saveTheme = this.saveTheme.bind(this);
        this.resetTheme = this.resetTheme.bind(this);
    }

    updateVar(name, color){
        
        let newTheme = Object.assign(this.state.currentTheme, {[name]:color});
        this.setState(Object.assign(this.state, {currentTheme:newTheme}));
    }

    setTheme(){
        let theme = this.state.currentTheme;
        
        for(let style in theme){
            document.documentElement.style.setProperty(style, theme[style]);
        }
    }

    saveTheme(){
        localStorage.setItem("theme", JSON.stringify(Object.assign(this.state.currentTheme)));
    }

    resetTheme(){
        console.log("DEFAULT THEME",this.state.resetStyle);
        localStorage.removeItem("theme");
        this.setState(Object.assign(this.state, {currentTheme:Object.assign(this.state.currentTheme, this.state.resetStyle), editTime:Date.now()}));
    }

    getAllCSSVars(){
        let themeState = {};
        let varnames = Array.from(document.styleSheets)
        .filter(
            sheet =>
            sheet.href === null || sheet.href.startsWith(window.location.origin)
        )
        .reduce(
            (acc, sheet) =>
            (acc = [
                ...acc,
                ...Array.from(sheet.cssRules).reduce(
                (def, rule) =>
                    (def =
                    rule.selectorText === ":root"
                        ? [
                            ...def,
                            ...Array.from(rule.style).filter(name =>
                            name.startsWith("--")
                            )
                        ]
                        : def),
                []
                )
            ]),
            []
        );
        for(let v in varnames){
            themeState[varnames[v]] = cStyle.getPropertyValue(varnames[v]);
        }

        return themeState;
    }

    render(){
        this.setTheme();
        let currentStyle = this.state.currentTheme;
        if(currentStyle != null){
            let colors = [];
            for(let style in currentStyle){
                if(style == "--margin-correction"){continue;}
                if(style =="--app-background-image"){
                    colors.push(
                        <label>{style}
                            <input type="text" defaultValue={currentStyle[style]} onInput={(e)=>this.updateVar(style, e.currentTarget.value)}/>
                        </label>
                    )
                }else{
                    colors.push(
                        <label>{style}
                            <ColorEditor key={style+"-"+this.state.editTime} inputStyle={currentStyle[style]} cssvarname={style} onColorChanged={this.updateVar} />
                        </label>
                    )
                }
                
            }

            return <div className="theme-editor">
                <div className="theme-editor-content">
                    <div className="color-container">
                        {colors}
                    </div>
                </div>
                <div className="theme-editor-actions">
                    <button className="modcheck-button" onClick={this.saveTheme}>Save</button>
                    <button className="modcheck-button" onClick={this.state.syncTheme}>Sync</button>
                    <button className="modcheck-button" onClick={this.resetTheme}>Reset</button>
                </div>
            </div>
        }
    }
}

export {ThemeTab};