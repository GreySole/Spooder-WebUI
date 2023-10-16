import React from 'react';
import DashedCircle from '../../icons/DashedCircle.svg';

class LoadingCircle extends React.Component{
    constructor(props){
        super(props);
        this.state = {...props};
    }

    render(){
        return <div className="loading-circle"><img src={DashedCircle} height="250px" /></div>;
    }
}

export default LoadingCircle;