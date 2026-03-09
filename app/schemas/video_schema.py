from datetime import datetime

from pydantic import BaseModel

from app.models.video_model import VideoStatus


class VideoMetadata(BaseModel):
    id: int
    filename: str
    fps: float
    total_frames: int
    duration: float
    uploaded_at: datetime
    status: VideoStatus

    class Config:
        orm_mode = True

