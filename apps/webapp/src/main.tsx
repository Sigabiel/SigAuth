import '@/index.css';
import App from '@/routes/App';
import Login from '@/routes/Login.tsx';

import { StrictMode } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from 'react-router';

const root = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <StrictMode>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </StrictMode>
  </BrowserRouter>
)