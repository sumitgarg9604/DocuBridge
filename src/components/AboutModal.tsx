import React from 'react';
import { X, Sparkles, Zap, Mic, Volume2, ShieldCheck, ShieldAlert, Globe2 } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CAPABILITIES = [
  {
    icon: Zap,
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    title: '7-agent Gemini pipeline',
    body: 'Every document is screened for prompt-injection, quality-checked, classified, extracted, translated, and fraud-checked by a chain of Gemini-driven agents — with a live, per-document execution trace visible to the loan officer.',
  },
  {
    icon: Mic,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    title: 'Native audio understanding',
    body: "Voice notes are sent directly to Gemini as audio — no separate Speech-to-Text API. Gemini transcribes, translates, and summarizes in one call.",
  },
  {
    icon: Volume2,
    color: 'text-violet-400',
    bg: 'bg-violet-500/15',
    title: 'Native Text-to-Speech',
    body: "Every customer-facing message — rejections, retake requests, approvals — can be read aloud in the applicant's own language via Gemini's native TTS model.",
  },
  {
    icon: ShieldCheck,
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    title: 'Deterministic fraud checks',
    body: 'Verhoeff checksum validation on ID numbers, payslip arithmetic reconciliation, and bank-statement cross-matching run alongside the AI pipeline — fraud detection that is mathematically verifiable, not just model judgement.',
  },
  {
    icon: ShieldAlert,
    color: 'text-rose-400',
    bg: 'bg-rose-500/15',
    title: 'Prompt-injection defense',
    body: 'A Model Armor screener quarantines adversarial instructions embedded in uploaded documents before they ever reach the extraction agent.',
  },
  {
    icon: Globe2,
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    title: '12 languages, JAPAC-first',
    body: 'Hindi, Tamil, Bengali, Gujarati, Telugu, Bahasa Indonesia, Vietnamese, Japanese, Korean, Chinese, Thai, English — native script in, English out, for both documents and voice.',
  },
];

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Built With Gemini</h2>
              <p className="text-xs text-slate-400">Google Cloud AI Builder Cup 2026 · JAPAC</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <p className="text-xs text-slate-300 leading-relaxed">
            DocuBridge is a bank-agnostic, multilingual document intake platform — every capability below runs on
            live Gemini calls in this build, not mockups.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <div key={cap.title} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cap.bg}`}>
                      <Icon className={`w-3.5 h-3.5 ${cap.color}`} />
                    </div>
                    <span className="text-xs font-bold text-white">{cap.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{cap.body}</p>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-[11px] text-blue-200">
            Built in Google AI Studio, deployed on Google Cloud Run. Personal Loan intake runs fully live today;
            Home Loan and Insurance Claim intake are previewed on the same pipeline.
          </div>
        </div>
      </div>
    </div>
  );
};
