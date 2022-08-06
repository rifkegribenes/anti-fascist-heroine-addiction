import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import store from './store/store';
import App from './App';
import './style.scss';

const root = createRoot(document.getElementById("root"));


root.render(
  <Provider store={store}>
    <AppContainer>
      <App />
    </AppContainer>
  </Provider>
);

if (module.hot) module.hot.accept(App, () => render(App));
