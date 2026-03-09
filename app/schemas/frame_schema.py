from pydantic import BaseModel


class FrameCreate(BaseModel):
    video_id: int
    frame_index: int
    timestamp: float


class FrameMetadata(BaseModel):
    id: int
    video_id: int
    frame_index: int
    timestamp: float

    class Config:
        orm_mode = True
