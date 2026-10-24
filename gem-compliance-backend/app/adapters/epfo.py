from .base_adapter import BaseAdapter
from typing import Dict, Any
import random

class EPFOAdapter(BaseAdapter):
    def verify(self, bidder_data: Dict[str, Any]) -> Dict[str, Any]:
        status = "PASS" if random.random() > 0.25 else "FAIL"
        return {
            "category": "EPFO Compliance",
            "status": status,
            "details": "EPFO registered and compliant" if status == "PASS" else "EPFO dues pending",
            "score": 10 if status == "PASS" else 0,
            "source": "Mock_Data"
        }