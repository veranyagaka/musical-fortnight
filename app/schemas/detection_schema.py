from datetime import datetime

from pydantic import BaseModel


class DetectionCreate(BaseModel):
    frame_id: int
    track_id: int | None = None
    confidence: float
    bbox_x: float
    bbox_y: float
    bbox_width: float
    bbox_height: float
    mask_path: str | None = None


class DetectionMetadata(BaseModel):
    id: int
    frame_id: int
    track_id: int | None = None
    confidence: float
    bbox_x: float
    bbox_y: float
    bbox_width: float
    bbox_height: float
    mask_path: str | None = None
    created_at: datetime

    class Config:
        orm_mode = True
