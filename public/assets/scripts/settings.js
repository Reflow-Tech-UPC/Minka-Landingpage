// T29 - Lucero Pipa: Privacidad y Disponibilidad
  const visibilitySelect = document.getElementById("visibility-select");
  if (visibilitySelect) {
    visibilitySelect.value = prefs.visibility || "public";
  }

  const hideDistrictToggle = document.getElementById("hide-district-toggle");
  if (hideDistrictToggle) {
    hideDistrictToggle.checked = prefs.hideDistrict || false;
  }

  updateAvailabilitySummary(prefs.availability || {});
}

function updateAvailabilitySummary(availability) {
  const summaryContainer = document.getElementById("availability-summary");
  if (!summaryContainer) return;

  const days = Object.keys(availability).filter(
    (day) => availability[day] && availability[day].length > 0
  );

  if (days.length === 0) {
    summaryContainer.innerHTML =
      '<p class="text-muted">No hay horarios configurados.</p>';
    return;
  }

  summaryContainer.innerHTML = days
    .map(
      (day) => `
    <div class="availability-tag">
      <strong>${day}:</strong> ${availability[day].join(", ")}
    </div>
  `
    )
    .join("");
}

function setupEventListeners() {
  // Language
  document
    .getElementById("language-select")
    ?.addEventListener("change", (e) => {
      applyLanguage(e.target.value);
    });

  // High Contrast
  document
    .getElementById("high-contrast-toggle")
    ?.addEventListener("change", (e) => {
      applyHighContrast(e.target.checked);
    });

  // Low Data
  document
    .getElementById("low-data-toggle")
    ?.addEventListener("change", (e) => {
      applyLowData(e.target.checked);
    });

  // Font Size
  document
    .getElementById("font-decrease")
    ?.addEventListener("click", () => setFontSize("small"));
  document
    .getElementById("font-reset")
    ?.addEventListener("click", () => setFontSize("medium"));
  document
    .getElementById("font-increase")
    ?.addEventListener("click", () => setFontSize("large"));

  // T29 - Lucero Pipa: Disponibilidad (HU26)
  const openAvailBtn = document.getElementById("open-availability-modal");
  const availModal = document.getElementById("availability-modal");
  const cancelAvailBtn = document.getElementById("cancel-availability");
  const saveAvailBtn = document.getElementById("save-availability");
  const previewBtn = document.getElementById("preview-profile-btn");

  if (openAvailBtn && availModal) {
    openAvailBtn.addEventListener("click", () => {
      availModal.classList.remove("hidden");
      availModal.style.display = "flex";
      // Cargar estado actual en checkboxes
      const prefs = JSON.parse(
        localStorage.getItem("minka_preferences") || "{}"
      );
      const availability = prefs.availability || {};

      document.querySelectorAll("input[name='day']").forEach((dayCb) => {
        const day = dayCb.value;
        const times = availability[day] || [];
        dayCb.checked = times.length > 0;

        document
          .querySelectorAll(`input[name='time_${day}']`)
          .forEach((timeCb) => {
            timeCb.checked = times.includes(timeCb.value);
          });
      });
    });

    cancelAvailBtn.addEventListener("click", () => {
      availModal.classList.add("hidden");
      availModal.style.display = "none";
    });

    saveAvailBtn.addEventListener("click", () => {
      const availability = {};
      document.querySelectorAll("input[name='day']").forEach((dayCb) => {
        if (dayCb.checked) {
          const day = dayCb.value;
          const times = [];
          document
            .querySelectorAll(`input[name='time_${day}']:checked`)
            .forEach((timeCb) => {
              times.push(timeCb.value);
            });
          if (times.length > 0) {
            availability[day] = times;
          }
        }
      });

      // Guardar temporalmente en memoria para cuando se de click a "Guardar Preferencias"
      // O guardar directamente en el objeto prefs global si existiera.
      // Para simplificar, lo guardamos en un atributo del modal o variable global temporal
      window.tempAvailability = availability;

      updateAvailabilitySummary(availability);
      availModal.classList.add("hidden");
      availModal.style.display = "none";
    });
  }

  if (previewBtn) {
    previewBtn.addEventListener("click", () => {
      alert(
        "Vista Previa: Así ven tu perfil los usuarios públicos.\n(Se ocultará tu distrito exacto si la opción está activa)."
      );
      // En una implementación real, esto abriría un modal con el componente de perfil en modo lectura.
    });
  }

  // Save Button
  document
    .getElementById("save-settings")
    ?.addEventListener("click", savePreferences);







    
    // T29 - Lucero Pipa: Privacidad y Disponibilidad
    visibility: document.getElementById("visibility-select")?.value || "public",
    hideDistrict:
      document.getElementById("hide-district-toggle")?.checked || false,
    availability: window.tempAvailability || prefs.availability || {},
  };

  localStorage.setItem("minka_preferences", JSON.stringify(newPrefs));
  alert("Preferencias guardadas correctamente.");