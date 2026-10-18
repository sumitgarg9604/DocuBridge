import React from 'react';
import { ApplicantCase } from '../types/docubridge';
import { UserSession } from '../types/auth';
import {
  Layers,
  Smartphone,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  User,
  Building2,
  FileUp,
  RefreshCw,
  ChevronDown,
  UserPlus,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  session: UserSession;
  onSignOut: () => void;
  cases: ApplicantCase[];
  currentCase: ApplicantCase;
  onSelectCase: (c: ApplicantCase) => void;
  onOpenUploadModal: () => void;
  onToggleRole: () => void;
  onOpenCreateCustomer?: () => void;
  onOpenAbout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  onSignOut,
  cases,
  currentCase,
  onSelectCase,
  onOpenUploadModal,
  onToggleRole,
  onOpenCreateCustomer,
  onOpenAbout,
}) => {
  const isCustomer = session.role === 'customer';

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 select-none shadow-md">
      {/* Brand & Portal Type */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/30 ring-1 ring-blue-400/40">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white">
              DocuBridge
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                isCustomer
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
              }`}
            >
              {isCustomer ? 'Applicant Portal' : 'Underwriter Console'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Multilingual Loan Intake & Verification Engine
          </div>
        </div>
      </div>

      {/* Staff Controls (Case Queue Picker & Pipeline Upload) */}
      {!isCustomer && (
        <div className="flex items-center gap-2.5">
          {/* Active Underwriting File Selector */}
          <div className="flex items-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 mr-2 text-[11px] font-semibold">Active Case:</span>
            <select
              value={currentCase.id}
              onChange={(e) => {
                const found = cases.find((c) => c.id === e.target.value);
                if (found) onSelectCase(found);
              }}
              aria-label="Select applicant case"
              className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.applicantName} ({c.primaryLanguage} · Risk: {c.riskLevel})
                </option>
              ))}
            </select>
          </div>

          {/* Create New Customer Button */}
          {onOpenCreateCustomer && (
            <button
              onClick={onOpenCreateCustomer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition cursor-pointer"
              title="Generate or create new customer application"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">+ New Customer</span>
            </button>
          )}

          {/* Upload Custom File to Intake Pipeline */}
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
            title="Upload document to 7-agent intake pipeline"
          >
            <FileUp className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Ingest Document</span>
          </button>
        </div>
      )}

      {/* User Session Profile & Actions */}
      <div className="flex items-center gap-3">
        {/* Role Quick Toggle (for easy dual-portal testing) */}
        <button
          onClick={onToggleRole}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition cursor-pointer"
          title={`Switch view to ${isCustomer ? 'Bank Staff Console' : 'Applicant Portal'}`}
        >
          {isCustomer ? (
            <>
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Switch to Staff Console</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Switch to Customer View</span>
            </>
          )}
        </button>

        {/* User Card */}
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-[11px] ${
              isCustomer ? 'bg-emerald-600' : 'bg-blue-600'
            }`}
          >
            {session.name.charAt(0)}
          </div>
          <div className="text-left hidden sm:block">
            <div className="font-bold text-white text-xs leading-none">{session.name}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 leading-none">{session.roleTitle}</div>
          </div>
        </div>

        {/* About / Built With Gemini */}
        {onOpenAbout && (
          <button
            onClick={onOpenAbout}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 border border-slate-700 transition cursor-pointer"
            title="About — Built With Gemini"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        )}

        {/* Sign Out */}
        <button
          onClick={onSignOut}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
