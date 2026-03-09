"""Drop all tables and recreate schema from SQLAlchemy models.

WARNING: This will irreversibly drop all data in the database.
Run from project root with your virtualenv activated:

    python reset_db.py

"""
from app.db.base import Base
from app.db.session import engine

# Import models so they are registered on Base.metadata
import app.models.video_model  # noqa: F401
import app.models.frame_model  # noqa: F401
import app.models.category_model  # noqa: F401
import app.models.track_model  # noqa: F401
import app.models.detection_model  # noqa: F401
import app.models.validation_model  # noqa: F401


def reset_db() -> None:
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Reset complete.")


if __name__ == "__main__":
    reset_db()
