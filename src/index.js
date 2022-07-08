
import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './React_Components/App.js';
import './React_Components/reset.css';
import './index.css';
import './React_Components/Tabs/CommandTable.css';
import './React_Components/Tabs/ConfigTab.css';
import './React_Components/Tabs/Monitor.css';
import './React_Components/Tabs/ThemeTab.css';
import './React_Components/UI/Helpers.js';
import './React_Components/UI/BoolSwitch.js';

const rootElement = document.getElementById("app");
const root = createRoot(rootElement);
root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
