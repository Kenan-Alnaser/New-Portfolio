from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List
from models import ProjectResponse, ApiResponse, SyncResponse
from database import database
from services.github_service import GitHubService
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/projects", tags=["projects"])
github_service = GitHubService()

@router.get("/", response_model=List[ProjectResponse])
async def get_projects():
    """Get all projects with automatic sync if cache is old"""
    try:
        # Check if we need to sync
        should_sync = await database.should_sync_projects()
        if should_sync:
            logger.info("Project cache is stale, triggering background sync")
            # Trigger background sync but don't wait for it
            await sync_projects_background()
        
        projects = await database.get_projects()
        return projects
    except Exception as e:
        logger.error(f"Error fetching projects: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch projects")

@router.get("/featured", response_model=List[ProjectResponse])
async def get_featured_projects():
    """Get only featured projects"""
    try:
        projects = await database.get_projects(featured_only=True)
        return projects
    except Exception as e:
        logger.error(f"Error fetching featured projects: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch featured projects")

@router.post("/sync", response_model=SyncResponse)
async def sync_projects():
    """Manually sync projects with GitHub API"""
    try:
        # Get profile to get GitHub username
        profile = await database.get_profile()
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        github_username = profile.get('github_username')
        if not github_username:
            raise HTTPException(status_code=400, detail="GitHub username not configured")
        
        # Fetch projects from GitHub
        github_repos = await github_service.get_user_repos(github_username)
        
        if not github_repos:
            return SyncResponse(
                success=False,
                message="Failed to fetch repositories from GitHub",
                projects_synced=0,
                errors=["GitHub API returned no data or failed"]
            )
        
        # Add cache timestamp
        from datetime import datetime
        for repo in github_repos:
            repo['cached_at'] = datetime.utcnow()
        
        # Upsert projects
        synced_count = await database.upsert_projects(github_repos)
        
        return SyncResponse(
            success=True,
            message=f"Successfully synced {synced_count} projects",
            projects_synced=synced_count
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error syncing projects: {str(e)}")
        return SyncResponse(
            success=False,
            message="Failed to sync projects",
            projects_synced=0,
            errors=[str(e)]
        )

async def sync_projects_background():
    """Background task to sync projects"""
    try:
        profile = await database.get_profile()
        if not profile:
            logger.error("No profile found for background sync")
            return
        
        github_username = profile.get('github_username')
        if not github_username:
            logger.error("No GitHub username configured")
            return
        
        github_repos = await github_service.get_user_repos(github_username)
        if github_repos:
            from datetime import datetime
            for repo in github_repos:
                repo['cached_at'] = datetime.utcnow()
            
            synced_count = await database.upsert_projects(github_repos)
            logger.info(f"Background sync completed: {synced_count} projects updated")
        else:
            logger.warning("Background sync: No repositories fetched from GitHub")
            
    except Exception as e:
        logger.error(f"Background sync failed: {str(e)}")

@router.get("/stats")
async def get_project_stats():
    """Get project statistics"""
    try:
        stats = await database.get_stats()
        cache_age = await database.get_project_cache_age()
        
        return {
            "total_projects": stats.get('projects', 0),
            "featured_projects": stats.get('featured_projects', 0),
            "last_sync": cache_age.isoformat() if cache_age else None,
            "cache_fresh": not await database.should_sync_projects()
        }
    except Exception as e:
        logger.error(f"Error fetching project stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch project statistics")