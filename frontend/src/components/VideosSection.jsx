import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Play, Eye, Clock, ExternalLink, Youtube, Monitor, Loader2 } from 'lucide-react';
import { videosAPI } from '../services/api';

const VideoCard = ({ video, index, onPlay }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="cyber-video-card bg-black/40 border-red-900/30 hover:border-red-500/50 transition-all duration-500 group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden">
        {/* Thumbnail */}
        <div className={`w-full h-full ${!imageLoaded ? 'img-loading' : ''}`}>
          <img
            src={video.thumbnail}
            alt={video.title}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isHovered ? 'scale-110' : 'scale-100'}`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            size="lg"
            className="cyber-play-btn bg-red-500/90 hover:bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center transition-all duration-300 hover:scale-110"
            onClick={() => onPlay(video)}
          >
            <Play className="w-6 h-6 ml-1" fill="currentColor" />
          </Button>
        </div>

        {/* Duration Badge */}
        <Badge 
          variant="secondary"
          className="absolute bottom-2 right-2 bg-black/80 text-white border-0 flex items-center gap-1"
        >
          <Clock className="w-3 h-3" />
          {video.duration}
        </Badge>

        {/* Glitch Effect Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-500">
          <div className="absolute top-1/4 left-0 w-full h-px bg-red-500 transform -skew-x-12"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-red-500 transform skew-x-12"></div>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-red-300 group-hover:text-red-200 transition-colors text-lg font-semibold line-clamp-2">
          {video.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
          {video.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{video.views} views</span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2"
            onClick={() => window.open(`https://youtube.com/watch?v=${video.videoId}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const VideosSection = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await videosAPI.getVideos();
        setVideos(data);
      } catch (error) {
        console.error('Failed to load videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
    // In a real app, this would open a modal or redirect to YouTube
    window.open(`https://youtube.com/watch?v=${video.videoId}`, '_blank');
  };

  return (
    <section id="videos" className="py-20 px-6 bg-gradient-to-b from-black via-gray-900/10 to-black relative overflow-hidden">
      {/* Background Tech Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="tech-pattern"></div>
      </div>

      {/* Scanning Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="scan-line"></div>
        <div className="scan-line" style={{ animationDelay: '3s', top: '60%' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative">
            <span 
              className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Tech Content
            </span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Dive into the future of technology through my video content. From AI breakthroughs to quantum computing insights.
          </p>

          {/* Channel Stats */}
          <div className="flex justify-center items-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-red-400">
              <Youtube className="w-5 h-5" />
              <span className="font-medium">12.4K Subscribers</span>
            </div>
            <div className="w-px h-6 bg-red-800"></div>
            <div className="flex items-center gap-2 text-red-400">
              <Monitor className="w-5 h-5" />
              <span className="font-medium">Weekly Tech Updates</span>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            <span className="ml-3 text-red-400">Loading videos...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
            {videos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                index={index}
                onPlay={handlePlayVideo}
              />
            ))}
          </div>
        )}

        {/* Channel CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-red-900/10 via-red-800/20 to-red-900/10 rounded-2xl p-8 border border-red-900/30 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Youtube className="w-8 h-8 text-red-500" />
              <h3 className="text-2xl font-bold text-red-300">
                Subscribe for More
              </h3>
            </div>
            <p className="text-gray-300 mb-6">
              Stay updated with the latest in AI, quantum computing, and emerging technologies. 
              New videos every week covering cutting-edge development and future tech insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="cyber-youtube-btn bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-semibold tracking-wide transition-all duration-300"
                onClick={() => window.open('https://www.youtube.com/@voransirt', '_blank')}
              >
                <Youtube className="mr-2 w-5 h-5" />
                Visit Channel
              </Button>
              <Button
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 px-8 py-3 text-lg transition-all duration-300"
                onClick={() => window.open('https://www.youtube.com/@voransirt?sub_confirmation=1', '_blank')}
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tech-pattern {
          background-image: 
            repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(239, 68, 68, 0.05) 20px, rgba(239, 68, 68, 0.05) 40px),
            repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(239, 68, 68, 0.05) 20px, rgba(239, 68, 68, 0.05) 40px);
          animation: tech-shift 15s linear infinite;
        }

        @keyframes tech-shift {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 40px 40px, -40px 40px; }
        }

        .scan-line {
          position: absolute;
          top: 30%;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ef4444, transparent);
          animation: scan 6s ease-in-out infinite;
        }

        @keyframes scan {
          0%, 100% { transform: translateX(-100%); opacity: 0; }
          10%, 90% { opacity: 1; }
          50% { transform: translateX(0); opacity: 1; }
        }

        .cyber-video-card {
          position: relative;
          backdrop-filter: blur(10px);
          background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.6) 100%);
        }

        .cyber-play-btn {
          backdrop-filter: blur(10px);
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
        }

        .cyber-youtube-btn:hover {
          box-shadow: 0 0 30px rgba(239, 68, 68, 0.4);
          transform: translateY(-2px);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default VideosSection;