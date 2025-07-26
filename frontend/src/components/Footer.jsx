import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Github, Heart, Code, Zap, ArrowUp, Terminal } from 'lucide-react';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <footer className="relative bg-gradient-to-t from-black via-gray-900/20 to-black border-t border-red-900/20 overflow-hidden">
      {/* Background Matrix */}
      <div className="absolute inset-0 opacity-5">
        <div className="matrix-footer"></div>
      </div>

      {/* Glitch Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="glitch-line"></div>
        <div className="glitch-line" style={{ animationDelay: '2s', bottom: '30%' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-red-900/20 rounded-lg border border-red-500/30 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-300" style={{ fontFamily: 'Orbitron, monospace' }}>
                  Kenan Alnaser
                </h3>
                <p className="text-gray-400 text-sm">Digital Architect</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Crafting the future through code, creativity, and relentless innovation. 
              Welcome to my corner of the digital universe.
            </p>
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <Zap className="w-4 h-4 animate-pulse" />
              <span>Status: Online & Creating</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-red-300 mb-4">Navigate</h4>
            <div className="space-y-2">
              {[
                { label: 'Projects', href: '#projects' },
                { label: 'About', href: '#about' },
                { label: 'Social', href: '#social' },
                { label: 'Videos', href: '#videos' }
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => document.getElementById(link.href.slice(1))?.scrollIntoView({ behavior: 'smooth' })}
                  className="block text-gray-400 hover:text-red-400 transition-colors text-sm py-1 hover:translate-x-1 transform duration-200"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* System Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-red-300 mb-4">System Status</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Local Time:</span>
                <span className="text-red-400 font-mono">{formatTime(currentTime)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Version:</span>
                <span className="text-red-400 font-mono">2025.1.0</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Environment:</span>
                <span className="text-green-400 font-mono">Production</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Uptime:</span>
                <span className="text-red-400 font-mono">24/7</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-red-900/30 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Crafted with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>and</span>
            <Code className="w-4 h-4 text-red-500" />
            <span>by Kenan Alnaser</span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-all duration-300"
              onClick={() => window.open('https://github.com/Kenan-Alnaser', '_blank')}
            >
              <Github className="w-4 h-4 mr-2" />
              Source
            </Button>
            
            <div className="text-gray-500 text-sm">
              © 2025 All rights reserved
            </div>
          </div>
        </div>

        {/* Terminal-like Footer */}
        <div className="mt-8 bg-black/60 border border-red-900/30 rounded-lg p-4 font-mono text-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400">root@kenan-portfolio:~$</span>
            <span className="text-gray-300">echo "Thanks for visiting my digital space!"</span>
          </div>
          <div className="text-green-400">Thanks for visiting my digital space!</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-red-400">root@kenan-portfolio:~$</span>
            <span className="text-gray-300 animate-pulse">_</span>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 cyber-scroll-btn bg-red-500/90 hover:bg-red-600 text-white w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}

      <style jsx>{`
        .matrix-footer {
          background-image: 
            linear-gradient(0deg, transparent 24%, rgba(239, 68, 68, 0.05) 25%, rgba(239, 68, 68, 0.05) 26%, transparent 27%, transparent 74%, rgba(239, 68, 68, 0.05) 75%, rgba(239, 68, 68, 0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(239, 68, 68, 0.05) 25%, rgba(239, 68, 68, 0.05) 26%, transparent 27%, transparent 74%, rgba(239, 68, 68, 0.05) 75%, rgba(239, 68, 68, 0.05) 76%, transparent 77%, transparent);
          background-size: 30px 30px;
          animation: matrix-flow 10s linear infinite;
        }

        @keyframes matrix-flow {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 30px 30px, -30px 30px; }
        }

        .glitch-line {
          position: absolute;
          top: 20%;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #ef4444, transparent);
          animation: glitch-scan 4s ease-in-out infinite;
        }

        @keyframes glitch-scan {
          0%, 100% { transform: translateX(-100%); opacity: 0; }
          50% { transform: translateX(0); opacity: 1; }
        }

        .cyber-scroll-btn {
          backdrop-filter: blur(10px);
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
        }

        .cyber-scroll-btn:hover {
          box-shadow: 0 0 30px rgba(239, 68, 68, 0.6);
        }
      `}</style>
    </footer>
  );
};

export default Footer;