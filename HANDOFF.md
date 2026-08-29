# Developer & Stakeholder Handoff Guide (HANDOFF)

เอกสารส่งมอบงานสำหรับนักพัฒนาและผู้ดูแลระบบ **Amata LINE LIFF Issue Reporting**

---

## 🚀 1. การเปิดใช้งานและทดสอบใน Local (Quick Start)

เนื่องจากโปรเจกต์ถูกพัฒนาด้วย **Vanilla HTML / CSS / JS (Zero-build Architecture)** จึงสามารถเปิดรันได้ทันทีโดยไม่ต้องติดตั้ง Node modules:

1. **ผ่าน VS Code / Antigravity IDE (Live Server):**
   - คลิกขวาที่ไฟล์ `index.html` $\rightarrow$ เลือก **"Open with Live Server"**
   - เบราว์เซอร์จะเปิดที่ `http://127.0.0.1:5500/index.html`

2. **ผ่าน Python Simple Server:**
   ```bash
   python3 -m http.server 8080
   ```
   - เปิดเบราว์เซอร์ที่ `http://localhost:8080`

---

## 🌐 2. การ Deploy บน GitHub Pages (Production / Staging)

- **Repository:** `https://github.com/fondee-team/amata-liff-new-issue`
- **Live URL:** `https://fondee-team.github.io/amata-liff-new-issue/`
- **Deployment Process:**
  - โค้ดทั้งหมดจะ Deploy อัตโนมัติทันทีที่ Push ขึ้น Branch `main`
  ```bash
  git add .
  git commit -m "feat: your update message"
  git push origin main
  ```

---

## 🔒 3. การจัดการความปลอดภัยและรหัสผ่าน (Passcode Management)

ระบบใช้ **SHA-256 One-Way Cryptographic Hash** จัดเก็บไว้ในไฟล์ `js/auth.js`:

```javascript
// js/auth.js
class AmataAuthManager {
  constructor() {
    // กำหนดค่า SHA-256 Hash ของรหัสผ่านที่นี่
    this.PASSPHRASE_HASH = "dba2da6693cf76ee7b2d1eb0e41aee1234fee9ae5038b88cb1d18bbe5025608b";
    this.SESSION_KEY = "amata_liff_authenticated";
  }
  // ...
}
```

### ขั้นตอนการเปลี่ยนรหัสผ่าน:
1. สร้าง Hash ใหม่จากคำที่ต้องการใน Terminal:
   ```bash
   echo -n "YOUR_NEW_PASSWORD" | shasum -a 256
   ```
2. นำค่า Hash ที่ได้มาวางแทนที่ใน `this.PASSPHRASE_HASH`
3. Commit และ Push ขึ้น GitHub

---

## 📱 4. แนวทางการเชื่อมต่อกับ LINE LIFF จริงใน Production

เมื่อต้องการนำ Mockup นี้ไปต่อกับระบบ Backend และ LINE Developers Console จริง:

1. **ลงทะเบียน LIFF App ใน LINE Developers Console:**
   - สร้าง Provider และ Channel ประเภท LINE Login
   - เพิ่ม LIFF App และตั้งค่า Endpoint URL เป็น URL ของระบบ Production
   - กำหนด Scope: `profile`, `openid`

2. **อัปเดต `initLiffSdk()` ใน `js/app.js`:**
   ```javascript
   liff.init({ liffId: "YOUR_REAL_LIFF_ID" })
     .then(() => {
       if (!liff.isLoggedIn()) {
         liff.login();
       } else {
         liff.getProfile().then(profile => {
           this.formData.reporter.name = profile.displayName;
           this.formData.reporter.userId = profile.userId;
         });
       }
     });
   ```

3. **ส่งข้อมูลไปยัง Backend API (ในฟังก์ชัน `submitReport()`):**
   ```javascript
   async submitReport() {
     const payload = {
       description: this.formData.description,
       location: this.formData.location,
       photos: this.formData.photos,
       category: this.formData.category.id,
       reporter: this.formData.reporter
     };

     const res = await fetch("https://api.amata.com/v1/issues", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(payload)
     });
     const data = await res.json();
     // แสดงผลหน้า Ticket ด้วย data.ticketId
   }
   ```

---

## ♿ 5. รายการตรวจสอบมาตรฐานการเข้าถึง (WCAG Checklist)

- [x] **Contrast Ratio:** ข้อความหลักและปุ่มมีค่า Contrast เกิน 4.5:1
- [x] **Focus Indicators:** กำหนด `:focus-visible` ชัดเจนรอบทุกปุ่มและกล่องกรอก
- [x] **Touch Targets:** พื้นที่สัมผัสของทุกปุ่มมีขนาดอย่างน้อย 44 × 44 px หรือความสูงตามมาตรฐาน Apple HIG
- [x] **Mobile Responsiveness:** ทดสอบบน iPhone SE (375x667px), iPhone 14/15/16 และ Android
- [x] **Pinch-to-zoom:** รองรับการขยายหน้าจอของผู้ใช้ (ไม่ปิดกั้น `user-scalable`)
