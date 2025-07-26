from fastapi import APIRouter, HTTPException
from models import ApiResponse, SyncResponse
from database import database
from services.github_service import GitHubService
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/system", tags=["system"])
github_service = GitHubService()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        stats = await database.get_stats()
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "database": "connected",
            "stats": stats
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Service unhealthy")

@router.post("/sync-all", response_model=SyncResponse)
async def sync_all_data():
    """Sync all external data sources"""
    try:
        projects_synced = 0
        videos_synced = 0
        errors = []
        
        # Get profile for GitHub username
        profile = await database.get_profile()
        if not profile:
            errors.append("Profile not found")
        else:
            github_username = profile.get('github_username')
            if github_username:
                try:
                    # Sync GitHub projects
                    github_repos = await github_service.get_user_repos(github_username)
                    if github_repos:
                        for repo in github_repos:
                            repo['cached_at'] = datetime.utcnow()
                        projects_synced = await database.upsert_projects(github_repos)
                    else:
                        errors.append("No GitHub repositories found")
                except Exception as e:
                    errors.append(f"GitHub sync failed: {str(e)}")
            else:
                errors.append("GitHub username not configured")
        
        # Sync videos (mock data for now)
        try:
            mock_videos = [
                {
                    "id": "1",
                    "youtube_id": "dQw4w9WgXcQ",
                    "title": "Building AI-Powered Applications",
                    "description": "Deep dive into creating intelligent software solutions",
                    "thumbnail": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop",
                    "published_at": datetime.utcnow(),
                    "view_count": 25000,
                    "duration": "15:32",
                    "is_featured": True,
                    "cached_at": datetime.utcnow()
                },
                {
                    "id": "2",
                    "youtube_id": "dQw4w9WgXcQ2", 
                    "title": "Future of Cybersecurity",
                    "description": "Exploring emerging threats and defense mechanisms",
                    "thumbnail": "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=600&h=400&fit=crop",
                    "published_at": datetime.utcnow(),
                    "view_count": 18000,
                    "duration": "22:45",
                    "is_featured": True,
                    "cached_at": datetime.utcnow()
                },
                {
                    "id": "3",
                    "youtube_id": "dQw4w9WgXcQ3",
                    "title": "Quantum Computing Explained", 
                    "description": "Making quantum concepts accessible to developers",
                    "thumbnail": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop",
                    "published_at": datetime.utcnow(),
                    "view_count": 32000,
                    "duration": "18:20",
                    "is_featured": True,
                    "cached_at": datetime.utcnow()
                }
            ]
            videos_synced = await database.upsert_videos(mock_videos)
        except Exception as e:
            errors.append(f"Video sync failed: {str(e)}")
        
        success = projects_synced > 0 or videos_synced > 0
        message = f"Sync completed: {projects_synced} projects, {videos_synced} videos"
        
        if errors:
            message += f" (with {len(errors)} errors)"
        
        return SyncResponse(
            success=success,
            message=message,
            projects_synced=projects_synced,
            videos_synced=videos_synced,
            errors=errors
        )
        
    except Exception as e:
        logger.error(f"Error in sync-all: {str(e)}")
        return SyncResponse(
            success=False,
            message="Failed to sync data",
            projects_synced=0,
            videos_synced=0,
            errors=[str(e)]
        )

@router.get("/stats")
async def get_system_stats():
    """Get comprehensive system statistics"""
    try:
        stats = await database.get_stats()
        cache_age = await database.get_project_cache_age()
        
        return {
            "database": stats,
            "cache": {
                "projects_last_sync": cache_age.isoformat() if cache_age else None,
                "projects_cache_fresh": not await database.should_sync_projects()
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error fetching system stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch system statistics")