/**
 * T27 - Miguel Sanca: Lógica de Configuración y Accesibilidad
 * Maneja idioma, alto contraste, modo bajo consumo y tamaño de fuente.
 * T29 - Lucero Pipa: Configuración de privacidad y verificación.
 */

const TRANSLATIONS = {
  es: {
    settings_title: "Configuración y Accesibilidad",
    settings_subtitle: "Personaliza tu experiencia en Mink'a.",
    language_title: "Idioma",
    language_desc: "Selecciona el idioma de la interfaz.",
    visual_title: "Accesibilidad Visual",
    contrast_label: "Alto Contraste",
    contrast_desc: "Aumenta el contraste para mejorar la legibilidad.",
    font_size_label: "Tamaño de Fuente",
    font_size_desc: "Ajusta el tamaño del texto.",
    data_title: "Datos y Rendimiento",
    low_data_label: "Modo Bajo Consumo",
    low_data_desc: "Reduce calidad de imágenes y desactiva animaciones.",
    save_btn: "Guardar Preferencias",
    security_title: "Seguridad",
    password_label: "Contraseña",
    password_desc:
      "Cambia tu contraseña periódicamente para mantener tu cuenta segura.",
    privacy_title: "Privacidad y Disponibilidad",
    visibility_label: "Visibilidad del Perfil",
    visibility_desc: "Controla quién puede ver tu información.",
    availability_label: "Horario de Intercambio",
    availability_desc: "Define cuándo estás disponible.",
  },
  en: {
    settings_title: "Settings & Accessibility",
    settings_subtitle: "Customize your Mink'a experience.",
    language_title: "Language",
    language_desc: "Select interface language.",
    visual_title: "Visual Accessibility",
    contrast_label: "High Contrast",
    contrast_desc: "Increase contrast for better readability.",
    font_size_label: "Font Size",
    font_size_desc: "Adjust text size.",
    data_title: "Data & Performance",
    low_data_label: "Low Data Mode",
    low_data_desc: "Reduces image quality and disables animations.",
    save_btn: "Save Preferences",
    security_title: "Security",
    password_label: "Password",
    password_desc:
      "Change your password periodically to keep your account safe.",
    privacy_title: "Privacy & Availability",
    visibility_label: "Profile Visibility",
    visibility_desc: "Control who can see your information.",
    availability_label: "Exchange Schedule",
    availability_desc: "Define when you are available.",
  },
  qu: {
    settings_title: "Allichaykuna",
    settings_subtitle: "Mink'a experienciaykita personalizay.",
    language_title: "Simi",
    language_desc: "Interfaz simita akllay.",
    visual_title: "Rikuy Allichay",
    contrast_label: "Hatun Contraste",
    contrast_desc: "Ñawiriyta allinchanapaq contrasteta yapay.",
    font_size_label: "Qillqa Hatun",
    font_size_desc: "Qillqa sayayta allichay.",
    data_title: "Datos y Ruway",
    low_data_label: "Pisi Data Modo",
    low_data_desc:
      "Imagen calidadta pisiyachin hinaspa animacionkunata wañuchin.",
    save_btn: "Allichaykunata Waqaychay",
    security_title: "Hark'ay",
    password_label: "Simi Qillqa",
    password_desc: "Simi qillqaykita sapa kuti tikray cuenta hark'anaykipaq.",
    privacy_title: "Pakay & Kay",
    visibility_label: "Perfil Rikuy",
    visibility_desc: "Pichus willakuykita rikunman chayta kamachiy.",
    availability_label: "Ruwanapaq Pacha",
    availability_desc: "Haykappis kanki chayta niy.",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initSettings();
});

function initSettings() {
  loadPreferences();
  loadSessions(); // T28
  setupEventListeners();
}

// T28 - Leonardo Chavez: Gestión de Sesiones (HU23)
function loadSessions() {
  const sessionsList = document.getElementById("sessions-list");
  if (!sessionsList) return;

  // Mock Data
  const sessions = [
    {
      id: 1,
      device: "Windows PC - Chrome",
      location: "Lima, PE",
      active: true,
      current: true,
    },
    {
      id: 2,
      device: "Android Mobile - App",
      location: "Lima, PE",
      active: true,
      lastActive: "Hace 2 horas",
    },
    {
      id: 3,
      device: "iPhone 13 - Safari",
      location: "Arequipa, PE",
      active: true,
      lastActive: "Hace 1 día",
    },
  ];

  sessionsList.innerHTML = sessions
    .map(
      (session) => `
    <div class="session-item" id="session-${session.id}">
      <div class="session-icon">
        <i class="fas ${
          session.device.includes("Mobile") || session.device.includes("iPhone")
            ? "fa-mobile-alt"
            : "fa-desktop"
        }"></i>
      </div>
      <div class="session-info">
        <strong>${session.device}</strong>
        <p>${session.location} · ${
        session.current
          ? '<span class="status-active">Actual</span>'
          : session.lastActive
      }</p>
      </div>
      ${
        !session.current
          ? `
        <button class="btn-icon" onclick="logoutSession(${session.id})" aria-label="Cerrar sesión">
          <i class="fas fa-times"></i>
        </button>
      `
          : ""
      }
    </div>
  `
    )
    .join("");
}

