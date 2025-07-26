import httpx
import os
import uuid
from typing import List, Optional
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

class GitHubService:
    def __init__(self):
        self.base_url = "https://api.github.com"
        self.token = os.environ.get('GITHUB_TOKEN')
        self.headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Portfolio-App'
        }
        if self.token:
            self.headers['Authorization'] = f'token {self.token}'

    async def get_user_repos(self, username: str) -> List[dict]:
        """Fetch user repositories from GitHub API"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/users/{username}/repos",
                    headers=self.headers,
                    params={
                        'sort': 'updated',
                        'direction': 'desc',
                        'per_page': 100,
                        'type': 'owner'
                    }
                )
                
                if response.status_code == 200:
                    repos = response.json()
                    return self._process_repositories(repos)
                elif response.status_code == 404:
                    logger.error(f"GitHub user {username} not found")
                    return []
                elif response.status_code == 403:
                    logger.error("GitHub API rate limit exceeded")
                    return []
                else:
                    logger.error(f"GitHub API error: {response.status_code} - {response.text}")
                    return []
                    
        except httpx.RequestError as e:
            logger.error(f"GitHub API request failed: {str(e)}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error in GitHub service: {str(e)}")
            return []

    def _process_repositories(self, repos: List[dict]) -> List[dict]:
        """Process and clean repository data"""
        processed_repos = []
        
        for repo in repos:
            # Skip forks unless they have significant activity
            if repo.get('fork') and repo.get('stargazers_count', 0) < 5:
                continue
                
            # Skip archived repositories
            if repo.get('archived'):
                continue
                
            processed_repo = {
                'id': str(uuid.uuid4()),  # Generate UUID for the project
                'github_id': repo['id'],
                'name': repo['name'],
                'description': repo.get('description') or f"A {repo.get('language', 'code')} project",
                'language': repo.get('language'),
                'html_url': repo['html_url'],
                'created_at': self._parse_github_date(repo['created_at']),
                'updated_at': self._parse_github_date(repo['updated_at']),
                'stargazers_count': repo.get('stargazers_count', 0),
                'forks_count': repo.get('forks_count', 0),
                'topics': repo.get('topics', []),
                'is_featured': self._determine_featured_status(repo)
            }
            processed_repos.append(processed_repo)
            
        return processed_repos

    def _parse_github_date(self, date_str: str) -> datetime:
        """Parse GitHub date string to datetime object"""
        try:
            return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        except Exception:
            return datetime.now(timezone.utc)

    def _determine_featured_status(self, repo: dict) -> bool:
        """Determine if a repository should be featured"""
        stars = repo.get('stargazers_count', 0)
        forks = repo.get('forks_count', 0)
        topics = repo.get('topics', [])
        
        # Feature criteria
        if stars >= 10 or forks >= 5:
            return True
            
        # Feature based on topics (AI, ML, etc.)
        featured_topics = ['ai', 'machine-learning', 'neural-network', 'quantum', 'blockchain', 'cyberpunk']
        if any(topic in featured_topics for topic in topics):
            return True
            
        # Feature based on name patterns
        featured_patterns = ['ai', 'quantum', 'neural', 'cyber', 'bot', 'ml']
        repo_name_lower = repo['name'].lower()
        if any(pattern in repo_name_lower for pattern in featured_patterns):
            return True
            
        return False

    async def get_repository_details(self, username: str, repo_name: str) -> Optional[dict]:
        """Get detailed information about a specific repository"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/repos/{username}/{repo_name}",
                    headers=self.headers
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.error(f"Failed to fetch repo {repo_name}: {response.status_code}")
                    return None
                    
        except Exception as e:
            logger.error(f"Error fetching repository details: {str(e)}")
            return None

    async def get_user_profile(self, username: str) -> Optional[dict]:
        """Get user profile information from GitHub"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/users/{username}",
                    headers=self.headers
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.error(f"Failed to fetch user profile: {response.status_code}")
                    return None
                    
        except Exception as e:
            logger.error(f"Error fetching user profile: {str(e)}")
            return None