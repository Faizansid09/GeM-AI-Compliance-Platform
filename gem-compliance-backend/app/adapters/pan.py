from .base_adapter import BaseAdapter
from typing import Dict, Any
import random

class PANAdapter(BaseAdapter):
    def verify(self, bidder_data: Dict[str, Any]) -> Dict[str, Any]:
        pan = bidder_data.get("pan", "")
        if pan and len(pan) == 10:
            if random.random() > 0.15:
                return {
                    "category": "PAN Verification",
                    "status": "PASS",
                    "details": f"PAN {pan} matches company name",
                    "score": 10,
                    "source": "Mock_Data"
                }
            else:
                return {
                    "category": "PAN Verification",
                    "status": "MANUAL_REVIEW",
                    "details": "PAN name mismatch (90% fuzzy match). Officer review needed.",
                    "score": 5,
                    "source": "Mock_Data"
                }
        return {
            "category": "PAN Verification",
            "status": "FAIL",
            "details": "Invalid PAN format",
            "score": 0,
            "source": "Mock_Data"
        }