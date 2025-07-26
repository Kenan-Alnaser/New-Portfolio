import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ExternalLink, Star, GitFork, Calendar, Code2, Zap, Loader2 } from 'lucide-react';
import { projectsAPI } from '../services/api';

const ProjectCard = ({ project, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 200);

    return () => clearTimeout(timer);
  }, [index]);

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: 'bg-yellow-500',
      Python: 'bg-blue-500',
      TypeScript: 'bg-blue-400',
      'C#': 'bg-purple-500',
      Java: 'bg-orange-500',
      Go: 'bg-cyan-500',
      Rust: 'bg-orange-600'
    };
    return colors[language] || 'bg-gray-500';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <Card 
      className={`cyber-card bg-black/40 border-red-900/30 hover:border-red-500/50 transition-all duration-500 group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-red-300 group-hover:text-red-200 transition-colors text-xl font-semibold flex items-center gap-2">
            <Code2 className="w-5 h-5 text-red-500" />
            {project.name}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Star className="w-4 h-4" />
            <span>{project.stargazers_count}</span>
            <GitFork className="w-4 h-4 ml-2" />
            <span>{project.forks_count}</span>
          </div>
        </div>
        <CardDescription className="text-gray-300 text-base leading-relaxed">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge 
              variant="secondary" 
              className={`${getLanguageColor(project.language)} text-white border-0 px-3 py-1`}
            >
              {project.language}
            </Badge>
            <div className="flex items-center text-gray-400 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              Updated {formatDate(project.updated_at)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="cyber-stats flex items-center gap-4 text-sm text-red-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Active</span>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="cyber-link-button border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-all duration-300"
            onClick={() => window.open(project.html_url, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Code
          </Button>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/5 via-transparent to-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg"></div>
      </CardContent>

      <style jsx>{`
        .cyber-card {
          position: relative;
          backdrop-filter: blur(10px);
          background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.6) 100%);
        }

        .cyber-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ef4444, transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .cyber-card:hover::before {
          opacity: 1;
        }

        .cyber-link-button:hover {
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </Card>
  );
};

const ProjectsSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section id="projects" className="py-20 px-6 bg-gradient-to-b from-black via-gray-900/20 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="circuit-pattern"></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute border border-red-500/20 rotate-45"
            style={{
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative">
            <span 
              className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              GitHub Projects
            </span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Exploring the digital frontier through code. Here are some of my latest experiments in 
            <span className="text-red-400"> artificial intelligence</span>, 
            <span className="text-red-400"> quantum computing</span>, and 
            <span className="text-red-400"> creative technology</span>.
          </p>
          
          {/* Tech Icons */}
          <div className="flex justify-center items-center gap-6 mt-8">
            {['AI', 'Quantum', 'Blockchain', 'VR'].map((tech, index) => (
              <div 
                key={tech}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Zap className={`w-4 h-4 ${hoveredIndex === index ? 'animate-pulse' : ''}`} />
                <span className="text-sm font-medium tracking-wide">{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {mockGitHubProjects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index}
            />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <Button
            className="cyber-cta bg-transparent border-2 border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300 px-8 py-3 text-lg font-semibold tracking-wide transition-all duration-300"
            onClick={() => window.open('https://github.com/Kenan-Alnaser?tab=repositories', '_blank')}
          >
            <ExternalLink className="mr-2 w-5 h-5" />
            Explore All Projects
          </Button>
        </div>
      </div>

      <style jsx>{`
        .circuit-pattern {
          background-image: 
            radial-gradient(circle at 25% 25%, #ef4444 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, #ef4444 1px, transparent 1px);
          background-size: 100px 100px;
          background-position: 0 0, 50px 50px;
          animation: circuit-pulse 8s ease-in-out infinite;
        }

        @keyframes circuit-pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }

        @keyframes float {
          0%, 100% { transform: rotate(45deg) translateY(0px); }
          50% { transform: rotate(45deg) translateY(-20px); }
        }

        .cyber-cta:hover {
          box-shadow: 0 0 30px rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </section>
  );
};

export default ProjectsSection;