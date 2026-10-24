import type { ComplianceStatus } from '../types';

/**
 * HARDCODED FALLBACK for GET /bidders/{id}/compliance-status
 * (req: "exact JSON my /bidders/123/compliance-status endpoint will return. Hardcode this in
 *  your React state for now. When my server is live, just swap the hardcoded data with a
 *  fetch() call.")
 *
 * This mirrors the exact key/values the backend returns for bidder id 123 (BID-001).
 * The hook useComplianceStatus() tries the real endpoint first; if the backend is not
 * reachable it falls back to this object so the dashboard is fully usable today.
 */
export const MOCK_COMPLIANCE_STATUS: ComplianceStatus = {
  bidder_id: 'BID-001',
  overall_compliance_score: 82,
  risk_level: 'Low',
  ai_recommendation:
    'Bidder is highly compliant. All statutory registrations are active. PAN and GST names match perfectly. Recommended for immediate qualification.',
  compliance_checks: [
    {
      category: 'Udyam (MSME)',
      status: 'PASS',
      details: 'Registration active until 2027',
      score: 10,
    },
    {
      category: 'GST Registration',
      status: 'PASS',
      details: 'GSTIN verified and active',
      score: 10,
    },
    {
      category: 'PAN Verification',
      status: 'PASS',
      details: 'PAN matches company name',
      score: 10,
    },
    {
      category: 'Income Tax (ITR)',
      status: 'FAIL',
      details: 'ITR not filed for AY 2025-26',
      score: 0,
    },
    {
      category: 'MCA21 (Company)',
      status: 'PASS',
      details: 'Company is Active',
      score: 10,
    },
    {
      category: 'Make in India',
      status: 'MANUAL_REVIEW',
      details: 'Local content 45% (Threshold: 50%)',
      score: 5,
    },
    {
      category: 'EPFO Compliance',
      status: 'PASS',
      details: 'EPFO registered',
      score: 10,
    },
    {
      category: 'ESIC Compliance',
      status: 'PASS',
      details: 'ESIC registered',
      score: 10,
    },
    {
      category: 'Startup India',
      status: 'NA',
      details: 'Not applicable for this tender',
      score: 10,
    },
    {
      category: 'Blacklisting Status',
      status: 'PASS',
      details: 'No blacklisting found',
      score: 10,
    },
  ],
};

export const MOCK_COMPLIANCE_STATUS_BY_BIDDER: Record<string, ComplianceStatus> = {
  '123': MOCK_COMPLIANCE_STATUS,
  '456': {
    ...MOCK_COMPLIANCE_STATUS,
    bidder_id: 'BID-002',
    overall_compliance_score: 74,
    risk_level: 'Medium',
    ai_recommendation:
      'Bidder meets most statutory requirements. Income tax filing evidence requires review before final qualification.',
    compliance_checks: MOCK_COMPLIANCE_STATUS.compliance_checks.map((check) =>
      check.category === 'Income Tax (ITR)'
        ? {
            ...check,
            status: 'MANUAL_REVIEW',
            details: 'ITR acknowledgement uploaded; assessment order pending review',
            score: 5,
          }
        : check.category === 'Make in India'
          ? {
              ...check,
              details: 'Local content declaration verified at 52%',
              score: 10,
            }
          : check,
    ),
  },
  '789': {
    ...MOCK_COMPLIANCE_STATUS,
    bidder_id: 'BID-003',
    overall_compliance_score: 61,
    risk_level: 'High',
    ai_recommendation:
      'Additional verification is required. GST registration is active, but blacklisting and statutory filing evidence need officer review.',
    compliance_checks: MOCK_COMPLIANCE_STATUS.compliance_checks.map((check) =>
      check.category === 'GST Registration'
        ? {
            ...check,
            details: 'GSTIN active; return filing is delayed for the latest period',
            score: 5,
          }
        : check.category === 'Blacklisting Status'
          ? {
              ...check,
              status: 'MANUAL_REVIEW',
              details: 'Name similarity found in portal search; manual confirmation required',
              score: 0,
            }
          : check.category === 'Income Tax (ITR)'
            ? {
                ...check,
                details: 'ITR for AY 2025-26 not available in submitted documents',
              }
            : check,
    ),
  },
};

/**
 * Small registry of bidders for the tender/selector UI. In production this is fetched
 * from GET /tenders/{id}/bidders and POST /bidders. Only BID-001 (route id 123) has a
 * hardcoded compliance fallback today.
 */
export const MOCK_BIDDERS = [
  {
    id: '123',
    display: 'BID-001 · Acme Engineering Pvt Ltd',
    name: 'Acme Engineering Pvt Ltd',
    pan: 'AAACA1234F',
    gstin: '33AAACA1234F1Z5',
    contactPerson: 'Rajesh Kumar',
    email: 'tenders@acmeengineering.in',
    phone: '+91 98765 43210',
    address: 'Plot 18, Industrial Estate, Chennai, Tamil Nadu 600032',
    tenderReference: 'CPCL/PROC/2026/047',
    submittedAt: '09 Sep 2026, 10:42 AM',
  },
  {
    id: '456',
    display: 'BID-002 · Bharat Industrial Works',
    name: 'Bharat Industrial Works',
    pan: 'AABCB5678G',
    gstin: '33AABCB5678G1Z2',
    contactPerson: 'Anita Sharma',
    email: 'bids@bharatindustrial.in',
    phone: '+91 98450 11223',
    address: '21 Export Park, Coimbatore, Tamil Nadu 641014',
    tenderReference: 'CPCL/PROC/2026/047',
    submittedAt: '09 Sep 2026, 11:08 AM',
  },
  {
    id: '789',
    display: 'BID-003 · Zenith Fabrication Co',
    name: 'Zenith Fabrication Co',
    pan: 'AACCZ9012H',
    gstin: '33AACCZ9012H1Z9',
    contactPerson: 'Vikram Mehta',
    email: 'compliance@zenithfab.co.in',
    phone: '+91 99620 77881',
    address: '4 Heavy Engineering Road, Hosur, Tamil Nadu 635126',
    tenderReference: 'CPCL/PROC/2026/047',
    submittedAt: '09 Sep 2026, 11:26 AM',
  },
];
