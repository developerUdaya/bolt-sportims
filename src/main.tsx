import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LocationProvider } from './context/LocationContext.tsx';
import { ClubProvider } from './context/ClubContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocationProvider>
       <ClubProvider>
      <App />
      </ClubProvider>
    </LocationProvider>
  </StrictMode>
);
