import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with timeout
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Profile API
export const profileAPI = {
  getProfile: async () => {
    try {
      const response = await apiClient.get('/profile');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // Return fallback data if API fails
      return {
        name: "Kenan Alnaser",
        title: "Software Engineer | Futurist | Creative Technologist",
        bio: "I'm a developer with a passion for merging technology and creativity. My work spans across software engineering, AI integration, and experimental projects that explore the limits of digital interaction. Whether it's building tools, automating systems, or visualizing abstract ideas—I thrive at the edge of what's next.",
        location: "Digital Frontier",
        specialties: [
          "Full-stack Development",
          "AI Tools", 
          "Creative Coding",
          "Quantum Computing"
        ],
        tools: [
          "JavaScript",
          "Python", 
          "React",
          "Node.js",
          "TensorFlow",
          "GitHub",
          "Docker"
        ]
      };
    }
  },
};

// Projects API
export const projectsAPI = {
  getProjects: async () => {
    try {
      const response = await apiClient.get('/projects');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      // Fallback to GitHub API directly if backend fails
      return await fetchGitHubProjectsDirect();
    }
  },

  getFeaturedProjects: async () => {
    try {
      const response = await apiClient.get('/projects/featured');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch featured projects:', error);
      const allProjects = await fetchGitHubProjectsDirect();
      return allProjects.filter(project => project.is_featured);
    }
  },

  syncProjects: async () => {
    try {
      const response = await apiClient.post('/projects/sync');
      return response.data;
    } catch (error) {
      console.error('Failed to sync projects:', error);
      throw error;
    }
  },
};

// Direct GitHub API fallback
const fetchGitHubProjectsDirect = async () => {
  try {
    const response = await axios.get('https://api.github.com/users/Kenan-Alnaser/repos', {
      params: {
        sort: 'updated',
        direction: 'desc',
        per_page: 50,
        type: 'owner'
      }
    });

    return response.data
      .filter(repo => !repo.fork && !repo.archived) // Filter out forks and archived repos
      .map(repo => ({
        id: repo.id.toString(),
        github_id: repo.id,
        name: repo.name,
        description: repo.description || `A ${repo.language || 'code'} project`,
        language: repo.language,
        html_url: repo.html_url,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        topics: repo.topics || [],
        is_featured: determineFeaturedStatus(repo)
      }));
  } catch (error) {
    console.error('Failed to fetch from GitHub directly:', error);
    return [];
  }
};

// Helper function to determine featured status
const determineFeaturedStatus = (repo) => {
  const stars = repo.stargazers_count || 0;
  const forks = repo.forks_count || 0;
  const topics = repo.topics || [];
  
  // Feature criteria
  if (stars >= 10 || forks >= 5) {
    return true;
  }
  
  // Feature based on topics
  const featuredTopics = ['ai', 'machine-learning', 'neural-network', 'quantum', 'blockchain', 'cyberpunk'];
  if (topics.some(topic => featuredTopics.includes(topic.toLowerCase()))) {
    return true;
  }
  
  // Feature based on name patterns
  const featuredPatterns = ['ai', 'quantum', 'neural', 'cyber', 'bot', 'ml'];
  const repoNameLower = repo.name.toLowerCase();
  if (featuredPatterns.some(pattern => repoNameLower.includes(pattern))) {
    return true;
  }
  
  return false;
};

// Social Links API
export const socialAPI = {
  getSocialLinks: async () => {
    try {
      const response = await apiClient.get('/social-links');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch social links:', error);
      // Return fallback data
      return [
        {
          name: "GitHub",
          url: "https://github.com/Kenan-Alnaser",
          icon: "Github"
        },
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/kenan-alnaser",
          icon: "Linkedin"
        },
        {
          name: "YouTube",
          url: "https://www.youtube.com/@voransirt",
          icon: "Youtube"
        },
        {
          name: "Twitch",
          url: "https://www.twitch.tv/vor_ansirt",
          icon: "Twitch"
        }
      ];
    }
  },
};

// Videos API
export const videosAPI = {
  getVideos: async () => {
    try {
      const response = await apiClient.get('/videos');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      // Return fallback mock data
      return [
        {
          id: "1",
          title: "Building AI-Powered Applications",
          description: "Deep dive into creating intelligent software solutions",
          thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop",
          videoId: "dQw4w9WgXcQ",
          views: "25K",
          duration: "15:32"
        },
        {
          id: "2",
          title: "Future of Cybersecurity",
          description: "Exploring emerging threats and defense mechanisms",
          thumbnail: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=600&h=400&fit=crop",
          videoId: "dQw4w9WgXcQ",
          views: "18K",
          duration: "22:45"
        },
        {
          id: "3",
          title: "Quantum Computing Explained",
          description: "Making quantum concepts accessible to developers",
          thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop",
          videoId: "dQw4w9WgXcQ",
          views: "32K",
          duration: "18:20"
        }
      ];
    }
  },

  getFeaturedVideos: async () => {
    try {
      const response = await apiClient.get('/videos/featured');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch featured videos:', error);
      return await videosAPI.getVideos(); // Return all videos as fallback
    }
  },
};

// System API
export const systemAPI = {
  healthCheck: async () => {
    try {
      const response = await apiClient.get('/system/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  syncAll: async () => {
    try {
      const response = await apiClient.post('/system/sync-all');
      return response.data;
    } catch (error) {
      console.error('Failed to sync all data:', error);
      throw error;
    }
  },
};

export default {
  profile: profileAPI,
  projects: projectsAPI,
  social: socialAPI,
  videos: videosAPI,
  system: systemAPI,
};