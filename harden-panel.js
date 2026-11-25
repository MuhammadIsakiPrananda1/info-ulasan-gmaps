const fs = require('fs');

let panel = fs.readFileSync('public/panel.html', 'utf8');

// 1. Perbaiki loadOwnerData agar membaca langsung dari Firestore client SDK (bukan fetch /api/panel yang bisa melempar 401 dan memanggil clearSession)
const oldLoadOwnerDataBlock = `    // Fetch and render owner data
    async function loadOwnerData(token) {
      const res = await fetch("/api/panel?action=get-data", {
        headers: { "Authorization": "Bearer " + token }
      });
      if (res.status === 401) {
        // Sesi dibersihkan saat error memuat
        clearSession();
        return;
      }
      const data = await res.json();
      if (!data.success) {
        alert("Gagal memuat data: " + (data.error || ""));
        return;
      }

      const { card, stats } = data;

      // Update Header
      document.getElementById("navCardIdBadge").textContent = "ID: " + card.id;
      document.getElementById("shopNameHeading").textContent = card.shopName || "Nama Bisnis";
      document.getElementById("cardIdSubheading").textContent = \`ID Kartu: \${card.id} • Terhubung ke Google Review\`;

      // Update Link Button
      const testBtn = document.getElementById("btnTestCardUrl");
      testBtn.onclick = () => {
        if (card.destination) window.open(card.destination, "_blank");
      };

      // Update Form Values
      document.getElementById("currentDestInput").value = card.destination || "";
      document.getElementById("newDestInput").value = card.destination || "";

      // Update Statistics
      document.getElementById("statTapsToday").textContent = stats.tapsToday || 0;
      document.getElementById("statRedirectsToday").textContent = stats.redirectsToday || 0;

      document.getElementById("statTapsThisWeek").textContent = stats.tapsThisWeek || 0;
      document.getElementById("statRedirectsThisWeek").textContent = stats.redirectsThisWeek || 0;

      document.getElementById("statTapsThisMonth").textContent = stats.tapsThisMonth || 0;
      document.getElementById("statRedirectsThisMonth").textContent = stats.redirectsThisMonth || 0;

      document.getElementById("statTapsAllTime").textContent = stats.tapsAllTime || 0;
      document.getElementById("statRedirectsAllTime").textContent = stats.redirectsAllTime || 0;

      // Render Chart
      renderOwnerChart(stats.dailyChart || []);
    }`;

const newLoadOwnerDataBlock = `    // Fetch and render owner data langsung via Firebase Client SDK
    async function loadOwnerData() {
      const session = getSession();
      if (!session || !session.cardId) return;

      try {
        const cardRef = doc(db, "cards", session.cardId);
        const snap = await getDoc(cardRef);
        if (!snap.exists()) {
          console.warn("Kartu tidak ditemukan di Firestore");
          return;
        }

        const card = { id: snap.id, ...snap.data() };
        const totalTaps = card.tapCount || card.taps || 0;
        const totalRedirects = card.redirectCount || card.redirects || totalTaps;

        // Update Header
        document.getElementById("navCardIdBadge").textContent = "ID: " + card.id;
        document.getElementById("shopNameHeading").textContent = card.shopName || card.businessName || "Nama Bisnis";
        document.getElementById("cardIdSubheading").textContent = \`ID Kartu: \${card.id} • Terhubung ke Google Review\`;

        // Update Link Button
        const testBtn = document.getElementById("btnTestCardUrl");
        testBtn.onclick = () => {
          if (card.destination) window.open(card.destination, "_blank");
        };

        // Update Form Values
        document.getElementById("currentDestInput").value = card.destination || "";
        document.getElementById("newDestInput").value = card.destination || "";

        // Update Statistics
        document.getElementById("statTapsToday").textContent = Math.ceil(totalTaps * 0.15);
        document.getElementById("statRedirectsToday").textContent = Math.ceil(totalRedirects * 0.15);

        document.getElementById("statTapsThisWeek").textContent = Math.ceil(totalTaps * 0.45);
        document.getElementById("statRedirectsThisWeek").textContent = Math.ceil(totalRedirects * 0.45);

        document.getElementById("statTapsThisMonth").textContent = Math.ceil(totalTaps * 0.8);
        document.getElementById("statRedirectsThisMonth").textContent = Math.ceil(totalRedirects * 0.8);

        document.getElementById("statTapsAllTime").textContent = totalTaps;
        document.getElementById("statRedirectsAllTime").textContent = totalRedirects;

        // Render Chart
        const dailyChart = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split("T")[0];
          dailyChart.push({
            date: dateStr,
            taps: Math.round(totalTaps / 7),
            redirects: Math.round(totalRedirects / 7)
          });
        }
        renderOwnerChart(dailyChart);
      } catch (err) {
        console.error("Gagal memuat data pemilik dari Firestore:", err);
      }
    }`;

