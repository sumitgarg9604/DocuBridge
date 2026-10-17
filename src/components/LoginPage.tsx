import React, { useState } from 'react';
import { UserRole, UserSession } from '../types/auth';
import { ApplicantCase } from '../types/docubridge';
import {
  Layers,
  Smartphone,
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  Sparkles,
  User,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  UserPlus,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (session: UserSession, targetApplicantId?: string) => void;
  cases: ApplicantCase[];
  onOpenCreateCustomer: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, cases, onOpenCreateCustomer }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedApplicantId, setSelectedApplicantId] = useState<string>(cases[0]?.id || 'APP-2026-IN-8491');
  const [showGoogleNotice, setShowGoogleNotice] = useState(false);

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'customer') {
      const applicant = cases.find((c) => c.id === selectedApplicantId) || cases[0];
      onLogin(
        {
          role: 'customer',
          name: applicant.applicantName,
          email: email || applicant.email,
          roleTitle: 'Loan Applicant',
          applicantId: applicant.id,
        },
        applicant.id
      );
    } else {
      onLogin({
        role: 'staff',
        name: 'Amit Kumar',
        email: email || 'amit.kumar@bankops.internal',
        roleTitle: 'Senior Credit Underwriter',
        employeeId: 'EMP-BFSI-4821',
        department: 'Retail Lending & Risk Management',
      });
    }
  };

  const handleGoogleClick = () => {
    setShowGoogleNotice(true);
  };

  const handleBypassCustomer = (applicantId?: string) => {
    const targetId = applicantId || selectedApplicantId;
    const applicant = cases.find((c) => c.id === targetId) || cases[0];
    onLogin(
      {
        role: 'customer',
        name: applicant.applicantName,
        email: applicant.email,
        roleTitle: 'Loan Applicant',
        applicantId: applicant.id,
      },
      applicant.id
    );
  };

  const handleBypassStaff = () => {
    onLogin({
      role: 'staff',
      name: 'Amit Kumar',
      email: 'amit.kumar@bankops.internal',
      roleTitle: 'Senior Credit Underwriter',
      employeeId: 'EMP-BFSI-4821',
      department: 'Retail Lending & Risk Operations',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center font-bold text-white shadow-xl shadow-blue-900/30 ring-1 ring-blue-400/40 mx-auto mb-3">
          <Layers className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">DocuBridge</h1>
        <p className="text-xs text-slate-400 mt-1">
          Enterprise Multilingual Loan Intake & Underwriting System
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md z-10 space-y-6">
        {/* Role Selector Tabs */}
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-2">
            Select Portal Access:
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedRole('customer')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                selectedRole === 'customer'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Customer Portal
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('staff')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                selectedRole === 'staff'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Bank Staff Console
            </button>
          </div>
        </div>

        {/* Role Description Banner */}
        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300">
          {selectedRole === 'customer' ? (
            <div className="flex items-start gap-2.5">
              <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Applicant Access:</span> Upload loan documents
                in any language (Hindi, Tamil, Bahasa, Vietnamese), record voice notes, and track real-time intake status.
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Loan Officer & Underwriter Access:</span> View intake queue,
                source citation bounding boxes, Verhoeff checksums, arithmetic reconciliation, and fraud flags.
              </div>
            </div>
          )}
        </div>

        {/* Standard Form */}
        <form onSubmit={handleStandardSubmit} className="space-y-4">
          {selectedRole === 'customer' && (
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Select Applicant Account:
              </label>
              <select
                value={selectedApplicantId}
                onChange={(e) => setSelectedApplicantId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.applicantName} ({c.loanProduct.split('—')[0]} · {c.primaryLanguage})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              {selectedRole === 'customer' ? 'Applicant Email or Mobile' : 'Bank Corporate Email / SSO ID'}
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                selectedRole === 'customer' ? 'e.g. priya.sharma@example.com' : 'e.g. amit.kumar@bankops.internal'
              }
              className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              {selectedRole === 'customer' ? 'OTP or Password' : 'Staff Password / Security Key'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sign In to {selectedRole === 'customer' ? 'Applicant Portal' : 'Staff Console'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onOpenCreateCustomer}
            className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-emerald-300 font-semibold text-xs shadow transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>+ Start New Loan Application (Generate Customer)</span>
          </button>
        </form>

        {/* Google OAuth Button */}
        <div className="pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleGoogleClick}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-2.5 shadow cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.15C3.25 21.31 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.39l4-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.25 2.69 1.27 6.61l4 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {showGoogleNotice && (
            <div className="mt-2.5 p-2.5 bg-blue-950/40 border border-blue-500/40 rounded-xl text-[11px] text-blue-200 flex items-start gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                Google Auth integration requires client ID and secret in environment. Please use the{' '}
                <strong className="text-white">Bypass buttons below</strong> to access the portals directly.
              </div>
            </div>
          )}
        </div>

        {/* Development Bypass Section */}
        <div className="pt-3 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              Developer Bypass (Quick Login)
            </span>
            <span className="text-[10px] text-slate-500">No secret required</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleBypassCustomer('APP-2026-IN-8491')}
              className="p-2.5 rounded-xl bg-emerald-950/30 hover:bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold transition text-left cursor-pointer"
            >
              <div className="text-[10px] text-emerald-400 uppercase font-bold">Applicant</div>
              <div className="text-white font-bold mt-0.5">Priya Sharma</div>
              <div className="text-[10px] text-slate-400">Retail Personal Loan</div>
            </button>

            <button
              type="button"
              onClick={handleBypassStaff}
              className="p-2.5 rounded-xl bg-blue-950/30 hover:bg-blue-950/60 border border-blue-500/40 text-blue-200 text-xs font-semibold transition text-left cursor-pointer"
            >
              <div className="text-[10px] text-blue-400 uppercase font-bold">Loan Officer</div>
              <div className="text-white font-bold mt-0.5">Amit Kumar</div>
              <div className="text-[10px] text-slate-400">Full Underwriting Queue</div>
            </button>
          </div>

          {/* Quick links to test other applicant files as customer */}
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>Other Applicant Portals:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleBypassCustomer('APP-2026-IN-7319')}
                className="hover:text-blue-300 underline cursor-pointer"
              >
                Vikram (Forged)
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => handleBypassCustomer('APP-2026-SEA-4022')}
                className="hover:text-blue-300 underline cursor-pointer"
              >
                Siti (Indonesia)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Compliance notes */}
      <div className="mt-8 text-center text-xs text-slate-500 space-y-1 z-10">
        <div>Protected under Digital Personal Data Protection Act 2023 & RBI KYC Directions</div>
        <div>Customer-Managed Encryption Keys (CMEK AES-256) · Immutable Audit Trail</div>
      </div>
    </div>
  );
};
