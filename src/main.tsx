import React from 'react';
import ReactDOM from 'react-dom/client';
import Page from './page'; // This imports your default function Page() from src/page.tsx

// Find the HTML root element container node
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find the root element framework node wrapper in your index.html.");
}

// Mount the React Application into the Browser DOM
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>
);