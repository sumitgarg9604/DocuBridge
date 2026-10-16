import React from 'react';
import { ApplicantCase } from '../types/docubridge';
import {
  ShieldCheck,
  Smartphone,
  LayoutDashboard,
  Sparkles,
  Layers,
  Lock,
  Globe2,
  FileUp,
} from 'lucide-react';

interface HeaderProps {
  viewMode: 'customer' | 'staff';
  setViewMode: (mode: 'customer' | 'staff') => void;
  cases: ApplicantCase[];
  currentCase: ApplicantCase;
  onSelectCase: (c: ApplicantCase) => void;
  onOpenDemoGuide: () => void;
  onOpenUploadModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  cases,
  currentCase,
  onSelectCase,
  onOpenDemoGuide,
  onOpenUploadModal,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 select-none shadow-md">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/30 ring-1 ring-blue-400/40">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white">
              DocuBridge
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
              7-Agent Graph
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Multilingual Loan Intake · BFSI Source Citation & Fraud Engine
          </div>
        </div>
      </div>

      {/* Main View Switcher: Customer Portal vs Staff Console */}
      <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
        <button
          onClick={() => setViewMode('customer')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition ${
            viewMode === 'customer'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          Customer Portal (Phone Web)
        </button>
        <button
          onClick={() => setViewMode('staff')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition ${
            viewMode === 'staff'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Staff Console (Bank Officer)
        </button>
      </div>

      {/* Preset Applicant Selector & Tools */}
      <div className="flex items-center gap-2.5">
        {/* Preset Selector */}
        <div className="hidden lg:flex items-center bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400 mr-2 text-[11px] font-medium">Applicant:</span>
          <select
            value={currentCase.id}
            onChange={(e) => {
              const found = cases.find((c) => c.id === e.target.value);
              if (found) onSelectCase(found);
            }}
            aria-label="Select applicant case preset"
            className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                {c.applicantName} ({c.primaryLanguage} · Risk: {c.riskLevel})
              </option>
            ))}
          </select>
        </div>

        {/* Live Upload Custom Synthetic File */}
        <button
          onClick={onOpenUploadModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition shadow-sm"
          title="Upload synthetic test file to run full 7-agent pipeline"
        >
          <FileUp className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Upload Test Doc</span>
        </button>

        {/* 3-Minute Demo Pitch Guide Button */}
        <button
          onClick={onOpenDemoGuide}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition shadow"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Demo Pitch Guide</span>
        </button>
      </div>
    </header>
  );
};
