from app.db.base import Base
from app.db.session import engine

# Import models to ensure they are registered with SQLAlchemy metadata.
# The import is intentional for side effects (model registration).
import app.models.video_model  # noqa: F401
import app.models.frame_model  # noqa: F401
import app.models.category_model  # noqa: F401
import app.models.track_model  # noqa: F401
import app.models.detection_model  # noqa: F401
import app.models.validation_model  # noqa: F401

Base.metadata.create_all(bind=engine)

