
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Use a more performant approach with strict mode disabled in production
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

// Only use StrictMode in development
if (import.meta.env.DEV) {
  import('react').then(({ StrictMode }) => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  });
} else {
  root.render(<App />);
}
