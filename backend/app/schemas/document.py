from pydantic import BaseModel

class DocumentResponse(BaseModel):
    id: int
    filename: str
    status: str
    result: str | None

    class Config:
        from_attributes = True