# 🤖 Groq AI Features - User Guide

## 🎯 Ringkasan Fitur

Legacy Planning sekarang dilengkapi dengan AI Assistant yang ditenagai oleh **Groq** - platform AI inference tercepat di dunia. Berikut semua fitur AI yang tersedia:

---

## 1. 💬 AI Chat Assistant

### Apa itu?
Asisten chat pintar yang siap membantu Anda 24/7 dengan pertanyaan apapun tentang Legacy Planning.

### Cara Menggunakan
1. **Klik tombol ✨ (Sparkles) di kanan bawah**
2. Chat window akan terbuka
3. Ketik pertanyaan Anda
4. Tekan Enter atau klik Send
5. AI akan menjawab dalam bahasa Indonesia

### Contoh Penggunaan

#### Pertanyaan Umum
```
User: "Bagaimana cara menambah aset?"
AI: "Klik tombol 'Add Asset' di halaman Assets, lalu..."

User: "Apa itu Dead Man's Switch?"
AI: "DMS adalah timer otomatis yang akan..."
```

#### Security Questions
```
User: "Bagaimana cara menyimpan encryption key dengan aman?"
AI: "Ada beberapa metode aman:
     1. Password manager (1Password, Bitwarden)
     2. Physical safe atau safety deposit box
     3. Split key storage..."
```

#### Troubleshooting
```
User: "Beneficiary saya belum bisa akses"
AI: "Mereka perlu verifikasi identitas dulu via Stripe.
     Status verifikasi bisa dicek di halaman Beneficiaries..."
```

### Features
- ✅ Context-aware (ingat percakapan sebelumnya)
- ✅ Bahasa Indonesia natural
- ✅ Jawaban cepat (< 2 detik)
- ✅ Multi-topic (features, security, troubleshooting)
- ✅ Privacy-protected (auto-filter data sensitif)

---

## 2. 🏷️ Smart Asset Categorizer

### Apa itu?
AI yang otomatis menyarankan kategori aset berdasarkan nama/deskripsi.

### Cara Menggunakan
1. Masuk ke halaman **Assets**
2. Klik **Add Asset**
3. Ketik nama aset (misal: "akun netflix")
4. Klik **"Kategorikan dengan AI"**
5. AI akan suggest: Type, Platform, Category
6. Accept atau edit manual

### Contoh

| Input | Type | Platform | Category |
|-------|------|----------|----------|
| "akun netflix premium" | subscription | Netflix | Entertainment |
| "seed phrase bitcoin" | crypto | Bitcoin | Cryptocurrency |
| "saham BCA sekuritas" | investment | BCA Sekuritas | Financial |
| "sertifikat rumah" | legal_document | - | Property |
| "password gmail" | text_note | Gmail | Email |

### Benefits
- ⏱️ Hemat waktu (tidak perlu pilih manual)
- 🎯 Akurat (trained on common patterns)
- 🔄 Konsisten (categorization uniform)
- 📊 Better organization

---

## 3. ✍️ Message Generator

### Apa itu?
AI yang membantu menulis pesan heartfelt untuk beneficiaries Anda.

### Cara Menggunakan
1. Masuk ke **Beneficiaries**
2. Klik **Add Beneficiary**
3. Pilih relationship (Spouse, Child, etc)
4. Klik **"Generate Pesan dengan AI"**
5. Pilih tone dan purpose
6. Klik **Generate**
7. Edit atau langsung gunakan

### Customization Options

**Tone:**
- **Warm & Caring** - Hangat dan penuh kasih sayang
- **Formal** - Formal dan profesional
- **Casual** - Santai dan friendly
- **Emotional** - Deep dan emosional

**Purpose:**
- **Instruksi Akses** - Panduan teknis akses warisan
- **Pesan Pribadi** - Pesan personal dari hati
- **Panduan & Tips** - How-to dan best practices
- **Ucapan & Harapan** - Wishes dan blessings

### Contoh Output

#### Untuk Anak (Warm & Caring)
```
Anakku yang tersayang,

Jika kamu membaca ini, berarti timer DMS saya telah aktif.
Aku sudah mempersiapkan semua aset digital kami untuk kamu.

Di dalam sistem ini ada informasi penting tentang:
- Password akun-akun keluarga
- Investasi dan tabungan
- Dokumen properti
- Dan pesan-pesan pribadi dari Papa/Mama

Ikuti instruksi dengan hati-hati. Encryption key tersimpan
di password manager keluarga yang kamu tahu.

Aku sangat mencintaimu dan bangga denganmu.

- Papa/Mama
```

