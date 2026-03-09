from datetime import datetime

from sqlalchemy import Column, Integer, ForeignKey, Float, String, DateTime
from sqlalchemy.orm import relationship

from app.db.base import Base


class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)
    frame_id = Column(Integer, ForeignKey("frames.id", ondelete="CASCADE"), nullable=False, index=True)
    track_id = Column(Integer, ForeignKey("tracks.id", ondelete="SET NULL"), nullable=True, index=True)
    confidence = Column(Float, nullable=False)
    bbox_x = Column(Float, nullable=False)
    bbox_y = Column(Float, nullable=False)
    bbox_width = Column(Float, nullable=False)
    bbox_height = Column(Float, nullable=False)
    mask_path = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    frame = relationship("Frame", back_populates="detections")
    track = relationship("Track", back_populates="detections")

    # validations for this detection
    validations = relationship("Validation", back_populates="detection", cascade="all, delete-orphan")
