# Amata LINE LIFF - Issue Reporting Mockup (ระบบแจ้งเรื่องใหม่)

เว็บแอปพลิเคชันจำลอง **LINE LIFF (LINE Front-end Framework)** สำหรับระบบรับแจ้งเรื่องร้องเรียนของ **นิคมอุตสาหกรรมอมตะซิตี้ (ชลบุรี และ ระยอง)** ออกแบบตามมาตรฐาน **Mobile-First UX** และ **WCAG 2.1 / 2.2 AA** เพื่อให้ลูกค้าและทีมงานสามารถเปิดทดลองใช้งาน Flow การแจ้งเรื่องใหม่บนสมาร์ตโฟนได้ทันทีผ่าน GitHub Pages พร้อมระบบความปลอดภัยด้วยรหัสผ่านแบบเข้ารหัส (Hashed Passcode Protection)

---

## 🌐 ลิงก์สำหรับเข้าทดลองใช้งาน (Live Demo)

- **Live URL:** [https://fondee-team.github.io/amata-liff-new-issue/](https://fondee-team.github.io/amata-liff-new-issue/)
- **การเข้าใช้งาน:** ป้องกันด้วยรหัสผ่านแบบ SHA-256 Hash เพื่อความปลอดภัย

---

## 🔒 ระบบป้องกันรหัสผ่าน (Hashed Passcode Protection)

สำหรับ GitHub Pages บน Public Repository ระบบได้นำระบบตรวจสอบรหัสผ่านด้วย **SHA-256 One-Way Cryptographic Hash** (Web Crypto API) มาใช้งาน:

- **ความปลอดภัย (Security):** รหัสผ่านจริงจะไม่ปรากฏใน Source Code หรือ Comment ใดๆ บน GitHub
- เมื่อผู้ใช้กรอกรหัสผ่านถูกต้อง เบราว์เซอร์จะจำสถานะการยืนยันตัวตนไว้ใน `sessionStorage` ตลอดการทดลองเล่นใน Session นั้น

### 💡 วิธีเปลี่ยนรหัสผ่านใหม่ (How to Change Passcode):
หากต้องการเปลี่ยนรหัสผ่านเป็นคำอื่น:
1. คำนวณ SHA-256 Hash ของรหัสใหม่ผ่าน Terminal:
   ```bash
   echo -n "YOUR_NEW_PASSWORD" | shasum -a 256
   ```
2. นำค่า Hash 64 ตัวอักษรที่ได้ ไปแทนที่ในตัวแปร `this.PASSPHRASE_HASH` ในไฟล์ `js/auth.js`

---

## 🌟 จุดเด่นและฟังก์ชันการทำงาน (Features)

### 1. ลำดับขั้นตอนการแจ้งเรื่อง 5 ขั้นตอน (5-Step Form Flow):
1. **ขั้นตอนที่ 1: พิมพ์รายละเอียดเรื่องแจ้ง (Details):**
   - กล่องพิมพ์รายละเอียดปัญหา (อย่างน้อย 5 ตัวอักษร) พร้อมตัวนับจำนวนตัวอักษร
2. **ขั้นตอนที่ 2: แชร์ตำแหน่งที่เกิดเหตุ (Location Switcher):**
   - **แท็บ 📍 พิกัดปัจจุบัน / GPS (Default):** ดึงตำแหน่ง GPS อัตโนมัติ พร้อมแผนที่ Leaflet และปุ่มลัดเลือกนิคม (ชลบุรี / ระยอง)
   - **แท็บ 🔗 วางลิงก์ Google Maps:** รองรับการวางลิงก์ Maps หรือพิกัด Lat, Long พร้อมระบบแปลงพิกัดและปักหมุด
3. **ขั้นตอนที่ 3: ใส่ภาพประกอบ (Attach Photos):**
   - แนบรูปภาพ 1 - 3 รูป พร้อมพรีวิวและปุ่มลบ
4. **ขั้นตอนที่ 4: เลือกประเภทเรื่องร้องเรียน (Category Single Column & Search):**
   - แสดง 13 หมวดหมู่ตามคู่มืออมตะในรูปแบบแถวยาว (Single Column) พร้อมชื่อไทย + อังกฤษ และตัวอย่างปัญหา
   - ช่องค้นหา Real-time ค้นหาหมวดหมู่ได้ทันที
5. **ขั้นตอนที่ 5: ตรวจสอบและยืนยันข้อมูล (Enhanced Review Summary):**
   - สรุปข้อมูลแยก 4 การ์ดชัดเจน (ปัญหา, สถานที่, ภาพถ่าย, ข้อมูลผู้แจ้ง) พร้อมปุ่มลัดแก้ไขเฉพาะส่วน
6. **หน้าผลลัพธ์: Ticket Card Summary**
   - ออกรหัสอ้างอิง สถานะ "รอรับเรื่องร้องเรียน", ปุ่มจำลองคำสั่ง `liff.closeWindow()` และปุ่มแจ้งเรื่องใหม่อีกครั้ง

### 2. การออกแบบสำหรับมือถือทุกขนาด (Optimized for iPhone SE & Mobile Viewports):
- **Unified Header (44px):** รวมปุ่มย้อนกลับ `<` ด้านบน, ป้ายบอกขั้นตอน (`1/5`), ชื่อขั้นตอน และปุ่มปิด `✕` ในแถวเดียว
- **Dual Back Navigation:** มีปุ่มย้อนกลับทั้งที่ Header (มุมซ้ายบน) และแถบปุ่มล่าง (รองรับ Thumb Zone ใช้งานมือเดียว)
- **Virtual Keyboard Resizing:** รองรับ `interactive-widget=resizes-content` ปุ่มกดยังคงลอยอยู่เหนือคีย์บอร์ดเสมอ

### 3. มาตรฐานระดับสากล (WCAG 2.1 / 2.2 AA Standard):
- อัตราส่วนความต่างสี (Contrast Ratio) มากกว่า 4.5:1
- เส้นขอบโฟกัส `:focus-visible` ชัดเจนสำหรับคีย์บอร์ด
- โครงสร้าง Semantic HTML5 พร้อม ARIA Roles & Status Messages

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```
amata-liff-new-issue/
├── css/
│   └── style.css            # สไตล์ชีททั้งหมด (Responsive, Theme, Accessible UI)
├── js/
│   ├── app.js               # Application Controller & Form State Management
│   ├── auth.js              # SHA-256 Hashed Passcode Protection Manager
│   ├── categories.js        # ข้อมูล 13 หมวดหมู่เรื่องร้องเรียน พร้อมไอคอน SVG
│   └── map.js               # Leaflet Map, GPS Geolocation & Google Maps Resolver
├── index.html               # หน้าหลักเว็บแอปพลิเคชัน LIFF
├── README.md                # เอกสารแนะนำโปรเจกต์
├── OKF.md                   # Objectives, Key Results & Architecture Framework
├── CONTEXT.md               # รายละเอียดบริบทระบบและ Business Logic
├── HANDOFF.md               # เอกสารส่งมอบงานและแนวทางการต่อยอด
└── .gitignore               # การตั้งค่า Git Ignore (ไม่เก็บไฟล์ PDF และระบบ)
```

---

## 🚀 วิธีนำขึ้น GitHub Pages (Deployment Guide)

1. **Commit และ Push ขึ้น GitHub:**
   ```bash
   git add .
   git commit -m "feat: update amata liff mockup"
   git push origin main
   ```

2. **เปิดใช้งาน GitHub Pages บน GitHub Settings:**
   - ไปที่แท็บ **Settings** > **Pages** ของ Repository
   - ในส่วน **Build and deployment**:
     - Source: เลือก **Deploy from a branch**
     - Branch: เลือก **main** และโฟลเดอร์ **/ (root)**
     - กดปุ่ม **Save**