#### Untuk Spouse (Formal + Instruksi)
```
Dear [Name],

This message is triggered by my Dead Man's Switch system.
All our digital assets are now accessible to you.

Access Instructions:
1. Verify your identity via Stripe (check your email)
2. Enter the access key provided
3. Use our shared password manager for encryption keys
4. Contact [Financial Advisor] for assistance if needed

Important accounts included:
- Banking & investments
- Insurance policies
- Property documents
- Business credentials

Please handle with care and consult professionals as needed.

With love,
[Your Name]
```

---

## 4. 📊 Dashboard Analytics (Coming Soon)

### Apa itu?
AI yang menganalisis dashboard Anda dan memberikan insights.

### Fitur
- Overview summary
- Security scoring
- Activity trends
- Personalized recommendations

### Contoh

```
User: "Analisis dashboard saya"

AI: "📊 Dashboard Summary

Total Assets: 8 items
  • 3 subscriptions
  • 2 crypto wallets
  • 2 investments
  • 1 legal document

Total Beneficiaries: 3
  • 2 verified ✅
  • 1 pending verification ⏳

DMS Status: ACTIVE ✅
  • Last check-in: 2 days ago
  • Next required: 28 days
  • Health: 95%

🎯 Recommendations:
1. Verify pending beneficiary (priority: high)
2. Backup encryption keys (priority: medium)
3. Consider adding emergency contact email

Your legacy security score: 85/100 (Good)"
```

---

## 5. 🛡️ Security Advisor (Coming Soon)

### Apa itu?
AI security checker yang audit setup Anda.

### Checks
- DMS configuration
- Beneficiary verification
- Backup procedures
- 2FA status
- Emergency contacts

### Contoh Output

```
🛡️ Security Audit

✅ Strengths:
  • Strong password (12+ characters)
  • All beneficiaries verified
  • DMS period appropriate
  • Regular check-ins

⚠️ Improvements Needed:
  • No emergency contact email
  • 2FA not enabled
  • Only 2 backup locations for keys

🎯 Action Items (Prioritized):
1. [HIGH] Enable 2FA (estimated: 5 min)
   → Go to Settings → Security → Enable 2FA

2. [MEDIUM] Add emergency contact (estimated: 2 min)
   → Go to Settings → Add emergency email

3. [MEDIUM] Backup keys to 3rd location (estimated: 15 min)
   → Consider: Hardware key storage, Safety deposit box

Security Score: 85/100 (Good)
Target Score: 95+ (Excellent)
```

---

## 6. 🔍 Smart Search (Coming Soon)

### Apa itu?
Cari aset dengan bahasa natural, tidak perlu filter ribet.

### Contoh

```
User: "Cari semua subscription saya"
→ AI: Shows Netflix, Spotify, Disney+

User: "Aset mana yang belum dikategorikan?"
→ AI: Shows uncategorized assets + suggests categories

User: "Berapa total crypto wallet?"
→ AI: "Anda memiliki 3 crypto wallets:
      1. Bitcoin (Coinbase)
      2. Ethereum (MetaMask)
      3. Binance Exchange Account"
```

---

## 7. 🌍 Multi-Language Translation (Coming Soon)

### Apa itu?
Translate pesan atau instruksi ke berbagai bahasa.

### Use Case
Beneficiaries Anda tinggal di berbagai negara dengan bahasa berbeda.

### Contoh

**Original (Indonesian):**
```
"Simpan encryption key ini dengan baik.
Kamu akan membutuhkannya untuk membuka aset."
```

**Translated:**
- 🇬🇧 English
- 🇨🇳 Chinese (Simplified)
- 🇸🇦 Arabic
- 🇪🇸 Spanish
- 🇯🇵 Japanese

---

## 8. 🚨 Scenario Simulator (Coming Soon)

### Apa itu?
Simulasi berbagai skenario emergency dan solusinya.

### Scenarios

#### "Apa yang terjadi jika saya lupa password?"
```
AI: "Jika lupa password akun:

✅ Yang BISA diselamatkan:
  • Reset password via email
  • Akses kembali ke akun

❌ Yang TIDAK bisa diselamatkan:
  • Encryption keys yang hilang
  • Data terenkripsi tanpa key

🎯 Solusi:
1. Klik 'Forgot Password'
2. Cek email untuk reset link
3. Set password baru

⚠️ PENTING: Encryption keys tidak bisa di-reset!
Selalu backup keys di multiple locations."
```

#### "Apa yang terjadi jika beneficiary meninggal?"
```
AI: "Jika beneficiary meninggal:

📋 Steps:
1. Hapus dari beneficiary list
2. Update distribusi aset
3. Tambah beneficiary pengganti
4. Update instruksi yang menyebut mereka

⚙️ How-to:
  • Dashboard → Beneficiaries
  • Klik trash icon
  • Confirm deletion

💡 Pertimbangkan:
  • Tambah alternate beneficiary
  • Review siapa yang punya access keys"
```

