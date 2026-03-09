from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.validation_model import Validation
from app.models.detection_model import Detection
from app.schemas.validation_schema import ValidationCreate, ValidationMetadata


router = APIRouter(prefix="/validations", tags=["validations"])


@router.post("", response_model=ValidationMetadata)
def create_validation(
    payload: ValidationCreate, db: Session = Depends(get_db)
):
    det = db.query(Detection).filter(Detection.id == payload.detection_id).first()
    if not det:
        raise HTTPException(status_code=404, detail="Detection not found.")

    validation = Validation(**payload.dict())
    db.add(validation)
    db.commit()
    db.refresh(validation)
    return validation


@router.get("", response_model=List[ValidationMetadata])
def list_validations(
    detection_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Validation)
    if detection_id is not None:
        query = query.filter(Validation.detection_id == detection_id)
    return query.all()


@router.get("/{validation_id}", response_model=ValidationMetadata)
def get_validation(validation_id: int, db: Session = Depends(get_db)):
    v = db.query(Validation).filter(Validation.id == validation_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Validation not found.")
    return v
