
import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './React_Components/App.js';
import './React_Components/reset.css';
import './index.scss';
import './React_Components/Tabs/CommandTable.css';
import './React_Components/Tabs/TwitchTab.css';
import './React_Components/Tabs/ConfigTab.css';
import './React_Components/Tabs/UserTab.css';
import './React_Components/UI/Helpers.js';
import './React_Components/UI/BoolSwitch.js';
import './React_Components/UI/LoadingCircle.js';
import './React_Components/UI/LoadingCircle.css';

const rootElement = document.getElementById("app");
const root = createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
  );
