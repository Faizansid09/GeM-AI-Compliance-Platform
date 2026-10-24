from pydantic import BaseModel
from typing import Optional

class BidderCreate(BaseModel):
    company_name: str
    pan: Optional[str] = None
    gstin: Optional[str] = None
    udyam_number: Optional[str] = None
    cin: Optional[str] = None
    is_startup: Optional[int] = 0
    local_content_threshold: Optional[int] = 50