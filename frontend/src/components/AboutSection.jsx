import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Zap, Brain, Code, Cpu, Database, GitBranch, Loader2 } from 'lucide-react';
import { profileAPI } from '../services/api';

const AboutSection = () => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [activeSkill, setActiveSkill] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileAPI.getProfile();
        setProfileData(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleItems(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in-item');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const getSkillIcon = (skill) => {
    const icons = {
      'Full-stack Development': Code,
      'AI Tools': Brain,
      'Creative Coding': Zap,
      'Quantum Computing': Cpu
    };
    return icons[skill] || Code;
  };

  const getToolIcon = (tool) => {
    const icons = {
      'JavaScript': Code,
      'Python': Code,
      'React': Code,
      'Node.js': Database,
      'TensorFlow': Brain,
      'GitHub': GitBranch,
      'Docker': Database
    };
    return icons[tool] || Code;
  };

  return (
    <section id="about" className="py-20 px-6 bg-gradient-to-b from-black via-gray-900/10 to-black relative overflow-hidden">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="matrix-bg"></div>
      </div>

      {/* Glowing Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-32 h-32 bg-red-500/5 rounded-full blur-xl animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative">
            <span 
              className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Who is Kenan?
            </span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card 
              className={`cyber-card bg-black/40 border-red-900/30 hover:border-red-500/50 transition-all duration-500 fade-in-item h-full ${
                visibleItems.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              data-index="0"
            >
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Profile Image Placeholder */}
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-red-900/20 rounded-full border-2 border-red-500/30 flex items-center justify-center group hover:border-red-500 transition-colors">
                      <Brain className="w-10 h-10 text-red-400 group-hover:text-red-300 transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-red-300 mb-2">{mockPersonalInfo.name}</h3>
                      <p className="text-red-400 font-medium">{mockPersonalInfo.title}</p>
                      <div className="flex items-center gap-2 mt-2 text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{mockPersonalInfo.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="border-l-2 border-red-500/30 pl-6">
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {mockPersonalInfo.bio}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="text-center p-4 bg-red-900/10 rounded-lg border border-red-900/20">
                      <div className="text-2xl font-bold text-red-400 mb-1">50+</div>
                      <div className="text-sm text-gray-400">Projects</div>
                    </div>
                    <div className="text-center p-4 bg-red-900/10 rounded-lg border border-red-900/20">
                      <div className="text-2xl font-bold text-red-400 mb-1">5+</div>
                      <div className="text-sm text-gray-400">Years Experience</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills & Tools Sidebar */}
          <div className="space-y-8">
            {/* Specialties */}
            <Card 
              className={`cyber-card bg-black/40 border-red-900/30 hover:border-red-500/50 transition-all duration-500 fade-in-item ${
                visibleItems.includes(1) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
              data-index="1"
            >
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold text-red-300 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-red-500" />
                  Specialties
                </h4>
                <div className="space-y-3">
                  {mockPersonalInfo.specialties.map((skill, index) => {
                    const IconComponent = getSkillIcon(skill);
                    return (
                      <div 
                        key={skill}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-900/10 transition-colors cursor-pointer group"
                        onMouseEnter={() => setActiveSkill(index)}
                        onMouseLeave={() => setActiveSkill(null)}
                      >
                        <IconComponent 
                          className={`w-5 h-5 transition-colors ${
                            activeSkill === index ? 'text-red-400' : 'text-red-600'
                          }`} 
                        />
                        <span className={`text-sm transition-colors ${
                          activeSkill === index ? 'text-red-300' : 'text-gray-300'
                        }`}>
                          {skill}
                        </span>
                        <div className={`ml-auto w-2 h-2 rounded-full transition-colors ${
                          activeSkill === index ? 'bg-red-500' : 'bg-red-900'
                        }`}></div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Tools */}
            <Card 
              className={`cyber-card bg-black/40 border-red-900/30 hover:border-red-500/50 transition-all duration-500 fade-in-item ${
                visibleItems.includes(2) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
              data-index="2"
            >
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold text-red-300 mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-red-500" />
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {mockPersonalInfo.tools.map((tool, index) => {
                    const IconComponent = getToolIcon(tool);
                    return (
                      <Badge
                        key={tool}
                        variant="secondary"
                        className="bg-red-900/20 text-red-300 border-red-800/30 hover:bg-red-800/30 hover:border-red-700/50 transition-all cursor-pointer flex items-center gap-1 px-3 py-2"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <IconComponent className="w-3 h-3" />
                        {tool}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        .matrix-bg {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(239, 68, 68, 0.03) 2px,
            rgba(239, 68, 68, 0.03) 4px
          );
          animation: matrix-scroll 10s linear infinite;
        }

        @keyframes matrix-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 0 20px; }
        }

        .cyber-card {
          position: relative;
          backdrop-filter: blur(10px);
          background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.6) 100%);
        }

        .fade-in-item {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </section>
  );
};

export default AboutSection;