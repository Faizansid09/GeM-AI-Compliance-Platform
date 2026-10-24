from typing import Dict, Any

class AIRecommender:
    def generate(self, compliance_result: Dict[str, Any]) -> str:
        score = compliance_result.get('overall_compliance_score', 0)
        checks = compliance_result.get('compliance_checks', [])

        failures = [c for c in checks if c.get('status') == 'FAIL']

        if score >= 80:
            return "Bidder is highly compliant with all statutory requirements. Recommended for immediate qualification."
        elif score >= 50:
            if failures:
                return f"Bidder has {len(failures)} critical non-compliances ({', '.join([c['category'] for c in failures[:2]])}). Manual review strongly advised."
            return "Bidder has minor discrepancies. Manual review recommended for pending documents."
        else:
            return f"Bidder has {len(failures)} critical non-compliances. Score is {score}%. Strongly advised to disqualify or request resubmission."