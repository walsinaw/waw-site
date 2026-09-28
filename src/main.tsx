import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/global.css';
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';

// O painel só é baixado por quem abre /admin.
const AdminApp = lazy(() => import('./admin/AdminApp'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={null}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
