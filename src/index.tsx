import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app/App.tsx';
import { UsersDbProvider } from './shared/context/users-db-context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UsersDbProvider>
      <App />
    </UsersDbProvider>
  </StrictMode>
);
