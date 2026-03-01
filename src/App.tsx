import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './lib/theme';
import ParticlesBg from './components/ParticlesBg';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

const PrizesPage = lazy(() => import('./pages/PrizesPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="relative min-h-screen flex flex-col">
          <ParticlesBg />
          <Navbar />
          <main className="flex-1 relative z-10">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/prizes" element={<PrizesPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />

          <Toaster
            position="top-center"
            toastOptions={{
              className: 'toast-custom',
              duration: 3000,
              style: {
                background: 'var(--color-bg-card)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
              },
            }}
          />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
