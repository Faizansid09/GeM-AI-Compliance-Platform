from .base_adapter import BaseAdapter
from typing import Dict, Any

class UdyamAdapter(BaseAdapter):
    def verify(self, bidder_data: Dict[str, Any]) -> Dict[str, Any]:
        if bidder_data.get("udyam_number"):
            return {
                "category": "Udyam (MSME)",
                "status": "PASS",
                "details": f"Udyam {bidder_data['udyam_number']} is active until 2027",
                "score": 10,
                "source": "Mock_Data"
            }
        return {
            "category": "Udyam (MSME)",
            "status": "FAIL",
            "details": "No Udyam registration found",
            "score": 0,
            "source": "Mock_Data"
        }