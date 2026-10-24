from .base_adapter import BaseAdapter
from typing import Dict, Any

class StartupIndiaAdapter(BaseAdapter):
    def verify(self, bidder_data: Dict[str, Any]) -> Dict[str, Any]:
        if bidder_data.get("is_startup", False):
            return {
                "category": "Startup India",
                "status": "PASS",
                "details": "Valid DPIIT recognition found",
                "score": 10,
                "source": "Mock_Data"
            }
        return {
            "category": "Startup India",
            "status": "NA",
            "details": "Not applicable for established firms",
            "score": 10,
            "source": "Mock_Data"
        }