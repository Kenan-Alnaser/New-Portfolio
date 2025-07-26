from fastapi import APIRouter, HTTPException
from typing import List
from models import VideoResponse, ApiResponse, SyncResponse
from database import database
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/videos", tags=["videos"])

@router.get("/", response_model=List[VideoResponse])
async def get_videos():
    """Get all videos"""
    try:
        videos = await database.get_videos()
        
        # Remove MongoDB _id field for response
        for video in videos:
            if '_id' in video:
                del video['_id']
                
        return videos
    except Exception as e:
        logger.error(f"Error fetching videos: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch videos")

@router.get("/featured", response_model=List[VideoResponse])
async def get_featured_videos():
    """Get only featured videos"""
    try:
        videos = await database.get_videos(featured_only=True)
        
        # Remove MongoDB _id field for response
        for video in videos:
            if '_id' in video:
                del video['_id']
                
        return videos
    except Exception as e:
        logger.error(f"Error fetching featured videos: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch featured videos")

@router.post("/sync", response_model=SyncResponse)
async def sync_videos():
    """Manually sync videos (placeholder for YouTube API integration)"""
    try:
        # For now, return mock data since YouTube API integration is optional
        # In production, this would integrate with YouTube Data API v3
        
        from datetime import datetime
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
        
        # Upsert videos to database
        synced_count = await database.upsert_videos(mock_videos)
        
        return SyncResponse(
            success=True,
            message=f"Successfully synced {synced_count} videos",
            videos_synced=synced_count
        )
        
    except Exception as e:
        logger.error(f"Error syncing videos: {str(e)}")
        return SyncResponse(
            success=False,
            message="Failed to sync videos",
            videos_synced=0,
            errors=[str(e)]
        )

@router.get("/stats")
async def get_video_stats():
    """Get video statistics"""
    try:
        stats = await database.get_stats()
        
        return {
            "total_videos": stats.get('videos', 0),
            "featured_videos": stats.get('featured_videos', 0)
        }
    except Exception as e:
        logger.error(f"Error fetching video stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch video statistics")