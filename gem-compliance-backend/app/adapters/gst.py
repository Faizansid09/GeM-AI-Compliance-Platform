from .base_adapter import BaseAdapter
from typing import Dict, Any
import random

class GSTAdapter(BaseAdapter):
    def verify(self, bidder_data: Dict[str, Any]) -> Dict[str, Any]:
        gst = bidder_data.get("gstin", "")
        if gst and len(gst) == 15:
            status = "PASS" if random.random() > 0.2 else "FAIL"
            details = "GSTIN verified and active" if status == "PASS" else "GST returns not filed for 3 months"
            return {
                "category": "GST Registration",
                "status": status,
                "details": details,
                "score": 10 if status == "PASS" else 0,
                "source": "Mock_Data"
            }
        return {
            "category": "GST Registration",
            "status": "FAIL",
            "details": "Invalid or missing GSTIN",
            "score": 0,
            "source": "Mock_Data"
        }