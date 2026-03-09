from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from app.db.base import Base


class Track(Base):
    __tablename__ = "tracks"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id", ondelete="CASCADE"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True)
    label = Column(String, nullable=False)
    first_frame_index = Column(Integer, nullable=False)
    last_frame_index = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    video = relationship("Video", back_populates="tracks")
    category = relationship("Category")

    # detections associated with this track
    detections = relationship("Detection", back_populates="track", cascade="all, delete-orphan")
