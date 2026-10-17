import React from 'react';
import { X, Sparkles, CheckCircle2, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ApplicationTypePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon: LucideIcon;
  title: string;
  tagline: string;
  checklist: string[];
}

export const ApplicationTypePreviewModal: React.FC<ApplicationTypePreviewModalProps> = ({
  isOpen,
  onClose,
  icon: Icon,
  title,
  tagline,
  checklist,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{title}</h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-full px-2 py-0.5 mt-1">
                <Rocket className="w-2.5 h-2.5" />
                Preview — Rolling Out Next
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">{tagline}</p>

          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Standard Document Checklist
            </div>
            <div className="space-y-1.5">
              {checklist.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-[11px] text-blue-200 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
            <span>
              Powered by the same multilingual, multi-agent Gemini intake pipeline as Personal Loan —
              document quality checks, cross-document reconciliation, and fraud screening carry over automatically
              to every product DocuBridge supports.
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
