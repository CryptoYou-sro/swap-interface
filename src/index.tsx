import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Header } from './components';
import reportWebVitals from './reportWebVitals';
import { FontStyles } from './styles';
import { AuthProvider } from './helpers';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <FontStyles />
      <Header />
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
