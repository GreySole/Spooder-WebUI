import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faSquareArrowUpRight } from '@fortawesome/free-solid-svg-icons';

class LinkButton extends React.Component{
    constructor(props){
        super(props);
        this.state =  {
            name:props.name,
            text:props.text,
            link:props.link,
            mode:props.mode
        };

        this.clickLink = this.clickLink.bind(this);
        this.fallbackCopyTextToClipboard = this.fallbackCopyTextToClipboard.bind(this);
    }

    clickLink(){
        if(this.state.mode === "newtab"){
            window.open(this.state.link, "_blank");
        }else if(this.state.mode === "copy"){
            this.copyTextToClipboard(this.state.link);
        }
    }

    fallbackCopyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        
        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
      
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
      
        try {
          var successful = document.execCommand('copy');
          var msg = successful ? 'successful' : 'unsuccessful';
          console.log('Fallback: Copying text command was ' + msg);
          window.setClass(document.querySelector("#linkButton-"+this.state.name), "success", true);
          setTimeout(() => {
            window.setClass(document.querySelector("#linkButton-"+this.state.name), "success", false);
          }, 5000);
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err);
        }
      
        document.body.removeChild(textArea);
      }

    copyTextToClipboard(text) {
        if (!navigator.clipboard) {
          this.fallbackCopyTextToClipboard(text);
          return;
        }
        navigator.clipboard.writeText(text).then(function() {
          console.log('Async: Copying to clipboard was successful!');
          window.setClass(document.querySelector("#linkButton-"+this.state.name), "success", true);
          setTimeout(() => {
            window.setClass(document.querySelector("#linkButton-"+this.state.name), "success", false);
          }, 5000);
        }, function(err) {
          console.error('Async: Could not copy text: ', err);
        });
      }

    render(){
        let iconLink = null;
        if(this.state.mode == "newtab"){
            iconLink = faSquareArrowUpRight;
        }else if(this.state.mode == "copy"){
            iconLink = faClipboard;
        }
        return <div className="link-button">
            
            <button id={"linkButton-"+this.state.name} className={"link-button-button "+this.state.mode+" "} type="button" onClick={this.clickLink}>{this.state.text} <FontAwesomeIcon icon={iconLink} size="lg" /></button>
        </div>;
    }
}

export default LinkButton;