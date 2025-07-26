from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import logging
from pathlib import Path

# Import database and models
from database import database
from seed_data import seed_initial_data

# Import routes
from routes.profile import router as profile_router
from routes.projects import router as projects_router
from routes.social_links import router as social_links_router
from routes.videos import router as videos_router
from routes.system import router as system_router

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
ROOT_DIR = Path(__file__).parent
from dotenv import load_dotenv
load_dotenv(ROOT_DIR / '.env')

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    try:
        # Startup
        logger.info("🚀 Starting Kenan's Cyberpunk Portfolio Backend...")
        
        # Connect to database
        await database.connect_to_mongo()
        logger.info("✅ Connected to MongoDB")
        
        # Seed initial data
        try:
            await seed_initial_data()
            logger.info("✅ Database seeded with initial data")
        except Exception as e:
            logger.warning(f"⚠️  Seeding warning: {str(e)}")
        
        logger.info("🎯 Backend startup completed successfully")
        yield
        
    except Exception as e:
        logger.error(f"❌ Startup error: {str(e)}")
        raise
    finally:
        # Shutdown
        logger.info("🔄 Shutting down...")
        await database.close_mongo_connection()
        logger.info("✅ Database connection closed")

# Create the main app with lifespan manager
app = FastAPI(
    title="Kenan Alnaser - Cyberpunk Portfolio API",
    description="Backend API for Kenan's futuristic portfolio website",
    version="1.0.0",
    lifespan=lifespan
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@api_router.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "🚀 Welcome to Kenan's Cyberpunk Portfolio API",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Include all route modules
api_router.include_router(profile_router)
api_router.include_router(projects_router)
api_router.include_router(social_links_router)
api_router.include_router(videos_router)
api_router.include_router(system_router)

# Include the API router in the main app
app.include_router(api_router)

# Health check endpoint (outside /api for load balancers)
@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy", "service": "portfolio-backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)