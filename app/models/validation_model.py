from datetime import datetime
from enum import Enum

from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Enum as SQLEnum
from sqlalchemy.orm import relationship

from app.db.base import Base


class ValidationDecision(str, Enum):
    CORRECT = "correct"
    INCORRECT = "incorrect"


class Validation(Base):
    __tablename__ = "validations"

    id = Column(Integer, primary_key=True, index=True)
    detection_id = Column(Integer, ForeignKey("detections.id", ondelete="CASCADE"), nullable=False, index=True)
    decision = Column(SQLEnum(ValidationDecision), nullable=False)
    notes = Column(String, nullable=True)
    validated_at = Column(DateTime, default=datetime.utcnow)

    detection = relationship("Detection", back_populates="validations")
