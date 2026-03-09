from sqlalchemy import Column, Integer, ForeignKey, Float
from sqlalchemy.orm import relationship

from app.db.base import Base


class Frame(Base):
	__tablename__ = "frames"

	id = Column(Integer, primary_key=True, index=True)
	video_id = Column(Integer, ForeignKey("videos.id", ondelete="CASCADE"), nullable=False, index=True)
	frame_index = Column(Integer, nullable=False)
	timestamp = Column(Float, nullable=False)

	# relationship to Video
	video = relationship("Video", back_populates="frames")

	# relationship to Detection objects
	detections = relationship("Detection", back_populates="frame", cascade="all, delete-orphan")

