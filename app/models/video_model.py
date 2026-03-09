from datetime import datetime
from enum import Enum

from sqlalchemy import Column, Integer, String, Float, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship

from app.db.base import Base


class VideoStatus(str, Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    COMPLETED = "completed"


class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    fps = Column(Float)
    total_frames = Column(Integer)
    duration = Column(Float)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    status = Column(SQLEnum(VideoStatus), default=VideoStatus.UPLOADED)

    # relationship to Frame objects
    frames = relationship("Frame", back_populates="video", cascade="all, delete-orphan")

    # relationship to Track objects
    tracks = relationship("Track", back_populates="video", cascade="all, delete-orphan")
