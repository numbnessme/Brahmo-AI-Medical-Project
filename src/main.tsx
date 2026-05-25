<<<<<<< HEAD
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
=======
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
>>>>>>> 944af93d08b53034c33eae1d1ba4435a6275b980
);