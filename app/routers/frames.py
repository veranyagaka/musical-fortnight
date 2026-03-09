from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.frame_model import Frame
from app.models.video_model import Video
from app.schemas.frame_schema import FrameMetadata


router = APIRouter(prefix="/videos/{video_id}/frames", tags=["frames"])


@router.get("", response_model=List[FrameMetadata])
def get_frames_for_video(video_id: int, db: Session = Depends(get_db)):
    video = db.query(Video).filter(Video.id == video_id).first()
    if video is None:
        raise HTTPException(status_code=404, detail="Video not found.")

    frames = db.query(Frame).filter(Frame.video_id == video_id).order_by(Frame.frame_index).all()
    return frames


@router.get("/{frame_index}", response_model=FrameMetadata)
def get_frame(video_id: int, frame_index: int, db: Session = Depends(get_db)):
    frame = (
        db.query(Frame)
        .filter(Frame.video_id == video_id, Frame.frame_index == frame_index)
        .first()
    )
    if frame is None:
        raise HTTPException(status_code=404, detail="Frame not found for this video.")
    return frame
