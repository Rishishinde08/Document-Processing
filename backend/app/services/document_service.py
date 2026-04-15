from app.database import SessionLocal
from app.models.document import Document


# CREATE
def create_document(filename: str):
    db = SessionLocal()
    try:
        doc = Document(filename=filename, status="queued")
        db.add(doc)
        db.commit()
        db.refresh(doc)
        return doc
    finally:
        db.close()


# GET ALL
def get_all_documents():
    db = SessionLocal()
    try:
        return db.query(Document).all()
    finally:
        db.close()


# GET ONE
def get_document(doc_id: int):
    db = SessionLocal()
    try:
        return db.query(Document).filter(Document.id == doc_id).first()
    finally:
        db.close()