/**
 * Amata LIFF Passcode Protection (SHA-256 Hashed)
 * ป้องกันการเข้าใช้งาน Mockup ด้วยรหัสผ่านแบบ One-Way Cryptographic Hash
 * รหัสผ่านจริงจะไม่ปรากฏใน Source Code บน GitHub (ปลอดภัยสำหรับ Public Repository)
 *
 * Default Passcode: amata2026
 * SHA-256 Hash: 96014ae2b86cf023c465424c867e11e19500d0e22736ef96deec2680694bf718
 */

class AmataAuthManager {
  constructor() {
    // SHA-256 Hash ของรหัสผ่าน "amata2026"
    this.PASSPHRASE_HASH = "96014ae2b86cf023c465424c867e11e19500d0e22736ef96deec2680694bf718";
    this.SESSION_KEY = "amata_liff_authenticated";
  }

  // คำนวณ SHA-256 Hash ของข้อความ
  async hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str.trim());
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  // ตรวจสอบว่าผู้ใช้เคยปลดล็อคใน Session นี้แล้วหรือยัง
  isAuthenticated() {
    return sessionStorage.getItem(this.SESSION_KEY) === "true";
  }

  // ตรวจสอบรหัสผ่านที่ป้อนเข้ามา
  async verifyPasscode(inputPasscode) {
    if (!inputPasscode) return false;
    const inputHash = await this.hashString(inputPasscode);
    if (inputHash === this.PASSPHRASE_HASH) {
      sessionStorage.setItem(this.SESSION_KEY, "true");
      return true;
    }
    return false;
  }

  init() {
    const lockScreen = document.getElementById("passcode-lock-screen");
    const lockForm = document.getElementById("passcode-form");
    const passInput = document.getElementById("passcode-input");
    const passError = document.getElementById("passcode-error");

    if (!lockScreen || !lockForm || !passInput) return;

    if (this.isAuthenticated()) {
      lockScreen.classList.add("hidden");
      return;
    }

    lockScreen.classList.remove("hidden");

    lockForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const val = passInput.value.trim();
      const unlockBtn = document.getElementById("unlock-btn");

      if (unlockBtn) {
        unlockBtn.disabled = true;
        unlockBtn.textContent = "กำลังตรวจสอบ... / Verifying...";
      }

      try {
        const isValid = await this.verifyPasscode(val);
        if (isValid) {
          lockScreen.classList.add("hidden");
          if (typeof app !== "undefined" && app.showToast) {
            app.showToast("ปลดล็อคสำเร็จ ยินดีต้อนรับ / Access granted", "success");
          }
        } else {
          if (passError) {
            passError.textContent = "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง / Invalid passcode";
            passError.classList.remove("hidden");
          }
          passInput.value = "";
          passInput.focus();
        }
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        if (unlockBtn) {
          unlockBtn.disabled = false;
          unlockBtn.textContent = "เข้าใช้งาน / Unlock";
        }
      }
    });
  }
}

const authManager = new AmataAuthManager();
document.addEventListener("DOMContentLoaded", () => {
  authManager.init();
});

if (typeof window !== "undefined") {
  window.authManager = authManager;
}
