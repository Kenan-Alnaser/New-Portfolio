# Kenan Alnaser Cyberpunk Portfolio - Backend Integration Contracts

## Overview
This document outlines the API contracts, data models, and integration plan for transforming the frontend from mock data to a fully functional backend-powered portfolio.

## Current Mock Data Analysis

### 1. GitHub Projects (mockGitHubProjects)
**Current Mock Structure:**
```javascript
{
  id: number,
  name: string,
  description: string,
  language: string,
  html_url: string,
  created_at: string (ISO),
  updated_at: string (ISO),
  stargazers_count: number,
  forks_count: number
}
```

### 2. Social Links (mockSocialLinks)
**Current Mock Structure:**
```javascript
{
  name: string,
  url: string,
  icon: string
}
```

### 3. Videos (mockVideos)
**Current Mock Structure:**
```javascript
{
  id: number,
  title: string,
  description: string,
  thumbnail: string,
  videoId: string,
  views: string,
  duration: string
}
```

### 4. Personal Info (mockPersonalInfo)
**Current Mock Structure:**
```javascript
{
  name: string,
  title: string,
  bio: string,
  location: string,
  specialties: string[],
  tools: string[]
}
```

## Backend Implementation Plan

### 1. Database Models (MongoDB)

#### ProfileModel
```javascript
{
  _id: ObjectId,
  name: string,
  title: string,
  bio: string,
  location: string,
  specialties: string[],
  tools: string[],
  github_username: string,
  youtube_channel_id: string,
  created_at: Date,
  updated_at: Date
}
```

#### ProjectModel (Cached GitHub Data)
```javascript
{
  _id: ObjectId,
  github_id: number,
  name: string,
  description: string,
  language: string,
  html_url: string,
  created_at: Date,
  updated_at: Date,
  stargazers_count: number,
  forks_count: number,
  topics: string[],
  is_featured: boolean,
  cached_at: Date
}
```

#### SocialLinkModel
```javascript
{
  _id: ObjectId,
  platform: string,
  name: string,
  url: string,
  icon: string,
  order: number,
  is_active: boolean
}
```

#### VideoModel (Cached YouTube Data)
```javascript
{
  _id: ObjectId,
  youtube_id: string,
  title: string,
  description: string,
  thumbnail: string,
  published_at: Date,
  view_count: number,
  duration: string,
  is_featured: boolean,
  cached_at: Date
}
```

### 2. API Endpoints

#### Profile Endpoints
- `GET /api/profile` - Get personal profile information
- `PUT /api/profile` - Update profile (admin only)

#### Projects Endpoints
- `GET /api/projects` - Get all projects (with caching)
- `GET /api/projects/featured` - Get featured projects only
- `POST /api/projects/sync` - Sync with GitHub API (admin only)

#### Social Links Endpoints
- `GET /api/social-links` - Get all active social links
- `POST /api/social-links` - Create new social link (admin only)
- `PUT /api/social-links/:id` - Update social link (admin only)

#### Videos Endpoints
- `GET /api/videos` - Get all videos (with caching)
- `GET /api/videos/featured` - Get featured videos only
- `POST /api/videos/sync` - Sync with YouTube API (admin only)

#### System Endpoints
- `GET /api/health` - Health check
- `POST /api/sync-all` - Sync all external data (admin only)

### 3. External API Integration

#### GitHub API Integration
- **Endpoint**: `https://api.github.com/users/Kenan-Alnaser/repos`
- **Rate Limit**: 60 requests/hour (unauthenticated)
- **Caching Strategy**: Update every 6 hours
- **Error Handling**: Fallback to cached data if API fails

#### YouTube API Integration (Optional for v1)
- **Endpoint**: YouTube Data API v3
- **Rate Limit**: 10,000 units/day
- **Caching Strategy**: Update daily
- **Fallback**: Manual video management if API quota exceeded

### 4. Frontend Integration Changes

#### Remove Mock Imports
```javascript
// Remove these imports from components:
import { mockGitHubProjects, mockSocialLinks, mockVideos, mockPersonalInfo } from '../mock';
```

#### Add API Service Layer
```javascript
// Create /src/services/api.js
const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

export const profileAPI = {
  getProfile: () => axios.get(`${API_BASE}/profile`),
};

export const projectsAPI = {
  getProjects: () => axios.get(`${API_BASE}/projects`),
  getFeaturedProjects: () => axios.get(`${API_BASE}/projects/featured`),
};

export const socialAPI = {
  getSocialLinks: () => axios.get(`${API_BASE}/social-links`),
};

export const videosAPI = {
  getVideos: () => axios.get(`${API_BASE}/videos`),
  getFeaturedVideos: () => axios.get(`${API_BASE}/videos/featured`),
};
```

#### Update Components to Use APIs
- **HeroSection.jsx**: Fetch profile data
- **ProjectsSection.jsx**: Fetch projects from API
- **AboutSection.jsx**: Fetch profile and skills data
- **SocialSection.jsx**: Fetch social links from API
- **VideosSection.jsx**: Fetch videos from API

### 5. Data Migration & Seeding

#### Initial Data Setup
1. Seed profile data with Kenan's information
2. Seed social links with provided URLs
3. Initial GitHub API sync
4. Optional: Seed featured videos manually

#### Environment Variables Required
```
GITHUB_TOKEN=<optional_for_higher_rate_limit>
YOUTUBE_API_KEY=<optional_for_youtube_integration>
ADMIN_SECRET_KEY=<for_admin_endpoints>
```

### 6. Error Handling & Fallbacks

#### API Error Scenarios
1. **GitHub API Down**: Serve cached project data
2. **Database Connection Issues**: Return error with retry mechanism
3. **Rate Limit Exceeded**: Use cached data with timestamp info
4. **Invalid Data**: Log error, return empty array with error flag

#### Loading States
- Add loading spinners for all API calls
- Skeleton loading for project cards
- Graceful error messages for users

### 7. Performance Optimizations

#### Caching Strategy
- **GitHub Data**: Cache for 6 hours
- **Profile Data**: Cache until manually updated
- **Social Links**: Cache until manually updated
- **Videos**: Cache for 24 hours

#### API Response Optimization
- Pagination for large project lists
- Selective field returns
- Gzip compression
- CDN for static assets

## Implementation Phases

### Phase 1: Core Backend Setup
1. Set up MongoDB models
2. Create basic CRUD endpoints
3. Implement GitHub API integration
4. Add data seeding

### Phase 2: Frontend Integration
1. Create API service layer
2. Update components to use real APIs
3. Add loading states and error handling
4. Remove mock data dependencies

### Phase 3: Advanced Features
1. Admin panel for content management
2. YouTube API integration
3. Analytics and monitoring
4. Performance optimizations

## Success Metrics
- ✅ All mock data replaced with real API calls
- ✅ GitHub repositories automatically synced
- ✅ Responsive error handling and loading states
- ✅ No broken functionality from mock to real data transition
- ✅ Performance maintained or improved