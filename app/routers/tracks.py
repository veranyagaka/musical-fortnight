from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.track_model import Track
from app.models.video_model import Video
from app.models.category_model import Category
from app.schemas.track_schema import TrackCreate, TrackMetadata


router = APIRouter(prefix="/videos/{video_id}/tracks", tags=["tracks"])


@router.post("", response_model=TrackMetadata)
def create_track(video_id: int, payload: TrackCreate, db: Session = Depends(get_db)):
    # verify video exists
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found.")

    if payload.category_id is not None:
        cat = db.query(Category).filter(Category.id == payload.category_id).first()
        if not cat:
            raise HTTPException(status_code=404, detail="Category not found.")

    track = Track(
        video_id=video_id,
        category_id=payload.category_id,
        label=payload.label,
        first_frame_index=payload.first_frame_index,
        last_frame_index=payload.last_frame_index,
    )
    db.add(track)
    db.commit()
    db.refresh(track)
    return track


@router.get("", response_model=List[TrackMetadata])
def list_tracks(video_id: int, db: Session = Depends(get_db)):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found.")
    return db.query(Track).filter(Track.video_id == video_id).all()


@router.get("/{track_id}", response_model=TrackMetadata)
def get_track(video_id: int, track_id: int, db: Session = Depends(get_db)):
    track = (
        db.query(Track)
        .filter(Track.video_id == video_id, Track.id == track_id)
        .first()
    )
    if not track:
        raise HTTPException(status_code=404, detail="Track not found.")
    return track


@router.put("/{track_id}", response_model=TrackMetadata)
def update_track(video_id: int, track_id: int, payload: TrackCreate, db: Session = Depends(get_db)):
    track = (
        db.query(Track)
        .filter(Track.video_id == video_id, Track.id == track_id)
        .first()
    )
    if not track:
        raise HTTPException(status_code=404, detail="Track not found.")

    if payload.category_id is not None:
        cat = db.query(Category).filter(Category.id == payload.category_id).first()
        if not cat:
            raise HTTPException(status_code=404, detail="Category not found.")

    track.category_id = payload.category_id
    track.label = payload.label
    track.first_frame_index = payload.first_frame_index
    track.last_frame_index = payload.last_frame_index
    db.commit()
    db.refresh(track)
    return track


@router.delete("/{track_id}")
def delete_track(video_id: int, track_id: int, db: Session = Depends(get_db)):
    track = (
        db.query(Track)
        .filter(Track.video_id == video_id, Track.id == track_id)
        .first()
    )
    if not track:
        raise HTTPException(status_code=404, detail="Track not found.")
    db.delete(track)
    db.commit()
    return {"detail": "Track deleted."}
