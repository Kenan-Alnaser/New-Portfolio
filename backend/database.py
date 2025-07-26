from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, List, Dict, Any
import os
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database = None

    async def connect_to_mongo(self):
        """Create database connection"""
        try:
            self.client = AsyncIOMotorClient(os.environ['MONGO_URL'])
            self.database = self.client[os.environ['DB_NAME']]
            
            # Test connection
            await self.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB")
            
        except Exception as e:
            logger.error(f"Error connecting to MongoDB: {str(e)}")
            raise

    async def close_mongo_connection(self):
        """Close database connection"""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")

    # Profile operations
    async def get_profile(self) -> Optional[Dict[str, Any]]:
        """Get user profile"""
        try:
            profile = await self.database.profiles.find_one()
            return profile
        except Exception as e:
            logger.error(f"Error fetching profile: {str(e)}")
            return None

    async def create_profile(self, profile_data: Dict[str, Any]) -> str:
        """Create user profile"""
        try:
            result = await self.database.profiles.insert_one(profile_data)
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error creating profile: {str(e)}")
            raise

    async def update_profile(self, profile_data: Dict[str, Any]) -> bool:
        """Update user profile"""
        try:
            profile_data['updated_at'] = datetime.utcnow()
            result = await self.database.profiles.replace_one(
                {}, profile_data, upsert=True
            )
            return result.modified_count > 0 or result.upserted_id is not None
        except Exception as e:
            logger.error(f"Error updating profile: {str(e)}")
            return False

    # Project operations
    async def get_projects(self, featured_only: bool = False) -> List[Dict[str, Any]]:
        """Get projects from database"""
        try:
            query = {}
            if featured_only:
                query['is_featured'] = True
                
            cursor = self.database.projects.find(query).sort('updated_at', -1)
            projects = await cursor.to_list(length=None)
            return projects
        except Exception as e:
            logger.error(f"Error fetching projects: {str(e)}")
            return []

    async def upsert_projects(self, projects: List[Dict[str, Any]]) -> int:
        """Insert or update projects"""
        try:
            if not projects:
                return 0
                
            operations = []
            for project in projects:
                operations.append({
                    'updateOne': {
                        'filter': {'github_id': project['github_id']},
                        'update': {'$set': project},
                        'upsert': True
                    }
                })
            
            if operations:
                result = await self.database.projects.bulk_write(operations)
                return result.upserted_count + result.modified_count
            return 0
        except Exception as e:
            logger.error(f"Error upserting projects: {str(e)}")
            return 0

    async def get_project_cache_age(self) -> Optional[datetime]:
        """Get the age of the most recent project cache"""
        try:
            latest_project = await self.database.projects.find_one(
                sort=[('cached_at', -1)]
            )
            return latest_project.get('cached_at') if latest_project else None
        except Exception as e:
            logger.error(f"Error getting cache age: {str(e)}")
            return None

    # Social links operations
    async def get_social_links(self) -> List[Dict[str, Any]]:
        """Get social links"""
        try:
            cursor = self.database.social_links.find(
                {'is_active': True}
            ).sort('order', 1)
            return await cursor.to_list(length=None)
        except Exception as e:
            logger.error(f"Error fetching social links: {str(e)}")
            return []

    async def create_social_link(self, link_data: Dict[str, Any]) -> str:
        """Create social link"""
        try:
            result = await self.database.social_links.insert_one(link_data)
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error creating social link: {str(e)}")
            raise

    async def update_social_link(self, link_id: str, link_data: Dict[str, Any]) -> bool:
        """Update social link"""
        try:
            result = await self.database.social_links.update_one(
                {'id': link_id}, {'$set': link_data}
            )
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Error updating social link: {str(e)}")
            return False

    # Video operations
    async def get_videos(self, featured_only: bool = False) -> List[Dict[str, Any]]:
        """Get videos from database"""
        try:
            query = {}
            if featured_only:
                query['is_featured'] = True
                
            cursor = self.database.videos.find(query).sort('published_at', -1)
            return await cursor.to_list(length=None)
        except Exception as e:
            logger.error(f"Error fetching videos: {str(e)}")
            return []

    async def upsert_videos(self, videos: List[Dict[str, Any]]) -> int:
        """Insert or update videos"""
        try:
            if not videos:
                return 0
                
            operations = []
            for video in videos:
                operations.append({
                    'updateOne': {
                        'filter': {'youtube_id': video['youtube_id']},
                        'update': {'$set': video},
                        'upsert': True
                    }
                })
            
            if operations:
                result = await self.database.videos.bulk_write(operations)
                return result.upserted_count + result.modified_count
            return 0
        except Exception as e:
            logger.error(f"Error upserting videos: {str(e)}")
            return 0

    # Utility functions
    async def should_sync_projects(self, max_age_hours: int = 6) -> bool:
        """Check if projects need to be synced"""
        try:
            cache_age = await self.get_project_cache_age()
            if not cache_age:
                return True
                
            max_age = datetime.utcnow() - timedelta(hours=max_age_hours)
            return cache_age < max_age
        except Exception as e:
            logger.error(f"Error checking sync status: {str(e)}")
            return True

    async def get_stats(self) -> Dict[str, int]:
        """Get database statistics"""
        try:
            stats = {
                'projects': await self.database.projects.count_documents({}),
                'social_links': await self.database.social_links.count_documents({'is_active': True}),
                'videos': await self.database.videos.count_documents({}),
                'featured_projects': await self.database.projects.count_documents({'is_featured': True}),
                'featured_videos': await self.database.videos.count_documents({'is_featured': True})
            }
            return stats
        except Exception as e:
            logger.error(f"Error getting stats: {str(e)}")
            return {}

# Global database instance
database = Database()