import React, { useState } from 'react';
import {
  ApplicantCase,
  DocType,
  DocField,
  FraudFlag,
  AuditEvent,
} from '../types/docubridge';
import { DocumentRenderer } from './DocumentRenderer';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  FileText,
  Volume2,
  Lock,
  Unlock,
  Eye,
  Send,
  History,
  FileCheck2,
  Calculator,
  UserCheck,
  Building2,
  DollarSign,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';

interface StaffConsoleProps {
  cases: ApplicantCase[];
  currentCase: ApplicantCase;
  onSelectCase: (c: ApplicantCase) => void;
  onUpdateCase: (updatedCase: ApplicantCase) => void;
  onRequestInfoModal: (docType: string) => void;
}

export const StaffConsole: React.FC<StaffConsoleProps> = ({
  cases,
  currentCase,
  onSelectCase,
  onUpdateCase,
  onRequestInfoModal,
}) => {
  const [filterReadiness, setFilterReadiness] = useState<string>('all');
  const [selectedDocType, setSelectedDocType] = useState<DocType>('salary_slip');
  const [activeField, setActiveField] = useState<DocField | null>(null);
  const [activeFlag, setActiveFlag] = useState<FraudFlag | null>(null);
  const [isMasked, setIsMasked] = useState<boolean>(true);
  const [showAuditDrawer, setShowAuditDrawer] = useState<boolean>(false);
  const [officerDecisionMessage, setOfficerDecisionMessage] = useState<string | null>(null);

  // Available docs for current case
  const docList = Object.entries(currentCase.documents)
    .filter(([_, doc]) => doc !== null)
    .map(([type, doc]) => ({ type: type as DocType, doc: doc! }));

  const activeDoc = currentCase.documents[selectedDocType] || docList[0]?.doc;

  // Filtered cases for queue
  const filteredCases = cases.filter((c) => {
    if (filterReadiness === 'complete') return c.status === 'Complete';
    if (filterReadiness === 'waiting') return c.status === 'Waiting on customer';
    if (filterReadiness === 'review') return c.status === 'Needs review';
    return true;
  });

  // Handle unmask action with audit logging
  const handleToggleMask = () => {
    const nextState = !isMasked;
    setIsMasked(nextState);

    // Append audit event
    const newAudit: AuditEvent = {
      id: `AUD-UNMASK-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: 'Officer Amit Kumar (Loan Ops)',
      actorRole: 'officer',
      action: nextState ? 'Masked PII protection re-engaged' : 'Sensitive PII unmasked by Loan Officer',
      details: nextState
        ? 'Aadhaar, PAN and Bank Account digits masked to 4-character suffixes.'
        : 'Logged KYC access. Aadhaar and account numbers revealed for verification under DPDP Act.',
      severity: nextState ? 'info' : 'warning',
    };

    onUpdateCase({
      ...currentCase,
      auditTrail: [newAudit, ...currentCase.auditTrail],
    });
  };

  const handleDecision = (decision: 'Approved' | 'Quarantined' | 'Clarification') => {
    let msg = '';
    let status: 'Complete' | 'Waiting on customer' | 'Needs review' = currentCase.status;

    if (decision === 'Approved') {
      msg = 'Application Approved by Officer Amit Kumar. Case package ready for Core Banking handoff.';
      status = 'Complete';
    } else if (decision === 'Quarantined') {
      msg = 'Quarantined for Special Investigations Unit (SIU) regarding forged documents / security flags.';
      status = 'Needs review';
    } else {
      msg = 'Clarification requested from customer. Draft notification generated.';
      status = 'Waiting on customer';
    }

    setOfficerDecisionMessage(msg);

    const decisionAudit: AuditEvent = {
      id: `AUD-DEC-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      actor: 'Officer Amit Kumar',
      actorRole: 'officer',
      action: `Officer Decision: ${decision}`,
      details: msg,
      severity: decision === 'Quarantined' ? 'alert' : 'info',
    };

    onUpdateCase({
      ...currentCase,
      status,
      auditTrail: [decisionAudit, ...currentCase.auditTrail],
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-68px)] bg-slate-950 text-slate-100 overflow-hidden">
      {/* Officer Sub-header with Readiness Queue & Status */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Readiness Queue Filters */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            Work Queue:
          </span>
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFilterReadiness('all')}
              className={`px-3 py-1 rounded-md transition font-medium ${
                filterReadiness === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({cases.length})
            </button>
            <button
              onClick={() => setFilterReadiness('complete')}
              className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1 ${
                filterReadiness === 'complete' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle className="w-3 h-3 text-emerald-300" />
              Complete ({cases.filter((c) => c.status === 'Complete').length})
            </button>
            <button
              onClick={() => setFilterReadiness('review')}
              className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1 ${
                filterReadiness === 'review' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3 h-3 text-rose-300" />
              Needs Review / High Risk ({cases.filter((c) => c.status === 'Needs review').length})
            </button>
          </div>
        </div>

        {/* Active Case Selector Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Switch Case:</span>
          <div className="flex gap-1.5">
            {filteredCases.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onSelectCase(c);
                  setActiveField(null);
                  setActiveFlag(null);
                  setOfficerDecisionMessage(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 border ${
                  currentCase.id === c.id
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500 shadow'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    c.riskLevel === 'High' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'
                  }`}
                />
                {c.applicantName}
                <span className="text-[10px] text-slate-400 font-mono">({c.primaryLanguage})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sensitive Data Protection (Masking) & Audit Logs */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleToggleMask}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition ${
              isMasked
                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
            title="DPDP Act / RBI KYC Masking Policy"
          >
            {isMasked ? <Lock className="w-3.5 h-3.5 text-blue-400" /> : <Unlock className="w-3.5 h-3.5 text-amber-400" />}
            {isMasked ? 'Masked PII (Safe)' : 'PII Unmasked (Logged)'}
          </button>

          <button
            onClick={() => setShowAuditDrawer(!showAuditDrawer)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition"
          >
            <History className="w-3.5 h-3.5 text-blue-400" />
            Audit Trail ({currentCase.auditTrail.length})
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: Case Insights, Cross-Doc Reconciliation, Fields Side-by-Side */}
        <div className="w-[52%] border-r border-slate-800 flex flex-col h-full bg-slate-950 overflow-y-auto">
          {/* Header Card */}
          <div className="p-5 border-b border-slate-800 bg-slate-900/50">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-white">{currentCase.applicantName}</h1>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                      currentCase.riskLevel === 'High'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : currentCase.riskLevel === 'Medium'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    Risk: {currentCase.riskLevel}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    {currentCase.id}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                  <span>{currentCase.loanProduct}</span>
                  <span>•</span>
                  <span>Lang: <strong className="text-slate-200">{currentCase.primaryLanguage}</strong></span>
                  <span>•</span>
                  <span>Submitted: {currentCase.applicationDate}</span>
                </div>
              </div>

              {/* Status pill */}
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold inline-block border ${
                    currentCase.status === 'Complete'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : currentCase.status === 'Needs review'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {currentCase.status}
                </span>
              </div>
            </div>

            {/* Officer Action Notification if triggered */}
            {officerDecisionMessage && (
              <div className="mt-3 p-2.5 rounded-lg bg-blue-950/60 border border-blue-500/40 text-xs text-blue-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{officerDecisionMessage}</span>
              </div>
            )}
          </div>

          <div className="p-5 space-y-5">
            {/* 1. GAPS & DISCREPANCIES (LISTED FIRST AS PER SPEC PAGE 3 & 5) */}
            <div className="rounded-xl border border-rose-900/40 bg-gradient-to-br from-rose-950/30 via-slate-900/60 to-slate-900 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                    Discrepancies & Fraud Alerts (Listed First)
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {currentCase.summary.gapsAndDiscrepancies.length} item(s) flagged
                </span>
              </div>

              <div className="space-y-2">
                {currentCase.summary.gapsAndDiscrepancies.map((gap, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                      gap.includes('CRITICAL') || gap.includes('SECURITY')
                        ? 'bg-rose-900/30 border-rose-500/50 text-rose-200'
                        : gap.includes('None')
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-800/60 border-slate-700 text-slate-200'
                    }`}
                  >
                    <span className="mt-0.5">
                      {gap.includes('None') ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                    </span>
                    <span className="leading-snug">{gap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. EXECUTIVE CASE SUMMARY */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                English Case File Executive Briefing
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                {currentCase.summary.executiveSummary}
              </p>

              {/* Positive Signals */}
              <div className="mt-3">
                <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Deterministic Validation Results:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {currentCase.summary.positiveSignals.map((sig, i) => (
                    <div key={i} className="p-2 rounded bg-slate-800/50 border border-slate-700/60 flex items-start gap-2 text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{sig}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. VOICE NOTE PLAYER & CONTEXT (NATIVE AUDIO TO ENGLISH REASONING) */}
            {currentCase.voiceNotes.length > 0 && (
              <div className="rounded-xl border border-blue-900/40 bg-gradient-to-br from-blue-950/20 to-slate-900 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-300">
                      Customer Voice Note Analysis (Multimodal Gemini Context)
                    </h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium">
                    {currentCase.voiceNotes[0].originalLanguage} Audio
                  </span>
                </div>

                {currentCase.voiceNotes.map((vn) => (
                  <div key={vn.id} className="space-y-2.5">
                    {/* Audio Player bar */}
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                          ▶
                        </div>
                        <div className="text-[11px] text-slate-300">
                          Audio Note #{vn.id} ({vn.audioDurationSeconds}s)
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="w-1 h-5 bg-emerald-400 rounded-full animate-pulse delay-75"></span>
                        <span className="w-1 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse delay-100"></span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800">
                        <div className="text-[10px] font-semibold text-slate-400">
                          Original Transcript ({vn.originalLanguage}):
                        </div>
                        <div className="text-slate-200 mt-1 italic font-sans">{vn.transcriptOriginal}</div>
                      </div>
                      <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800">
                        <div className="text-[10px] font-semibold text-blue-400">
                          Verified English Translation:
                        </div>
                        <div className="text-white mt-1">{vn.transcriptEn}</div>
                      </div>
                    </div>

                    <div className="p-2 bg-emerald-950/30 border border-emerald-500/30 rounded text-[11px] text-emerald-200 flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-emerald-300">Officer Context:</strong> {vn.officerContext}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. CROSS-DOCUMENT CONSISTENCY MATRIX */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-blue-400" />
                Cross-Document Reconciliation Matrix
              </h3>

              <div className="space-y-2 text-xs">
                {/* Identity */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-slate-200">Identity & Name Consistency</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {currentCase.crossDocumentCheck.identityDetails}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                      currentCase.crossDocumentCheck.identityMatch
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {currentCase.crossDocumentCheck.identityMatch ? 'MATCH ✓' : 'MISMATCH ✗'}
                  </span>
                </div>

                {/* Address */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-slate-200">Residential Address Verification</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {currentCase.crossDocumentCheck.addressDetails}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                      currentCase.crossDocumentCheck.addressMatch
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {currentCase.crossDocumentCheck.addressMatch ? 'VERIFIED ✓' : 'CHECK NEEDED'}
                  </span>
                </div>

                {/* Income */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-slate-200">Income vs Bank Deposit Reconciliation</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {currentCase.crossDocumentCheck.incomeDetails}
                    </div>
                    <div className="mt-1 flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-slate-400">
                        Payslip Net: <strong className="text-emerald-400">₹{currentCase.crossDocumentCheck.salarySlipNetPay.toLocaleString('en-IN')}</strong>
                      </span>
                      <span className="text-slate-400">
                        Bank Credit: <strong className="text-blue-400">₹{currentCase.crossDocumentCheck.bankStatementNetCredit.toLocaleString('en-IN')}</strong>
                      </span>
                      {currentCase.crossDocumentCheck.discrepancyDelta ? (
                        <span className="text-rose-400 font-bold">
                          Delta: +₹{currentCase.crossDocumentCheck.discrepancyDelta.toLocaleString('en-IN')}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                      currentCase.crossDocumentCheck.incomeMatch
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300 animate-pulse'
                    }`}
                  >
                    {currentCase.crossDocumentCheck.incomeMatch ? 'RECONCILED ✓' : 'FAILED ✗'}
                  </span>
                </div>
              </div>
            </div>

            {/* 5. EXTRACTED FIELDS TABLE (SIDE-BY-SIDE ORIGINAL SCRIPT + ENGLISH TRANSLATION) */}
            {activeDoc && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-blue-400" />
                      Extracted Fields Citation Matrix ({activeDoc.title})
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      Click any row to illuminate the exact bounding box on the original document
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {activeDoc.fields.length} Fields Extracted
                  </span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                        <th className="p-2.5">Field Name</th>
                        <th className="p-2.5">Original Script Value ({activeDoc.language})</th>
                        <th className="p-2.5">English Translation</th>
                        <th className="p-2.5 text-right">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-950 font-sans">
                      {activeDoc.fields.map((field) => {
                        const isSelected = activeField?.id === field.id;
                        return (
                          <tr
                            key={field.id}
                            onClick={() => setActiveField(field)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-blue-600/20 border-l-2 border-l-blue-500'
                                : 'hover:bg-slate-900/60'
                            }`}
                          >
                            <td className="p-2.5 font-semibold text-slate-200">
                              {field.label}
                            </td>
                            <td className="p-2.5 font-sans text-slate-300">
                              {isMasked && field.isSensitive ? 'XXXX-XXXX-8921' : field.value_original}
                            </td>
                            <td className="p-2.5 font-medium text-blue-300">
                              {isMasked && field.isSensitive ? 'XXXX-XXXX-8921' : field.value_en}
                            </td>
                            <td className="p-2.5 text-right font-mono text-[11px] text-emerald-400">
                              {Math.round(field.confidence * 100)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. OFFICER DECISION CONTROLS */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Loan Officer Credit Decision
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  onClick={() => handleDecision('Approved')}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Application
                </button>
                <button
                  onClick={() => onRequestInfoModal(selectedDocType)}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
                >
                  <Send className="w-4 h-4" />
                  Request Clarification
                </button>
                <button
                  onClick={() => handleDecision('Quarantined')}
                  className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Refer to SIU (Fraud)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Document Inspector with Source Bounding Boxes */}
        <div className="w-[48%] flex flex-col h-full bg-slate-950 p-4">
          {/* Document Type Switcher Tabs */}
          <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
            {docList.map(({ type, doc }) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedDocType(type);
                  setActiveField(null);
                  setActiveFlag(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 border ${
                  selectedDocType === type
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                {doc.title.split('(')[0]}
                {doc.flags.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                )}
              </button>
            ))}
          </div>

          {/* Active Field Citation Banner */}
          {activeField && (
            <div className="mb-3 p-3 rounded-xl bg-blue-950/70 border border-blue-500/40 text-xs flex items-center justify-between">
              <div>
                <div className="text-[10px] text-blue-300 font-semibold uppercase">
                  Active Source Citation Box:
                </div>
                <div className="font-bold text-white mt-0.5">
                  {activeField.label}:{' '}
                  <span className="text-emerald-400">
                    {isMasked && activeField.isSensitive ? 'XXXX' : activeField.value_original}
                  </span>
                  <span className="text-slate-400 font-normal ml-2">
                    → English: {isMasked && activeField.isSensitive ? 'XXXX' : activeField.value_en}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveField(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Document Renderer */}
          <div className="flex-1 overflow-hidden">
            {activeDoc ? (
              <DocumentRenderer
                document={activeDoc}
                activeFieldId={activeField?.id}
                onSelectField={(field) => setActiveField(field)}
                highlightFlag={activeFlag}
                isMasked={isMasked}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                No document selected.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide-over Audit Trail Drawer */}
      {showAuditDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-bold text-white">Immutable Case Audit Trail</h2>
              </div>
              <button
                onClick={() => setShowAuditDrawer(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-400 my-3">
              Every agent execution, OCR bounding box calculation, model latency, and loan officer action is logged in an
              append-only audit collection per RBI digital lending & DPDP Act compliance.
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {currentCase.auditTrail.map((ev) => (
                <div
                  key={ev.id}
                  className={`p-3 rounded-xl border text-xs ${
                    ev.severity === 'alert'
                      ? 'bg-rose-950/30 border-rose-500/40'
                      : ev.severity === 'warning'
                      ? 'bg-amber-950/30 border-amber-500/40'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start text-[11px] mb-1">
                    <span className="font-semibold text-slate-200">{ev.actor}</span>
                    <span className="font-mono text-[10px] text-slate-500">{ev.timestamp}</span>
                  </div>
                  <div className="font-medium text-white">{ev.action}</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{ev.details}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
