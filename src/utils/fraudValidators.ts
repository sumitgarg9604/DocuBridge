/**
 * Verhoeff Algorithm for Aadhaar Checksum Validation
 * Standard D8 / permutation tables for verifying 12-digit UIDAI numbers
 */
const verhoeffD = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const verhoeffP = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

export function validateAadhaarVerhoeff(aadhaar: string): { valid: boolean; reason?: string } {
  const clean = aadhaar.replace(/[\s-]/g, '');
  if (!/^\d{12}$/.test(clean)) {
    return { valid: false, reason: 'Aadhaar must be exactly 12 numeric digits' };
  }
  let c = 0;
  const digits = clean.split('').map(Number).reverse();
  for (let i = 0; i < digits.length; i++) {
    c = verhoeffD[c][verhoeffP[i % 8][digits[i]]];
  }
  if (c === 0) {
    return { valid: true };
  }
  return { valid: false, reason: 'Verhoeff checksum failed. The last check digit is mathematically invalid.' };
}

export function validatePanFormat(pan: string): { valid: boolean; entityType?: string; reason?: string } {
  const clean = pan.trim().toUpperCase();
  const panRegex = /^[A-Z]{3}[ABCFGHLJPT][A-Z]\d{4}[A-Z]$/;
  if (!panRegex.test(clean)) {
    return { valid: false, reason: 'Invalid PAN structure. Must match [A-Z]{5}[0-9]{4}[A-Z] with valid 4th entity char.' };
  }
  const entityMap: Record<string, string> = {
    P: 'Individual / Person',
    C: 'Company',
    H: 'HUF (Hindu Undivided Family)',
    F: 'Firm / Partnership',
    A: 'Association of Persons',
    T: 'Trust',
    B: 'Body of Individuals',
    L: 'Local Authority',
    J: 'Artificial Juridical Person',
    G: 'Government Entity',
  };
  const entityChar = clean[3];
  return { valid: true, entityType: entityMap[entityChar] || 'Individual' };
}

export function validatePayslipArithmetic(
  gross: number,
  deductions: number,
  netPay: number
): { valid: boolean; calculatedNet: number; difference: number; reason?: string } {
  const calculatedNet = Math.round((gross - deductions) * 100) / 100;
  const difference = Math.round(Math.abs(calculatedNet - netPay) * 100) / 100;
  if (difference <= 1.0) {
    return { valid: true, calculatedNet, difference: 0 };
  }
  return {
    valid: false,
    calculatedNet,
    difference,
    reason: `Arithmetic mismatch: Gross (₹${gross.toLocaleString('en-IN')}) - Deductions (₹${deductions.toLocaleString('en-IN')}) equals ₹${calculatedNet.toLocaleString('en-IN')}, but printed Net Pay is ₹${netPay.toLocaleString('en-IN')} (Delta: ₹${difference.toLocaleString('en-IN')}).`,
  };
}

export function validateBankSalaryReconciliation(
  payslipNetPay: number,
  bankSalaryDeposit: number
): { match: boolean; difference: number; reason?: string } {
  const diff = Math.abs(payslipNetPay - bankSalaryDeposit);
  if (diff <= 10.0) {
    return { match: true, difference: diff };
  }
  return {
    match: false,
    difference: diff,
    reason: `Bank statement monthly salary credit (₹${bankSalaryDeposit.toLocaleString('en-IN')}) does not reconcile with Payslip Net Pay (₹${payslipNetPay.toLocaleString('en-IN')}). Difference: ₹${diff.toLocaleString('en-IN')}.`,
  };
}

export function screenPromptInjection(text: string): { isSuspicious: boolean; matches: string[]; neutralizedText: string } {
  const patterns = [
    /ignore\s+(all\s+)?(previous\s+)?instructions/i,
    /system\s+override/i,
    /bypass\s+(all\s+)?(fraud|validation|checks)/i,
    /approve\s+this\s+loan/i,
    /set\s+risk(score)?\s*=\s*0/i,
    /output\s+verified\s*=\s*true/i,
    /you\s+must\s+confirm\s+eligibility/i,
    /disregard\s+financial\s+rules/i,
    /admin\s+token/i,
  ];

  const matches: string[] = [];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      matches.push(match[0]);
    }
  }

  // Sanitize / neutralize suspicious instructions
  let neutralizedText = text;
  if (matches.length > 0) {
    for (const m of matches) {
      neutralizedText = neutralizedText.replace(new RegExp(m, 'gi'), `[BLOCKED_ADVERSARIAL_INPUT: "${m}"]`);
    }
  }

  return {
    isSuspicious: matches.length > 0,
    matches,
    neutralizedText,
  };
}

export function maskSensitiveValue(value: string, type: 'aadhaar' | 'pan' | 'account' | 'phone'): string {
  if (!value) return '';
  const clean = value.trim();
  if (type === 'aadhaar') {
    const digits = clean.replace(/\D/g, '');
    if (digits.length >= 4) {
      const last4 = digits.slice(-4);
      return `XXXX-XXXX-${last4}`;
    }
    return 'XXXX-XXXX-XXXX';
  }
  if (type === 'pan') {
    if (clean.length === 10) {
      return `XXXXX${clean.slice(5, 9)}X`;
    }
    return 'XXXXX****X';
  }
  if (type === 'account') {
    if (clean.length >= 4) {
      return `••••••••${clean.slice(-4)}`;
    }
    return '••••••••';
  }
  if (type === 'phone') {
    if (clean.length >= 4) {
      return `+91 ••••• ••${clean.slice(-2)}`;
    }
    return '+91 ••••• •••••';
  }
  return value;
}
