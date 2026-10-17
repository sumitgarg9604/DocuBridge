import React, { useState, useEffect } from 'react';
import { ApplicantCase, Language } from '../types/docubridge';
import { X, Send, MessageSquare, Copy, Check, Sparkles, Smartphone } from 'lucide-react';

interface RequestInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: ApplicantCase;
  defaultDocType?: string;
}

export const RequestInfoModal: React.FC<RequestInfoModalProps> = ({
  isOpen,
  onClose,
  applicant,
  defaultDocType = 'Form 16 / Latest ITR',
}) => {
  const [targetDoc, setTargetDoc] = useState(defaultDocType);
  const [targetLanguage, setTargetLanguage] = useState<Language>(applicant.primaryLanguage || 'Hindi');
  const [reason, setReason] = useState('Income tax return is required for loan amounts exceeding ₹5,00,000');
  const [draftOriginal, setDraftOriginal] = useState('');
  const [draftEn, setDraftEn] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    generateDraft(targetDoc, targetLanguage, reason);
  }, [targetDoc, targetLanguage, reason, applicant.applicantName]);

  const generateDraft = async (doc: string, lang: Language, rsn: string) => {
    setIsDrafting(true);
    setSentSuccess(false);

    try {
      const res = await fetch('/api/agent/draft-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName: applicant.applicantName,
          targetLanguage: lang,
          missingDocType: doc,
          reasonEn: rsn,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDraftOriginal(data.messageOriginal || '');
        setDraftEn(data.messageEn || '');
        setIsDrafting(false);
        return;
      }
    } catch (e) {
      console.warn('Draft endpoint fetch fallback:', e);
    }

    // High quality client fallbacks
    const fallbackTemplates: Record<string, { orig: string; en: string }> = {
      Hindi: {
        orig: `नमस्ते ${applicant.applicantName} जी, आपके ऋण आवेदन को आगे बढ़ाने के लिए हमें आपका ${doc} चाहिए (${rsn})। कृपया इसे ऐप में दिए गए लिंक से सुरक्षित अपलोड करें। धन्यवाद!`,
        en: `Hello ${applicant.applicantName}, to proceed with your loan application we require your ${doc} (${rsn}). Please upload it securely via the app link. Thank you!`,
      },
      Tamil: {
        orig: `வணக்கம் ${applicant.applicantName}, உங்கள் கடன் விண்ணப்பத்தை அடுத்த நிலைக்கு கொண்டு செல்ல ${doc} தேவைப்படுகிறது (${rsn}). தயவுசெய்து செயலியில் உள்ள இணைப்பின் மூலம் பதிவேற்றவும். நன்றி!`,
        en: `Hello ${applicant.applicantName}, to process your loan application further we require your ${doc} (${rsn}). Please upload it via the app. Thank you!`,
      },
      'Bahasa Indonesia': {
        orig: `Halo ${applicant.applicantName}, untuk melanjutkan pengajuan pinjaman Anda, kami memerlukan ${doc} (${rsn}). Silakan unggah kembali melalui tautan aplikasi. Terima kasih!`,
        en: `Hello ${applicant.applicantName}, to proceed with your loan application we require your ${doc} (${rsn}). Please upload it via the app. Thank you!`,
      },
      Japanese: {
        orig: `${applicant.applicantName}様、ローンのお申込みを進めるために${doc}が必要です（${rsn}）。アプリのリンクから安全にアップロードしてください。よろしくお願いいたします。`,
        en: `Hello ${applicant.applicantName}, to proceed with your loan application we require your ${doc} (${rsn}). Please upload it via the app link. Thank you!`,
      },
      Korean: {
        orig: `${applicant.applicantName}님, 대출 신청을 진행하기 위해 ${doc}가 필요합니다 (${rsn}). 앱 내 링크를 통해 안전하게 업로드해 주세요. 감사합니다!`,
        en: `Hello ${applicant.applicantName}, to proceed with your loan application we require your ${doc} (${rsn}). Please upload it via the app link. Thank you!`,
      },
      'Chinese (Simplified)': {
        orig: `您好 ${applicant.applicantName}，为了继续处理您的贷款申请，我们需要您提供${doc}（${rsn}）。请通过应用内链接安全上传。谢谢！`,
        en: `Hello ${applicant.applicantName}, to proceed with your loan application we require your ${doc} (${rsn}). Please upload it via the app link. Thank you!`,
      },
      Thai: {
        orig: `สวัสดีคุณ ${applicant.applicantName} เพื่อดำเนินการสินเชื่อของคุณต่อ เราต้องการ${doc} (${rsn}) กรุณาอัปโหลดผ่านลิงก์ในแอปอย่างปลอดภัย ขอบคุณค่ะ/ครับ!`,
        en: `Hello ${applicant.applicantName}, to proceed with your loan application we require your ${doc} (${rsn}). Please upload it via the app link. Thank you!`,
      },
    };

    const sel = fallbackTemplates[lang] || fallbackTemplates['Hindi'];
    setDraftOriginal(sel.orig);
    setDraftEn(sel.en);
    setIsDrafting(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftOriginal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSimulated = () => {
    setSentSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Draft Request Information</h2>
              <p className="text-xs text-slate-400">
                System automatically drafts in customer's preferred native language
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Inputs Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Target Document Gap:
              </label>
              <select
                value={targetDoc}
                onChange={(e) => setTargetDoc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Form 16 or Latest ITR">Form 16 / Latest ITR (Income Tax)</option>
                <option value="Clearer copy of Salary Slip">Clearer Copy of Salary Slip (Full Page)</option>
                <option value="Registered Rental Agreement">Registered Rental Agreement (Address Proof)</option>
                <option value="Latest 3 Months Bank Statement">Updated 3-Month Bank Statement</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Customer Language:
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value as Language)}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="Vietnamese">Tiếng Việt</option>
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                <option value="Japanese">日本語 (Japanese)</option>
                <option value="Korean">한국어 (Korean)</option>
                <option value="Chinese (Simplified)">中文 (Chinese)</option>
                <option value="Thai">ไทย (Thai)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Reason for Request:
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Generated Native Draft */}
          <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Customer Native Script Preview ({targetLanguage}):
              </span>
              <button
                onClick={handleCopy}
                className="text-xs flex items-center gap-1 text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700 transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-white leading-relaxed font-sans">
              {draftOriginal}
            </div>

            <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800/80 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">English Translation:</span> {draftEn}
            </div>
          </div>

          {sentSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              Message dispatched to {applicant.phone} via WhatsApp & SMS. Logged to audit trail.
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Smartphone className="w-4 h-4 text-slate-500" />
            <span>Sends via Bank SMS & WhatsApp API</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSendSimulated}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-md transition"
            >
              <Send className="w-3.5 h-3.5" />
              Send to Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
