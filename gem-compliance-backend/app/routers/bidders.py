from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.engine.rule_engine import RuleEngine
from app.engine.ai_recommender import AIRecommender
from app.models import Bidder
from app.schemas.bidder import BidderCreate
from app.database import get_db
import uuid
from app.routers.status import job_status_store
router = APIRouter(prefix="/api/v1/bidders", tags=["bidders"])

engine = RuleEngine()
recommender = AIRecommender()

DUMMY_BIDDERS = {
    "123": {
        "bidder_id": "123",
        "company_name": "ABC Solutions",
        "pan": "ABCDE1234F",
        "gstin": "22ABCDE1234F1Z5",
        "udyam_number": "UDYAM-TN-123",
        "cin": "U12345TN2026PLC123456",
        "is_startup": False,
        "local_content_threshold": 50
    }
}

# ============================================
# CREATE BIDDER - Accepts FormData with File
# ============================================

# ============================================
# GET COMPLIANCE STATUS
@router.post("")
@router.post("/")
async def create_bidder(
    file: UploadFile = File(...),
    company_name: str = Form(...),
    pan: str = Form(None),
    gstin: str = Form(None),
    udyam_number: str = Form(None),
    cin: str = Form(None),
    is_startup: int = Form(0),
    local_content_threshold: int = Form(50),
    db: Session = Depends(get_db)
):
    from app.routers.status import job_status_store

    bidder_id = str(uuid.uuid4())[:8]
    new_bidder = Bidder(
        id=bidder_id,
        company_name=company_name,
        pan=pan,
        gstin=gstin,
        udyam_number=udyam_number,
        cin=cin,
        is_startup=is_startup,
        local_content_threshold=local_content_threshold
    )
    db.add(new_bidder)
    db.commit()

    contents = await file.read()
    job_id = f"job_{uuid.uuid4().hex[:10]}"

    # Store job status for polling
    job_status_store[job_id] = {
        "job_id": job_id,
        "status": "Completed",
        "progress": 100,
        "message": "Verification complete",
        "bidder_id": bidder_id
    }

    return {
        "bidder_id": bidder_id,
        "job_id": job_id,
        "status": "processing",
        "message": f"Bidder created and file '{file.filename}' queued.",
        "filename": file.filename,
        "size": len(contents)
    }
# ============================================
@router.get("/{bidder_id}/compliance-status")
def get_compliance_status(bidder_id: str, db: Session = Depends(get_db)):
    if bidder_id == "123":
        bidder_data = DUMMY_BIDDERS["123"]
    else:
        bidder = db.query(Bidder).filter(Bidder.id == bidder_id).first()
        if not bidder:
            raise HTTPException(status_code=404, detail="Bidder not found")
        bidder_data = {
            "bidder_id": bidder.id,
            "company_name": bidder.company_name,
            "pan": bidder.pan,
            "gstin": bidder.gstin,
            "udyam_number": bidder.udyam_number,
            "cin": bidder.cin,
            "is_startup": bool(bidder.is_startup),
            "local_content_threshold": bidder.local_content_threshold
        }
    result = engine.evaluate(bidder_data)
    result["ai_recommendation"] = recommender.generate(result)
    return result

# ============================================
# UPLOAD DOCUMENT (Standalone)
# ============================================
@router.post("/{bidder_id}/documents/upload")
async def upload_document(
    bidder_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if bidder_id != "123":
        bidder = db.query(Bidder).filter(Bidder.id == bidder_id).first()
        if not bidder:
            raise HTTPException(status_code=404, detail="Bidder not found")

    contents = await file.read()
    job_id = f"job_{uuid.uuid4().hex[:10]}"

    return {
        "bidder_id": bidder_id,
        "job_id": job_id,
        "status": "processing",
        "message": f"File '{file.filename}' received.",
        "filename": file.filename,
        "size": len(contents)
    }

# ============================================
# OFFICER OVERRIDE
# ============================================
@router.patch("/{bidder_id}/override")
def officer_override(bidder_id: str, data: dict, db: Session = Depends(get_db)):
    if bidder_id == "123":
        return {"bidder_id": bidder_id, "final_status": data.get("status"), "message": "Override applied (Demo)"}
    bidder = db.query(Bidder).filter(Bidder.id == bidder_id).first()
    if not bidder:
        raise HTTPException(status_code=404, detail="Bidder not found")
    new_status = data.get("status")
    bidder.final_status = new_status
    db.commit()
    return {"bidder_id": bidder_id, "final_status": new_status, "message": "Override applied"}

# ============================================
# REVERIFY BIDDER
# ============================================
@router.post("/{bidder_id}/reverify")
def reverify_bidder(bidder_id: str, db: Session = Depends(get_db)):
    if bidder_id == "123":
        bidder_data = DUMMY_BIDDERS["123"]
    else:
        bidder = db.query(Bidder).filter(Bidder.id == bidder_id).first()
        if not bidder:
            raise HTTPException(status_code=404, detail="Bidder not found")
        bidder_data = {
            "bidder_id": bidder.id,
            "company_name": bidder.company_name,
            "pan": bidder.pan,
            "gstin": bidder.gstin,
            "udyam_number": bidder.udyam_number,
            "cin": bidder.cin,
            "is_startup": bool(bidder.is_startup),
            "local_content_threshold": bidder.local_content_threshold
        }
    result = engine.evaluate(bidder_data)
    result["ai_recommendation"] = recommender.generate(result)
    return {"status": "success", "message": f"Bidder {bidder_id} reverified", "data": result}

# ============================================
# VERIFICATION STATUS (Polling)
# ============================================
@router.get("/{bidder_id}/verification-status")
def get_verification_status(bidder_id: str, db: Session = Depends(get_db)):
    if bidder_id == "123":
        return {"bidder_id": bidder_id, "status": "COMPLETED", "progress": 100, "message": "Verification complete"}
    bidder = db.query(Bidder).filter(Bidder.id == bidder_id).first()
    if not bidder:
        raise HTTPException(status_code=404, detail="Bidder not found")
    return {
        "bidder_id": bidder_id,
        "status": "COMPLETED",
        "progress": 100,
        "message": "Verification complete",
        "final_status": bidder.final_status
    }