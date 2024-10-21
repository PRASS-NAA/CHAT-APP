import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import { ReceiverProvider } from './receiverProvider'; // Ensure this path is correct

const root = ReactDOM.createRoot(
  document.getElementById('root')
);
root.render(
  <BrowserRouter>
    <AuthContextProvider>
      <ReceiverProvider>
        <App />
      </ReceiverProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
