from typing import Dict, Any
from app.adapters import *

class RuleEngine:
    def __init__(self):
        self.adapters = [
            UdyamAdapter(), GSTAdapter(), PANAdapter(), ITRAdapter(), MCAAdapter(),
            MakeInIndiaAdapter(), EPFOAdapter(), ESICAdapter(),
            StartupIndiaAdapter(), NSICAdapter(), BlacklistAdapter()
        ]

    def evaluate(self, bidder_data: Dict[str, Any]) -> Dict[str, Any]:
        results = []
        total_score = 0

        for adapter in self.adapters:
            result = adapter.verify(bidder_data)
            results.append(result)
            total_score += result.get("score", 0)

        max_possible = len(self.adapters) * 10
        score_percent = round((total_score / max_possible) * 100, 2)

        if score_percent >= 80:
            risk = "Low"
        elif score_percent >= 50:
            risk = "Medium"
        else:
            risk = "High"

        return {
            "bidder_id": bidder_data.get("bidder_id", "UNKNOWN"),
            "overall_compliance_score": score_percent,
            "risk_level": risk,
            "compliance_checks": results
        }