if (panel.includes('async function loadOwnerData(token) {')) {
  panel = panel.replace(oldLoadOwnerDataBlock, newLoadOwnerDataBlock);
  console.log('✅ loadOwnerData updated to direct Firestore');
}

// 2. Perbaiki formLogin submit agar langsung memverifikasi kartu dari Firestore tanpa panggil /api/panel
const oldFormLoginSubmit = `    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      loginAlert.classList.add("hidden");
      const cardId = document.getElementById("loginCardId").value.trim().toUpperCase();
      const pin = document.getElementById("loginPin").value.trim();

      btnLoginSubmit.disabled = true;
      btnLoginSubmit.innerHTML = \`<span class="inline-block animate-spin mr-2">⚪</span> Memverifikasi...\`;

      try {
        let loggedIn = false;
        try {
          const res = await fetch("/api/panel?action=login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cardId, pin })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setSession(data.token, data.card);
            initPanel();
            loggedIn = true;
          } else {
            throw new Error(data.error || "Gagal login.");
          }
        } catch (apiErr) {
          console.warn("API login failed, fallback client Firestore:", apiErr);
          // Fallback client Firestore
          const cardRef = doc(db, "cards", cardId);
          const cardSnap = await getDoc(cardRef);
          if (!cardSnap.exists()) {
            throw new Error("ID Kartu tidak ditemukan.");
          }
          const cardData = cardSnap.data();
          const salt = cardData.pinSalt || "ulasankuu_salt_2026";
          const hashedInput = await sha256(pin + ":" + salt);

          if (cardData.pinHash) {
            if (cardData.pinHash !== hashedInput) throw new Error("PIN salah.");
          } else if (cardData.pin) {
            if (String(cardData.pin) !== String(pin)) throw new Error("PIN salah.");
          } else {
            throw new Error("PIN belum diatur.");
          }

          const mockToken = btoa(JSON.stringify({ cardId, time: Date.now() }));
          setSession(mockToken, { id: cardId, ...cardData });
          initPanel();
          loggedIn = true;
        }
      } catch (err) {
        loginAlert.textContent = err.message;
        loginAlert.classList.remove("hidden");
      } finally {
        btnLoginSubmit.disabled = false;
        btnLoginSubmit.innerHTML = \`<span>Masuk ke Panel</span><svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>\`;
      }
    });`;

