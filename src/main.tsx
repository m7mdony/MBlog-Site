import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeGTM } from './lib/gtm-manager'

// تهيئة GTM عند تحميل التطبيق
initializeGTM();

createRoot(document.getElementById("root")!).render(<App />);
