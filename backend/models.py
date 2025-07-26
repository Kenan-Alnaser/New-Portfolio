from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Profile Models
class ProfileBase(BaseModel):
    name: str
    title: str
    bio: str
    location: str
    specialties: List[str]
    tools: List[str]
    github_username: str
    youtube_channel_id: Optional[str] = None

class Profile(ProfileBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    specialties: Optional[List[str]] = None
    tools: Optional[List[str]] = None
    github_username: Optional[str] = None
    youtube_channel_id: Optional[str] = None

# Project Models
class ProjectBase(BaseModel):
    github_id: int
    name: str
    description: Optional[str] = None
    language: Optional[str] = None
    html_url: str
    created_at: datetime
    updated_at: datetime
    stargazers_count: int = 0
    forks_count: int = 0
    topics: List[str] = []
    is_featured: bool = False

class Project(ProjectBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    cached_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectResponse(BaseModel):
    id: str
    github_id: int
    name: str
    description: Optional[str]
    language: Optional[str]
    html_url: str
    created_at: datetime
    updated_at: datetime
    stargazers_count: int
    forks_count: int
    topics: List[str]
    is_featured: bool

# Social Link Models
class SocialLinkBase(BaseModel):
    platform: str
    name: str
    url: str
    icon: str
    order: int = 0
    is_active: bool = True

class SocialLink(SocialLinkBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SocialLinkCreate(SocialLinkBase):
    pass

class SocialLinkUpdate(BaseModel):
    platform: Optional[str] = None
    name: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

# Video Models
class VideoBase(BaseModel):
    youtube_id: str
    title: str
    description: str
    thumbnail: str
    published_at: datetime
    view_count: int = 0
    duration: str
    is_featured: bool = False

class Video(VideoBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    cached_at: datetime = Field(default_factory=datetime.utcnow)

class VideoResponse(BaseModel):
    id: str
    youtube_id: str
    title: str
    description: str
    thumbnail: str
    published_at: datetime
    view_count: int
    duration: str
    is_featured: bool

# API Response Models
class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

class SyncResponse(BaseModel):
    success: bool
    message: str
    projects_synced: int = 0
    videos_synced: int = 0
    errors: List[str] = []