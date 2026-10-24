from .base_adapter import BaseAdapter
from typing import Dict, Any
import random

class ESICAdapter(BaseAdapter):
    def verify(self, bidder_data: Dict[str, Any]) -> Dict[str, Any]:
        status = "PASS" if random.random() > 0.2 else "FAIL"
        return {
            "category": "ESIC Compliance",
            "status": status,
            "details": "ESIC compliance verified" if status == "PASS" else "ESIC registration not found",
            "score": 10 if status == "PASS" else 0,
            "source": "Mock_Data"
        }