from database import database
from models import Profile, SocialLink
from datetime import datetime
import asyncio
import logging

logger = logging.getLogger(__name__)

async def seed_initial_data():
    """Seed the database with initial data"""
    try:
        # Database should already be connected by the lifespan manager
        # Check if profile already exists
        existing_profile = await database.get_profile()
        if not existing_profile:
            # Create initial profile
            profile_data = Profile(
                name="Kenan Alnaser",
                title="Software Engineer | Futurist | Creative Technologist",
                bio="I'm a developer with a passion for merging technology and creativity. My work spans across software engineering, AI integration, and experimental projects that explore the limits of digital interaction. Whether it's building tools, automating systems, or visualizing abstract ideas—I thrive at the edge of what's next.",
                location="Digital Frontier",
                specialties=[
                    "Full-stack Development",
                    "AI Tools", 
                    "Creative Coding",
                    "Quantum Computing"
                ],
                tools=[
                    "JavaScript",
                    "Python", 
                    "React",
                    "Node.js",
                    "TensorFlow",
                    "GitHub",
                    "Docker"
                ],
                github_username="Kenan-Alnaser",
                youtube_channel_id="@voransirt"
            ).dict()
            
            await database.create_profile(profile_data)
            logger.info("✅ Profile data seeded")
        else:
            logger.info("✅ Profile already exists")

        # Check if social links exist
        existing_links = await database.get_social_links()
        if not existing_links:
            # Create social links
            social_links = [
                SocialLink(
                    platform="GitHub",
                    name="GitHub",
                    url="https://github.com/Kenan-Alnaser",
                    icon="Github",
                    order=1
                ).dict(),
                SocialLink(
                    platform="LinkedIn", 
                    name="LinkedIn",
                    url="https://www.linkedin.com/in/kenan-alnaser",
                    icon="Linkedin",
                    order=2
                ).dict(),
                SocialLink(
                    platform="YouTube",
                    name="YouTube", 
                    url="https://www.youtube.com/@voransirt",
                    icon="Youtube",
                    order=3
                ).dict(),
                SocialLink(
                    platform="Twitch",
                    name="Twitch",
                    url="https://www.twitch.tv/vor_ansirt", 
                    icon="Twitch",
                    order=4
                ).dict()
            ]
            
            for link in social_links:
                await database.create_social_link(link)
            
            logger.info("✅ Social links seeded")
        else:
            logger.info("✅ Social links already exist")

        logger.info("🌱 Database seeding completed successfully")
        
    except Exception as e:
        logger.error(f"❌ Error seeding database: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(seed_initial_data())