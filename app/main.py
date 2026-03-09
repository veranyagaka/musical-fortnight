from fastapi import FastAPI

from app.routers.videos import router as videos_router
from app.routers.frames import router as frames_router
from app.routers.tracks import router as tracks_router
from app.routers.detection import router as detections_router
from app.routers.validations import router as validations_router    

app = FastAPI()

app.include_router(videos_router)
app.include_router(frames_router)
app.include_router(tracks_router)
app.include_router(detections_router)
app.include_router(validations_router)


@app.get("/test")
def test_route():
    """Why are you running."""
    return {"message": "API is running successfully"}
