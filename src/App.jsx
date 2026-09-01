import React, { useEffect } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Policies from './pages/Policies';
import Admin from './pages/Admin';
import ClientPortal from './pages/ClientPortal';
import EditorPortal from './pages/EditorPortal';
import DesignerPortal from './pages/DesignerPortal';
import MyBooking from './pages/MyBooking';
import AiSearch from './pages/AiSearch';
import GroomBrideSignup from './pages/GroomBrideSignup';
import NotFound from './pages/NotFound';
import CustomCursor from './components/ui/CustomCursor';
import TrivandrumOffer from './pages/TrivandrumOffer';
import CustomPackage from './pages/CustomPackage';
import Packages from './pages/Packages';
import DigitalProposal from './pages/DigitalProposal';
import ClientGallery from './pages/ClientGallery';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Global Error Boundary to prevent any blank screen crash
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dreamwed UI Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-950/50 border border-red-800/40 flex items-center justify-center text-red-400 mx-auto">
            <span className="text-2xl font-bold">⚠️</span>
          </div>
          <h1 className="text-2xl font-light">Something went wrong</h1>
          <p className="text-zinc-400 text-xs max-w-md font-mono bg-zinc-900 p-3 rounded-xl border border-zinc-800 break-words">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-6 py-2.5 bg-[#b4975a] text-zinc-950 font-bold uppercase tracking-wider rounded-xl text-xs hover:brightness-110 transition-all cursor-pointer shadow-lg"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/policies" element={<Policies />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/my-booking" element={<ClientPortal />} />
      <Route path="/booking" element={<MyBooking />} />
      <Route path="/groom/bride" element={<GroomBrideSignup />} />
      <Route path="/grrom/bride" element={<GroomBrideSignup />} />
      <Route path="/groom-bride" element={<GroomBrideSignup />} />
      <Route path="/editor" element={<EditorPortal />} />
      <Route path="/designer" element={<DesignerPortal />} />
      <Route path="/ai-search" element={<AiSearch />} />
      <Route path="/trivandrum-offer" element={<TrivandrumOffer />} />
      <Route path="/custom-package" element={<CustomPackage />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/proposal" element={<DigitalProposal />} />
      <Route path="/gallery" element={<ClientGallery />} />
      <Route path="/gallery/:id" element={<ClientGallery />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isPortalPath = ["/my-booking", "/admin", "/editor", "/designer", "/ai-search", "/groom/bride", "/grrom/bride", "/groom-bride", "/proposal", "/gallery"].some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <div className="flex flex-col min-h-screen">
      {!isPortalPath && <Header />}
      <main className="flex-grow">
        <AnimatedRoutes />
      </main>
      {!isPortalPath && <Footer />}
    </div>
  );
};

function App() {
  const RouterComponent = window.location.protocol === 'file:' ? HashRouter : BrowserRouter;
  return (
    <ErrorBoundary>
      <RouterComponent>
        <ScrollToTop />
        <CustomCursor />
        <AppContent />
      </RouterComponent>
    </ErrorBoundary>
  );
}

export default App;
