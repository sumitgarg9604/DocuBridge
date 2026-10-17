import { ApplicantCase, Language, DocRecord, VoiceNote, AuditEvent } from '../types/docubridge';

export interface NewCustomerInput {
  name: string;
  phone: string;
  email: string;
  loanProduct: string;
  requestedAmount: number;
  tenureMonths: number;
  primaryLanguage: Language;
  monthlySalary: number;
  employerName: string;
  city: string;
  initialTemplate: 'empty' | 'verified' | 'discrepancy' | 'landlord_rent';
}

export function generateCustomerCase(input: NewCustomerInput): ApplicantCase {
  const uniqueNum = Math.floor(1000 + Math.random() * 9000);
  const countryPrefix =
    input.primaryLanguage === 'Bahasa Indonesia'
      ? 'SEA'
      : input.primaryLanguage === 'Vietnamese'
      ? 'VN'
      : 'IN';
  const id = `APP-2026-${countryPrefix}-${uniqueNum}`;
  const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST';

  // Gross, deductions and net pay calculations
  const gross = input.monthlySalary;
  const deductions = Math.round(gross * 0.14);
  const netPay = gross - deductions;

  // Currency symbol
  const currencySymbol = input.primaryLanguage === 'Bahasa Indonesia' ? 'Rp' : input.primaryLanguage === 'Vietnamese' ? '₫' : '₹';

  const formatMoney = (amount: number) => {
    if (input.primaryLanguage === 'Bahasa Indonesia') {
      return `Rp ${amount.toLocaleString('id-ID')}`;
    }
    if (input.primaryLanguage === 'Vietnamese') {
      return `${amount.toLocaleString('vi-VN')} ₫`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  let documents: Record<string, DocRecord | null> = {
    aadhaar_card: null,
    pan_card: null,
    salary_slip: null,
    bank_statement: null,
    proof_of_address: null,
    form_16: null,
    unknown: null,
  };

  let voiceNotes: VoiceNote[] = [];
  let status: 'Complete' | 'Waiting on customer' | 'Needs review' = 'Waiting on customer';
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';

  const auditTrail: AuditEvent[] = [
    {
      id: `AUD-INIT-${uniqueNum}`,
      timestamp: nowStr,
      actor: input.name,
      actorRole: 'customer',
      action: 'Loan Application Initiated',
      details: `Applicant ${input.name} created application for ${input.loanProduct} (${formatMoney(input.requestedAmount)}). Selected Language: ${input.primaryLanguage}.`,
      severity: 'info',
    },
  ];

  if (input.initialTemplate === 'empty') {
    // Fresh application, customer needs to upload all documents
    status = 'Waiting on customer';
    return {
      id,
      applicantName: input.name,
      applicationDate: nowStr,
      phone: input.phone || '+91 98110 54129',
      email: input.email || `${input.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      loanProduct: input.loanProduct,
      requestedAmount: input.requestedAmount,
      tenureMonths: input.tenureMonths,
      primaryLanguage: input.primaryLanguage,
      status,
      riskLevel: 'Low',
      isMasked: true,
      documents: {
        aadhaar_card: null,
        pan_card: null,
        salary_slip: null,
        bank_statement: null,
        proof_of_address: null,
        form_16: null,
        unknown: null,
      },
      voiceNotes: [],
      crossDocumentCheck: {
        identityMatch: false,
        identityDetails: 'Pending document uploads.',
        addressMatch: false,
        addressDetails: 'Pending address document.',
        incomeMatch: false,
        incomeDetails: 'Pending salary slip and bank statement.',
        salarySlipNetPay: 0,
        bankStatementNetCredit: 0,
      },
      summary: {
        executiveSummary: `New loan intake initiated for ${input.name}. Awaiting document submission via applicant portal.`,
        gapsAndDiscrepancies: ['Pending initial document uploads from customer.'],
        positiveSignals: ['Application profile created successfully.'],
        voiceNoteKeyTakeaways: [],
        recommendation: 'Requires Clarification',
      },
      auditTrail,
    };
  }

  // Pre-generate verified or discrepancy documents based on template
  const isDiscrepancy = input.initialTemplate === 'discrepancy';
  const hasLandlordBill = input.initialTemplate === 'landlord_rent';

  // 1. Identity Document (Aadhaar / KTP)
  const isAadhaarSlot = input.primaryLanguage !== 'Bahasa Indonesia';
  const idDoc: DocRecord = {
    id: `DOC-${uniqueNum}-ID`,
    docType: isAadhaarSlot ? 'aadhaar_card' : 'pan_card',
    title: isAadhaarSlot ? 'Aadhaar Card (UIDAI Verified)' : 'Kartu Tanda Penduduk (KTP)',
    fileName: `identity_${input.name.toLowerCase().replace(/\s+/g, '_')}.pdf`,
    fileUrl: '/mock_docs/aadhaar_priya.png',
    uploadTime: nowStr,
    quality: 'ok',
    language: input.primaryLanguage,
    statusText: 'Verified',
    fields: [
      {
        id: `F-${uniqueNum}-01`,
        name: 'full_name',
        label: 'Applicant Name',
        value_original: input.name,
        value_en: input.name,
        page: 1,
        bbox: [32, 28, 42, 65],
        confidence: 0.99,
        category: 'identity',
      },
      {
        id: `F-${uniqueNum}-02`,
        name: 'id_number',
        label: isAadhaarSlot ? 'Aadhaar Number' : 'NIK Number',
        value_original: isAadhaarSlot ? '6492 8104 3821' : '3174092104820002',
        value_en: isAadhaarSlot ? '6492 8104 3821' : '3174092104820002',
        page: 1,
        bbox: [68, 25, 78, 75],
        confidence: 0.99,
        category: 'identity',
        isSensitive: true,
      },
    ],
    flags: [],
  };

  // 2. PAN Card
  const panDoc: DocRecord = {
    id: `DOC-${uniqueNum}-PAN`,
    docType: 'pan_card',
    title: 'PAN Card (Income Tax Dept)',
    fileName: `pan_${input.name.toLowerCase().replace(/\s+/g, '_')}.jpg`,
    fileUrl: '/mock_docs/pan_priya.png',
    uploadTime: nowStr,
    quality: 'ok',
    language: 'English',
    statusText: 'Verified',
    fields: [
      {
        id: `F-${uniqueNum}-PAN1`,
        name: 'pan_number',
        label: 'PAN Number',
        value_original: `ABCP${input.name.charAt(0).toUpperCase()}${uniqueNum}K`,
        value_en: `ABCP${input.name.charAt(0).toUpperCase()}${uniqueNum}K`,
        page: 1,
        bbox: [52, 18, 64, 58],
        confidence: 0.99,
        category: 'identity',
        isSensitive: true,
      },
      {
        id: `F-${uniqueNum}-PAN2`,
        name: 'full_name',
        label: 'Name on Card',
        value_original: input.name.toUpperCase(),
        value_en: input.name.toUpperCase(),
        page: 1,
        bbox: [32, 18, 42, 60],
        confidence: 0.99,
        category: 'identity',
      },
    ],
    flags: [],
  };

  // 3. Salary Slip
  const printedNetPay = isDiscrepancy ? netPay + 30000 : netPay;
  const salaryDoc: DocRecord = {
    id: `DOC-${uniqueNum}-SAL`,
    docType: 'salary_slip',
    title: `Monthly Payslip (${input.employerName})`,
    fileName: `salary_slip_${input.employerName.toLowerCase().replace(/\s+/g, '_')}.pdf`,
    fileUrl: '/mock_docs/salary_hindi_clean.png',
    uploadTime: nowStr,
    quality: 'ok',
    language: input.primaryLanguage,
    statusText: isDiscrepancy ? 'Arithmetic Discrepancy Found' : 'Verified',
    fields: [
      {
        id: `F-${uniqueNum}-SAL1`,
        name: 'employer_name',
        label: 'Employer Name',
        value_original: input.employerName,
        value_en: input.employerName,
        page: 1,
        bbox: [12, 18, 22, 82],
        confidence: 0.98,
        category: 'income',
      },
      {
        id: `F-${uniqueNum}-SAL2`,
        name: 'gross_salary',
        label: 'Gross Earnings',
        value_original: formatMoney(gross),
        value_en: formatMoney(gross),
        page: 1,
        bbox: [50, 62, 58, 88],
        confidence: 0.99,
        category: 'income',
      },
      {
        id: `F-${uniqueNum}-SAL3`,
        name: 'total_deductions',
        label: 'Total Deductions',
        value_original: formatMoney(deductions),
        value_en: formatMoney(deductions),
        page: 1,
        bbox: [60, 62, 68, 88],
        confidence: 0.99,
        category: 'income',
      },
      {
        id: `F-${uniqueNum}-SAL4`,
        name: 'net_pay',
        label: isDiscrepancy ? 'Printed Net Pay (TAMPERED)' : 'Net Pay',
        value_original: formatMoney(printedNetPay),
        value_en: formatMoney(printedNetPay),
        page: 1,
        bbox: [72, 58, 82, 90],
        confidence: 0.99,
        category: 'income',
      },
    ],
    flags: isDiscrepancy
      ? [
          {
            id: `FLG-${uniqueNum}-ARITH`,
            rule: 'Payslip Balance Arithmetic Check',
            severity: 'High',
            evidence: `Gross (${formatMoney(gross)}) - Deductions (${formatMoney(deductions)}) = ${formatMoney(netPay)}, but printed Net Pay is ${formatMoney(printedNetPay)}.`,
            type: 'deterministic',
            category: 'arithmetic',
            bbox: [72, 58, 82, 90],
          },
        ]
      : [],
  };

  // 4. Bank Statement
  const bankSalaryCredit = isDiscrepancy ? netPay - 15000 : netPay;
  const bankDoc: DocRecord = {
    id: `DOC-${uniqueNum}-BANK`,
    docType: 'bank_statement',
    title: 'Bank Statement (3 Months Recurring Salary)',
    fileName: `bank_statement_${input.name.toLowerCase().replace(/\s+/g, '_')}.pdf`,
    fileUrl: '/mock_docs/bank_statement_hdfc.png',
    uploadTime: nowStr,
    quality: 'ok',
    language: 'English',
    statusText: isDiscrepancy ? 'Reconciliation Mismatch' : 'Verified',
    fields: [
      {
        id: `F-${uniqueNum}-BNK1`,
        name: 'salary_credit',
        label: 'Monthly Salary Credit',
        value_original: `${formatMoney(bankSalaryCredit)} (NEFT CR-${input.employerName.toUpperCase().slice(0, 15)})`,
        value_en: `${formatMoney(bankSalaryCredit)} (${input.employerName} Payroll)`,
        page: 1,
        bbox: [54, 52, 62, 92],
        confidence: 0.99,
        category: 'income',
      },
    ],
    flags: isDiscrepancy
      ? [
          {
            id: `FLG-${uniqueNum}-BNK`,
            rule: 'Bank Salary Credit Reconciliation',
            severity: 'High',
            evidence: `Bank credit of ${formatMoney(bankSalaryCredit)} contradicts claimed payslip net pay ${formatMoney(printedNetPay)}.`,
            type: 'deterministic',
            category: 'reconciliation',
            bbox: [54, 52, 62, 92],
          },
        ]
      : [],
  };

  // 5. Proof of Address
  const addressDoc: DocRecord = {
    id: `DOC-${uniqueNum}-POA`,
    docType: 'proof_of_address',
    title: `Electricity Utility Bill (${input.city})`,
    fileName: `utility_bill_${input.city.toLowerCase()}.jpg`,
    fileUrl: '/mock_docs/tangedco_bill.png',
    uploadTime: nowStr,
    quality: 'ok',
    language: input.primaryLanguage,
    statusText: hasLandlordBill ? 'Verified via Voice Note' : 'Verified',
    fields: [
      {
        id: `F-${uniqueNum}-POA1`,
        name: 'consumer_name',
        label: 'Registered Consumer',
        value_original: hasLandlordBill ? 'Rajesh Khanna (Landlord)' : input.name,
        value_en: hasLandlordBill ? 'Rajesh Khanna (Landlord)' : input.name,
        page: 1,
        bbox: [28, 20, 36, 55],
        confidence: 0.98,
        category: 'address',
      },
      {
        id: `F-${uniqueNum}-POA2`,
        name: 'service_address',
        label: 'Service Address',
        value_original: `Flat 302, Green Park Apartments, ${input.city}`,
        value_en: `Flat 302, Green Park Apartments, ${input.city}`,
        page: 1,
        bbox: [38, 20, 48, 85],
        confidence: 0.97,
        category: 'address',
      },
    ],
    flags: [],
  };

  if (hasLandlordBill) {
    voiceNotes.push({
      id: `VN-${uniqueNum}-01`,
      originalLanguage: input.primaryLanguage,
      audioDurationSeconds: 15,
      transcriptOriginal:
        input.primaryLanguage === 'Tamil'
          ? 'வணக்கம், இந்த மின்சார ரசீது என் வீட்டு உரிமையாளர் பெயரில் உள்ளது. நான் வாடகை ஒப்பந்தத்தில் வசிக்கிறேன்.'
          : input.primaryLanguage === 'Bahasa Indonesia'
          ? 'Halo, listrik ini atas nama pemilik rumah sewa saya sesuai perjanjian sewa.'
          : 'नमस्ते, यह बिजली का बिल मेरे मकान मालिक के नाम पर है क्योंकि मैं किराए के एग्रीमेंट पर रहता हूँ।',
      transcriptEn:
        'Hello, this electricity bill is in my landlord\'s name because I live here under a registered rental lease.',
      summaryEn:
        'Applicant clarifies utility bill is in landlord name due to active rental agreement.',
      officerContext:
        'Explains address gap upfront. Prevents false rejection.',
      contradictsDocument: false,
    });
  }

  if (isAadhaarSlot) {
    documents.aadhaar_card = idDoc;
    documents.pan_card = panDoc;
  } else {
    documents.pan_card = idDoc; // KTP as primary ID
  }
  documents.salary_slip = salaryDoc;
  documents.bank_statement = bankDoc;
  documents.proof_of_address = addressDoc;

  if (isDiscrepancy) {
    status = 'Needs review';
    riskLevel = 'High';
  } else {
    status = 'Complete';
    riskLevel = 'Low';
  }

  return {
    id,
    applicantName: input.name,
    applicationDate: nowStr,
    phone: input.phone || '+91 98450 99120',
    email: input.email || `${input.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    loanProduct: input.loanProduct,
    requestedAmount: input.requestedAmount,
    tenureMonths: input.tenureMonths,
    primaryLanguage: input.primaryLanguage,
    status,
    riskLevel,
    isMasked: true,
    documents: documents as any,
    voiceNotes,
    crossDocumentCheck: {
      identityMatch: true,
      identityDetails: `Identity confirmed across all primary records for ${input.name}.`,
      addressMatch: true,
      addressDetails: hasLandlordBill
        ? 'Utility bill in landlord name, corroborated by customer voice note and lease.'
        : `Residential address in ${input.city} verified.`,
      incomeMatch: !isDiscrepancy,
      incomeDetails: isDiscrepancy
        ? `Conflict between calculated net pay (${formatMoney(netPay)}) and printed pay (${formatMoney(printedNetPay)}).`
        : `Net pay ${formatMoney(netPay)} matches recurring monthly bank credit.`,
      salarySlipNetPay: printedNetPay,
      bankStatementNetCredit: bankSalaryCredit,
      discrepancyDelta: isDiscrepancy ? printedNetPay - bankSalaryCredit : 0,
      addressVoiceNoteResolved: hasLandlordBill,
    },
    summary: {
      executiveSummary: isDiscrepancy
        ? `HIGH RISK: Financial documents for ${input.name} show arithmetic discrepancies between payslip gross/net and bank credits.`
        : `Verified retail salaried application for ${input.name} (${input.employerName}, ${input.city}). Income and KYC verified with full source citations.`,
      gapsAndDiscrepancies: isDiscrepancy
        ? [`Payslip arithmetic failure: gross minus deductions does not match printed net pay.`]
        : ['All required KYC and financial documents verified.'],
      positiveSignals: [
        `Identity verified for ${input.name}.`,
        isDiscrepancy ? 'ID checks passed.' : `Income arithmetic and bank statement reconciliation passed.`,
      ],
      voiceNoteKeyTakeaways: hasLandlordBill ? ['Customer proactively clarified landlord tenancy address.'] : [],
      recommendation: isDiscrepancy ? 'Flagged for Special Investigation' : 'Recommend Approval',
    },
    auditTrail,
  };
}
