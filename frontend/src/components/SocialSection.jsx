import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Github, Linkedin, Youtube, Twitch, ExternalLink, Users, Radio, Loader2 } from 'lucide-react';
import { socialAPI } from '../services/api';

const SocialSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const getIcon = (iconName) => {
    const icons = {
      Github,
      Linkedin,
      Youtube,
      Twitch
    };
    return icons[iconName] || ExternalLink;
  };

  const getSocialStats = (platform) => {
    const stats = {
      GitHub: { followers: '2.3K', label: 'Followers' },
      LinkedIn: { followers: '5.7K', label: 'Connections' },
      YouTube: { followers: '12.4K', label: 'Subscribers' },
      Twitch: { followers: '3.8K', label: 'Followers' }
    };
    return stats[platform] || { followers: '1K+', label: 'Followers' };
  };

  const getPlatformColor = (platform) => {
    const colors = {
      GitHub: 'hover:text-gray-300 hover:border-gray-400',
      LinkedIn: 'hover:text-blue-400 hover:border-blue-500',
      YouTube: 'hover:text-red-400 hover:border-red-500',
      Twitch: 'hover:text-purple-400 hover:border-purple-500'
    };
    return colors[platform] || 'hover:text-red-400 hover:border-red-500';
  };

  return (
    <section id="social" className="py-20 px-6 bg-gradient-to-b from-black via-gray-900/5 to-black relative overflow-hidden">
      {/* Digital Rain Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="digital-rain"></div>
      </div>

      {/* Floating Data Streams */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-20"
            style={{
              width: '200px',
              top: `${20 + i * 15}%`,
              animation: `data-flow ${8 + i * 2}s linear infinite`,
              animationDelay: `${i * 2}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative">
            <span 
              className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Digital Connections
            </span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Connect with me across the digital sphere. Follow my journey through code, content, and creative exploration.
          </p>
        </div>

        {/* Social Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {mockSocialLinks.map((social, index) => {
            const IconComponent = getIcon(social.icon);
            const stats = getSocialStats(social.name);
            const colorClass = getPlatformColor(social.name);

            return (
              <Card
                key={social.name}
                className={`cyber-social-card bg-black/40 border-red-900/30 hover:border-red-500/50 transition-all duration-500 group cursor-pointer ${
                  hoveredIndex === index ? 'scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => window.open(social.url, '_blank')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-red-900/20 border border-red-800/30 flex items-center justify-center group-hover:bg-red-800/30 transition-all ${colorClass}`}>
                        <IconComponent className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-red-300 group-hover:text-red-200 transition-colors">
                          {social.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {social.name === 'GitHub' && 'Code Repository'}
                          {social.name === 'LinkedIn' && 'Professional Network'}
                          {social.name === 'YouTube' && 'Tech Content'}
                          {social.name === 'Twitch' && 'Live Coding'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-400 group-hover:text-red-300 transition-colors">
                        {stats.followers}
                      </div>
                      <div className="text-gray-500 text-sm">{stats.label}</div>
                    </div>
                  </div>

                  {/* Platform-specific details */}
                  <div className="mt-4 pt-4 border-t border-red-900/20">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        {social.name === 'GitHub' && (
                          <>
                            <Radio className="w-4 h-4" />
                            <span>50+ Repositories</span>
                          </>
                        )}
                        {social.name === 'LinkedIn' && (
                          <>
                            <Users className="w-4 h-4" />
                            <span>Tech Professional</span>
                          </>
                        )}
                        {social.name === 'YouTube' && (
                          <>
                            <Radio className="w-4 h-4 text-red-500" />
                            <span>Weekly Uploads</span>
                          </>
                        )}
                        {social.name === 'Twitch' && (
                          <>
                            <Radio className="w-4 h-4 text-purple-500" />
                            <span>Live Sessions</span>
                          </>
                        )}
                      </div>
                      <ExternalLink className="w-4 h-4 text-red-500 group-hover:text-red-400 transition-colors" />
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-900/5 via-transparent to-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg"></div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call-to-Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-red-900/10 via-red-800/20 to-red-900/10 rounded-2xl p-8 border border-red-900/30">
            <h3 className="text-2xl font-bold text-red-300 mb-4">
              Let's Build the Future Together
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Whether you're interested in collaboration, have questions about my projects, or just want to connect with a fellow technologist.
            </p>
            <Button
              className="cyber-connect-btn bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-semibold tracking-wide transition-all duration-300"
              onClick={() => window.open('https://www.linkedin.com/in/kenan-alnaser', '_blank')}
            >
              <Users className="mr-2 w-5 h-5" />
              Connect on LinkedIn
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .digital-rain {
          background: 
            linear-gradient(90deg, transparent 0%, rgba(239, 68, 68, 0.1) 50%, transparent 100%);
          background-size: 2px 100%;
          animation: rain-fall 3s linear infinite;
        }

        @keyframes rain-fall {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 0%; }
        }

        @keyframes data-flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(calc(100vw + 200px)); }
        }

        .cyber-social-card {
          position: relative;
          backdrop-filter: blur(10px);
          background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.6) 100%);
          transform-origin: center;
        }

        .cyber-social-card:hover {
          box-shadow: 0 10px 40px rgba(239, 68, 68, 0.1);
        }

        .cyber-connect-btn:hover {
          box-shadow: 0 0 30px rgba(239, 68, 68, 0.4);
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
};

export default SocialSection;