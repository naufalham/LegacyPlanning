# 🤖 Groq AI Integration - Setup Guide

## 📋 Daftar Isi

1. [Setup Awal](#setup-awal)
2. [Konfigurasi Environment](#konfigurasi-environment)
3. [Fitur yang Tersedia](#fitur-yang-tersedia)
4. [Cara Menggunakan](#cara-menggunakan)
5. [Privacy & Security](#privacy--security)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Setup Awal

### 1. Dapatkan Groq API Key

1. Kunjungi [Groq Console](https://console.groq.com)
2. Sign up atau login
3. Buat API Key baru
4. Copy API Key (format: `gsk_...`)

### 2. Install Dependencies

Dependencies sudah terinstall otomatis saat `npm install`:
```bash
npm install groq-sdk
```

### 3. Setup Environment Variable

Edit file `.env` dan tambahkan:

```env
# Groq AI
GROQ_API_KEY="gsk_your_actual_api_key_here"
```

**PENTING:** Jangan commit `.env` ke Git! File ini sudah ada di `.gitignore`.

### 4. Restart Development Server

```bash
npm run dev
```

---

## ⚙️ Konfigurasi Environment

### File `.env` Lengkap

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend Email
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Groq AI
GROQ_API_KEY="gsk_..."  # ← TAMBAHKAN INI
```

---

## ✨ Fitur yang Tersedia

### 1. **AI Chat Assistant** ✅
- **Lokasi:** Floating button di kanan bawah (semua halaman dashboard)
- **Fungsi:**
  - Menjawab pertanyaan tentang platform
  - Memberikan panduan step-by-step
  - Tips keamanan dan best practices
  - Troubleshooting issues
- **Cara Pakai:** Klik tombol dengan icon ✨ Sparkles

### 2. **Smart Asset Categorizer** ✅
- **Lokasi:** Halaman Add Asset (akan ditambahkan)
- **Fungsi:**
  - Auto-kategorisasi berdasarkan nama aset
  - Suggest tipe, platform, dan kategori
- **Cara Pakai:** Ketik nama aset, klik "Kategorikan dengan AI"

### 3. **Message Generator** ✅
- **Lokasi:** Halaman Add Beneficiary (akan ditambahkan)
- **Fungsi:**
  - Generate pesan untuk beneficiaries
  - Customize tone dan purpose
  - Personalisasi berdasarkan relationship
- **Cara Pakai:** Klik "Generate Pesan dengan AI"

### 4. **Dashboard Analytics** 🔄 (Coming Soon)
- Analisis dashboard metrics
- Insights dan rekomendasi
- Security score

---

## 📖 Cara Menggunakan

### AI Chat Assistant

1. **Buka Dashboard**
2. **Klik tombol ✨ di kanan bawah**
3. **Chat dimulai dengan welcome message**
4. **Ketik pertanyaan Anda**
5. **Tekan Enter atau klik Send**

**Contoh Pertanyaan:**
```
- "Bagaimana cara menambah aset?"
- "Apa itu Dead Man's Switch?"
- "Kenapa beneficiary saya belum verified?"
- "Berapa hari optimal untuk DMS period?"
- "Cara backup encryption key yang aman?"
```

### Smart Categorizer

```typescript
// Component usage di Assets page
import SmartCategorizer from "@/components/ai/SmartCategorizer";

<SmartCategorizer
  assetName={assetName}
  onSuggestion={(result) => {
    setAssetType(result.type);
    setPlatform(result.platform);
  }}
  isDark={isDark}
/>
```

### Message Generator

```typescript
// Component usage di Beneficiaries page
import MessageGenerator from "@/components/ai/MessageGenerator";

<MessageGenerator
  relationship={relationship}
  onGenerated={(message) => {
    setCustomMessage(message);
  }}
  isDark={isDark}
/>
```

---

## 🔒 Privacy & Security

### Multi-Layer Protection

#### 1. **Client-Side Filtering**
```typescript
// Privacy filter di browser
if (input.includes("password") || input.includes("key")) {
  alert("⚠️ Jangan share data sensitif!");
  return;
}
```

#### 2. **API-Level Sanitization**
```typescript
// Server-side privacy check
const { safe, sanitized, warnings } = sanitizeInput(prompt);

if (!safe) {
  return error("Sensitive data detected");
}
```

#### 3. **Pattern Detection**
Otomatis detect dan block:
- Email addresses
- Phone numbers
- Cryptocurrency addresses
- Seed phrases
- Passwords & API keys
- URLs & sensitive keywords

#### 4. **System Prompt Protection**
```typescript
systemPrompt += `
IMPORTANT:
- NEVER ask for passwords, keys, or PII
- NEVER suggest sharing private information
- Always prioritize user privacy
`;
```

### ❌ Yang TIDAK Boleh Dikirim ke AI

- ❌ Passwords
- ❌ Encryption keys
- ❌ Private keys / Seed phrases
- ❌ Credit card numbers
- ❌ Social Security Numbers
- ❌ Passport/ID numbers
- ❌ Actual asset content (yang terenkripsi)

### ✅ Yang AMAN Dikirim ke AI

- ✅ Pertanyaan umum
- ✅ Nama aset (tanpa content)
- ✅ Relationship info (Spouse, Child, etc)
- ✅ Platform names (Netflix, Binance)
- ✅ Dashboard statistics (total counts)
- ✅ General guidance requests

---

## 🛠️ Troubleshooting

### Error: "GROQ_API_KEY is not set"

**Penyebab:** Environment variable tidak terbaca

**Solusi:**
1. Cek file `.env` ada di root project
2. Pastikan formatnya benar: `GROQ_API_KEY="gsk_..."`
3. Restart dev server: `npm run dev`
4. Clear Next.js cache: `rm -rf .next`

### Error: "Failed to get AI response"

**Penyebab:** API key invalid atau quota habis

**Solusi:**
1. Verifikasi API key di [Groq Console](https://console.groq.com/keys)
2. Cek quota/limits
3. Generate API key baru jika perlu

### Error: "Sensitive data detected"

**Penyebab:** Input mengandung data sensitif

**Solusi:**
- Ini adalah **fitur keamanan**, bukan bug
- Hapus password, keys, atau PII dari input
- Gunakan pertanyaan yang general saja

### AI Response Lambat

**Penyebab:** Model atau network issue

**Solusi:**
1. Cek koneksi internet
2. Groq biasanya sangat cepat (100+ tokens/sec)
3. Jika tetap lambat, coba lagi nanti

### Component Tidak Muncul

**Penyebab:** Import path salah atau component belum ter-render

**Solusi:**
```typescript
// Pastikan import benar
import AIAssistant from "@/components/ai/AIAssistant";

// Pastikan component dipanggil
<AIAssistant />
```

---

## 🔧 Konfigurasi Lanjutan

### Ubah Model AI

Edit file `src/lib/groq.ts`:

```typescript
const completion = await groq.chat.completions.create({
  // Model options:
  // - "llama-3.1-70b-versatile" (default, balanced)
  // - "llama-3.1-8b-instant" (faster, cheaper)
  // - "mixtral-8x7b-32768" (long context)
  model: "llama-3.1-70b-versatile",

  // Temperature: 0-2 (higher = more creative)
  temperature: 0.7,

  // Max tokens: max response length
  max_tokens: 1024,
});
```

### Custom System Prompts

Edit file `src/lib/ai/prompts.ts`:

```typescript
export const SYSTEM_PROMPTS = {
  assistant: `Custom prompt Anda di sini...`,
  // ... prompts lainnya
};
```

### Adjust Privacy Filters

Edit file `src/lib/ai/privacy.ts`:

```typescript
// Tambah pattern baru
const SENSITIVE_PATTERNS = {
  custom: /your-regex-here/g,
  // ... patterns lainnya
};

// Tambah keyword baru
const FORBIDDEN_KEYWORDS = [
  "your-keyword",
  // ... keywords lainnya
];
```

---

## 📊 Monitoring & Analytics

### Log AI Usage

Tambahkan di API routes:

```typescript
// app/api/ai/chat/route.ts
console.log(`AI Chat - User: ${session.user.email} - Tokens: ${result.usage?.total_tokens}`);
```

### Track Costs

Groq pricing (as of 2024):
- Free tier: Generous limits
- Paid tier: Very affordable
- Monitor di: [Groq Console](https://console.groq.com/usage)

---

## 📚 Resources

- [Groq Documentation](https://console.groq.com/docs)
- [Groq Playground](https://console.groq.com/playground)
- [Model Comparison](https://console.groq.com/docs/models)
- [Rate Limits](https://console.groq.com/docs/rate-limits)

---

## ✅ Checklist Setup

- [ ] Groq account created
- [ ] API key generated
- [ ] `.env` file updated
- [ ] `npm install` dijalankan
- [ ] Dev server restarted
- [ ] AI Assistant button muncul
- [ ] Chat works (test dengan "Halo")
- [ ] Privacy filter works (test dengan "password123")

---

## 🎉 Selesai!

Groq AI sudah terintegrasi dengan sempurna! Fitur-fitur AI sekarang siap digunakan.

**Next Steps:**
1. Test semua fitur AI
2. Customize prompts sesuai kebutuhan
3. Monitor usage dan costs
4. Expand dengan fitur AI tambahan

**Need Help?**
- Check troubleshooting section
- Review code di `src/lib/ai-service.ts`
- Test API route di Postman/Thunder Client

Happy coding! 🚀
