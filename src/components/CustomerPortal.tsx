import React, { useState, useRef } from 'react';
import { ApplicantCase, DocType, Language, DocRecord, DocField, FraudFlag } from '../types/docubridge';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mic,
  Volume2,
  FileText,
  RotateCw,
  Camera,
  Check,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Info,
  X,
  Loader2,
  FileUp,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';

interface CustomerPortalProps {
  currentCase: ApplicantCase;
  onUpdateCase: (updatedCase: ApplicantCase) => void;
  onSwitchToStaffConsole?: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  currentCase,
  onUpdateCase,
  onSwitchToStaffConsole,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(currentCase.primaryLanguage || 'Hindi');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [voiceRecorded, setVoiceRecorded] = useState(currentCase.voiceNotes.length > 0);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [activeTab, setActiveTab] = useState<'checklist' | 'voice' | 'confirm'>('checklist');
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [fieldConfirmed, setFieldConfirmed] = useState(false);

  // Upload dialog state for individual document checklist items
  const [activeUploadSlot, setActiveUploadSlot] = useState<DocType | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Localized UI strings
  const UI_TEXT: Record<Language, any> = {
    Hindi: {
      loanTitle: 'व्यक्तिगत ऋण आवेदन',
      loanSub: 'ऋण राशि: ₹5,00,000 · अवधि: 36 माह',
      statusWaiting: 'कुछ दस्तावेज समीक्षाधीन हैं',
      checklistTitle: 'आवश्यक दस्तावेज चेकलिस्ट',
      checklistSub: 'अपने फोन से फोटो लें या फाइल अपलोड करें',
      voiceTitle: 'आवाज से समझाएं (Voice Note)',
      voiceSub: 'दस्तावेज में कोई खास बात है? अपनी भाषा में बोलकर बताएं',
      confirmTitle: 'पढ़े गए विवरण की पुष्टि करें',
      confirmSub: 'एजेंट द्वारा निकाली गई जानकारी की जांच करें',
      retakeBtn: 'साफ फोटो दोबारा लें',
      uploadBtn: 'अपलोड करें',
      reuploadBtn: 'दोबारा अपलोड',
      recognised: 'स्वीकृत एवं सत्यापित',
      needsClearer: 'साफ फोटो की आवश्यकता है',
      missing: 'अपलोड बाकी है',
      voiceNoteHelper: 'उदा: "बिजली का बिल मेरे मकान मालिक के नाम पर है क्योंकि मैं किराए पर रहता हूँ"',
      confirmBtn: 'विवरण सही है, पुष्टि करें',
      flagMistakeBtn: 'कोई गलती है? सुधारें',
      simBlurryBtn: 'धुंधली फोटो का परीक्षण करें (डेमो)',
      simRetakeBtn: 'साफ फोटो अपलोड करें (स्वीकृत)',
    },
    Tamil: {
      loanTitle: 'தனிநபர் கடன் விண்ணப்பம்',
      loanSub: 'கடன் தொகை: ₹5,00,000 · காலம்: 36 மாதங்கள்',
      statusWaiting: 'ஆவணங்கள் மதிப்பாய்வில் உள்ளன',
      checklistTitle: 'தேவையான ஆவணங்கள் சரிபார்ப்புப் பட்டியல்',
      checklistSub: 'மொபைல் மூலம் பதிவேற்றவும்',
      voiceTitle: 'குரல் குறிப்பு (Voice Note)',
      voiceSub: 'உங்கள் சொந்த மொழியில் ஆவணத்தைப் பற்றி சுருக்கமாகப் பேசவும்',
      confirmTitle: 'விவரங்களை உறுதிப்படுத்தவும்',
      confirmSub: 'AI படித்த தகவல்கள் சரியானவையா என்று சரிபார்க்கவும்',
      retakeBtn: 'மீண்டும் புகைப்படம் எடுக்கவும்',
      uploadBtn: 'பதிவேற்று',
      reuploadBtn: 'மீண்டும் பதிவேற்று',
      recognised: 'சரிபார்க்கப்பட்டது',
      needsClearer: 'தெளிவான நகல் தேவை',
      missing: 'பதிவேற்ற வேண்டும்',
      voiceNoteHelper: 'எ.கா: "வாடகை ஒப்பந்தத்தில் இருப்பதால் மின்சார ரசீது வீட்டு உரிமையாளர் பெயரில் உள்ளது"',
      confirmBtn: 'விவரங்கள் சரி, உறுதிசெய்',
      flagMistakeBtn: 'தவறை சுட்டிக்காட்டு',
      simBlurryBtn: 'மங்கலான புகைப்பட சோதனை (Demo)',
      simRetakeBtn: 'தெளிவான நகலை பதிவேற்று (Approved)',
    },
    'Bahasa Indonesia': {
      loanTitle: 'Pengajuan Pinjaman Mikro',
      loanSub: 'Plafon: Rp 50.000.000 · Tenor: 24 Bulan',
      statusWaiting: 'Dokumen sedang diproses',
      checklistTitle: 'Daftar Periksa Dokumen',
      checklistSub: 'Unggah foto langsung dari kamera HP Anda',
      voiceTitle: 'Catatan Suara (Voice Note)',
      voiceSub: 'Jelaskan dokumen Anda dalam bahasa Indonesia',
      confirmTitle: 'Konfirmasi Data Terbaca',
      confirmSub: 'Periksa data yang diekstrak oleh sistem sebelum diteruskan',
      retakeBtn: 'Ambil Ulang Foto',
      uploadBtn: 'Unggah',
      reuploadBtn: 'Unggah Ulang',
      recognised: 'Terverifikasi',
      needsClearer: 'Perlu Foto Lebih Jelas',
      missing: 'Belum Diunggah',
      voiceNoteHelper: 'Contoh: "Slip gaji ini dari kantor cabang Kuningan, alamat sesuai KTP."',
      confirmBtn: 'Konfirmasi Data Benar',
      flagMistakeBtn: 'Laporkan Kesalahan',
      simBlurryBtn: 'Simulasi Dokumen Buram',
      simRetakeBtn: 'Unggah Ulang Jelas',
    },
    Vietnamese: {
      loanTitle: 'Hồ Sơ Vay Tiêu Dùng',
      loanSub: 'Hạn mức: 150.000.000 đ · Kỳ hạn: 36 tháng',
      statusWaiting: 'Đang xác minh hồ sơ',
      checklistTitle: 'Danh Mục Hồ Sơ Cần Thiết',
      checklistSub: 'Chụp ảnh từ điện thoại hoặc tải tài liệu',
      voiceTitle: 'Ghi Chú Thoại',
      voiceSub: 'Giải thích tài liệu bằng tiếng Việt',
      confirmTitle: 'Xác Nhận Thông Tin',
      confirmSub: 'Kiểm tra thông tin do AI trích xuất',
      retakeBtn: 'Chụp lại ảnh rõ nét',
      uploadBtn: 'Tải lên',
      reuploadBtn: 'Tải lại',
      recognised: 'Đã xác nhận',
      needsClearer: 'Cần ảnh rõ nét hơn',
      missing: 'Chưa tải lên',
      voiceNoteHelper: 'Ví dụ: "Hóa đơn điện đứng tên chủ nhà vì tôi đang thuê trọ."',
      confirmBtn: 'Xác nhận thông tin đúng',
      flagMistakeBtn: 'Báo sai sót',
      simBlurryBtn: 'Thử nghiệm ảnh mờ',
      simRetakeBtn: 'Tải lại ảnh rõ',
    },
    English: {
      loanTitle: 'Retail Personal Loan Application',
      loanSub: 'Amount: ₹5,00,000 · Tenure: 36 Months',
      statusWaiting: 'Documents under live verification',
      checklistTitle: 'Required Documents Checklist',
      checklistSub: 'Upload high-resolution phone photos or PDF scans',
      voiceTitle: 'Customer Voice Note',
      voiceSub: 'Explain any document details in your own native tongue',
      confirmTitle: 'Confirm Extracted Details',
      confirmSub: 'Review what our agents read from your documents',
      retakeBtn: 'Retake Photo',
      uploadBtn: 'Upload',
      reuploadBtn: 'Re-upload',
      recognised: 'Recognised & Verified',
      needsClearer: 'Needs a clearer copy',
      missing: 'Missing upload',
      voiceNoteHelper: 'e.g. "The electricity bill is in my landlord\'s name because I rent"',
      confirmBtn: 'Confirm Details are Correct',
      flagMistakeBtn: 'Flag a Correction',
      simBlurryBtn: 'Simulate Blurry Upload (Triggers Feedback)',
      simRetakeBtn: 'Upload Clean Document (Recognised)',
    },
    Bengali: {
      loanTitle: 'ব্যক্তিগত ঋণ আবেদন',
      loanSub: 'ঋণ পরিমাণ: ₹৫,০০,০০০ · মেয়াদ: ৩৬ মাস',
      statusWaiting: 'নথিপত্র যাচাই চলছে',
      checklistTitle: 'প্রয়োজনীয় নথি তালিকা',
      checklistSub: 'আপনার ফোন থেকে সরাসরি ছবি তুলুন বা আপলোড করুন',
      voiceTitle: 'ভয়েস নোট (Voice Note)',
      voiceSub: 'আপনার নিজের ভাষায় নথির বিবরণ রেকর্ড করুন',
      confirmTitle: 'তথ্য যাচাই করুন',
      confirmSub: 'সিস্টেম দ্বারা সংগৃহীত তথ্য মিলিয়ে দেখুন',
      retakeBtn: 'পুনরায় ছবি তুলুন',
      uploadBtn: 'আপলোড করুন',
      reuploadBtn: 'পুনরায় আপলোড',
      recognised: 'যাচাই সম্পন্ন',
      needsClearer: 'পরিষ্কার ছবি প্রয়োজন',
      missing: 'আপলোড বাকি আছে',
      voiceNoteHelper: 'উদাহরণ: "ভাড়া চুক্তির কারণে বিদ্যুৎ বিল বাড়ির মালিকের নামে রয়েছে"',
      confirmBtn: 'তথ্য সঠিক, নিশ্চিত করুন',
      flagMistakeBtn: 'ভুল সংশোধন করুন',
      simBlurryBtn: 'অস্পষ্ট ছবি পরীক্ষা (Demo)',
      simRetakeBtn: 'পরিষ্কার নথি আপলোড',
    },
    Gujarati: {
      loanTitle: 'વ્યક્તિગત લોન અરજી',
      loanSub: 'લોનની રકમ: ₹5,00,000 · મુદત: 36 મહિના',
      statusWaiting: 'દસ્તાવેજોની ચકાસણી ચાલુ છે',
      checklistTitle: 'જરૂરી દસ્તાવેજોની યાદી',
      checklistSub: 'તમારા ફોનમાંથી અપલોડ કરો',
      voiceTitle: 'વોઇસ નોટ',
      voiceSub: 'તમારી પોતાની ભાષામાં બોલીને સમજાવો',
      confirmTitle: 'વિગતોની ચકાસણી',
      confirmSub: 'વાંચેલ વિગતો તપાસો',
      retakeBtn: 'ફરીથી ફોટો લો',
      uploadBtn: 'અપલોડ કરો',
      reuploadBtn: 'ફરી અપલોડ કરો',
      recognised: 'ચકાસાયેલ',
      needsClearer: 'સ્પષ્ટ ફોટો જરૂરી છે',
      missing: 'બાકી છે',
      voiceNoteHelper: 'ઉદાહરણ: "વીજળીનું બિલ મકાનમાલિકના નામે છે કારણ કે હું ભાડે રહું છું."',
      confirmBtn: 'વિગતો સાચી છે, ખાતરી કરો',
      flagMistakeBtn: 'ભૂલ જણાવો',
      simBlurryBtn: 'ઝાંખા ફોટોનું પરીક્ષણ',
      simRetakeBtn: 'સ્પષ્ટ ફોટો અપલોડ કરો',
    },
    Telugu: {
      loanTitle: 'వ్యక్తిగత లోన్ దరఖాస్తు',
      loanSub: 'మొత్తం: ₹5,00,000 · కాలపరిమితి: 36 నెలలు',
      statusWaiting: 'డాక్యుమెంట్లు పరిశీలనలో ఉన్నాయి',
      checklistTitle: 'అవసరమైన పత్రాల జాబితా',
      checklistSub: 'మీ ఫోన్ నుండి నేరుగా అప్‌లోడ్ చేయండి',
      voiceTitle: 'వాయిస్ నోట్',
      voiceSub: 'మీ సొంత భాషలో వివరించండి',
      confirmTitle: 'వివరాలను నిర్ధారించండి',
      confirmSub: 'సిస్టమ్ చదివిన సమాచారాన్ని సరిచూసుకోండి',
      retakeBtn: 'మళ్లీ స్పష్టమైన ఫోటో తీయండి',
      uploadBtn: 'అప్‌లోడ్ చేయండి',
      reuploadBtn: 'రీ-అప్‌లోడ్ చేయండి',
      recognised: 'ధృవీకరించబడింది',
      needsClearer: 'స్పష్టమైన కాపీ అవసరం',
      missing: 'అప్‌లోడ్ చేయాలి',
      voiceNoteHelper: 'ఉదా: "కరెంట్ బిల్లు నా ఇంటి యజమాని పేరు మీద ఉంది কারণ నేను అద్దెకు ఉంటున్నాను"',
      confirmBtn: 'వివరాలు సరైనవి',
      flagMistakeBtn: 'సవరణ చేయండి',
      simBlurryBtn: 'అస్పష్టమైన ఫోటో టెస్ట్',
      simRetakeBtn: 'స్పష్టమైన కాపీ అప్‌లోడ్',
    },
  };

