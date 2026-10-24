from .base_adapter import BaseAdapter
from typing import Dict, Any
import random

class NSICAdapter(BaseAdapter):
    def verify(self, bidder_data: Dict[str, Any]) -> Dict[str, Any]:
        if random.random() > 0.5:
            return {
                "category": "NSIC Registration",
                "status": "PASS",
                "details": "NSIC registration active",
                "score": 10,
                "source": "Mock_Data"
            }
        return {
            "category": "NSIC Registration",
            "status": "NA",
            "details": "Not mandatory for this tender",
            "score": 10,
            "source": "Mock_Data"
        }