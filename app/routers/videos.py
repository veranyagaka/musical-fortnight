import os
import uuid
from typing import List

import cv2
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.config import VIDEO_UPLOAD_DIR
from app.dependencies import get_db
from app.models.video_model import Video, VideoStatus
from app.schemas.video_schema import VideoMetadata

router = APIRouter(prefix="/videos", tags=["videos"])


@router.post("", response_model=VideoMetadata)
async def upload_video(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if not file.content_type or not file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="Invalid file type; expected a video.")

    _, ext = os.path.splitext(file.filename)
    unique_name = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(VIDEO_UPLOAD_DIR, unique_name)

    try:
        with open(file_path, "wb") as out_file:
            while chunk := await file.read(1024 * 1024):
                out_file.write(chunk)
    finally:
        await file.close()

    cap = cv2.VideoCapture(file_path)
    if not cap.isOpened():
        raise HTTPException(status_code=400, detail="Unable to read uploaded video file.")

    fps = float(cap.get(cv2.CAP_PROP_FPS) or 0.0)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    duration = float(frame_count / fps) if fps > 0 else 0.0
    cap.release()

    video = Video(
        filename=unique_name,
        fps=fps,
        total_frames=frame_count,
        duration=duration,
        status=VideoStatus.UPLOADED,
    )
    db.add(video)
    db.commit()
    db.refresh(video)

    return video


@router.get("/{video_id}", response_model=VideoMetadata)
def get_video_metadata(video_id: int, db: Session = Depends(get_db)):
    video = db.query(Video).filter(Video.id == video_id).first()
    if video is None:
        raise HTTPException(status_code=404, detail="Video not found.")
    return video


@router.get("", response_model=List[VideoMetadata])
def list_videos(db: Session = Depends(get_db)):
    return db.query(Video).order_by(Video.uploaded_at.desc()).all()
