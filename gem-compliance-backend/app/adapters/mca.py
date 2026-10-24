from .base_adapter import BaseAdapter
from typing import Dict, Any

class MCAAdapter(BaseAdapter):
    def verify(self, bidder_data: Dict[str, Any]) -> Dict[str, Any]:
        if bidder_data.get("cin"):
            return {
                "category": "MCA21 (Company Status)",
                "status": "PASS",
                "details": "Company is Active and in good standing",
                "score": 10,
                "source": "Mock_Data"
            }
        return {
            "category": "MCA21 (Company Status)",
            "status": "NA",
            "details": "Not applicable for proprietorship",
            "score": 10,
            "source": "Mock_Data"
        }