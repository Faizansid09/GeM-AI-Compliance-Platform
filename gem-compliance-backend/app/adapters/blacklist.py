from .base_adapter import BaseAdapter
from typing import Dict, Any
import random

class BlacklistAdapter(BaseAdapter):
    def verify(self, bidder_data: Dict[str, Any]) -> Dict[str, Any]:
        if random.random() > 0.1:
            return {
                "category": "Blacklisting / Debarment",
                "status": "PASS",
                "details": "No blacklisting found against this entity",
                "score": 10,
                "source": "Mock_Data"
            }
        return {
            "category": "Blacklisting / Debarment",
            "status": "FAIL",
            "details": "Entity found in debarment list (Ref: GeM Blacklist #123)",
            "score": 0,
            "source": "Mock_Data"
        }