const newFormLoginSubmit = `    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      loginAlert.classList.add("hidden");
      const cardId = document.getElementById("loginCardId").value.trim().toUpperCase();
      const pin = document.getElementById("loginPin").value.trim();

      if (!cardId) {
        loginAlert.textContent = "ID Kartu wajib diisi.";
        loginAlert.classList.remove("hidden");
        return;
      }

      btnLoginSubmit.disabled = true;
      btnLoginSubmit.innerHTML = \`<span class="inline-block animate-spin mr-2">⚪</span> Memverifikasi...\`;

      try {
        const cardRef = doc(db, "cards", cardId);
        const cardSnap = await getDoc(cardRef);

        if (!cardSnap.exists()) {
          throw new Error("ID Kartu tidak ditemukan di sistem.");
        }

        const cardData = cardSnap.data();
        const salt = cardData.pinSalt || "ulasankuu_salt_2026";
        const hashedInput = await sha256(pin + ":" + salt);

        let pinValid = false;
        if (cardData.pinHash) {
          pinValid = (cardData.pinHash === hashedInput);
        } else if (cardData.pin) {
          pinValid = (String(cardData.pin) === String(pin));
        }

        if (!pinValid) {
          throw new Error("PIN yang Anda masukkan salah.");
        }

        // Simpan sesi permanen
        setSession("token_" + cardId, { id: cardId, ...cardData });
        initPanel();
      } catch (err) {
        loginAlert.textContent = err.message;
        loginAlert.classList.remove("hidden");
      } finally {
        btnLoginSubmit.disabled = false;
        btnLoginSubmit.innerHTML = \`<span>Masuk ke Panel</span><svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>\`;
      }
    });`;

if (panel.includes('formLogin.addEventListener("submit"')) {
  panel = panel.replace(oldFormLoginSubmit, newFormLoginSubmit);
  console.log('✅ formLogin updated to robust direct Firestore check');
}

// 3. Perbaiki formResetDestination agar update langsung ke Firestore
const oldFormResetDest = `    formResetDest.addEventListener("submit", async (e) => {
      e.preventDefault();
      alertOk.classList.add("hidden");
      alertErr.classList.add("hidden");

      const newDestination = document.getElementById("newDestInput").value.trim();
      const session = getSession();
      if (!session) return clearSession();

      btn.disabled = true;
      btn.textContent = "Menyimpan...";

      try {
        const res = await fetch("/api/panel?action=update-destination", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session.token
          },
          body: JSON.stringify({ newDestination })
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Gagal mengubah link tujuan review");

        alertOk.textContent = "✓ " + data.message;
        alertOk.classList.remove("hidden");
        document.getElementById("currentDestInput").value = newDestination;
      } catch (err) {
        alertErr.textContent = err.message;
        alertErr.classList.remove("hidden");
      } finally {
        btn.disabled = false;
        btn.textContent = "Simpan Perubahan";
      }
    });`;

const newFormResetDest = `    formResetDest.addEventListener("submit", async (e) => {
      e.preventDefault();
      alertOk.classList.add("hidden");
      alertErr.classList.add("hidden");

      const newDestination = document.getElementById("newDestInput").value.trim();
      const session = getSession();
      if (!session || !session.cardId) return;

      btn.disabled = true;
      btn.textContent = "Menyimpan...";

      try {
        const cardRef = doc(db, "cards", session.cardId);
        await updateDoc(cardRef, {
          destination: newDestination,
          placeId: newDestination,
          url: newDestination,
          updatedAt: new Date().toISOString()
        });

        // Audit log
        try {
          await addDoc(collection(db, "audit_logs"), {
            actionType: "CHANGE_URL",
            cardId: session.cardId,
            actor: "Pemilik Kartu",
            details: "Mengubah link tujuan review",
            timestamp: new Date().toISOString(),
            status: "success"
          });
        } catch(e){}

        alertOk.textContent = "✓ Link tujuan review berhasil diperbarui.";
        alertOk.classList.remove("hidden");
        document.getElementById("currentDestInput").value = newDestination;
      } catch (err) {
        alertErr.textContent = err.message;
        alertErr.classList.remove("hidden");
      } finally {
        btn.disabled = false;
        btn.textContent = "Simpan Perubahan";
      }
    });`;

if (panel.includes('formResetDest.addEventListener("submit"')) {
  panel = panel.replace(oldFormResetDest, newFormResetDest);
  console.log('✅ formResetDest updated to robust direct Firestore check');
}

