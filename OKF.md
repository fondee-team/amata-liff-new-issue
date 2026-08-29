# Objectives, Key Results & Framework (OKF)

เอกสารสรุปวัตถุประสงค์ ผลลัพธ์หลัก และกรอบการพัฒนาของโครงการ **Amata LINE LIFF Issue Reporting Mockup**

---

## 🎯 1. Objectives (วัตถุประสงค์)

1. **สร้างระบบ Mockup LINE LIFF สำหรับแจ้งเรื่องร้องเรียน:** จำลองขั้นตอนการแจ้งปัญหาในนิคมอุตสาหกรรมอมตะซิตี้ (ชลบุรีและระยอง) ตามคู่มือทางการ โดยสามารถเปิดทดลองใช้งานได้จริงบนสมาร์ตโฟนผ่าน GitHub Pages
2. **มอบประสบการณ์การใช้งานระดับพรีเมียม (Premium Mobile UX):** ออกแบบให้กระชับ โหลดเร็ว ใช้งานง่ายบนหน้าจอทุกขนาด (รวมถึง iPhone SE 375x667px) โดยลดการ Scroll ให้เหลือน้อยที่สุด
3. **ปฏิบัติตามมาตรฐานสากลด้านการเข้าถึง (WCAG 2.1 / 2.2 AA Compliance):** ออกแบบให้มีความชัดเจนของสี (Contrast > 4.5:1), รองรับ Screen Reader, Touch Target ขั้นต่ำ 44px และใช้งานร่วมกับคีย์บอร์ดได้สมบูรณ์
4. **ความปลอดภัยบน Public Repository:** ปกป้องการเข้าถึง Mockup ด้วยรหัสผ่านแบบ SHA-256 One-Way Hash โดยไม่มีการเปิดเผยรหัสผ่านจริงในโค้ด

---

## 📊 2. Key Results (ผลลัพธ์หลักที่สำเร็จ)

| Key Result | รายละเอียดผลลัพธ์ที่ได้ | สถานะ |
| :--- | :--- | :---: |
| **KR 1: Standalone Deployment** | เผยแพร่เว็บแอปพลิเคชันแบบ Zero-build บน GitHub Pages พร้อมทดสอบได้ทันที | ✅ สำเร็จ |
| **KR 2: Hashed Security** | ติดตั้งระบบ Passcode Screen ด้วย Web Crypto API SHA-256 Hash ป้องกันการเข้าถึงโดยไม่ได้รับอนุญาต | ✅ สำเร็จ |
| **KR 3: 5-Step Intuitive Flow** | ลำดับขั้นตอนการแจ้งเรื่อง 5 สเต็ป: รายละเอียด $\rightarrow$ แชร์ตำแหน่ง $\rightarrow$ ภาพถ่าย 1-3 รูป $\rightarrow$ เลือกประเภท $\rightarrow$ ตรวจสอบและออก Ticket | ✅ สำเร็จ |
| **KR 4: Dual Location Input** | รองรับการระบุตำแหน่ง 2 โหมด: ดึง GPS ปัจจุบันอัตโนมัติบนแผนที่ Leaflet และวางลิงก์ Google Maps / พิกัด Lat-Long | ✅ สำเร็จ |
| **KR 5: 13-Category Search** | หมวดหมู่ 13 รายการแบบ Single Column พร้อมช่องค้นหา Real-time Filter ค้นหาได้ทั้งภาษาไทยและอังกฤษ | ✅ สำเร็จ |
| **KR 6: iPhone SE Compatibility** | รวม Navigation Bar ในขนาด 44px, รองรับ Virtual Keyboard Resizing และโครงสร้าง No-scroll Layout | ✅ สำเร็จ |

---

## 🏗️ 3. Architecture & Technical Framework (กรอบทางเทคนิค)

### 3.1 เทคโนโลยีหลัก (Core Tech Stack)
- **Frontend Core:** Vanilla HTML5 Semantic Elements + Vanilla JavaScript (ES6+ Classes)
- **Styling Architecture:** Modern Vanilla CSS with CSS Custom Properties (Tokens) & Flexbox/Grid
- **Map & Geolocation:** Leaflet.js v1.9.4 (OpenStreetMap Tiles) + HTML5 Geolocation API
- **Cryptography:** Web Crypto API (`crypto.subtle.digest("SHA-256", ...)`)
- **LINE Integration:** Official LINE LIFF SDK v2 (`@line/liff`) Mock Simulation

### 3.2 State Management Pattern
ระบบใช้สถาปัตยกรรมคลาส `AmataLiffApp` เป็นศูนย์กลางในการจัดการ State และ Data Model:
```javascript
formData: {
  description: string,
  location: { lat, lng, address, estateTh, estateEn, googleMapsUrl },
  photos: Array<{ id, dataUrl, name }>,
  category: { id, titleTh, titleEn, badgeColor, icon, examplesTh, examplesEn },
  reporter: { name, phone, company, userType },
  ticket: { id, createdAtTh, createdAtEn, statusTh, statusEn }
}
```

### 3.3 Design & Ergonomics Framework
- **Thumb Zone Design:** จัดวาง Action Buttons (`ถัดไป`, `ย้อนกลับ`, `ยืนยัน`) ไว้ในโซนล่างสุดของหน้าจอที่นิ้วโป้งเอื้อมถึงง่าย
- **Dual Navigation:** มีปุ่มย้อนกลับทั้งใน Unified Header (มาตรฐาน iOS) และ Bottom Bar (มาตรฐาน Thumb Zone)
- **Zero-clutter Viewport:** ตัด Progress Stepper แนวนอนออก แล้วรวม Indicator ขั้นตอนเข้ากับ Navigation Bar เพื่อคืนพื้นที่แนวตั้งกว่า 50px
