const SENSITIVE_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b\d{10,15}\b/g,
  url: /https?:\/\/[^\s]+/g,
  // Crypto patterns
  btcAddress: /\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g,
  ethAddress: /\b0x[a-fA-F0-9]{40}\b/g,
  seedPhrase: /\b(\w+\s+){11,23}\w+\b/g,
  // Credentials
  password: /\b(password|pwd|pass|key|secret)\s*[:=]\s*\S+/gi,
  apiKey: /\b[A-Za-z0-9_-]{20,}\b/g,
};

const FORBIDDEN_KEYWORDS = [
  "password", "private key", "seed phrase", "mnemonic",
  "secret", "pin", "cvv", "ssn", "credit card",
  "encryption key", "wallet key", "recovery phrase",
  "kata sandi", "kunci privat", "kunci enkripsi"
];

export interface SanitizeResult {
  safe: boolean;
  sanitized: string;
  warnings: string[];
  blockedReasons: string[];
}

export function sanitizeInput(text: string): SanitizeResult {
  const warnings: string[] = [];
  const blockedReasons: string[] = [];
  let sanitized = text;
  let safe = true;

  // Check for forbidden keywords
  const lowerText = text.toLowerCase();
  for (const keyword of FORBIDDEN_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      blockedReasons.push(`Terdeteksi kata kunci sensitif: "${keyword}"`);
      safe = false;
    }
  }

  // Check and redact patterns
  for (const [type, pattern] of Object.entries(SENSITIVE_PATTERNS)) {
    const matches = text.match(pattern);
    if (matches) {
      warnings.push(`Terdeteksi dan disensor: ${type}`);
      sanitized = sanitized.replace(pattern, `[${type.toUpperCase()}_REDACTED]`);
    }
  }

  // Additional length check for potential keys/hashes
  const words = text.split(/\s+/);
  const longStrings = words.filter(w => w.length > 30 && /^[a-fA-F0-9]+$/.test(w));
  if (longStrings.length > 0) {
    warnings.push("String hexadecimal panjang terdeteksi dan disensor");
    longStrings.forEach(str => {
      sanitized = sanitized.replace(str, "[HEX_REDACTED]");
    });
  }

  return {
    safe,
    sanitized,
    warnings,
    blockedReasons,
  };
}

export function isInputSafe(text: string): boolean {
  return sanitizeInput(text).safe;
}
