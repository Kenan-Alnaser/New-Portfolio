#!/usr/bin/env python3
"""
Backend API Test Suite for Kenan Alnaser Cyberpunk Portfolio
Tests all backend endpoints and functionality as specified in the review request.
"""

import asyncio
import httpx
import json
import os
from datetime import datetime
from typing import Dict, List, Any

# Get backend URL from frontend .env file
def get_backend_url():
    """Get backend URL from frontend environment"""
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"❌ Error reading frontend .env: {e}")
        return None
    return None

class BackendTester:
    def __init__(self):
        self.backend_url = get_backend_url()
        if not self.backend_url:
            raise Exception("Could not get backend URL from frontend/.env")
        
        self.api_url = f"{self.backend_url}/api"
        self.results = {
            "health_check": {"passed": False, "details": ""},
            "profile_management": {"passed": False, "details": ""},
            "github_projects": {"passed": False, "details": ""},
            "social_links": {"passed": False, "details": ""},
            "videos_system": {"passed": False, "details": ""},
            "system_sync": {"passed": False, "details": ""}
        }
        self.errors = []
        
    async def run_all_tests(self):
        """Run all backend tests"""
        print(f"🚀 Starting Backend API Tests")
        print(f"📡 Backend URL: {self.backend_url}")
        print(f"🔗 API Base URL: {self.api_url}")
        print("=" * 60)
        
        # Test in order of dependencies
        await self.test_health_check()
        await self.test_profile_management()
        await self.test_social_links()
        await self.test_videos_system()
        await self.test_github_projects()
        await self.test_system_sync()
        
        self.print_summary()
        
    async def test_health_check(self):
        """Test health check and system status endpoints"""
        print("\n🏥 Testing Health Check & System Status...")
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                # Test system health endpoint
                response = await client.get(f"{self.api_url}/system/health")
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Verify response structure
                    required_fields = ["status", "timestamp", "database", "stats"]
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if missing_fields:
                        self.results["health_check"]["details"] = f"Missing fields: {missing_fields}"
                        print(f"❌ Health check missing fields: {missing_fields}")
                        return
                    
                    # Check database connectivity
                    if data.get("database") != "connected":
                        self.results["health_check"]["details"] = f"Database not connected: {data.get('database')}"
                        print(f"❌ Database not connected: {data.get('database')}")
                        return
                    
                    # Check stats
                    stats = data.get("stats", {})
                    print(f"📊 Database Stats: {stats}")
                    
                    self.results["health_check"]["passed"] = True
                    self.results["health_check"]["details"] = f"Health check passed. Database connected. Stats: {stats}"
                    print("✅ Health check passed")
                    
                else:
                    self.results["health_check"]["details"] = f"HTTP {response.status_code}: {response.text}"
                    print(f"❌ Health check failed: HTTP {response.status_code}")
                    
        except Exception as e:
            self.results["health_check"]["details"] = f"Exception: {str(e)}"
            self.errors.append(f"Health check error: {str(e)}")
            print(f"❌ Health check exception: {str(e)}")
    
    async def test_profile_management(self):
        """Test profile management endpoints"""
        print("\n👤 Testing Profile Management...")
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                # Test GET profile
                response = await client.get(f"{self.api_url}/profile/")
                
                if response.status_code == 200:
                    profile = response.json()
                    
                    # Verify Kenan's profile data
                    required_fields = ["name", "title", "bio", "specialties", "tools", "github_username"]
                    missing_fields = [field for field in required_fields if field not in profile]
                    
                    if missing_fields:
                        self.results["profile_management"]["details"] = f"Missing profile fields: {missing_fields}"
                        print(f"❌ Profile missing fields: {missing_fields}")
                        return
                    
                    # Verify it's Kenan's profile
                    if "Kenan" not in profile.get("name", ""):
                        self.results["profile_management"]["details"] = f"Profile name doesn't contain 'Kenan': {profile.get('name')}"
                        print(f"❌ Profile name issue: {profile.get('name')}")
                        return
                    
                    # Check GitHub username
                    github_username = profile.get("github_username")
                    if github_username != "Kenan-Alnaser":
                        print(f"⚠️  GitHub username: {github_username} (expected: Kenan-Alnaser)")
                    
                    print(f"✅ Profile loaded: {profile.get('name')} - {profile.get('title')}")
                    print(f"📝 Bio: {profile.get('bio', '')[:100]}...")
                    print(f"🛠️  Specialties: {profile.get('specialties', [])}")
                    print(f"🔧 Tools: {profile.get('tools', [])}")
                    
                    self.results["profile_management"]["passed"] = True
                    self.results["profile_management"]["details"] = f"Profile loaded successfully for {profile.get('name')}"
                    
                elif response.status_code == 404:
                    self.results["profile_management"]["details"] = "Profile not found - may need seeding"
                    print("❌ Profile not found - database may need seeding")
                    
                else:
                    self.results["profile_management"]["details"] = f"HTTP {response.status_code}: {response.text}"
                    print(f"❌ Profile fetch failed: HTTP {response.status_code}")
                    
        except Exception as e:
            self.results["profile_management"]["details"] = f"Exception: {str(e)}"
            self.errors.append(f"Profile management error: {str(e)}")
            print(f"❌ Profile management exception: {str(e)}")
    
    async def test_github_projects(self):
        """Test GitHub projects integration"""
        print("\n🐙 Testing GitHub Projects Integration...")
        
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:  # Longer timeout for GitHub API
                # Test manual sync first
                print("🔄 Testing manual GitHub sync...")
                sync_response = await client.post(f"{self.api_url}/projects/sync")
                
                if sync_response.status_code == 200:
                    sync_data = sync_response.json()
                    print(f"✅ Sync response: {sync_data}")
                    
                    if not sync_data.get("success"):
                        print(f"⚠️  Sync reported failure: {sync_data.get('message')}")
                        if sync_data.get("errors"):
                            print(f"🚨 Sync errors: {sync_data.get('errors')}")
                else:
                    print(f"❌ Sync failed: HTTP {sync_response.status_code}")
                
                # Test GET projects
                print("📂 Testing projects retrieval...")
                response = await client.get(f"{self.api_url}/projects/")
                
                if response.status_code == 200:
                    projects = response.json()
                    
                    if not projects:
                        self.results["github_projects"]["details"] = "No projects returned - GitHub sync may have failed"
                        print("⚠️  No projects returned")
                        return
                    
                    print(f"📊 Found {len(projects)} projects")
                    
                    # Verify project structure
                    sample_project = projects[0]
                    required_fields = ["github_id", "name", "description", "language", "html_url", 
                                     "stargazers_count", "forks_count", "is_featured"]
                    missing_fields = [field for field in required_fields if field not in sample_project]
                    
                    if missing_fields:
                        self.results["github_projects"]["details"] = f"Project missing fields: {missing_fields}"
                        print(f"❌ Project structure issue: missing {missing_fields}")
                        return
                    
                    # Show project details
                    for i, project in enumerate(projects[:3]):  # Show first 3
                        print(f"  {i+1}. {project['name']} ({project.get('language', 'N/A')})")
                        print(f"     ⭐ {project['stargazers_count']} stars, 🍴 {project['forks_count']} forks")
                        print(f"     🎯 Featured: {project['is_featured']}")
                        if project.get('description'):
                            print(f"     📝 {project['description'][:80]}...")
                    
                    # Test featured projects
                    featured_response = await client.get(f"{self.api_url}/projects/featured")
                    if featured_response.status_code == 200:
                        featured_projects = featured_response.json()
                        print(f"🌟 Featured projects: {len(featured_projects)}")
                    
                    self.results["github_projects"]["passed"] = True
                    self.results["github_projects"]["details"] = f"Successfully loaded {len(projects)} projects from GitHub"
                    
                else:
                    self.results["github_projects"]["details"] = f"HTTP {response.status_code}: {response.text}"
                    print(f"❌ Projects fetch failed: HTTP {response.status_code}")
                    
        except Exception as e:
            self.results["github_projects"]["details"] = f"Exception: {str(e)}"
            self.errors.append(f"GitHub projects error: {str(e)}")
            print(f"❌ GitHub projects exception: {str(e)}")
    
    async def test_social_links(self):
        """Test social links endpoints"""
        print("\n🔗 Testing Social Links...")
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(f"{self.api_url}/social-links/")
                
                if response.status_code == 200:
                    links = response.json()
                    
                    if not links:
                        self.results["social_links"]["details"] = "No social links returned - may need seeding"
                        print("⚠️  No social links returned")
                        return
                    
                    # Verify we have the expected 4 platforms
                    expected_platforms = ["GitHub", "LinkedIn", "YouTube", "Twitch"]
                    found_platforms = [link.get("platform") for link in links]
                    
                    print(f"🔗 Found {len(links)} social links:")
                    for link in links:
                        print(f"  • {link.get('platform')}: {link.get('url')}")
                    
                    missing_platforms = [p for p in expected_platforms if p not in found_platforms]
                    if missing_platforms:
                        print(f"⚠️  Missing platforms: {missing_platforms}")
                    
                    # Verify link structure
                    sample_link = links[0]
                    required_fields = ["platform", "name", "url", "icon", "is_active"]
                    missing_fields = [field for field in required_fields if field not in sample_link]
                    
                    if missing_fields:
                        self.results["social_links"]["details"] = f"Social link missing fields: {missing_fields}"
                        print(f"❌ Social link structure issue: missing {missing_fields}")
                        return
                    
                    self.results["social_links"]["passed"] = True
                    self.results["social_links"]["details"] = f"Successfully loaded {len(links)} social links"
                    
                else:
                    self.results["social_links"]["details"] = f"HTTP {response.status_code}: {response.text}"
                    print(f"❌ Social links fetch failed: HTTP {response.status_code}")
                    
        except Exception as e:
            self.results["social_links"]["details"] = f"Exception: {str(e)}"
            self.errors.append(f"Social links error: {str(e)}")
            print(f"❌ Social links exception: {str(e)}")
    
    async def test_videos_system(self):
        """Test videos system endpoints"""
        print("\n🎥 Testing Videos System...")
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                # Test video sync (mock data)
                print("🔄 Testing video sync...")
                sync_response = await client.post(f"{self.api_url}/videos/sync")
                
                if sync_response.status_code == 200:
                    sync_data = sync_response.json()
                    print(f"✅ Video sync: {sync_data}")
                
                # Test GET videos
                response = await client.get(f"{self.api_url}/videos/")
                
                if response.status_code == 200:
                    videos = response.json()
                    
                    print(f"🎬 Found {len(videos)} videos")
                    
                    if videos:
                        # Verify video structure
                        sample_video = videos[0]
                        required_fields = ["youtube_id", "title", "description", "thumbnail", 
                                         "published_at", "view_count", "duration", "is_featured"]
                        missing_fields = [field for field in required_fields if field not in sample_video]
                        
                        if missing_fields:
                            self.results["videos_system"]["details"] = f"Video missing fields: {missing_fields}"
                            print(f"❌ Video structure issue: missing {missing_fields}")
                            return
                        
                        # Show video details
                        for i, video in enumerate(videos[:3]):  # Show first 3
                            print(f"  {i+1}. {video['title']}")
                            print(f"     👀 {video['view_count']} views, ⏱️ {video['duration']}")
                            print(f"     🎯 Featured: {video['is_featured']}")
                        
                        # Test featured videos
                        featured_response = await client.get(f"{self.api_url}/videos/featured")
                        if featured_response.status_code == 200:
                            featured_videos = featured_response.json()
                            print(f"🌟 Featured videos: {len(featured_videos)}")
                    
                    self.results["videos_system"]["passed"] = True
                    self.results["videos_system"]["details"] = f"Successfully loaded {len(videos)} videos (mock data)"
                    
                else:
                    self.results["videos_system"]["details"] = f"HTTP {response.status_code}: {response.text}"
                    print(f"❌ Videos fetch failed: HTTP {response.status_code}")
                    
        except Exception as e:
            self.results["videos_system"]["details"] = f"Exception: {str(e)}"
            self.errors.append(f"Videos system error: {str(e)}")
            print(f"❌ Videos system exception: {str(e)}")
    
    async def test_system_sync(self):
        """Test full system sync endpoint"""
        print("\n🔄 Testing Full System Sync...")
        
        try:
            async with httpx.AsyncClient(timeout=90.0) as client:  # Long timeout for full sync
                response = await client.post(f"{self.api_url}/system/sync-all")
                
                if response.status_code == 200:
                    sync_data = response.json()
                    
                    print(f"📊 Sync Results:")
                    print(f"  • Success: {sync_data.get('success')}")
                    print(f"  • Message: {sync_data.get('message')}")
                    print(f"  • Projects synced: {sync_data.get('projects_synced', 0)}")
                    print(f"  • Videos synced: {sync_data.get('videos_synced', 0)}")
                    
                    if sync_data.get('errors'):
                        print(f"  • Errors: {sync_data.get('errors')}")
                    
                    # Test system stats
                    stats_response = await client.get(f"{self.api_url}/system/stats")
                    if stats_response.status_code == 200:
                        stats = stats_response.json()
                        print(f"📈 System Stats: {stats}")
                    
                    self.results["system_sync"]["passed"] = True
                    self.results["system_sync"]["details"] = f"System sync completed: {sync_data.get('message')}"
                    
                else:
                    self.results["system_sync"]["details"] = f"HTTP {response.status_code}: {response.text}"
                    print(f"❌ System sync failed: HTTP {response.status_code}")
                    
        except Exception as e:
            self.results["system_sync"]["details"] = f"Exception: {str(e)}"
            self.errors.append(f"System sync error: {str(e)}")
            print(f"❌ System sync exception: {str(e)}")
    
    def print_summary(self):
        """Print test results summary"""
        print("\n" + "=" * 60)
        print("🎯 BACKEND API TEST SUMMARY")
        print("=" * 60)
        
        passed_count = sum(1 for result in self.results.values() if result["passed"])
        total_count = len(self.results)
        
        for test_name, result in self.results.items():
            status = "✅ PASS" if result["passed"] else "❌ FAIL"
            print(f"{status} {test_name.replace('_', ' ').title()}")
            if result["details"]:
                print(f"    {result['details']}")
        
        print(f"\n📊 Overall: {passed_count}/{total_count} tests passed")
        
        if self.errors:
            print(f"\n🚨 Critical Errors ({len(self.errors)}):")
            for error in self.errors:
                print(f"  • {error}")
        
        print("\n" + "=" * 60)

async def main():
    """Main test runner"""
    try:
        tester = BackendTester()
        await tester.run_all_tests()
    except Exception as e:
        print(f"❌ Test runner failed: {str(e)}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)