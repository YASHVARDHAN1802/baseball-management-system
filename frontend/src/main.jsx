
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // This looks for App.jsx in the same folder
import './styles/global.css'; // This looks inside the styles folder for global.css

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

