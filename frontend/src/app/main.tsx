import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/iosevka-charon/300.css';
import '@fontsource/iosevka-charon/400.css';
import '@fontsource/iosevka-charon/500.css';
import '@fontsource/iosevka-charon/700.css';
import '@/shared/styles/globals.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
