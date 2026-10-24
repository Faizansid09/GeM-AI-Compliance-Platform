export type CheckStatus = 'PASS' | 'FAIL' | 'MANUAL_REVIEW' | 'NA';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface ComplianceCheck {
  category: string;
  status: CheckStatus;
  details: string;
  score: number;
}

export interface ComplianceStatus {
  bidder_id: string;
  overall_compliance_score: number;
  risk_level: RiskLevel;
  ai_recommendation: string;
  compliance_checks: ComplianceCheck[];
}

export interface Bidder {
  id: string;
  name: string;
  pan: string;
  gstin: string;
  udyam_number?: string;
  cin?: string;
  is_startup?: number; // 0 or 1
  local_content_threshold?: number;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  tenderReference?: string;
  submittedAt?: string;
}

export interface UploadResponse {
  bidder_id: string;
  job_id: string;
  status?: string;
  message?: string;
  filename?: string;
  size?: number;
}

export type JobStatusValue = 'Processing' | 'Completed' | 'Failed';

export interface JobStatus {
  job_id: string;
  status: JobStatusValue;
  progress?: number;
  message?: string;
}

export type OfficerAction = 'APPROVE' | 'REJECT' | 'OVERRIDE';

export interface AuditPayload {
  bidder_id: string;
  action: OfficerAction;
  comment: string;
  actor: string;
}

export interface OverridePayload {
  reason: string;
}

export interface OverrideResponse {
  bidder_id: string;
  status: string;
  reason: string;
  officer: string;
  timestamp: string;
}

export interface RateLimitError extends Error {
  code?: string;
  retry_after?: number;
}
