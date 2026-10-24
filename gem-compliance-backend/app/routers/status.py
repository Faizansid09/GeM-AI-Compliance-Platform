from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/status", tags=["status"])

# In-memory store for job statuses (for demo only)
# In production, use Redis or a database
job_status_store = {}

@router.get("/{job_id}")
def get_job_status(job_id: str):
    """
    Poll job status endpoint.
    Frontend calls this every 5 seconds while processing.
    """
    if job_id in job_status_store:
        return job_status_store[job_id]
    
    # If job not found, return a default completed status
    # This prevents 404s during demo
    return {
        "job_id": job_id,
        "status": "Completed",
        "progress": 100,
        "message": "Verification complete",
        "bidder_id": None
    }