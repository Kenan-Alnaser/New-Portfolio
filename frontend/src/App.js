import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeroSection from "./components/HeroSection";
import ProjectsSection from "./components/ProjectsSection";
import AboutSection from "./components/AboutSection";
import SocialSection from "./components/SocialSection";
import VideosSection from "./components/VideosSection";
import Footer from "./components/Footer";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CyberpunkPortfolio = () => {
  useEffect(() => {
    // Add custom fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';  
    document.head.appendChild(link);

    // Set document title
    document.title = 'Kenan Alnaser - Cyberpunk Portfolio';

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="cyberpunk-portfolio bg-black text-white overflow-x-hidden">
      {/* Custom CSS Variables */}
      <style jsx global>{`
        :root {
          --cyber-red: #ef4444;
          --cyber-red-dark: #dc2626;
          --cyber-red-light: #f87171;
          --cyber-glow: 0 0 20px rgba(239, 68, 68, 0.3);
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: var(--cyber-red) #1a1a1a;
        }

        *::-webkit-scrollbar {
          width: 8px;
        }

        *::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        *::-webkit-scrollbar-thumb {
          background: var(--cyber-red);
          border-radius: 4px;
        }

        *::-webkit-scrollbar-thumb:hover {
          background: var(--cyber-red-light);
        }

        .cyberpunk-portfolio {
          font-family: 'Exo 2', 'Orbitron', sans-serif;
          background: radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%);
          min-height: 100vh;
          position: relative;
        }

        .cyberpunk-portfolio::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(239, 68, 68, 0.02) 0%, transparent 50%);
          pointer-events: none;
          z-index: 1;
        }

        .cyberpunk-portfolio > * {
          position: relative;
          z-index: 2;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Custom selection */
        ::selection {
          background: rgba(239, 68, 68, 0.3);
          color: #ffffff;
        }

        /* Cyber glow animations */
        @keyframes cyber-pulse {
          0%, 100% { box-shadow: 0 0 5px rgba(239, 68, 68, 0.5); }
          50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.4); }
        }

        @keyframes data-flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }

        /* Loading animation for images */
        .img-loading {
          background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 37%, #1a1a1a 63%);
          background-size: 400% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <SocialSection />
      <VideosSection />
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CyberpunkPortfolio />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;