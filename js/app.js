/**
 * Amata LINE LIFF Issue Reporting Main Application (WCAG 2.1 / 2.2 AA Compliant)
 * Unified 44px Header, Single-Column Category with Search, Enhanced Review Cards, Dual Back Navigation
 */

class AmataLiffApp {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 5;
    this.maxPhotos = 3;
    this.locationMode = "gps"; // "gps" or "link"
    this.categoryFilter = "";
    this.mapManager = new AmataMapManager();

    this.formData = {
      description: "",
      location: {
        lat: 13.4183,
        lng: 101.0078,
        address: "นิคมอุตสาหกรรมอมตะซิตี้ ชลบุรี / Amata City Chonburi",
        estateTh: "อมตะซิตี้ ชลบุรี",
        estateEn: "Amata City Chonburi",
        googleMapsUrl: ""
      },
      photos: [],
      category: null,
      reporter: {
        name: "คุณสมชาย รักษาดี",
        phone: "081-234-5678",
        company: "บริษัท อมตะ คอร์ปอเรชัน จำกัด (มหาชน)",
        userType: "บริษัท / Company"
      },
      ticket: null
    };

    this.isSubmitting = false;
  }

  init() {
    this.initLiffSdk();
    this.renderCategories();
    this.bindEvents();
    this.updateStepView();
  }

  initLiffSdk() {
    if (typeof liff !== "undefined") {
      liff.init({ liffId: "mock-liff-id" })
        .then(() => {
          if (liff.isLoggedIn()) {
            liff.getProfile().then(profile => {
              if (profile && profile.displayName) {
                this.formData.reporter.name = profile.displayName;
              }
            });
          }
        })
        .catch(() => {
          console.log("Running in LIFF standalone/mock mode");
        });
    }
  }

  renderCategories() {
    const list = document.getElementById("category-list-single");
    if (!list || typeof ISSUE_CATEGORIES === "undefined") return;

    const query = this.categoryFilter.trim().toLowerCase();
    const filtered = ISSUE_CATEGORIES.filter(cat => {
      if (!query) return true;
      return (
        cat.titleTh.toLowerCase().includes(query) ||
        cat.titleEn.toLowerCase().includes(query) ||
        (cat.examplesTh && cat.examplesTh.toLowerCase().includes(query)) ||
        (cat.examplesEn && cat.examplesEn.toLowerCase().includes(query))
      );
    });

    if (filtered.length === 0) {
      list.innerHTML = `<div class="no-results-msg">ไม่พบหมวดหมู่ที่ค้นหา / No category found</div>`;
      return;
    }

    list.innerHTML = filtered.map((cat) => {
      const isSelected = this.formData.category && this.formData.category.id === cat.id;
      return `
        <button type="button" class="category-list-item ${isSelected ? 'active' : ''}" data-cat-id="${cat.id}" id="cat-btn-${cat.id}" role="radio" aria-checked="${isSelected ? 'true' : 'false'}" aria-label="${cat.titleTh} / ${cat.titleEn}">
          <div class="category-item-icon" style="color: ${cat.badgeColor}; background: ${cat.badgeColor}18;" aria-hidden="true">
            ${cat.icon}
          </div>
          <div class="category-item-content">
            <div class="category-item-header">
              <span class="category-item-title-th">${cat.titleTh}</span>
              <span class="category-item-title-en">/ ${cat.titleEn}</span>
            </div>
            <div class="category-item-examples">${cat.examplesTh}</div>
          </div>
          <div class="category-item-radio" aria-hidden="true">
            ${isSelected ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
          </div>
        </button>
      `;
    }).join("");

    list.querySelectorAll(".category-list-item").forEach(item => {
      item.addEventListener("click", () => {
        const catId = item.getAttribute("data-cat-id");
        this.selectCategory(catId);
      });
    });
  }

  selectCategory(catId) {
    const category = ISSUE_CATEGORIES.find(c => c.id === catId);
    if (!category) return;

    this.formData.category = category;
    this.renderCategories();

    const nextBtn = document.getElementById("step4-next-btn");
    if (nextBtn) nextBtn.disabled = false;
  }

  bindEvents() {
    // Header Back Button
    document.getElementById("header-back-btn")?.addEventListener("click", () => {
      if (this.currentStep > 1) {
        this.goToStep(this.currentStep - 1);
      }
    });

    // Step 1 -> Step 2
    document.getElementById("step1-next-btn")?.addEventListener("click", () => {
      const desc = this.formData.description.trim();
      if (!desc) {
        this.showToast("กรุณากรอกรายละเอียดเรื่องร้องเรียน / Please enter details", "warning");
        document.getElementById("description-input")?.focus();
        return;
      }
      if (desc.length < 5) {
        this.showToast("กรุณากรอกรายละเอียดอย่างน้อย 5 ตัวอักษร / Min 5 chars", "warning");
        document.getElementById("description-input")?.focus();
        return;
      }
      this.goToStep(2);
    });

    // Step 2 Back & Next
    document.getElementById("step2-back-btn")?.addEventListener("click", () => this.goToStep(1));
    document.getElementById("step2-next-btn")?.addEventListener("click", () => {
      if (this.locationMode === "link" && !this.formData.location.googleMapsUrl) {
        const val = document.getElementById("gmaps-input")?.value.trim();
        if (val) {
          const res = this.mapManager.parseGoogleMapsUrl(val);
          if (res.success) {
            this.formData.location.googleMapsUrl = val;
          }
        }
      }
      this.goToStep(3);
    });

    // Location Mode Tabs (GPS vs Link)
    const tabGps = document.getElementById("tab-mode-gps");
    const tabLink = document.getElementById("tab-mode-link");
    const viewGps = document.getElementById("view-mode-gps");
    const viewLink = document.getElementById("view-mode-link");

    if (tabGps && tabLink) {
      tabGps.addEventListener("click", () => {
        this.locationMode = "gps";
        tabGps.classList.add("active");
        tabGps.setAttribute("aria-selected", "true");
        tabLink.classList.remove("active");
        tabLink.setAttribute("aria-selected", "false");

        viewGps?.classList.remove("hidden");
        viewLink?.classList.add("hidden");
        this.mapManager.invalidateSize();
      });

      tabLink.addEventListener("click", () => {
        this.locationMode = "link";
        tabLink.classList.add("active");
        tabLink.setAttribute("aria-selected", "true");
        tabGps.classList.remove("active");
        tabGps.setAttribute("aria-selected", "false");

        viewLink?.classList.remove("hidden");
        viewGps?.classList.add("hidden");
        document.getElementById("gmaps-input")?.focus();
      });
    }

    // Step 3 Back & Next
    document.getElementById("step3-back-btn")?.addEventListener("click", () => this.goToStep(2));
    document.getElementById("step3-next-btn")?.addEventListener("click", () => this.goToStep(4));

    // Step 4 Search Input
    document.getElementById("category-search-input")?.addEventListener("input", (e) => {
      this.categoryFilter = e.target.value;
      this.renderCategories();
    });

    // Step 4 Back & Next
    document.getElementById("step4-back-btn")?.addEventListener("click", () => this.goToStep(3));
    document.getElementById("step4-next-btn")?.addEventListener("click", () => {
      if (!this.formData.category) {
        this.showToast("กรุณาเลือกประเภทเรื่องร้องเรียน / Select a category", "warning");
        return;
      }
      this.renderReviewSummary();
      this.goToStep(5);
    });

    // Step 5 Back & Submit
    document.getElementById("step5-back-btn")?.addEventListener("click", () => this.goToStep(4));
    document.getElementById("step5-submit-btn")?.addEventListener("click", () => this.submitReport());

    // Presets with ARIA pressed
    document.querySelectorAll(".preset-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const preset = btn.getAttribute("data-preset");
        document.querySelectorAll(".preset-btn").forEach(b => {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
        this.mapManager.goToPreset(preset);
      });
    });

    // GPS Button
    const gpsBtn = document.getElementById("gps-btn");
    if (gpsBtn) {
      gpsBtn.addEventListener("click", async () => {
        gpsBtn.classList.add("loading");
        gpsBtn.innerHTML = `
          <svg class="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
          ...
        `;
        try {
          await this.mapManager.getCurrentLocation();
          this.showToast("ดึงตำแหน่ง GPS สำเร็จ / GPS retrieved", "success");
        } catch (err) {
          this.showToast(err.message, "error");
        } finally {
          gpsBtn.classList.remove("loading");
          gpsBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="12 8 8 12 12 16 16 12 12 8"/></svg>
            <span>GPS</span>
          `;
        }
      });
    }

    // Google Maps Input
    const gmapsInput = document.getElementById("gmaps-input");
    const gmapsApplyBtn = document.getElementById("gmaps-apply-btn");
    const gmapsResolvedBox = document.getElementById("gmaps-resolved-box");
    const gmapsResolvedText = document.getElementById("gmaps-resolved-text");

    if (gmapsApplyBtn && gmapsInput) {
      gmapsApplyBtn.addEventListener("click", () => {
        const val = gmapsInput.value.trim();
        if (!val) {
          this.showToast("กรุณาวางลิงก์ Google Maps หรือพิกัด / Enter link or coords", "warning");
          return;
        }
        const result = this.mapManager.parseGoogleMapsUrl(val);
        if (result.success) {
          this.showToast(`แปลงพิกัด ${result.lat}, ${result.lng} สำเร็จ / Resolved`, "success");
          this.formData.location.googleMapsUrl = val;

          if (gmapsResolvedBox && gmapsResolvedText) {
            gmapsResolvedText.textContent = `${this.formData.location.estateTh} (${result.lat}, ${result.lng})`;
            gmapsResolvedBox.classList.remove("hidden");
          }
        } else {
          this.showToast(result.message, "error");
          if (gmapsResolvedBox) gmapsResolvedBox.classList.add("hidden");
        }
      });

      gmapsInput.addEventListener("paste", () => {
        setTimeout(() => gmapsApplyBtn.click(), 100);
      });
      
      gmapsInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          gmapsApplyBtn.click();
        }
      });
    }

    // Map location listener
    this.mapManager.onLocationChange = (loc) => {
      this.formData.location.lat = loc.lat;
      this.formData.location.lng = loc.lng;
      this.formData.location.address = loc.address;
      this.formData.location.estateTh = loc.estateTh;
      this.formData.location.estateEn = loc.estateEn;

      const locDisplay = document.getElementById("current-location-text");
      if (locDisplay) {
        locDisplay.textContent = `${loc.estateTh} (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`;
      }
    };

    // Photos (Max 3 photos)
    const photoInput = document.getElementById("photo-input");
    const uploadTrigger = document.getElementById("upload-trigger-btn");

    if (uploadTrigger && photoInput) {
      uploadTrigger.addEventListener("click", () => photoInput.click());
      uploadTrigger.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          photoInput.click();
        }
      });

      photoInput.addEventListener("change", (e) => {
        this.handlePhotoFiles(e.target.files);
        photoInput.value = "";
      });
    }

    // Description text input
    document.getElementById("description-input")?.addEventListener("input", (e) => {
      this.formData.description = e.target.value;
      const countEl = document.getElementById("char-count");
      if (countEl) countEl.textContent = `${e.target.value.length}/500`;
    });

    // Success Screen Actions
    document.getElementById("close-liff-btn")?.addEventListener("click", () => this.closeLiffWindow());
    document.getElementById("new-issue-btn")?.addEventListener("click", () => this.resetForm());
    document.getElementById("header-close-btn")?.addEventListener("click", () => this.closeLiffWindow());
  }

  handlePhotoFiles(files) {
    if (!files || files.length === 0) return;

    const remainingSlots = this.maxPhotos - this.formData.photos.length;
    if (remainingSlots <= 0) {
      this.showToast(`แนบรูปภาพได้สูงสุด ${this.maxPhotos} รูป / Max ${this.maxPhotos} photos`, "warning");
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      if (!file.type.startsWith("image/")) {
        this.showToast(`ไฟล์ไม่ใช่รูปภาพ / Invalid image`, "error");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        this.showToast(`รูปภาพใหญ่เกิน 10MB / Exceeds 10MB`, "warning");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const photoObj = {
          id: "photo_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
          dataUrl: e.target.result,
          name: file.name
        };
        this.formData.photos.push(photoObj);
        this.renderPhotoGallery();
      };
      reader.readAsDataURL(file);
    });
  }

  renderPhotoGallery() {
    const gallery = document.getElementById("photo-gallery");
    const uploadTrigger = document.getElementById("upload-trigger-btn");
    const photoCountBadge = document.getElementById("photo-count-badge");

    if (!gallery) return;

    if (photoCountBadge) {
      photoCountBadge.textContent = `${this.formData.photos.length}/${this.maxPhotos}`;
    }

    gallery.innerHTML = this.formData.photos.map((photo, idx) => `
      <div class="photo-thumbnail-card" id="${photo.id}">
        <img src="${photo.dataUrl}" alt="Attached ${idx + 1}" class="photo-img" />
        <button type="button" class="photo-delete-btn" onclick="app.removePhoto('${photo.id}')" aria-label="ลบรูป / Delete" title="ลบรูป">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div class="photo-badge" aria-hidden="true">#${idx + 1}</div>
      </div>
    `).join("");

    if (uploadTrigger) {
      uploadTrigger.style.display = this.formData.photos.length >= this.maxPhotos ? "none" : "flex";
    }
  }

  removePhoto(photoId) {
    this.formData.photos = this.formData.photos.filter(p => p.id !== photoId);
    this.renderPhotoGallery();
    this.showToast("ลบรูปภาพเรียบร้อย / Deleted", "info");
  }

  renderReviewSummary() {
    const cat = this.formData.category;
    const loc = this.formData.location;

    // 1. หมวดหมู่ & รายละเอียด
    const catBadge = document.getElementById("review-category-badge");
    if (catBadge && cat) {
      catBadge.innerHTML = `
        <div class="review-cat-tag">
          <div style="color: ${cat.badgeColor};" aria-hidden="true">${cat.icon}</div>
          <div>
            <strong class="text-xs text-gray-900">${cat.titleTh}</strong>
            <span class="text-xxs text-gray-600">(${cat.titleEn})</span>
          </div>
        </div>
      `;
    }

    const descText = document.getElementById("review-description-text");
    if (descText) {
      descText.textContent = this.formData.description;
    }

    // 2. สถานที่
    const locBox = document.getElementById("review-location-box");
    if (locBox) {
      const gmapsLink = `https://www.google.com/maps?q=${loc.lat},${loc.lng}`;
      locBox.innerHTML = `
        <div class="text-xs font-bold text-gray-900">${loc.estateTh}</div>
        <div class="text-xxs text-gray-600">พิกัด: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}</div>
        <a href="${gmapsLink}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xxs text-emerald-800 font-bold mt-1 hover:underline">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          เปิดแผนที่ Google Maps
        </a>
      `;
    }

    // 3. รูปภาพ (1 - 3 รูป)
    const photosBox = document.getElementById("review-photos-box");
    if (photosBox) {
      if (this.formData.photos.length > 0) {
        photosBox.innerHTML = `
          <div class="review-photo-grid">
            ${this.formData.photos.map((p, idx) => `
              <img src="${p.dataUrl}" alt="Attached preview ${idx + 1}" class="review-photo-img" />
            `).join("")}
          </div>
        `;
      } else {
        photosBox.innerHTML = `<span class="text-xxs text-gray-500">ไม่ได้แนบรูปภาพ / No photos attached</span>`;
      }
    }

    // 4. ข้อมูลผู้แจ้ง (Read-only Profile)
    const repBox = document.getElementById("review-reporter-box");
    if (repBox) {
      const rep = this.formData.reporter;
      repBox.innerHTML = `
        <div class="text-xs font-bold text-gray-900">${this.escapeHtml(rep.name)}</div>
        <div class="text-xxs text-gray-600">${this.escapeHtml(rep.company)} • ${this.escapeHtml(rep.phone)}</div>
      `;
    }
  }

  submitReport() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    const submitBtn = document.getElementById("step5-submit-btn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
        กำลังบันทึก...
      `;
    }

    setTimeout(() => {
      const randomNum = Math.floor(100 + Math.random() * 900);
      const now = new Date();
      const ticketId = `#AM-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${randomNum}`;

      this.formData.ticket = {
        id: ticketId,
        createdAtTh: now.toLocaleString("th-TH", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        createdAtEn: now.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        statusTh: "รอรับเรื่องร้องเรียน",
        statusEn: "Pending"
      };

      this.renderSuccessScreen();
      this.goToSuccess();
      this.isSubmitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
          <span>ยืนยันส่งเรื่อง <span class="sub-en-btn">/ Submit</span></span>
        `;
      }
    }, 900);
  }

  renderSuccessScreen() {
    const t = this.formData.ticket;
    const cat = this.formData.category;
    const loc = this.formData.location;

    document.getElementById("ticket-id-display").textContent = t.id;
    document.getElementById("ticket-date-display").textContent = `${t.createdAtTh}`;
    document.getElementById("ticket-category-display").textContent = cat ? `${cat.titleTh}` : "-";
    document.getElementById("ticket-desc-display").textContent = this.formData.description;
    document.getElementById("ticket-location-display").textContent = `${loc.estateTh} (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`;

    const ticketPhoto = document.getElementById("ticket-photo-display");
    if (ticketPhoto) {
      if (this.formData.photos.length > 0) {
        ticketPhoto.innerHTML = `
          <img src="${this.formData.photos[0].dataUrl}" alt="Attached incident photo" class="w-full h-28 object-cover rounded border border-gray-200" />
          ${this.formData.photos.length > 1 ? `<div class="text-xxs text-gray-600 mt-0.5 text-right">+ อีก ${this.formData.photos.length - 1} รูป</div>` : ""}
        `;
        ticketPhoto.classList.remove("hidden");
      } else {
        ticketPhoto.classList.add("hidden");
      }
    }
  }

  goToStep(stepNumber) {
    this.currentStep = stepNumber;
    this.updateStepView();

    if (stepNumber === 2) {
      setTimeout(() => {
        this.mapManager.init("map-container");
        this.mapManager.invalidateSize();
      }, 150);
    }
  }

  goToSuccess() {
    document.querySelectorAll(".step-section").forEach(s => s.classList.add("hidden"));
    document.getElementById("success-screen")?.classList.remove("hidden");
    
    const backBtn = document.getElementById("header-back-btn");
    if (backBtn) backBtn.classList.add("hidden");

    const badge = document.getElementById("header-step-badge");
    if (badge) badge.textContent = "สำเร็จ / Success";

    const title = document.getElementById("header-step-title");
    if (title) title.textContent = "ผลการแจ้งเรื่อง / Status";
  }

  updateStepView() {
    for (let i = 1; i <= this.totalSteps; i++) {
      const el = document.getElementById(`step-${i}`);
      if (el) {
        el.classList.toggle("hidden", i !== this.currentStep);
      }
    }

    document.getElementById("success-screen")?.classList.add("hidden");

    // Header Back button visibility
    const backBtn = document.getElementById("header-back-btn");
    if (backBtn) {
      backBtn.classList.toggle("hidden", this.currentStep <= 1);
    }

    // Header step badge & title
    const stepTitles = {
      1: { badge: "1/5", title: "รายละเอียดเรื่องแจ้ง" },
      2: { badge: "2/5", title: "แชร์ตำแหน่งที่เกิดเหตุ" },
      3: { badge: "3/5", title: "ภาพถ่ายประกอบ (1-3)" },
      4: { badge: "4/5", title: "เลือกประเภทเรื่อง" },
      5: { badge: "5/5", title: "ตรวจสอบและยืนยัน" }
    };

    const cur = stepTitles[this.currentStep];
    if (cur) {
      const badgeEl = document.getElementById("header-step-badge");
      const titleEl = document.getElementById("header-step-title");
      if (badgeEl) badgeEl.textContent = cur.badge;
      if (titleEl) titleEl.textContent = cur.title;
    }
  }

  closeLiffWindow() {
    if (typeof liff !== "undefined" && liff.isInClient && liff.isInClient()) {
      liff.closeWindow();
    } else {
      this.showToast("จำลองคำสั่ง liff.closeWindow() (ปิดหน้าต่างใน LINE จริง)", "info");
    }
  }

  resetForm() {
    this.formData.description = "";
    this.formData.photos = [];
    this.formData.category = null;
    this.formData.ticket = null;
    this.categoryFilter = "";

    const descInput = document.getElementById("description-input");
    if (descInput) descInput.value = "";

    const charCount = document.getElementById("char-count");
    if (charCount) charCount.textContent = "0/500";

    const gmapsInput = document.getElementById("gmaps-input");
    if (gmapsInput) gmapsInput.value = "";

    const gmapsResolvedBox = document.getElementById("gmaps-resolved-box");
    if (gmapsResolvedBox) gmapsResolvedBox.classList.add("hidden");

    const searchInput = document.getElementById("category-search-input");
    if (searchInput) searchInput.value = "";

    this.renderPhotoGallery();
    this.renderCategories();

    const nextBtn = document.getElementById("step4-next-btn");
    if (nextBtn) nextBtn.disabled = true;

    document.getElementById("tab-mode-gps")?.click();

    this.goToStep(1);
    this.showToast("รีเซ็ตฟอร์มเรียบร้อย", "info");
  }

  showToast(message, type = "info") {
    const toast = document.getElementById("app-toast");
    if (!toast) return;

    toast.className = `app-toast show ${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        ${this.getToastIcon(type)}
        <span>${message}</span>
      </div>
    `;

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.className = "app-toast";
    }, 3000);
  }

  getToastIcon(type) {
    if (type === "success") {
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    }
    if (type === "error") {
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    }
    if (type === "warning") {
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.5" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    }
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }

  escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new AmataLiffApp();
  app.init();
});
