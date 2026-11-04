import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import { Prototype } from './pages/Prototype';
import './styles/global.css';

const rootElement = document.getElementById('root');

// Check if prototype route is requested
const isPrototype =
  typeof window !== 'undefined' &&
  (window.location.pathname === '/prototype' ||
    window.location.search.includes('prototype=true') ||
    window.location.hash === '#prototype');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {isPrototype ? <Prototype /> : <App />}
    </React.StrictMode>
  );
}
