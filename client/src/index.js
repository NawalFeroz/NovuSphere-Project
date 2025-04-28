import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <=== this is important
import App from './App';
import './index.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* 🛡️ Now Routes will work safely inside */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
