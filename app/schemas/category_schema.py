from pydantic import BaseModel


class CategoryCreate(BaseModel):
    name: str


class CategoryMetadata(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
