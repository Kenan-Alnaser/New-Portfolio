from fastapi import APIRouter, HTTPException
from typing import List
from models import SocialLink, SocialLinkCreate, SocialLinkUpdate, ApiResponse
from database import database
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/social-links", tags=["social-links"])

@router.get("/", response_model=List[SocialLink])
async def get_social_links():
    """Get all active social links"""
    try:
        links = await database.get_social_links()
        
        # Remove MongoDB _id field for response
        for link in links:
            if '_id' in link:
                del link['_id']
                
        return links
    except Exception as e:
        logger.error(f"Error fetching social links: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch social links")

@router.post("/", response_model=ApiResponse)
async def create_social_link(link_data: SocialLinkCreate):
    """Create new social link (admin only)"""
    try:
        # Create social link model
        social_link = SocialLink(**link_data.dict())
        
        # Save to database
        link_id = await database.create_social_link(social_link.dict())
        
        return ApiResponse(
            success=True, 
            message="Social link created successfully",
            data={"id": link_id}
        )
    except Exception as e:
        logger.error(f"Error creating social link: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create social link")

@router.put("/{link_id}", response_model=ApiResponse)
async def update_social_link(link_id: str, link_update: SocialLinkUpdate):
    """Update social link (admin only)"""
    try:
        # Get update data
        update_data = link_update.dict(exclude_unset=True)
        if not update_data:
            return ApiResponse(success=False, message="No data provided for update")
        
        # Update in database
        success = await database.update_social_link(link_id, update_data)
        
        if success:
            return ApiResponse(success=True, message="Social link updated successfully")
        else:
            return ApiResponse(success=False, message="Social link not found or update failed")
            
    except Exception as e:
        logger.error(f"Error updating social link: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update social link")