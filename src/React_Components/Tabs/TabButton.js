import React from 'react'

const TabButton = ({ tabName, onClick, children, tabState }) => {
    return (
        <button type="button" className={'tab-button' + (tabState == tabName ? ' selected' : '')} onClick={onClick}>
            {children}
        </button>
    );
};

export default TabButton;