import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const container = document.createElement('div');
container.setAttribute('id', 'root');
document.body.appendChild(container);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
