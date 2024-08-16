import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './store/index.js';
import { WebSocketProvider } from './webscoket/WebSocketContext.jsx'; // Import WebSocketProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <WebSocketProvider> {/* Wrap your App component with WebSocketProvider */}
        <App />
      </WebSocketProvider>
    </Provider>
  </StrictMode>,
);
