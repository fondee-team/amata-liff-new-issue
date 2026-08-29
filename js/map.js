/**
 * Amata LIFF Map & Location Component (Bilingual TH / EN)
 * จัดการ Leaflet Interactive Map, Geolocation, และ Google Maps URL Parsing
 */

class AmataMapManager {
  constructor() {
    this.map = null;
    this.marker = null;
    this.currentLocation = {
      lat: 13.4183,
      lng: 101.0078,
      address: "นิคมอุตสาหกรรมอมตะซิตี้ ชลบุรี / Amata City Chonburi",
      estateTh: "อมตะซิตี้ ชลบุรี",
      estateEn: "Amata City Chonburi",
      googleMapsUrl: ""
    };

    this.presets = {
      chonburi: {
        lat: 13.4183,
        lng: 101.0078,
        nameTh: "อมตะซิตี้ ชลบุรี",
        nameEn: "Amata City Chonburi"
      },
      rayong: {
        lat: 12.9856,
        lng: 101.1278,
        nameTh: "อมตะซิตี้ ระยอง",
        nameEn: "Amata City Rayong"
      }
    };

    this.hasAutoDetectedGps = false;
    this.onLocationChange = null;
  }

  init(containerId = "map-container") {
    const container = document.getElementById(containerId);
    if (!container || this.map) return;

    // สร้าง Leaflet Map
    this.map = L.map(containerId, {
      center: [this.currentLocation.lat, this.currentLocation.lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    // Zoom Control
    L.control.zoom({ position: "bottomright" }).addTo(this.map);

    // Tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd"
    }).addTo(this.map);

    // Custom Marker Pin
    const customIcon = L.divIcon({
      className: "custom-map-pin",
      html: `
        <div class="pin-wrapper">
          <div class="pin-pulse"></div>
          <div class="pin-marker">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#0C382E" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="#10B981"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 36],
      popupAnchor: [0, -36]
    });

    // Marker
    this.marker = L.marker([this.currentLocation.lat, this.currentLocation.lng], {
      icon: customIcon,
      draggable: true,
      autoPan: true
    }).addTo(this.map);

    // Drag event
    this.marker.on("dragend", (e) => {
      const position = e.target.getLatLng();
      this.updatePosition(position.lat, position.lng);
    });

    // Click event
    this.map.on("click", (e) => {
      this.updatePosition(e.latlng.lat, e.latlng.lng);
    });

    this.updatePosition(this.currentLocation.lat, this.currentLocation.lng);

    // Default: พยายามดึง GPS ปัจจุบันของผู้ใช้อัตโนมัติเป็นค่าเริ่มต้น
    if (!this.hasAutoDetectedGps) {
      this.hasAutoDetectedGps = true;
      this.getCurrentLocation().catch(() => {
        // หากผู้ใช้ไม่อนุญาต ให้คงค่าพิกัดอมตะเริ่มต้นไว้
      });
    }
  }

  updatePosition(lat, lng) {
    this.currentLocation.lat = parseFloat(lat.toFixed(6));
    this.currentLocation.lng = parseFloat(lng.toFixed(6));

    if (this.marker) {
      this.marker.setLatLng([this.currentLocation.lat, this.currentLocation.lng]);
    }
    if (this.map) {
      this.map.panTo([this.currentLocation.lat, this.currentLocation.lng]);
    }

    this.resolveEstateArea(this.currentLocation.lat, this.currentLocation.lng);

    if (this.onLocationChange) {
      this.onLocationChange(this.currentLocation);
    }
  }

  resolveEstateArea(lat, lng) {
    if (lat > 13.2) {
      this.currentLocation.estateTh = "อมตะซิตี้ ชลบุรี";
      this.currentLocation.estateEn = "Amata City Chonburi";
      this.currentLocation.address = `นิคมอุตสาหกรรมอมตะซิตี้ ชลบุรี / Amata City Chonburi (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`;
    } else {
      this.currentLocation.estateTh = "อมตะซิตี้ ระยอง";
      this.currentLocation.estateEn = "Amata City Rayong";
      this.currentLocation.address = `นิคมอุตสาหกรรมอมตะซิตี้ ระยอง / Amata City Rayong (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`;
    }
  }

  goToPreset(key) {
    if (this.presets[key]) {
      const p = this.presets[key];
      this.updatePosition(p.lat, p.lng);
      if (this.map) this.map.setZoom(15);
    }
  }

  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("เบราว์เซอร์ไม่รองรับการระบุตำแหน่ง GPS / Browser does not support Geolocation"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.updatePosition(lat, lng);
          if (this.map) this.map.setZoom(16);
          resolve({ lat, lng });
        },
        (error) => {
          let msg = "ไม่สามารถเข้าถึงตำแหน่ง GPS ได้ / Unable to retrieve GPS location";
          if (error.code === error.PERMISSION_DENIED) {
            msg = "กรุณาอนุญาตการเข้าถึงตำแหน่งที่ตั้ง / Please allow location permission";
          }
          reject(new Error(msg));
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    });
  }

  parseGoogleMapsUrl(input) {
    if (!input || typeof input !== "string") {
      return { success: false, message: "กรุณาระบุลิงก์หรือพิกัด / Please enter link or coordinates" };
    }

    const trimmed = input.trim();

    // Direct Coords (13.4183, 101.0078)
    const directCoordsMatch = trimmed.match(/^(-?\d{1,2}\.\d+)[,\s]+(-?\d{1,3}\.\d+)$/);
    if (directCoordsMatch) {
      const lat = parseFloat(directCoordsMatch[1]);
      const lng = parseFloat(directCoordsMatch[2]);
      if (this.isValidLatLng(lat, lng)) {
        this.updatePosition(lat, lng);
        if (this.map) this.map.setZoom(16);
        return { success: true, lat, lng, source: "coordinates" };
      }
    }

    // @lat,lng
    const atMatch = trimmed.match(/@(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/);
    if (atMatch) {
      const lat = parseFloat(atMatch[1]);
      const lng = parseFloat(atMatch[2]);
      if (this.isValidLatLng(lat, lng)) {
        this.updatePosition(lat, lng);
        if (this.map) this.map.setZoom(16);
        return { success: true, lat, lng, source: "google_maps_at" };
      }
    }

    // query params ?q=lat,lng
    const queryMatch = trimmed.match(/[?&](?:q|query|ll|daddr|saddr)=(-?\d{1,2}\.\d+)[,%2C\s]+(-?\d{1,3}\.\d+)/i);
    if (queryMatch) {
      const lat = parseFloat(queryMatch[1]);
      const lng = parseFloat(queryMatch[2]);
      if (this.isValidLatLng(lat, lng)) {
        this.updatePosition(lat, lng);
        if (this.map) this.map.setZoom(16);
        return { success: true, lat, lng, source: "google_maps_query" };
      }
    }

    // place !3dLat!4dLng
    const placeMatch = trimmed.match(/!3d(-?\d{1,2}\.\d+)!4d(-?\d{1,3}\.\d+)/);
    if (placeMatch) {
      const lat = parseFloat(placeMatch[1]);
      const lng = parseFloat(placeMatch[2]);
      if (this.isValidLatLng(lat, lng)) {
        this.updatePosition(lat, lng);
        if (this.map) this.map.setZoom(16);
        return { success: true, lat, lng, source: "google_maps_place" };
      }
    }

    if (trimmed.includes("goo.gl") || trimmed.includes("maps.app.goo.gl")) {
      return {
        success: false,
        message: "ลิงก์ย่อนี้ไม่มีพิกัดตัวเลขใน URL โดยตรง กรุณาคัดลอกพิกัดตัวเลข (Lat, Long) หรือแตะปักหมุดบนแผนที่ได้เลยครับ / Short link does not contain direct coordinates. Please copy Lat,Long numbers or pin on the map."
      };
    }

    return {
      success: false,
      message: "ไม่พบข้อมูลพิกัดในลิงก์ กรุณาใส่ลิงก์ Google Maps หรือ พิกัด เช่น 13.4183, 101.0078 / Coordinates not found. Please provide valid Google Maps link or Lat, Long numbers."
    };
  }

  isValidLatLng(lat, lng) {
    return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }

  getGoogleMapsLink() {
    return `https://www.google.com/maps?q=${this.currentLocation.lat},${this.currentLocation.lng}`;
  }

  invalidateSize() {
    if (this.map) {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 200);
    }
  }
}

if (typeof window !== "undefined") {
  window.AmataMapManager = AmataMapManager;
}
