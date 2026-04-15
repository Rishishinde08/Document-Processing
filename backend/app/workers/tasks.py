from app.workers.celery_app import celery
from app.database import SessionLocal
from app.models.document import Document
import time
import redis
import json

r = redis.Redis(host="localhost", port=6379, db=0)

@celery.task
def process_document(doc_id: int):
    db = SessionLocal()
    doc = db.query(Document).filter(Document.id == doc_id).first()

    # STEP 1
    doc.status = "parsing"
    db.commit()
    r.publish("progress", json.dumps({"id": doc_id, "status": "parsing"}))
    time.sleep(1)

    # STEP 2
    doc.status = "extracting"
    db.commit()
    r.publish("progress", json.dumps({"id": doc_id, "status": "extracting"}))
    time.sleep(1)

    # FINAL
    doc.status = "completed"
    doc.result = "Extracted content here..."
    db.commit()
    r.publish("progress", json.dumps({"id": doc_id, "status": "completed"}))

    db.close()