---

## 🔒 Privacy & Safety

### What AI CAN See

✅ **Safe to share:**
- General questions
- Asset names (without content)
- Relationship types
- Platform names
- Dashboard statistics
- Feature requests

### What AI CANNOT See

❌ **Never sent to AI:**
- Passwords
- Encryption keys
- Private keys / Seed phrases
- Actual encrypted asset content
- Email addresses (auto-redacted)
- Phone numbers (auto-redacted)
- Credit card numbers

### Auto-Protection Features

1. **Pattern Detection**
   - Automatically detects sensitive patterns
   - Redacts before sending to AI
   - User gets warning

2. **Keyword Blocking**
   - Blocks messages with "password", "private key", etc.
   - Returns error instead of sending

3. **System Prompt Protection**
   - AI instructed never to ask for sensitive data
   - Double-layer protection

### Example: Privacy Filter in Action

```
User input: "My password is abc123 for netflix"

❌ BLOCKED!
Message: "⚠️ Sensitive data detected: password

🔒 Jangan pernah share password, encryption key,
atau data sensitif dengan AI."
```

---

## 💡 Tips Menggunakan AI

### DO's ✅

1. **Ask General Questions**
   ```
   ✅ "Bagaimana cara setup DMS?"
   ✅ "Berapa beneficiary yang optimal?"
   ✅ "Tips keamanan untuk crypto?"
   ```

2. **Get Guidance**
   ```
   ✅ "Panduan untuk first-time users"
   ✅ "Best practices untuk backup keys"
   ✅ "Cara organize banyak aset"
   ```

3. **Troubleshoot Issues**
   ```
   ✅ "Beneficiary tidak dapat email"
   ✅ "DMS timer tidak reset"
   ✅ "Error saat add asset"
   ```

### DON'Ts ❌

1. **Never Share Credentials**
   ```
   ❌ "My password is..."
   ❌ "Encryption key: abc123..."
   ❌ "Seed phrase: word1 word2..."
   ```

2. **Don't Include PII**
   ```
   ❌ Full names with ID numbers
   ❌ Email addresses
   ❌ Phone numbers
   ❌ Physical addresses
   ```

3. **Don't Paste Asset Content**
   ```
   ❌ Actual encrypted data
   ❌ API keys
   ❌ Private keys
   ❌ Recovery phrases
   ```

---

## 🎯 Use Cases

### For New Users
```
"Saya baru pertama kali pakai, apa yang harus dilakukan?"

AI akan guide step-by-step:
1. Setup DMS period
2. Add first asset
3. Add beneficiary
4. Verify identity
5. Security tips
```

### For Security-Conscious Users
```
"Bagaimana memastikan setup saya aman?"

AI akan:
1. Audit security posture
2. Identify vulnerabilities
3. Provide action items
4. Guide implementation
```

### For Busy Users
```
"Saya punya 50 aset, cara organize yang efisien?"

AI akan suggest:
1. Categorization strategy
2. Naming conventions
3. Tagging system
4. Priority ordering
```

---

## 🚀 Coming Soon

### Phase 2 Features
- [ ] Voice Input/Output
- [ ] Proactive Notifications
- [ ] Predictive Insights
- [ ] Cost Analysis
- [ ] Beneficiary Onboarding Guide

### Phase 3 Features
- [ ] Video Message Support
- [ ] Advanced Analytics
- [ ] Integration Suggestions
- [ ] Automated Security Scanning
- [ ] Smart Reminders

---

## 📞 Get Help

**AI Not Working?**
1. Check GROQ_API_KEY in `.env`
2. Restart dev server
3. Clear browser cache
4. See GROQ_AI_SETUP.md

**Feature Request?**
Open an issue atau chat dengan AI Assistant!

**Privacy Concerns?**
Review `src/lib/ai/privacy.ts` untuk lihat filtering logic

---

## ✅ Summary

Groq AI di Legacy Planning memberikan:

🎯 **Smart Assistance** - 24/7 help tanpa batas
🏷️ **Auto-Categorization** - Save time organizing
✍️ **Content Generation** - Write better messages
📊 **Data Insights** - Understand your legacy
🛡️ **Security Guidance** - Stay protected
🔒 **Privacy-First** - Zero-knowledge AI

**Semua fitur dirancang untuk:**
- Mudah digunakan
- Privacy-safe
- User-friendly
- Tidak mengganggu

**Mulai sekarang:** Klik tombol ✨ di dashboard Anda!

---

Made with ❤️ & 🤖 by Legacy Planning Team
