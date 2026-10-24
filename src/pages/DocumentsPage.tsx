import { useState } from 'react';
import { EmptyState } from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';

export interface DocumentItem {
  id: string;
  bidder: string;
  bidId: string;
  type: string;
  date: string;
  status: 'Verified' | 'Manual Review' | 'Pending' | 'Failed';
  extractionStatus: 'Completed' | 'Processing' | 'Failed';
  source: string;
  file: string;
  fileSize: string;
  officialEmail: string;
  officerName: string;
  designation: string;
  department: string;
  phone: string;
  employeeId: string;
  extractedDetails: {
    documentNumber?: string;
    issueDate?: string;
    validUntil?: string;
    verifiedByAi?: string;
    confidenceScore?: string;
  };
}

const DEFAULT_MOCK_DOCS: DocumentItem[] = [
  {
    id: 'd1',
    bidder: 'Acme Engineering Pvt Ltd',
    bidId: 'BID-001',
    type: 'GST Certificate',
    date: '09 Sep 2026',
    status: 'Verified',
    extractionStatus: 'Completed',
    source: 'Upload',
    file: 'gst_acme.pdf',
    fileSize: '1.4 MB',
    officialEmail: 'officer@cpcl.gov.in',
    officerName: 'Prince Kumar',
    designation: 'Procurement Officer',
    department: 'Procurement',
    phone: '9876543210',
    employeeId: 'CPCL-2024-0042',
    extractedDetails: {
      documentNumber: '33AAACA1234F1Z5',
      issueDate: '14 May 2018',
      validUntil: 'Active (Regular)',
      verifiedByAi: 'Matched GSTN live database',
      confidenceScore: '99.4%',
    },
  },
  {
    id: 'd2',
    bidder: 'Acme Engineering Pvt Ltd',
    bidId: 'BID-001',
    type: 'PAN Card',
    date: '09 Sep 2026',
    status: 'Verified',
    extractionStatus: 'Completed',
    source: 'Upload',
    file: 'pan_acme.pdf',
    fileSize: '820 KB',
    officialEmail: 'officer@cpcl.gov.in',
    officerName: 'Prince Kumar',
    designation: 'Procurement Officer',
    department: 'Procurement',
    phone: '9876543210',
    employeeId: 'CPCL-2024-0042',
    extractedDetails: {
      documentNumber: 'AAACA1234F',
      issueDate: '10 Jan 2015',
      validUntil: 'Permanent',
      verifiedByAi: 'NSDL PAN verification passed',
      confidenceScore: '98.9%',
    },
  },
  {
    id: 'd3',
    bidder: 'Acme Engineering Pvt Ltd',
    bidId: 'BID-001',
    type: 'Udyam Certificate',
    date: '09 Sep 2026',
    status: 'Verified',
    extractionStatus: 'Completed',
    source: 'Upload',
    file: 'udyam_acme.pdf',
    fileSize: '2.1 MB',
    officialEmail: 'officer@cpcl.gov.in',
    officerName: 'Prince Kumar',
    designation: 'Procurement Officer',
    department: 'Procurement',
    phone: '9876543210',
    employeeId: 'CPCL-2024-0042',
    extractedDetails: {
      documentNumber: 'UDYAM-MH-01-0012345',
      issueDate: '22 Aug 2021',
      validUntil: 'Valid MSME Class: Medium',
      verifiedByAi: 'MSME Udyam portal verified',
      confidenceScore: '97.8%',
    },
  },
  {
    id: 'd4',
    bidder: 'Bharat Industrial Works',
    bidId: 'BID-002',
    type: 'ITR Acknowledgement',
    date: '09 Sep 2026',
    status: 'Manual Review',
    extractionStatus: 'Completed',
    source: 'Upload',
    file: 'itr_bharat.pdf',
    fileSize: '3.6 MB',
    officialEmail: 'officer@cpcl.gov.in',
    officerName: 'Prince Kumar',
    designation: 'Procurement Officer',
    department: 'Procurement',
    phone: '9876543210',
    employeeId: 'CPCL-2024-0042',
    extractedDetails: {
      documentNumber: 'ACK-ITR-2025-884920',
      issueDate: '31 Jul 2025',
      validUntil: 'AY 2025-26',
      verifiedByAi: 'Turnover figure requires manual validation',
      confidenceScore: '86.2%',
    },
  },
  {
    id: 'd5',
    bidder: 'Zenith Fabrication Co',
    bidId: 'BID-003',
    type: 'EPFO Registration',
    date: '09 Sep 2026',
    status: 'Pending',
    extractionStatus: 'Processing',
    source: 'Upload',
    file: 'epfo_zenith.pdf',
    fileSize: '1.9 MB',
    officialEmail: 'officer@cpcl.gov.in',
    officerName: 'Prince Kumar',
    designation: 'Procurement Officer',
    department: 'Procurement',
    phone: '9876543210',
    employeeId: 'CPCL-2024-0042',
    extractedDetails: {
      documentNumber: 'DL/CPM/0034928/000',
      issueDate: '12 Nov 2019',
      validUntil: 'Active Establishments',
      verifiedByAi: 'OCR in progress (75%)',
      confidenceScore: 'Pending',
    },
  },
  {
    id: 'd6',
    bidder: 'Acme Engineering Pvt Ltd',
    bidId: 'BID-001',
    type: 'Audited Financial Statement',
    date: '08 Sep 2026',
    status: 'Verified',
    extractionStatus: 'Completed',
    source: 'Upload',
    file: 'balance_sheet_fy24.pdf',
    fileSize: '4.8 MB',
    officialEmail: 'officer@cpcl.gov.in',
    officerName: 'Prince Kumar',
    designation: 'Procurement Officer',
    department: 'Procurement',
    phone: '9876543210',
    employeeId: 'CPCL-2024-0042',
    extractedDetails: {
      documentNumber: 'UDIN-24098234AAAA0192',
      issueDate: '15 Jun 2024',
      validUntil: 'FY 2023-24',
      verifiedByAi: 'Average 3Y Turnover: ₹48.2 Cr (Meets criteria)',
      confidenceScore: '99.1%',
    },
  },
];

