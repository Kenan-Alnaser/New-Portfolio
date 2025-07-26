from fastapi import APIRouter, HTTPException
from models import Profile, ProfileUpdate, ApiResponse
from database import database
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("/")
async def get_profile():
    """Get user profile information"""
    try:
        profile = await database.get_profile()
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        # Remove MongoDB _id field for response
        if '_id' in profile:
            del profile['_id']
            
        return profile
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching profile: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch profile")

@router.put("/", response_model=ApiResponse)
async def update_profile(profile_update: ProfileUpdate):
    """Update user profile (admin only in production)"""
    try:
        # Get existing profile
        existing_profile = await database.get_profile()
        if not existing_profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        # Update only provided fields
        update_data = profile_update.dict(exclude_unset=True)
        if not update_data:
            return ApiResponse(success=False, message="No data provided for update")
        
        # Merge with existing data
        for field, value in update_data.items():
            existing_profile[field] = value
        
        # Update in database
        success = await database.update_profile(existing_profile)
        
        if success:
            return ApiResponse(success=True, message="Profile updated successfully")
        else:
            return ApiResponse(success=False, message="Failed to update profile")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating profile: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update profile")