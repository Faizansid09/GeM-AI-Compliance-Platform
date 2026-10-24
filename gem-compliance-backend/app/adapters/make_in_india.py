from .base_adapter import BaseAdapter
from typing import Dict, Any
import random

class MakeInIndiaAdapter(BaseAdapter):
    def verify(self, bidder_data: Dict[str, Any]) -> Dict[str, Any]:
        local_content = random.randint(30, 80)
        threshold = bidder_data.get("local_content_threshold", 50)
        if local_content >= threshold:
            return {
                "category": "Make in India (Local Content)",
                "status": "PASS",
                "details": f"Local content {local_content}% (Threshold: {threshold}%)",
                "score": 10,
                "source": "Mock_Data"
            }
        else:
            return {
                "category": "Make in India (Local Content)",
                "status": "MANUAL_REVIEW",
                "details": f"Local content {local_content}% below threshold ({threshold}%). Check docs.",
                "score": 5,
                "source": "Mock_Data"
            }