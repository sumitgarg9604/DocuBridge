import React, { useState } from 'react';
import { ApplicantCase, Language } from '../types/docubridge';
import { generateCustomerCase, NewCustomerInput } from '../utils/customerGenerator';
import {
  X,
  UserPlus,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Building2,
  DollarSign,
  AlertTriangle,
  FileText,
  Dices,
} from 'lucide-react';

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated: (newCase: ApplicantCase, autoLoginAsApplicant?: boolean) => void;
  isTriggeredFromLogin?: boolean;
}

export const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({
  isOpen,
  onClose,
  onCustomerCreated,
  isTriggeredFromLogin = false,
}) => {
  const [name, setName] = useState('Ananya Deshmukh');
  const [phone, setPhone] = useState('+91 98201 44821');
  const [email, setEmail] = useState('ananya.deshmukh@example.com');
  const [loanProduct, setLoanProduct] = useState('Retail Personal Loan — ₹6,00,000');
  const [requestedAmount, setRequestedAmount] = useState(600000);
  const [tenureMonths, setTenureMonths] = useState(36);
  const [primaryLanguage, setPrimaryLanguage] = useState<Language>('Hindi');
  const [monthlySalary, setMonthlySalary] = useState(75000);
  const [employerName, setEmployerName] = useState('Infosys Technologies Ltd');
  const [city, setCity] = useState('Pune');
  const [initialTemplate, setInitialTemplate] = useState<'empty' | 'verified' | 'discrepancy' | 'landlord_rent'>('empty');
  const [autoLogin, setAutoLogin] = useState(isTriggeredFromLogin);

  if (!isOpen) return null;

  // Preset random personas
  const RANDOM_PERSONAS: NewCustomerInput[] = [
    {
      name: 'Rohan Kulkarni',
      phone: '+91 98450 11928',
      email: 'rohan.kulkarni@example.com',
      loanProduct: 'Retail Personal Loan — ₹5,00,000',
      requestedAmount: 500000,
      tenureMonths: 36,
      primaryLanguage: 'Hindi',
      monthlySalary: 65000,
      employerName: 'Tata Consultancy Services',
      city: 'Mumbai',
      initialTemplate: 'empty',
    },
    {
      name: 'Meenakshi Sundaram',
      phone: '+91 94440 82910',
      email: 'meenakshi.s@example.com',
      loanProduct: 'Consumer Credit Loan — ₹4,00,000',
      requestedAmount: 400000,
      tenureMonths: 24,
      primaryLanguage: 'Tamil',
      monthlySalary: 58000,
      employerName: 'Cognizant Technology Solutions',
      city: 'Chennai',
      initialTemplate: 'landlord_rent',
    },
    {
      name: 'Budi Santoso',
      phone: '+62 811 9281 0491',
      email: 'budi.santoso@example.id',
      loanProduct: 'Personal Micro-Loan — Rp 40.000.000',
      requestedAmount: 40000000,
      tenureMonths: 18,
      primaryLanguage: 'Bahasa Indonesia',
      monthlySalary: 14000000,
      employerName: 'PT GoTo Gojek Tokopedia',
      city: 'Jakarta',
      initialTemplate: 'verified',
    },
    {
      name: 'Nguyen Van An',
      phone: '+84 90 382 9182',
      email: 'nguyen.an@example.vn',
      loanProduct: 'Personal Consumption Loan — 120.000.000 đ',
      requestedAmount: 120000000,
      tenureMonths: 36,
      primaryLanguage: 'Vietnamese',
      monthlySalary: 28000000,
      employerName: 'FPT Software Corporation',
      city: 'Ho Chi Minh City',
      initialTemplate: 'verified',
    },
  ];

  const handleApplyRandom = () => {
    const randomChoice = RANDOM_PERSONAS[Math.floor(Math.random() * RANDOM_PERSONAS.length)];
    setName(randomChoice.name);
    setPhone(randomChoice.phone);
    setEmail(randomChoice.email);
    setLoanProduct(randomChoice.loanProduct);
    setRequestedAmount(randomChoice.requestedAmount);
    setTenureMonths(randomChoice.tenureMonths);
    setPrimaryLanguage(randomChoice.primaryLanguage);
    setMonthlySalary(randomChoice.monthlySalary);
    setEmployerName(randomChoice.employerName);
    setCity(randomChoice.city);
    setInitialTemplate(randomChoice.initialTemplate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase = generateCustomerCase({
      name,
      phone,
      email,
      loanProduct,
      requestedAmount,
      tenureMonths,
      primaryLanguage,
      monthlySalary,
      employerName,
      city,
      initialTemplate,
    });

    onCustomerCreated(newCase, autoLogin || isTriggeredFromLogin);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Generate New Customer Application</h2>
              <p className="text-xs text-slate-400">
                Create a loan applicant file for the multilingual intake engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApplyRandom}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              title="Fill in a random realistic applicant"
            >
              <Dices className="w-3.5 h-3.5 text-blue-400" />
              <span>Random Profile</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Identity Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Applicant Full Name:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ananya Deshmukh"
                className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Primary Language:
              </label>
              <select
                value={primaryLanguage}
                onChange={(e) => setPrimaryLanguage(e.target.value as Language)}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="Vietnamese">Tiếng Việt</option>
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Phone Number:
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98450 12345"
                className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Email Address:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Loan & Income Details */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block">
              Loan Request & Employment
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Loan Product:
                </label>
                <input
                  type="text"
                  value={loanProduct}
                  onChange={(e) => setLoanProduct(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Requested Amount (Numeric):
                </label>
                <input
                  type="number"
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Monthly Net Salary:
                </label>
                <input
                  type="number"
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Employer & City:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                    placeholder="Employer"
                    className="w-2/3 bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-1/3 bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Initial Document Intake State */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Initial Document Intake Mode:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInitialTemplate('empty')}
                className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                  initialTemplate === 'empty'
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-white mb-0.5">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  Fresh Blank Application
                </div>
                <div className="text-[10px] text-slate-400 leading-snug">
                  Customer begins with 0/5 uploads and submits live from their camera/files.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setInitialTemplate('verified')}
                className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                  initialTemplate === 'verified'
                    ? 'bg-emerald-600/20 border-emerald-500 text-white shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-white mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Auto-Verified KYC Profile
                </div>
                <div className="text-[10px] text-slate-400 leading-snug">
                  Pre-populates verified Aadhaar, PAN, payslip, and bank statement.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setInitialTemplate('discrepancy')}
                className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                  initialTemplate === 'discrepancy'
                    ? 'bg-rose-600/20 border-rose-500 text-white shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-white mb-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  Income Arithmetic Mismatch
                </div>
                <div className="text-[10px] text-slate-400 leading-snug">
                  Simulates altered Net Pay on payslip vs bank deposit.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setInitialTemplate('landlord_rent')}
                className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                  initialTemplate === 'landlord_rent'
                    ? 'bg-amber-600/20 border-amber-500 text-white shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-white mb-0.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  Landlord Bill & Voice Note
                </div>
                <div className="text-[10px] text-slate-400 leading-snug">
                  Address bill in landlord name, accompanied by native voice note.
                </div>
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
              />
              <span>Log in as this applicant immediately</span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                Create Application
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
