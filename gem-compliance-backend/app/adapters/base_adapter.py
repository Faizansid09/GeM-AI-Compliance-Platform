from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseAdapter(ABC):
    """Every government portal checker must follow this blueprint."""

    @abstractmethod
    def verify(self, bidder_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Run the compliance check.
        Returns: { category, status, details, score, source }
        """
        pass