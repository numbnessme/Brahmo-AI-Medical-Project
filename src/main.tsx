import React from 'react';
import ReactDOM from 'react-dom/client';
import Page from './page';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element in your index.html.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>
);
