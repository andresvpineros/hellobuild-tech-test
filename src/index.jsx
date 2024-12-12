import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SnackbarProvider } from 'notistack'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SnackbarProvider 
      autoHideDuration={5000}
      maxSnack={3}
    >
      <App />
    </SnackbarProvider>
  </React.StrictMode>
);