window.logoutSession = (id) => {
  if (confirm("¿Cerrar esta sesión?")) {
    const el = document.getElementById(`session-${id}`);
    if (el) {
      el.style.opacity = "0.5";
      setTimeout(() => el.remove(), 500);
      alert("Sesión cerrada correctamente.");
    }
  }
};

function setupEventListeners() {
  const prefs = JSON.parse(localStorage.getItem("minka_preferences") || "{}");

  // Language
  const langSelect = document.getElementById("language-select");
  if (langSelect) {
    langSelect.value = prefs.language || "es";
    applyLanguage(prefs.language || "es");
  }

  // High Contrast
  const contrastToggle = document.getElementById("high-contrast-toggle");
  if (contrastToggle) {
    contrastToggle.checked = prefs.highContrast || false;
    applyHighContrast(prefs.highContrast || false);
  }

  // Low Data
  const dataToggle = document.getElementById("low-data-toggle");
  if (dataToggle) {
    dataToggle.checked = prefs.lowData || false;
    applyLowData(prefs.lowData || false);
  }

  // Font Size
  applyFontSize(prefs.fontSize || "medium");

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

  // T28 - Leonardo Chavez: Reautenticación (HU24)
  const changePassBtn = document.getElementById("change-password-btn");
  const logoutAllBtn = document.getElementById("logout-all-sessions"); // HU23
  const reauthModal = document.getElementById("reauth-modal");
  const cancelReauthBtn = document.getElementById("cancel-reauth");
  const confirmReauthBtn = document.getElementById("confirm-reauth");
  const reauthPasswordInput = document.getElementById("reauth-password");

  let pendingAction = null;

  const requestReauth = (action) => {
    // Verificar tiempo de gracia (10 min)
    const lastAuth = localStorage.getItem("minka_last_reauth");
    const now = Date.now();

    if (lastAuth && now - parseInt(lastAuth) < 10 * 60 * 1000) {
      action(); // Ejecutar directamente si está en periodo de gracia
    } else {
      pendingAction = action;
      reauthModal.classList.remove("hidden");
      reauthModal.style.display = "flex";
    }
  };

  if (changePassBtn) {
    changePassBtn.addEventListener("click", () => {
      requestReauth(() => alert("Redirigiendo a cambio de contraseña..."));
    });
  }

  if (logoutAllBtn) {
    logoutAllBtn.addEventListener("click", () => {
      requestReauth(() => {
        document.getElementById("sessions-list").innerHTML =
          '<p class="text-center">Todas las sesiones remotas han sido cerradas.</p>';
        alert("Se han cerrado todas las sesiones excepto la actual.");
      });
    });
  }

  if (reauthModal) {
    cancelReauthBtn.addEventListener("click", () => {
      reauthModal.classList.add("hidden");
      reauthModal.style.display = "none";
      reauthPasswordInput.value = "";
      pendingAction = null;
    });

    confirmReauthBtn.addEventListener("click", () => {
      const password = reauthPasswordInput.value;
      if (password) {
        // Simulación de verificación exitosa
        localStorage.setItem("minka_last_reauth", Date.now().toString()); // Guardar timestamp

        reauthModal.classList.add("hidden");
        reauthModal.style.display = "none";
        reauthPasswordInput.value = "";

        if (pendingAction) {
          pendingAction();
          pendingAction = null;
        }
      } else {
        alert("Por favor ingresa tu contraseña.");
      }
    });
  }
}

function applyLanguage(lang) {
  const texts = TRANSLATIONS[lang] || TRANSLATIONS["es"];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (texts[key]) {
      el.textContent = texts[key];
    }
  });
  document.documentElement.lang = lang;
}

function applyHighContrast(enabled) {
  if (enabled) {
    document.body.classList.add("high-contrast");
  } else {
    document.body.classList.remove("high-contrast");
  }
}

function applyLowData(enabled) {
  if (enabled) {
    document.body.classList.add("low-data");
    // Logic to replace high-res images would go here
    // For demo, CSS filter handles visual indication
  } else {
    document.body.classList.remove("low-data");
  }
}

function setFontSize(size) {
  const root = document.documentElement;
  switch (size) {
    case "small":
      root.style.fontSize = "14px";
      break;
    case "medium":
      root.style.fontSize = "16px";
      break;
    case "large":
      root.style.fontSize = "20px";
      break;
  }
  // Store temporarily in memory or data attribute if needed immediately
  root.setAttribute("data-font-size", size);
}

function applyFontSize(size) {
  setFontSize(size);
}

function savePreferences() {
  const prefs = JSON.parse(localStorage.getItem("minka_preferences") || "{}");

  const newPrefs = {
    ...prefs,
    language: document.getElementById("language-select").value,
    highContrast: document.getElementById("high-contrast-toggle").checked,
    lowData: document.getElementById("low-data-toggle").checked,
    fontSize:
      document.documentElement.getAttribute("data-font-size") || "medium",
    // T29 - Lucero Pipa: Privacidad y Disponibilidad
    visibility: document.getElementById("visibility-select")?.value || "public",
    hideDistrict:
      document.getElementById("hide-district-toggle")?.checked || false,
    availability: window.tempAvailability || prefs.availability || {},
  };

  localStorage.setItem("minka_preferences", JSON.stringify(newPrefs));
  alert("Preferencias guardadas correctamente.");
}
