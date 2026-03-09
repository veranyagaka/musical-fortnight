from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.detection_model import Detection
from app.models.frame_model import Frame
from app.models.track_model import Track
from app.schemas.detection_schema import DetectionCreate, DetectionMetadata


router = APIRouter(prefix="/detections", tags=["detections"])


@router.post("", response_model=DetectionMetadata)
def create_detection(
    payload: DetectionCreate, db: Session = Depends(get_db)
):
    # ensure frame exists
    frame = db.query(Frame).filter(Frame.id == payload.frame_id).first()
    if not frame:
        raise HTTPException(status_code=404, detail="Frame not found.")

    if payload.track_id is not None:
        track = db.query(Track).filter(Track.id == payload.track_id).first()
        if not track:
            raise HTTPException(status_code=404, detail="Track not found.")

    detection = Detection(**payload.dict())
    db.add(detection)
    db.commit()
    db.refresh(detection)
    return detection


@router.get("", response_model=List[DetectionMetadata])
def list_detections(
    frame_id: Optional[int] = None,
    track_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Detection)
    if frame_id is not None:
        query = query.filter(Detection.frame_id == frame_id)
    if track_id is not None:
        query = query.filter(Detection.track_id == track_id)
    return query.all()


@router.get("/{detection_id}", response_model=DetectionMetadata)
def get_detection(detection_id: int, db: Session = Depends(get_db)):
    det = db.query(Detection).filter(Detection.id == detection_id).first()
    if not det:
        raise HTTPException(status_code=404, detail="Detection not found.")
    return det