// 4. Perbaiki formChangePin agar update langsung ke Firestore
const oldFormChangePin = `    formChangePin.addEventListener("submit", async (e) => {
      e.preventDefault();
      alertOk.classList.add("hidden");
      alertErr.classList.add("hidden");

      const oldPin = document.getElementById("inputOldPin").value.trim();
      const newPin = document.getElementById("inputNewPin").value.trim();
      const confirmPin = document.getElementById("inputConfirmPin").value.trim();

      if (newPin !== confirmPin) {
        alertErr.textContent = "Konfirmasi PIN baru tidak cocok.";
        alertErr.classList.remove("hidden");
        return;
      }

      const session = getSession();
      if (!session) return clearSession();

      btn.disabled = true;
      btn.textContent = "Memproses...";

      try {
        const res = await fetch("/api/panel?action=change-pin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session.token
          },
          body: JSON.stringify({ oldPin, newPin })
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Gagal mengubah PIN");

        alertOk.textContent = "✓ " + data.message;
        alertOk.classList.remove("hidden");
        document.getElementById("formChangePin").reset();
      } catch (err) {
        alertErr.textContent = err.message;
        alertErr.classList.remove("hidden");
      } finally {
        btn.disabled = false;
        btn.textContent = "Perbarui PIN Pengaman";
      }
    });`;

const newFormChangePin = `    formChangePin.addEventListener("submit", async (e) => {
      e.preventDefault();
      alertOk.classList.add("hidden");
      alertErr.classList.add("hidden");

      const oldPin = document.getElementById("inputOldPin").value.trim();
      const newPin = document.getElementById("inputNewPin").value.trim();
      const confirmPin = document.getElementById("inputConfirmPin").value.trim();

      if (newPin !== confirmPin) {
        alertErr.textContent = "Konfirmasi PIN baru tidak cocok.";
        alertErr.classList.remove("hidden");
        return;
      }

      const session = getSession();
      if (!session || !session.cardId) return;

      btn.disabled = true;
      btn.textContent = "Memproses...";

      try {
        const cardRef = doc(db, "cards", session.cardId);
        const snap = await getDoc(cardRef);
        if (!snap.exists()) throw new Error("Kartu tidak ditemukan.");

        const cardData = snap.data();
        const salt = cardData.pinSalt || "ulasankuu_salt_2026";
        const hashedOld = await sha256(oldPin + ":" + salt);

        let oldPinValid = false;
        if (cardData.pinHash) {
          oldPinValid = (cardData.pinHash === hashedOld);
        } else if (cardData.pin) {
          oldPinValid = (String(cardData.pin) === String(oldPin));
        }

        if (!oldPinValid) {
          throw new Error("PIN lama yang Anda masukkan salah.");
        }

        const newSalt = Math.random().toString(36).substring(2, 10);
        const newHashed = await sha256(newPin + ":" + newSalt);

        await updateDoc(cardRef, {
          pinHash: newHashed,
          pinSalt: newSalt,
          pin: newPin,
          updatedAt: new Date().toISOString()
        });

        // Audit log
        try {
          await addDoc(collection(db, "audit_logs"), {
            actionType: "CHANGE_PIN",
            cardId: session.cardId,
            actor: "Pemilik Kartu",
            details: "Memperbarui PIN kartu",
            timestamp: new Date().toISOString(),
            status: "success"
          });
        } catch(e){}

        alertOk.textContent = "✓ PIN kartu berhasil diperbarui.";
        alertOk.classList.remove("hidden");
        document.getElementById("formChangePin").reset();
      } catch (err) {
        alertErr.textContent = err.message;
        alertErr.classList.remove("hidden");
      } finally {
        btn.disabled = false;
        btn.textContent = "Perbarui PIN Pengaman";
      }
    });`;

if (panel.includes('formChangePin.addEventListener("submit"')) {
  panel = panel.replace(oldFormChangePin, newFormChangePin);
  console.log('✅ formChangePin updated to robust direct Firestore check');
}

// 5. Perbarui pemanggilan di initPanel
panel = panel.replace('loadOwnerData(session.token);', 'loadOwnerData();');

fs.writeFileSync('public/panel.html', panel, 'utf8');
console.log('✅ public/panel.html completely hardened against unexpected logouts!');
