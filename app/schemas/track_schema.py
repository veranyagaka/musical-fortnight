from datetime import datetime

from pydantic import BaseModel


class TrackCreate(BaseModel):
    video_id: int
    category_id: int | None = None
    label: str
    first_frame_index: int
    last_frame_index: int


class TrackMetadata(BaseModel):
    id: int
    video_id: int
    category_id: int | None = None
    label: str
    first_frame_index: int
    last_frame_index: int
    created_at: datetime

    class Config:
        orm_mode = True
