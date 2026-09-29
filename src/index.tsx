import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/store';
import App from './app/App.tsx';
import { getBase } from 'vite-basepath/runtime';
import './index.css';
import './shared/lib/fonts/fonts.css';
import './shared/lib/variables.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={getBase()}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