const STATUS_STYLES: Record<string, string> = {
  Verified: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  'Manual Review': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  Pending: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  Failed: 'bg-red-50 text-red-700 ring-red-600/20',
};

export function DocumentsPage() {
  const { user, profile } = useAuth();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  // Sync active user details with mock docs
  const activeEmail = user?.email || profile?.email || 'officer@cpcl.gov.in';
  const activeName = profile?.displayName || user?.displayName || 'Prince Kumar';
  const activeDesig = profile?.designation || 'Procurement Officer';
  const activeDept = profile?.department || 'Procurement';
  const activePhone = profile?.phone || '9876543210';
  const activeEmpId = profile?.employeeId || 'CPCL-2024-0042';

  const docsWithUser: DocumentItem[] = DEFAULT_MOCK_DOCS.map((d) => ({
    ...d,
    officialEmail: activeEmail,
    officerName: activeName,
    designation: activeDesig,
    department: activeDept,
    phone: activePhone,
    employeeId: activeEmpId,
  }));

  const types = ['All', ...Array.from(new Set(docsWithUser.map((d) => d.type)))];

  const filtered = docsWithUser.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      d.bidder.toLowerCase().includes(q) ||
      d.bidId.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q) ||
      d.officialEmail.toLowerCase().includes(q) ||
      d.officerName.toLowerCase().includes(q);
    const matchType = typeFilter === 'All' || d.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Documents</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            All uploaded compliance documents, AI extraction status, and assigned officer details.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-xs text-brand font-medium">
          <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
          <span>Officer: <strong>{activeName}</strong> ({activeEmail})</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search by bidder, document type, bid ID, or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          {types.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No documents found" description="Try adjusting the search or filter." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['File', 'Bidder', 'Bid ID', 'Document Type', 'Official Email', 'Upload Date', 'Verification', 'AI Extraction', 'Action'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-red-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <div>
                          <span className="text-xs font-semibold text-slate-800 block">{doc.file}</span>
                          <span className="text-[10px] text-slate-400">{doc.fileSize}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-800 font-medium">{doc.bidder}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-500">{doc.bidId}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-700">{doc.type}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="text-xs font-mono text-slate-800 font-medium">{doc.officialEmail}</span>
                        <span className="text-[10px] text-slate-400">{doc.officerName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">{doc.date}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[doc.status] ?? 'bg-slate-100 text-slate-600 ring-slate-500/20'}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-medium ${doc.extractionStatus === 'Completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {doc.extractionStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoc(doc);
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-brand hover:text-brand transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400 flex items-center justify-between">
            <span>Showing {filtered.length} of {docsWithUser.length} documents</span>
            <span>Click any document to inspect official email & officer metadata</span>
          </div>
        </div>
      )}

      {/* Document Details & User Mock Data Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>📄</span> {selectedDoc.file}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Uploaded on {selectedDoc.date} · {selectedDoc.fileSize} · Source: {selectedDoc.source}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Officer / User Mock Data */}
              <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand flex items-center gap-1.5">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    Official Officer Record
                  </h4>
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
                    Active Session Mock
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Official Email:</span>
                    <a
                      href={`mailto:${selectedDoc.officialEmail}`}
                      className="font-semibold text-brand hover:underline font-mono"
                    >
                      {selectedDoc.officialEmail}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Officer Name:</span>
                    <span className="font-semibold text-slate-800">{selectedDoc.officerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Designation:</span>
                    <span className="text-slate-700">{selectedDoc.designation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Department:</span>
                    <span className="text-slate-700">{selectedDoc.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Phone Number:</span>
                    <span className="font-mono text-slate-700">{selectedDoc.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Employee / Officer ID:</span>
                    <span className="font-mono text-slate-700">{selectedDoc.employeeId}</span>
                  </div>
                </div>
              </div>

              {/* Document and AI Extraction Information */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  AI Extraction & Verification Breakdown
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Bidder Name:</span>
                    <span className="font-semibold text-slate-800">{selectedDoc.bidder}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Bid ID:</span>
                    <span className="font-mono text-slate-700">{selectedDoc.bidId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Extracted Identifier:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedDoc.extractedDetails.documentNumber || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Issue Date / Validity:</span>
                    <span className="text-slate-700">{selectedDoc.extractedDetails.issueDate} ({selectedDoc.extractedDetails.validUntil})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">AI Verification Status:</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[selectedDoc.status]}`}>
                      {selectedDoc.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">AI Confidence:</span>
                    <span className="font-semibold text-emerald-600">{selectedDoc.extractedDetails.confidenceScore}</span>
                  </div>
                </div>

                {selectedDoc.extractedDetails.verifiedByAi && (
                  <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600 border border-slate-100">
                    <span className="font-semibold text-slate-700">Verification note: </span>
                    {selectedDoc.extractedDetails.verifiedByAi}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex items-center justify-between">
              <a
                href={`mailto:${selectedDoc.officialEmail}?subject=Regarding%20Document%20${selectedDoc.file}%20(${selectedDoc.bidId})`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                ✉️ Open Official Email
              </a>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
