export type DocType =
  | 'aadhaar_card'
  | 'pan_card'
  | 'salary_slip'
  | 'bank_statement'
  | 'form_16'
  | 'proof_of_address'
  | 'unknown';

export type Language =
  | 'Hindi'
  | 'Tamil'
  | 'Bengali'
  | 'Bahasa Indonesia'
  | 'Vietnamese'
  | 'English'
  | 'Gujarati'
  | 'Telugu'
  | 'Japanese'
  | 'Korean'
  | 'Chinese (Simplified)'
  | 'Thai';

export type DocQuality = 'ok' | 'retake' | 'wrong_doc';

export interface BoundingBox {
  ymin: number; // 0 to 1000 or percentage
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface DocField {
  id: string;
  name: string;
  label: string;
  value_original: string;
  value_en: string;
  page: number;
  bbox: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in percentages 0-100
  confidence: number;
  category?: 'identity' | 'income' | 'address' | 'banking' | 'tax';
  isSensitive?: boolean;
}

export interface FraudFlag {
  id: string;
  rule: string;
  severity: 'Low' | 'Medium' | 'High';
  evidence: string;
  page?: number;
  bbox?: [number, number, number, number];
  type: 'deterministic' | 'model_judgement' | 'prompt_injection';
  category:
    | 'checksum'
    | 'arithmetic'
    | 'reconciliation'
    | 'metadata'
    | 'consistency'
    | 'visual_tampering'
    | 'prompt_injection'
    | 'voice_contradiction';
}

export interface VoiceNote {
  id: string;
  originalLanguage: Language;
  audioDurationSeconds: number;
  audioUrl?: string;
  transcriptOriginal: string;
  transcriptEn: string;
  summaryEn: string;
  officerContext: string;
  contradictsDocument?: boolean;
  contradictionDetails?: string;
}

export interface DocMetadata {
  producerSoftware?: string;
  createdDate?: string;
  modifiedDate?: string;
  isEditorResaved?: boolean;
  perceptualHash?: string;
  fileSizeKb: number;
  mimeType: string;
}

export interface DocRecord {
  id: string;
  docType: DocType;
  title: string;
  fileName: string;
  fileUrl: string;
  uploadTime: string;
  quality: DocQuality;
  qualityReason?: string;
  language: Language;
  fields: DocField[];
  flags: FraudFlag[];
  customerMessage?: string;
  voiceNoteId?: string;
  metadataCheck?: DocMetadata;
  rawText?: string;
  statusText?: string;
}

export interface CrossDocumentValidation {
  identityMatch: boolean;
  identityDetails: string;
  addressMatch: boolean;
  addressDetails: string;
  incomeMatch: boolean;
  incomeDetails: string;
  salarySlipNetPay: number;
  bankStatementNetCredit: number;
  discrepancyDelta?: number;
  addressVoiceNoteResolved?: boolean;
}

export interface CaseSummary {
  executiveSummary: string;
  gapsAndDiscrepancies: string[];
  positiveSignals: string[];
  voiceNoteKeyTakeaways: string[];
  recommendation: 'Recommend Approval' | 'Requires Clarification' | 'Flagged for Special Investigation';
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: 'agent' | 'officer' | 'customer' | 'system';
  action: string;
  agentName?: string;
  details: string;
  severity?: 'info' | 'warning' | 'alert';
  customerVisible?: boolean;
}

export interface ApplicantCase {
  id: string;
  applicantName: string;
  applicationDate: string;
  phone: string;
  email: string;
  loanProduct: string;
  requestedAmount: number;
  tenureMonths: number;
  primaryLanguage: Language;
  status: 'Complete' | 'Waiting on customer' | 'Needs review';
  riskLevel: 'Low' | 'Medium' | 'High';
  documents: Record<DocType, DocRecord | null>;
  voiceNotes: VoiceNote[];
  crossDocumentCheck: CrossDocumentValidation;
  summary: CaseSummary;
  auditTrail: AuditEvent[];
  isMasked: boolean;
}

export interface PipelineExecutionResult {
  documentId: string;
  docType: DocType;
  language: Language;
  quality: DocQuality;
  qualityReason?: string;
  fields: DocField[];
  flags: FraudFlag[];
  customerMessage: string;
  summaryEn: string;
  agentLogs: { agent: string; latencyMs: number; status: string }[];
}
