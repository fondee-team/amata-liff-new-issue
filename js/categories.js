/**
 * Amata Issue Categories Configuration
 * อ้างอิงจากคู่มือระบบรับแจ้งเรื่องร้องเรียน Amata Manual - LINE (หน้า 12-13)
 * รองรับภาษาไทย (หลัก) และภาษาอังกฤษ (รอง)
 */

const ISSUE_CATEGORIES = [
  {
    id: "traffic",
    titleTh: "จราจร/ความปลอดภัย",
    titleEn: "Traffic & Safety",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14 12-8.5 8.5a2.12 2.12 0 1 1-3-3L11 9"/><path d="M12 18v4"/><path d="M8 22h8"/><path d="M14 6a2 2 0 1 0 4 0 2 2 0 1 0-4 0Z"/><path d="M18 2v4"/><path d="m19 13 3-3"/></svg>`,
    badgeColor: "#10B981",
    examplesTh: "ไฟจราจรเสีย, กีดขวางเส้นทาง, สัญญาณเตือนชำรุด, อุบัติเหตุ",
    examplesEn: "Traffic lights, road blockages, warning signs, accidents"
  },
  {
    id: "maintenance",
    titleTh: "พื้นที่ส่วนกลาง (ถนน, ไฟทาง, คลอง, ความสะอาด)",
    titleEn: "Infra & Utilities (Roads, Streetlights, Canals, Cleanliness)",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    badgeColor: "#F59E0B",
    examplesTh: "ถนนชำรุดเป็นหลุม, ฝาท่อระบายน้ำแตก, ทางเท้าเสียหาย",
    examplesEn: "Potholes, broken manhole covers, damaged sidewalk"
  },
  {
    id: "green_area",
    titleTh: "พื้นที่สีเขียว",
    titleEn: "Green Area",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10v12"/><path d="M12 6a4 4 0 0 1 4 4c0 3-4 6-4 6s-4-3-4-6a4 4 0 0 1 4-4Z"/><path d="M17 14c2.5-1 4-3 4-5a4 4 0 0 0-7-2.6"/><path d="M7 14c-2.5-1-4-3-4-5a4 4 0 0 1 7-2.6"/></svg>`,
    badgeColor: "#059669",
    examplesTh: "กิ่งไม้บดบังทัศนวิสัย, ต้นไม้โค่นล้ม, หญ้ารกริมทาง",
    examplesEn: "Overgrown branches, fallen trees, tall grass"
  },
  {
    id: "raw_water",
    titleTh: "น้ำดิบ",
    titleEn: "Raw water",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`,
    badgeColor: "#0284C7",
    examplesTh: "ท่อน้ำดิบรั่วซึม, แรงดันน้ำผิดปกติ, ปริมาณน้ำไม่เพียงพอ",
    examplesEn: "Raw water pipe leakage, abnormal water pressure"
  },
  {
    id: "treated_water",
    titleTh: "น้ำประปา",
    titleEn: "Tap water",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
    badgeColor: "#2563EB",
    examplesTh: "น้ำประปาไม่ไหล, ท่อประปาแตก, น้ำมีตะกอน/ขุ่น",
    examplesEn: "Water outage, broken pipe, murky / cloudy water"
  },
  {
    id: "waste_water",
    titleTh: "น้ำเสียจากโรงงาน",
    titleEn: "Wastewater from User",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/><path d="M9 15a3 3 0 0 0 6 0"/></svg>`,
    badgeColor: "#475569",
    examplesTh: "ท่อน้ำทิ้งอุดตัน, น้ำเสียล้นรางระบาย, กลิ่นเหม็นจากน้ำเสีย",
    examplesEn: "Blocked drainage, overflowing wastewater, odor"
  },
  {
    id: "pr_signage",
    titleTh: "สื่อสารองค์กร/ป้าย",
    titleEn: "PR & Signage",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>`,
    badgeColor: "#8B5CF6",
    examplesTh: "ป้ายบอกทางชำรุด, ป้ายโฆษณาบังสายตา, ป้ายเฟสไม่ชัดเจน",
    examplesEn: "Damaged direction signs, billboard obstructions"
  },
  {
    id: "waste_mgmt",
    titleTh: "การจัดการขยะภายในโรงงานเท่านั้น",
    titleEn: "Waste Management in factory only",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
    badgeColor: "#D97706",
    examplesTh: "ขยะล้นถัง, จุดทิ้งขยะตกค้าง, ลักลอบทิ้งขยะไม่ถูกต้อง",
    examplesEn: "Overflowing trash bins, illegal waste dumping"
  },
  {
    id: "elec_internet",
    titleTh: "ไฟฟ้า/โทรศัพท์/อินเตอร์เน็ต",
    titleEn: "Elec/Tel/Internet",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    badgeColor: "#EAB308",
    examplesTh: "ไฟฟ้าส่องสว่างดับ, สายสื่อสารห้อยระโยงระยาง, เสาไฟเอียง",
    examplesEn: "Street lights out, hanging cables, tilted utility pole"
  },
  {
    id: "community",
    titleTh: "ชุมชน",
    titleEn: "CSR",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    badgeColor: "#06B6D4",
    examplesTh: "ข้อร้องเรียนชุมชนรอบข้าง, กิจกรรมที่ส่งผลกระทบภายนอก",
    examplesEn: "Surrounding community complaints, external impacts"
  },
  {
    id: "construction",
    titleTh: "ผลกระทบจากการก่อสร้าง",
    titleEn: "Construction Impacts",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/></svg>`,
    badgeColor: "#F97316",
    examplesTh: "เศษดิน/ทรายบนถนน, เสียงดังเกินกำหนด, ฝุ่นละอองจากการก่อสร้าง",
    examplesEn: "Mud/dirt on roads, construction noise, dust dispersion"
  },
  {
    id: "environment",
    titleTh: "ปัญหาสิ่งแวดล้อม (มลพิษอากาศ (กลิ่น, ควัน, ฝุ่น) &เสียง",
    titleEn: "Environmental Impacts : Air (Odor, Smoke, Dust) & Noise Pollution",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    badgeColor: "#10B981",
    examplesTh: "กลิ่นสารเคมี, ควัน/มลพิษทางอากาศ, การทิ้งกากของเสียอันตราย",
    examplesEn: "Chemical odors, smoke/air pollution, hazardous waste"
  },
  {
    id: "others",
    titleTh: "อื่นๆ",
    titleEn: "Others",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`,
    badgeColor: "#64748B",
    examplesTh: "เรื่องอื่นๆ ที่ไม่อยู่ในหมวดหมู่นี้",
    examplesEn: "Other issues not listed above"
  }
];

if (typeof window !== "undefined") {
  window.ISSUE_CATEGORIES = ISSUE_CATEGORIES;
}
