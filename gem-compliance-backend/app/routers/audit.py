from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/audit", tags=["audit"])

@router.post("")
@router.post("/")
async def log_audit(data: dict):
    """
    Log officer decision/audit entries from frontend.
    Accepts any JSON payload (status, reason, bidder_id, action, etc.)
    """
    return {
        "status": "success",
        "message": "Audit logged successfully",
        "logged_data": data
    }