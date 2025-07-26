import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ChevronDown, Zap, Code, Cpu } from 'lucide-react';

const HeroSection = () => {
  const [glitchText, setGlitchText] = useState('Kenan Alnaser');
  const [isGlitching, setIsGlitching] = useState(false);

  const originalText = 'Kenan Alnaser';
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const createGlitchEffect = () => {
    setIsGlitching(true);
    let iterations = 0;
    const maxIterations = 10;

    const interval = setInterval(() => {
      setGlitchText(prev => {
        return originalText
          .split('')
          .map((char, index) => {
            if (iterations < maxIterations && Math.random() < 0.3) {
              return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
            return originalText[index];
          })
          .join('');
      });

      iterations++;
      if (iterations >= maxIterations + 5) {
        clearInterval(interval);
        setGlitchText(originalText);
        setIsGlitching(false);
      }
    }, 100);
  };

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (!isGlitching && Math.random() < 0.1) {
        createGlitchEffect();
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, [isGlitching]);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-black to-red-900/5"></div>
        <div className="grid-background"></div>
      </div>

      {/* Cyber Grid Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="cyber-lines"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Name with Glitch Effect */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 relative">
          <span 
            className="cyber-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]"
            style={{ fontFamily: 'Orbitron, monospace' }}
          >
            {glitchText}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent opacity-50 transform translate-x-1 translate-y-1 -z-10">
            {glitchText}
          </div>
        </h1>

        {/* Subtitle */}
        <div className="mb-8 space-y-2">
          <p className="text-xl md:text-2xl text-red-300 font-light tracking-wider">
            Software Engineer | Futurist | Creative Technologist
          </p>
          <div className="flex justify-center items-center space-x-4 text-red-400">
            <Code className="w-5 h-5 animate-pulse" />
            <div className="w-12 h-px bg-red-500"></div>
            <Cpu className="w-5 h-5 animate-pulse" />
            <div className="w-12 h-px bg-red-500"></div>
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Intro Text */}
        <div className="mb-12 max-w-2xl mx-auto">
          <p className="text-gray-300 text-lg leading-relaxed opacity-90">
            Driven by innovation and boundless curiosity, I bring ideas to life through code and creative experimentation. 
            <span className="text-red-400 font-medium"> This is my digital space—welcome.</span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            onClick={() => scrollToSection('projects')}
            className="cyber-button bg-transparent border-2 border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300 px-8 py-3 text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]"
          >
            View Projects
            <Code className="ml-2 w-5 h-5" />
          </Button>
          <Button
            onClick={() => scrollToSection('about')}
            variant="outline"
            className="cyber-button border-gray-500 text-gray-300 hover:border-red-400 hover:text-red-400 px-8 py-3 text-lg transition-all duration-300"
          >
            About Me
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center animate-bounce">
          <p className="text-red-400 text-sm mb-2 tracking-wider">SCROLL TO EXPLORE</p>
          <ChevronDown className="w-6 h-6 text-red-500" />
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .grid-background {
          background-image: 
            linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
        }

        .cyber-lines::before,
        .cyber-lines::after {
          content: '';
          position: absolute;
          background: linear-gradient(90deg, transparent, #ef4444, transparent);
          height: 1px;
          width: 100%;
          animation: scan 4s linear infinite;
        }

        .cyber-lines::before {
          top: 20%;
          animation-delay: 0s;
        }

        .cyber-lines::after {
          top: 80%;
          animation-delay: 2s;
        }

        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        @keyframes scan {
          0%, 100% { transform: translateX(-100%); opacity: 0; }
          50% { transform: translateX(0); opacity: 1; }
        }

        .cyber-text {
          text-shadow: 
            0 0 10px rgba(239, 68, 68, 0.5),
            0 0 20px rgba(239, 68, 68, 0.3),
            0 0 40px rgba(239, 68, 68, 0.1);
        }

        .cyber-button {
          position: relative;
          overflow: hidden;
        }

        .cyber-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.2), transparent);
          transition: left 0.5s;
        }

        .cyber-button:hover::before {
          left: 100%;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;