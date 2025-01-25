import React from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import store from './app/store';
import InitLayer from './InitLayer';

const rootElement = document.getElementById('app');
const root = createRoot(rootElement!);
//root.render(<FixedHeaderPage />);
root.render(
  <Provider store={store}>
    <InitLayer />
  </Provider>,
);
