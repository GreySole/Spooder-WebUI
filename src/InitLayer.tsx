import React from 'react';
import useServer from './app/hooks/useServer';
import App from './ui/app/App';
import { OscProvider, ThemeProvider } from '@greysole/spooder-component-library';
import './ui/common/css/core/index.scss';

export default function InitLayer() {
  const { getServerState } = useServer();
  const { data, isLoading, error } = getServerState();

  if (error) {
    return (
      <div className='App'>
        <div className='locals-only'>
          <h1 className='App-title'>/╲/\( ºx ω xº )/\╱\</h1>
          <h1>Can't connect to Spooder. Is it on?</h1>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return null;
  }

  const theme =
    localStorage.getItem('themeVariables') != null
      ? JSON.parse(localStorage.getItem('themeVariables')!)
      : {
          hue: 0,
          saturation: 0.5,
          isDarkTheme: true,
        };

  return (
    <ThemeProvider theme={theme} spooder={data.themes.spooderpet}>
      <OscProvider host={data.host} port={data.port}>
        <App />
      </OscProvider>
    </ThemeProvider>
  );
}
