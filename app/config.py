from pathlib import Path
import os

from sqlalchemy.engine import URL

# DATABASE_URL = "postgresql://kioko:Kioko@sql5999@localhost:5432/visionpro"
DATABASE_URL = URL.create(
    drivername="postgresql",
    username="kioko",
    password="Kioko@sql5999",
    host="localhost",
    port=5432,
    database="visionpro",
)

BASE_DIR = Path(__file__).resolve().parent
VIDEO_UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(VIDEO_UPLOAD_DIR, exist_ok=True)