from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class ValidationDecision(str, Enum):
    CORRECT = "correct"
    INCORRECT = "incorrect"


class ValidationCreate(BaseModel):
    detection_id: int
    decision: ValidationDecision
    notes: str | None = None


class ValidationMetadata(BaseModel):
    id: int
    detection_id: int
    decision: ValidationDecision
    notes: str | None = None
    validated_at: datetime

    class Config:
        orm_mode = True
