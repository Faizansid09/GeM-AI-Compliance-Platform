from sqlalchemy import Column, String, Integer
from app.database import Base

class Bidder(Base):
    __tablename__ = "bidders"
    id = Column(String, primary_key=True, index=True)
    company_name = Column(String, nullable=False)
    pan = Column(String, nullable=True)
    gstin = Column(String, nullable=True)
    udyam_number = Column(String, nullable=True)
    cin = Column(String, nullable=True)
    is_startup = Column(Integer, default=0)
    local_content_threshold = Column(Integer, default=50)
    final_status = Column(String, default="PENDING")