  const t = UI_TEXT[selectedLanguage] || UI_TEXT.Hindi;

  // Documents required for personal loan checklist
  const REQUIRED_DOCS: { type: DocType; name: string; desc: string }[] = [
    { type: 'aadhaar_card', name: 'Aadhaar Card / Photo ID', desc: 'UIDAI verified Identity' },
    { type: 'pan_card', name: 'PAN Card', desc: 'Income Tax Identity' },
    { type: 'salary_slip', name: 'Latest Salary Slips (2 Months)', desc: 'Proof of salaried income' },
    { type: 'bank_statement', name: 'Bank Statement (3 Months)', desc: 'Salary credit account' },
    { type: 'proof_of_address', name: 'Proof of Address (Utility Bill)', desc: 'Electricity or Rental Lease' },
  ];

  // Helper to open upload for a specific slot
  const handleOpenSlotUpload = (docType: DocType) => {
    setActiveUploadSlot(docType);
  };

  // Helper to trigger device file picker
  const handleTriggerFileInput = (docType: DocType) => {
    setActiveUploadSlot(docType);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Process a selected or captured file
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadSlot) return;

    setIsProcessingUpload(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || result;

        try {
          const res = await fetch('/api/agent/pipeline', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              docTypeSlot: activeUploadSlot,
              fileBase64: base64,
              mimeType: file.type || 'image/jpeg',
              fileName: file.name,
            }),
          });

          const data = await res.json();
          applyProcessedDocument(activeUploadSlot, data, file.name, result);
        } catch (err) {
          console.error('API error processing document:', err);
          applyErrorDocument(
            activeUploadSlot,
            'Verification error: Failed to process document with Agent pipeline. Please check file format and try again.',
            file.name,
            result
          );
        } finally {
          setIsProcessingUpload(false);
          setActiveUploadSlot(null);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File read error:', err);
      setIsProcessingUpload(false);
      setActiveUploadSlot(null);
    }
  };

  // Apply a processed document result to the case
  const applyProcessedDocument = (
    slot: DocType,
    data: any,
    fileName: string,
    previewDataUrl?: string
  ) => {
    const quality = (data.quality as 'ok' | 'retake' | 'wrong_doc') || 'wrong_doc';
    const newDoc: DocRecord = {
      id: data.documentId || `DOC-${Date.now()}`,
      docType: slot,
      title: `${slot.replace(/_/g, ' ').toUpperCase()} (${
        quality === 'ok' ? 'Verified' : quality === 'retake' ? 'Cropped / Retake' : 'Rejected'
      })`,
      fileName,
      fileUrl: previewDataUrl || data.fileUrl || '/mock_docs/aadhaar_priya.png',
      uploadTime: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      quality,
      qualityReason: data.qualityReason,
      language: (data.language as Language) || 'Hindi',
      fields: data.fields || [],
      flags: data.flags || [],
      customerMessage: data.customerMessage,
      statusText:
        quality === 'ok'
          ? 'Verified by Agent Graph'
          : quality === 'retake'
          ? 'Needs a clearer copy / Cropped'
          : 'Invalid Document (Rejected by Agent)',
    };

    const updated = { ...currentCase };
    updated.documents = {
      ...updated.documents,
      [slot]: newDoc,
    };

    // If an invalid document is uploaded, set risk level to High so loan officers can inspect
    if (quality === 'wrong_doc') {
      updated.riskLevel = 'High';
      updated.status = 'Needs review';
    } else if (quality === 'retake') {
      updated.status = 'Waiting on customer';
    } else {
      const allVerified = REQUIRED_DOCS.every((req) => updated.documents[req.type]?.quality === 'ok');
      if (allVerified && updated.riskLevel !== 'High') {
        updated.status = 'Complete';
      }
    }

    onUpdateCase(updated);
  };

  // Apply an explicit rejection / error document
  const applyErrorDocument = (
    slot: DocType,
    reason: string,
    fileName = 'uploaded_file.jpg',
    previewDataUrl?: string
  ) => {
    const errorDoc: DocRecord = {
      id: `DOC-ERR-${Date.now()}`,
      docType: slot,
      title: `${slot.replace(/_/g, ' ').toUpperCase()} (Rejected)`,
      fileName,
      fileUrl: previewDataUrl || '/mock_docs/aadhaar_priya.png',
      uploadTime: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
      quality: 'wrong_doc',
      qualityReason: reason,
      language: 'Hindi',
      customerMessage: 'दस्तावेज सत्यापन विफल: अपलोड की गई तस्वीर सही दस्तावेज नहीं है। कृपया असली दस्तावेज की साफ फोटो दोबारा लें।',
      fields: [],
      flags: [
        {
          id: `FLG-ERR-${Date.now()}`,
          rule: 'Document Authenticity Check',
          severity: 'High',
          evidence: reason,
          type: 'model_judgement',
          category: 'consistency',
        },
      ],
      statusText: 'Rejected: Invalid Document',
    };

    const updated = { ...currentCase };
    updated.documents = {
      ...updated.documents,
      [slot]: errorDoc,
    };
    updated.riskLevel = 'High';
    updated.status = 'Needs review';
    onUpdateCase(updated);
  };

  // Simulate Cropped Aadhaar Card to test LLM retake detection
  const handleSimulateCroppedDoc = (slot: DocType) => {
    setIsProcessingUpload(true);
    setTimeout(() => {
      setIsProcessingUpload(false);
      setActiveUploadSlot(null);

      const croppedDoc: DocRecord = {
        id: `DOC-CROP-${Date.now()}`,
        docType: slot,
        title: `${slot.replace(/_/g, ' ').toUpperCase()} (Cropped Photo)`,
        fileName: `${slot}_cropped_camera.jpg`,
        fileUrl: '/mock_docs/aadhaar_priya.png',
        uploadTime: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
        quality: 'retake',
        qualityReason:
          'The Aadhaar card is cropped at the bottom margin. The 12-digit UIDAI number and security hologram are sliced outside the camera frame.',
        customerMessage:
          'आधार कार्ड का निचला हिस्सा कटा हुआ है और 12 अंकों का आधार नंबर नहीं दिख रहा है। कृपया पूरे कार्ड के चारों कोनों की साफ फोटो दोबारा लें। / Aadhaar card margins are clipped outside the frame. Please retake showing all 4 corners.',
        language: 'Hindi',
        fields: [],
        flags: [
          {
            id: 'FLG-CROP-TEST',
            rule: 'Document Margins & Completeness Inspection',
            severity: 'Medium',
            evidence: 'Bottom margin clipped by 22%; 12-digit UIDAI number obscured outside crop rectangle.',
            type: 'model_judgement',
            category: 'visual_tampering',
          },
        ],
        statusText: 'Retake Required: Cropped Margins',
      };

      const updated = { ...currentCase };
      updated.documents = { ...updated.documents, [slot]: croppedDoc };
      updated.status = 'Waiting on customer';
      onUpdateCase(updated);
    }, 700);
  };

  // Simulate Random Photo (Selfie / Landscape) to test LLM rejection error
  const handleSimulateRandomPhoto = (slot: DocType) => {
    setIsProcessingUpload(true);
    setTimeout(() => {
      setIsProcessingUpload(false);
      setActiveUploadSlot(null);

      const rejectedDoc: DocRecord = {
        id: `DOC-ERR-${Date.now()}`,
        docType: slot,
        title: `${slot.replace(/_/g, ' ').toUpperCase()} (Rejected - Random Photo)`,
        fileName: 'nature_selfie_random.jpg',
        fileUrl: '/mock_docs/random_photo_sample.png',
        uploadTime: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
        quality: 'wrong_doc',
        qualityReason:
          'The uploaded file is a personal photo / landscape, NOT a Government of India Aadhaar Card. No UIDAI emblem or card structure was detected.',
        customerMessage:
          'अपलोड की गई तस्वीर आधार कार्ड नहीं है (सामान्य फोटो/सेल्फी पहचानी गई)। कृपया अपने असली आधार कार्ड की स्पष्ट फोटो अपलोड करें। / The uploaded photo is not an Aadhaar card. Please upload a clear photo of your real Aadhaar card.',
        language: 'Hindi',
        fields: [],
        flags: [
          {
            id: 'FLG-RANDOM-PHOTO-REJECTED',
            rule: 'Document Authenticity & Type Verification',
            severity: 'High',
            evidence: 'Image classified as random photo / non-document (Confidence 99%). Aadhaar UIDAI markers completely absent.',
            type: 'model_judgement',
            category: 'consistency',
          },
        ],
        statusText: 'Rejected: Not a Valid Document',
      };

      const updated = { ...currentCase };
      updated.documents = { ...updated.documents, [slot]: rejectedDoc };
      updated.riskLevel = 'High';
      updated.status = 'Needs review';
      onUpdateCase(updated);
    }, 700);
  };

  // Apply a clean standard preset document for the slot
  const applyStandardPresetDoc = (slot: DocType) => {
    setIsProcessingUpload(true);
    setTimeout(() => {
      setIsProcessingUpload(false);
      setActiveUploadSlot(null);

      const updated = { ...currentCase };
      if (slot === 'salary_slip') {
        updated.documents.salary_slip = {
          id: `DOC-SAL-${Date.now()}`,
          docType: 'salary_slip',
          title: 'Salary Slip (सितंबर 2026 / September 2026)',
          fileName: 'salary_slip_aditya_clean.pdf',
          fileUrl: '/mock_docs/salary_hindi_clean.png',
          uploadTime: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
          quality: 'ok',
          language: 'Hindi',
          statusText: 'Verified',
          customerMessage: 'आपकी वेतन पर्ची सफलता से सत्यापित हो गई है (शुद्ध वेतन: ₹58,400)।',
          fields: [
            {
              id: 'F-SAL-01',
              name: 'employer_name',
              label: 'Employer Name',
              value_original: 'आदित्य टेक्सटाइल्स प्राइवेट लिमिटेड',
              value_en: 'Aditya Textiles Private Limited',
              page: 1,
              bbox: [12, 18, 22, 82],
              confidence: 0.98,
              category: 'income',
            },
            {
              id: 'F-SAL-06',
              name: 'net_pay',
              label: 'Net Pay',
              value_original: '₹58,400.00',
              value_en: '₹58,400.00',
              page: 1,
              bbox: [72, 58, 82, 90],
              confidence: 0.99,
              category: 'income',
            },
          ],
          flags: [],
        };
      } else if (slot === 'aadhaar_card') {
        updated.documents.aadhaar_card = {
          id: `DOC-AADH-${Date.now()}`,
          docType: 'aadhaar_card',
          title: 'Aadhaar Card (e-KYC Copy)',
          fileName: 'aadhaar_verified.pdf',
          fileUrl: '/mock_docs/aadhaar_priya.png',
          uploadTime: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
          quality: 'ok',
          language: 'Hindi',
          statusText: 'Verified',
          customerMessage: 'आपका आधार कार्ड सफलतापूर्वक पढ़ लिया गया है।',
          fields: [
            {
              id: 'F-AADHAAR-01',
              name: 'full_name',
              label: 'Applicant Name',
              value_original: 'प्रिया शर्मा',
              value_en: 'Priya Sharma',
              page: 1,
              bbox: [32, 28, 42, 65],
              confidence: 0.99,
              category: 'identity',
            },
            {
              id: 'F-AADHAAR-02',
              name: 'aadhaar_number',
              label: 'Aadhaar Number',
              value_original: '5489 2104 8921',
              value_en: '5489 2104 8921',
              page: 1,
              bbox: [68, 25, 78, 75],
              confidence: 0.99,
              category: 'identity',
              isSensitive: true,
            },
          ],
          flags: [],
        };
      } else if (slot === 'pan_card') {
        updated.documents.pan_card = {
          id: `DOC-PAN-${Date.now()}`,
          docType: 'pan_card',
          title: 'PAN Card',
          fileName: 'pan_card_verified.jpg',
          fileUrl: '/mock_docs/pan_priya.png',
          uploadTime: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
          quality: 'ok',
          language: 'English',
          statusText: 'Verified',
          customerMessage: 'PAN Card verified successfully against NSDL format.',
          fields: [
            {
              id: 'F-PAN-01',
              name: 'pan_number',
              label: 'PAN Number',
              value_original: 'ABCPS1234D',
              value_en: 'ABCPS1234D',
              page: 1,
              bbox: [52, 18, 64, 58],
              confidence: 0.99,
              category: 'identity',
              isSensitive: true,
            },
          ],
          flags: [],
        };
      } else if (slot === 'bank_statement') {
        updated.documents.bank_statement = {
          id: `DOC-BNK-${Date.now()}`,
          docType: 'bank_statement',
          title: 'Bank Statement (HDFC Bank)',
          fileName: 'bank_statement_3mo.pdf',
          fileUrl: '/mock_docs/bank_statement_hdfc.png',
          uploadTime: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
          quality: 'ok',
          language: 'English',
          statusText: 'Verified',
          customerMessage: 'Bank statement salary deposits reconciled.',
          fields: [
            {
              id: 'F-BNK-03',
              name: 'salary_credit',
              label: 'Recurring Salary Credit',
              value_original: '₹58,400.00 (NEFT CR-ADITYA TEXTILES)',
              value_en: '₹58,400.00 (Aditya Textiles NEFT)',
              page: 1,
              bbox: [54, 52, 62, 92],
              confidence: 0.99,
              category: 'income',
            },
          ],
          flags: [],
        };
      } else if (slot === 'proof_of_address') {
        updated.documents.proof_of_address = {
          id: `DOC-POA-${Date.now()}`,
          docType: 'proof_of_address',
          title: 'Electricity Bill (TANGEDCO)',
          fileName: 'tangedco_ebill.jpg',
          fileUrl: '/mock_docs/tangedco_bill.png',
          uploadTime: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
          quality: 'ok',
          language: 'Tamil',
          statusText: 'Verified via Voice Note Context',
          customerMessage: 'Address proof accepted with landlord tenancy context.',
          fields: [
            {
              id: 'F-POA-02',
              name: 'consumer_name',
              label: 'Registered Consumer Name',
              value_original: 'கே. சுந்தரம்',
              value_en: 'K. Sundaram (Landlord)',
              page: 1,
              bbox: [28, 20, 36, 55],
              confidence: 0.98,
              category: 'address',
            },
          ],
          flags: [],
        };
      } else if (slot === 'form_16') {
        updated.documents.form_16 = {
          id: `DOC-F16-${Date.now()}`,
          docType: 'form_16',
          title: 'Form 16 / ITR Certificate',
          fileName: 'form16_tax_verified.pdf',
          fileUrl: '/mock_docs/form16_clean.png',
          uploadTime: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
          quality: 'ok',
          language: 'English',
          statusText: 'Verified',
          customerMessage: 'Form 16 income tax deductions confirmed.',
          fields: [
            {
              id: 'F-F16-01',
              name: 'gross_salary',
              label: 'Total Salary Paid',
              value_original: '₹7,50,000.00',
              value_en: '₹7,50,000.00',
              page: 1,
              bbox: [20, 20, 30, 80],
              confidence: 0.99,
              category: 'tax',
            },
          ],
          flags: [],
        };
      }

      onUpdateCase(updated);
    }, 600);
  };

  // Helper to trigger blurry demo state (Step 1 of demo script)
  const handleSimulateBlurryUpload = () => {
    setIsProcessingUpload(true);
    setTimeout(() => {
      setIsProcessingUpload(false);
      const updated = { ...currentCase };
      if (updated.documents.salary_slip) {
        updated.documents.salary_slip = {
          ...updated.documents.salary_slip,
          quality: 'retake',
          qualityReason: 'The bottom of the payslip is blurry and cut off, so the pay date is not visible.',
          customerMessage:
            'पेस्लिप का निचला हिस्सा धुंधला और कटा हुआ है, इसलिए भुगतान की तारीख दिखाई नहीं दे रही है। कृपया दोबारा फोटो लें।',
          statusText: 'Needs a clearer copy',
        };
      }
      onUpdateCase(updated);
    }, 600);
  };

  // Helper to trigger clean retake upload (Step 2 of demo script)
  const handleSimulateCleanRetake = () => {
    setIsProcessingUpload(true);
    setTimeout(() => {
      setIsProcessingUpload(false);
      const updated = { ...currentCase };
      if (updated.documents.salary_slip) {
        updated.documents.salary_slip = {
          ...updated.documents.salary_slip,
          quality: 'ok',
          qualityReason: undefined,
          customerMessage: 'आपकी वेतन पर्ची सफलता से पहचानी गई और स्वीकार कर ली गई।',
          statusText: 'Recognised & Verified',
        };
      }
      onUpdateCase(updated);
    }, 600);
  };

  // Simulate voice recording
  const handleToggleVoiceRecord = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setVoiceSeconds(0);
      const timer = setInterval(() => {
        setVoiceSeconds((s) => {
          if (s >= 10) {
            clearInterval(timer);
            setIsRecordingVoice(false);
            setVoiceRecorded(true);
            return 10;
          }
          return s + 1;
        });
      }, 1000);
    } else {
      setIsRecordingVoice(false);
      setVoiceRecorded(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-4 px-2 sm:px-6">
      {/* Hidden file input for native camera / disk upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,application/pdf"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Device frame switch & Demo Trigger Bar */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">Customer Viewport:</span>
          </div>
          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setIsMobileFrame(true)}
              className={`px-3 py-1 rounded-md font-medium transition ${
                isMobileFrame ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📱 Mobile Phone Frame
            </button>
            <button
              onClick={() => setIsMobileFrame(false)}
              className={`px-3 py-1 rounded-md font-medium transition ${
                !isMobileFrame ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🖥️ Fullscreen View
            </button>
          </div>
        </div>

        {/* Security & Compliance Info */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            DPDP 2023 · CMEK AES-256
          </span>
        </div>
      </div>

      {/* Main Container - either Phone bezel or responsive container */}
      <div
        className={`transition-all duration-300 ${
          isMobileFrame
            ? 'w-full max-w-[430px] rounded-[44px] border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] bg-slate-950 overflow-hidden ring-1 ring-slate-700/50'
            : 'w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden'
        }`}
      >
        {/* Mobile Status Bar Simulation */}
        {isMobileFrame && (
          <div className="bg-slate-950 px-7 pt-3 pb-2 flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-900 select-none">
            <span className="font-semibold text-slate-300">9:41</span>
            <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto -mt-1 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
            </div>
            <div className="flex items-center gap-1 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Portal Header */}
        <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 p-5 text-white border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
                DB
              </div>
              <div>
                <div className="font-bold text-sm tracking-tight">DocuBridge Mobile</div>
                <div className="text-[10px] text-blue-300">Fast-Track Loan Intake</div>
              </div>
            </div>

            {/* Language Picker */}
            <div className="flex items-center gap-1.5">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                aria-label="Select customer language"
                className="bg-slate-800/90 text-white text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400 font-medium cursor-pointer"
              >
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="English">English</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="Vietnamese">Tiếng Việt</option>
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
              </select>
            </div>
          </div>

          {/* Product Banner */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 backdrop-blur-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-semibold text-blue-300">{t.loanTitle}</div>
                <div className="text-base font-bold text-white mt-0.5">{currentCase.loanProduct}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{t.loanSub}</div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Application #{currentCase.id.slice(-4)}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-2 text-xs">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex-1 py-3 font-medium text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Checklist (5)
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex-1 py-3 font-medium text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'voice'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            Voice Note
            {voiceRecorded && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
          </button>
          <button
            onClick={() => setActiveTab('confirm')}
            className={`flex-1 py-3 font-medium text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'confirm'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirm Data
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[580px] overflow-y-auto">
          {/* TAB 1: CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{t.checklistTitle}</h3>
                  <p className="text-[11px] text-slate-400">{t.checklistSub}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {Object.values(currentCase.documents).filter((d) => d && d.quality === 'ok').length}/5
                  </span>
                  <div className="text-[9px] text-slate-500">Verified</div>
                </div>
              </div>

              {/* Document items list */}
              <div className="space-y-3">
                {REQUIRED_DOCS.map((docItem) => {
                  const docRecord = currentCase.documents[docItem.type];
                  const isUploaded = !!docRecord;
                  const isOk = docRecord?.quality === 'ok';
                  const isRetake = docRecord?.quality === 'retake';
                  const isWrongDoc = docRecord?.quality === 'wrong_doc';

                  return (
                    <div
                      key={docItem.type}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isWrongDoc
                          ? 'bg-rose-950/25 border-rose-500/50 shadow-md ring-1 ring-rose-500/30'
                          : isRetake
                          ? 'bg-amber-950/20 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                          : isOk
                          ? 'bg-slate-900/80 border-emerald-500/30'
                          : 'bg-slate-900/40 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              isWrongDoc
                                ? 'bg-rose-500/20 text-rose-400'
                                : isRetake
                                ? 'bg-amber-500/20 text-amber-400'
                                : isOk
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {isWrongDoc ? (
                              <ShieldAlert className="w-5 h-5 text-rose-400" />
                            ) : isRetake ? (
                              <AlertCircle className="w-5 h-5 text-amber-400" />
                            ) : isOk ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <FileText className="w-5 h-5" />
                            )}
                          </div>

                          <div>
                            <div className="font-semibold text-xs text-white flex items-center gap-2">
                              {docItem.name}
                              {docRecord?.language && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-blue-300 font-normal">
                                  {docRecord.language}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{docItem.desc}</div>

                            {/* REJECTED: Not a document or wrong document error alert */}
                            {isWrongDoc && (
                              <div className="mt-2.5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/35 text-[11px] text-rose-200">
                                <div className="font-bold flex items-center gap-1.5 text-rose-400 text-[10px] uppercase tracking-wider">
                                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                                  DOCUMENT REJECTED - NOT A VALID {docItem.name.toUpperCase()}
                                </div>
                                <div className="mt-1 leading-snug font-medium text-rose-100">
                                  {docRecord?.customerMessage ||
                                    'अपलोड की गई तस्वीर मान्य दस्तावेज नहीं है। कृपया असली दस्तावेज की साफ फोटो अपलोड करें।'}
                                </div>
                                {docRecord?.qualityReason && (
                                  <div className="mt-1.5 text-[10px] text-rose-300/80 font-mono bg-rose-950/40 p-1.5 rounded border border-rose-500/20">
                                    Quality Agent Finding: {docRecord.qualityReason}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* RETAKE: Cropped or Blurry photo alert */}
                            {isRetake && (
                              <div className="mt-2.5 p-3 rounded-xl bg-amber-500/15 border border-amber-500/35 text-[11px] text-amber-200">
                                <div className="font-bold flex items-center gap-1.5 text-amber-300 text-[10px] uppercase tracking-wider">
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                                  RETAKE REQUIRED - CROPPED OR CUT-OFF PHOTO
                                </div>
                                <div className="mt-1 leading-snug font-medium text-amber-100">
                                  {docRecord?.customerMessage ||
                                    'दस्तावेज का किनारा या नंबर कटा हुआ है। कृपया पूरे दस्तावेज की साफ फोटो दोबारा लें।'}
                                </div>
                                {docRecord?.qualityReason && (
                                  <div className="mt-1.5 text-[10px] text-amber-300/80 font-mono bg-amber-950/40 p-1.5 rounded border border-amber-500/20">
                                    Quality Agent Finding: {docRecord.qualityReason}
                                  </div>
                                )}
                              </div>
                            )}

                            {isOk && docRecord?.customerMessage && (
                              <div className="mt-1.5 text-[10px] text-emerald-400 flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                {docRecord.customerMessage}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Badge & Action */}
                        <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                          {isWrongDoc ? (
                            <div className="flex flex-col items-end gap-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                ✗ Rejected
                              </span>
                              <button
                                onClick={() => handleOpenSlotUpload(docItem.type)}
                                disabled={isProcessingUpload}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                              >
                                <RotateCw className={`w-3.5 h-3.5 ${isProcessingUpload ? 'animate-spin' : ''}`} />
                                Re-upload Correct Doc
                              </button>
                            </div>
                          ) : isRetake ? (
                            <div className="flex flex-col items-end gap-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                ⚠ Cropped Photo
                              </span>
                              <button
                                onClick={() => handleOpenSlotUpload(docItem.type)}
                                disabled={isProcessingUpload}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
                              >
                                <RotateCw className={`w-3.5 h-3.5 ${isProcessingUpload ? 'animate-spin' : ''}`} />
                                {t.retakeBtn}
                              </button>
                            </div>
                          ) : isOk ? (
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                <Check className="w-3 h-3" /> {t.recognised}
                              </span>
                              <button
                                onClick={() => handleOpenSlotUpload(docItem.type)}
                                title="Re-upload without restarting application"
                                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                              >
                                <RefreshCw className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenSlotUpload(docItem.type)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5" /> {t.uploadBtn}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Helper notice */}
              <div className="p-3 bg-blue-950/30 border border-blue-900/50 rounded-xl text-[11px] text-blue-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                <div>
                  <span className="font-semibold text-white">Multi-Agent Intake:</span> Click any document's{' '}
                  <strong className="text-white">Upload</strong> or <strong className="text-white">Retake</strong> button
                  to capture from your camera, choose a local PDF/scan, or select an instant verified synthetic sample!
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VOICE NOTE */}
          {activeTab === 'voice' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mic className="w-4 h-4 text-emerald-400" />
                  {t.voiceTitle}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{t.voiceSub}</p>
              </div>

              {/* Explanatory banner */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-300 leading-relaxed">
                <span className="font-semibold text-emerald-400">Why record a note?</span> Gemini feeds your audio
                directly into the classifier and cross-document validator. If an electricity bill is in your landlord’s
                name or employer name is in regional script, your spoken note resolves the gap upfront instead of
                causing a rejection!
              </div>

              {/* Interactive Recorder Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-center flex flex-col items-center justify-center">
                <button
                  onClick={handleToggleVoiceRecord}
                  className={`w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-xl transition-all transform active:scale-95 ${
                    isRecordingVoice
                      ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <Mic className="w-8 h-8" />
                  <span className="text-[10px] font-bold mt-1">
                    {isRecordingVoice ? `${voiceSeconds}s` : 'TAP TO RECORD'}
                  </span>
                </button>

                <p className="text-xs text-slate-400 mt-3 italic max-w-xs">{t.voiceNoteHelper}</p>

                {isRecordingVoice && (
                  <div className="flex items-center gap-1 mt-4">
                    <span className="w-1.5 h-6 bg-rose-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-10 bg-rose-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-4 bg-rose-500 rounded-full animate-bounce delay-150"></span>
                    <span className="w-1.5 h-8 bg-rose-400 rounded-full animate-bounce"></span>
                  </div>
                )}
              </div>

              {/* Recorded Note Card */}
              {currentCase.voiceNotes.map((note) => (
                <div key={note.id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-white">Recorded Note ({note.originalLanguage})</span>
                      <span className="text-[10px] text-slate-500 font-mono">{note.audioDurationSeconds}s</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-medium">
                      Translated by Gemini
                    </span>
                  </div>

                  <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 text-[11px]">
                    <div className="text-slate-400 text-[10px]">Original Audio Transcript ({note.originalLanguage}):</div>
                    <div className="text-slate-200 italic mt-0.5 font-sans">{note.transcriptOriginal}</div>
                  </div>

                  <div className="p-2.5 rounded bg-blue-950/30 border border-blue-900/40 text-[11px]">
                    <div className="text-blue-300 text-[10px] font-medium">Bank Officer English Translation:</div>
                    <div className="text-white mt-0.5">{note.transcriptEn}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: CONFIRM DATA */}
          {activeTab === 'confirm' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">{t.confirmTitle}</h3>
                <p className="text-[11px] text-slate-400">{t.confirmSub}</p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Full Name</span>
                  <span className="font-bold text-white">{currentCase.applicantName}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Employer</span>
                  <span className="font-semibold text-white">
                    {currentCase.documents.salary_slip?.fields.find((f) => f.name === 'employer_name')?.value_original ||
                      'Aditya Textiles Pvt Ltd'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Net Take Home Pay</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {currentCase.documents.salary_slip?.fields.find((f) => f.name === 'net_pay')?.value_original ||
                      '₹58,400'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Address Proof Status</span>
                  <span className="font-medium text-blue-300">
                    {currentCase.crossDocumentCheck.addressVoiceNoteResolved
                      ? 'Corroborated by Tenancy Voice Note'
                      : 'Verified'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => setFieldConfirmed(true)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition ${
                    fieldConfirmed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {fieldConfirmed ? 'Details Confirmed by Customer ✓' : t.confirmBtn}
                </button>

                <button
                  onClick={() => {}}
                  className="w-full py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-800 transition"
                >
                  {t.flagMistakeBtn}
                </button>
              </div>

              {/* Jump to Staff View */}
              {onSwitchToStaffConsole && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
                  <button
                    onClick={onSwitchToStaffConsole}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 mx-auto font-medium"
                  >
                    Switch to Bank Officer View to inspect case file <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Options Dialog for Individual Slot */}
      {activeUploadSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileUp className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">
                  Upload {activeUploadSlot.replace(/_/g, ' ').toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => setActiveUploadSlot(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5">
              <p className="text-xs text-slate-300">
                Choose how you would like to submit or test this document for the 7-agent pipeline:
              </p>

              {/* Option 1: Native device file or camera capture */}
              <button
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
                disabled={isProcessingUpload}
                className="w-full p-3.5 rounded-xl border border-blue-500/40 bg-blue-950/30 hover:bg-blue-950/50 flex items-center justify-between text-left transition group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-blue-300 transition">
                      Upload from Camera / Files
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Pick any JPG, PNG, PDF from your phone or desktop
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
              </button>

              {/* Option 2: Digital e-document instant load */}
              <button
                onClick={() => applyStandardPresetDoc(activeUploadSlot)}
                disabled={isProcessingUpload}
                className="w-full p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-950/40 flex items-center justify-between text-left transition group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                      Load Verified Official Document
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Official verified UIDAI e-KYC copy
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
              </button>

              {/* Option 3: Simulate Cropped Aadhaar Card */}
              <button
                onClick={() => handleSimulateCroppedDoc(activeUploadSlot)}
                disabled={isProcessingUpload}
                className="w-full p-3 rounded-xl border border-amber-500/40 bg-amber-950/20 hover:bg-amber-950/40 flex items-center justify-between text-left transition group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-200 group-hover:text-amber-100 transition">
                      Test Cropped Document (Retake Check)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Simulate photo where Aadhaar 12-digit number is cut off
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
              </button>

              {/* Option 4: Simulate Random Photo Rejection */}
              <button
                onClick={() => handleSimulateRandomPhoto(activeUploadSlot)}
                disabled={isProcessingUpload}
                className="w-full p-3 rounded-xl border border-rose-500/40 bg-rose-950/20 hover:bg-rose-950/40 flex items-center justify-between text-left transition group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-rose-200 group-hover:text-rose-100 transition">
                      Test Random Photo (Rejection Error)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Simulate selfie/landscape photo rejected by LLM
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400" />
              </button>

              {isProcessingUpload && (
                <div className="p-3 bg-blue-950/40 border border-blue-500/40 rounded-xl flex items-center justify-center gap-2 text-xs text-blue-300">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running 7-Agent Intake Pipeline...
                </div>
              )}
            </div>

            <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveUploadSlot(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
