from fastapi import APIRouter, UploadFile, File
from fastapi.responses import Response

from app.services.document_service import create_document, get_all_documents, get_document
from app.workers.tasks import process_document
from app.utils.exporter import export_to_json, export_to_csv

from app.database import SessionLocal
from app.models.document import Document

router = APIRouter()


# -------------------- UPLOAD --------------------
@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    doc = create_document(file.filename)
    process_document.delay(doc.id)
    return {"id": doc.id, "status": "queued"}


# -------------------- LIST --------------------
@router.get("/documents")
def list_documents():
    return get_all_documents()


# -------------------- UPDATE (EDIT) --------------------
@router.put("/update/{doc_id}")
def update_document(doc_id: int, data: dict):
    db = SessionLocal()
    doc = db.query(Document).filter(Document.id == doc_id).first()

    if not doc:
        return {"error": "Document not found"}

    doc.result = str(data)
    db.commit()

    return {"message": "Updated successfully"}


# -------------------- FINALIZE --------------------
@router.put("/finalize/{doc_id}")
def finalize_document(doc_id: int):
    db = SessionLocal()
    doc = db.query(Document).filter(Document.id == doc_id).first()

    if not doc:
        return {"error": "Document not found"}

    doc.status = "finalized"
    db.commit()

    return {"message": "Finalized successfully"}


# -------------------- DELETE --------------------
@router.delete("/delete/{doc_id}")
def delete_document(doc_id: int):
    db = SessionLocal()
    doc = db.query(Document).filter(Document.id == doc_id).first()

    if not doc:
        return {"error": "Document not found"}

    db.delete(doc)
    db.commit()

    return {"message": "Deleted successfully"}


# -------------------- RETRY JOB 🔥 --------------------
@router.post("/retry/{doc_id}")
def retry_job(doc_id: int):
    process_document.delay(doc_id)
    return {"message": "Retry started"}


# -------------------- EXPORT JSON --------------------
@router.get("/export/json/{doc_id}")
def export_json(doc_id: int):
    doc = get_document(doc_id)

    if not doc:
        return {"error": "Document not found"}

    data = export_to_json(doc)

    return Response(
        content=data,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=doc_{doc_id}.json"}
    )


# -------------------- EXPORT CSV --------------------
@router.get("/export/csv/{doc_id}")
def export_csv(doc_id: int):
    doc = get_document(doc_id)

    if not doc:
        return {"error": "Document not found"}

    data = export_to_csv(doc)

    return Response(
        content=data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=doc_{doc_id}.csv"}
    )