// T13 - Lucero Pipa: Lógica de perfil e identidad simulada
const SESSION_KEY = "minka-demo-session";

const demoUser = {
  email: "lucero.pipa@minka.com",
  password: "Minka123",
  name: "Lucero Pipa",
  phone: "+51 987 654 321",
  location: "Lima, Perú",
};

const getSessionUser = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("No se pudo leer la sesión demo", error);
    return null;
  }
};

const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.warn("No se pudo limpiar la sesión demo", error);
  }
};

const profileForm = document.getElementById("profile-form");
const profileInputs = profileForm
  ? profileForm.querySelectorAll("input, textarea")
  : [];
const profilePhotoInput = document.getElementById("profile-photo-input");
const profilePhotoPreview = document.getElementById("profile-photo-preview");
const profileProgressFill = document.querySelector(".profile-progress__fill");
const profileProgressBar = document.querySelector(".profile-progress__bar");
const profileProgressValue = document.getElementById("profile-progress-value");
const profileBadge = document.getElementById("perfil-verificacion");
const profileSummary = {
  name: document.getElementById("perfil-resumen"),
  email: document.getElementById("perfil-email"),
  phone: document.getElementById("perfil-telefono"),
  location: document.getElementById("perfil-ubicacion"),
};
const saveProfileButtons = document.querySelectorAll("[data-save-profile]");
const simulateIdentityBtn = document.querySelector("[data-simulate-identity]");
const identityError = document.querySelector("[data-identity-error]");
const identitySuccess = document.querySelector("[data-identity-success]");
const identityModal = document.getElementById("identity-modal");
const modalOpeners = document.querySelectorAll("[data-open-modal]");
const modalClosers = document.querySelectorAll("[data-close-modal]");
const logoutBtn = document.getElementById("logout-btn");
const myItemsList = document.getElementById("my-items-list");
const PUBLISHED_KEY = "minka_published_items";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const profileState = {
  photo: true,
  verified: false,
};

init();

function init() {
  loadSession();
  bindEvents();
  renderMyItems();
}

function renderMyItems() {
  if (!myItemsList) return;
  const items = JSON.parse(localStorage.getItem(PUBLISHED_KEY) || "[]");

  if (items.length === 0) {
    myItemsList.innerHTML =
      '<p class="form__hint">No tienes publicaciones activas.</p>';
    return;
  }

  myItemsList.innerHTML = items
    .map(
      (item) => `
    <div class="profile-item-card" onclick="window.location.href='detalle.html?id=${
      item.id
    }'">
      <img src="${
        item.images ? item.images[0] : "./assets/images/items/default.jpg"
      }" alt="${item.title}" />
      <div class="profile-item-info">
        <h4>${item.title}</h4>
        <span class="badge">${item.status || "Activo"}</span>
      </div>
    </div>
  `
    )
    .join("");
}

const toggleModalVisibility = (modal, open) => {
  if (!modal) return;
  modal.classList.toggle("is-open", open);
  modal.setAttribute("aria-hidden", String(!open));
  if (open) {
    const firstField = modal.querySelector("input");
    if (firstField) firstField.focus();
  }
};

const setFieldError = (field, message) => {
  const errorNode = document.querySelector(`[data-error-for="${field.id}"]`);
  if (errorNode) errorNode.textContent = message || "";
  field.setAttribute("aria-invalid", message ? "true" : "false");
};

const setFormSuccess = (form, message) => {
  let success = form.querySelector(".form__success");
  if (!success) {
    success = document.createElement("p");
    success.className = "form__success";
    form.appendChild(success);
  }
  success.textContent = message;
  success.hidden = false;
};

const validateEmail = (input) => {
  if (!input.value.trim()) return "El correo es obligatorio";
  if (!emailPattern.test(input.value.trim()))
    return "Formato de correo inválido";
  return "";
};

const validatePhone = (input) => {
  if (!input.value.trim()) return "El teléfono es obligatorio";
  if (input.value.trim().length < 9) return "Ingresa un teléfono válido";
  return "";
};

const validateLocation = (input) => {
  if (!input.value.trim())
    return "El distrito es obligatorio para guardar cambios";
  if (input.value.trim().length < 3) return "Ingresa un distrito válido";
  return "";
};

const validateBio = (textarea) => {
  const value = textarea.value.trim();
  if (value.length > 150)
    return "La descripción no puede exceder 150 caracteres";
  return "";
};

// T13 - Lucero Pipa: Contador de caracteres en tiempo real
const bioTextarea = document.getElementById("profile-bio");
const bioCharCount = document.getElementById("bio-char-count");
const charCountContainer = document.querySelector(".form__char-count");

if (bioTextarea && bioCharCount) {
  const updateCharCount = () => {
    const length = bioTextarea.value.length;
    bioCharCount.textContent = length;

    charCountContainer.classList.remove("warning", "error");
    if (length > 150) {
      charCountContainer.classList.add("error");
    } else if (length > 130) {
      charCountContainer.classList.add("warning");
    }
  };

  bioTextarea.addEventListener("input", updateCharCount);
  updateCharCount();
}

// T13 - Lucero Pipa: Validación en tiempo real del distrito
const locationInput = document.getElementById("profile-location");

const checkFormValidity = () => {
  if (!locationInput || saveProfileButtons.length === 0) return;

  const locationValid = locationInput.value.trim().length >= 3;
  saveProfileButtons.forEach((btn) => {
    btn.disabled = !locationValid;
  });
};

if (locationInput) {
  locationInput.addEventListener("input", () => {
    const error = validateLocation(locationInput);
    setFieldError(locationInput, error);
    checkFormValidity();
  });

  // Verificar al cargar
  checkFormValidity();
}

// T13 - HU03: Progreso distingue campos requeridos (distrito) vs opcionales
const updateProfileProgress = () => {
  if (!profileForm) return;
  const name = profileForm.querySelector("#profile-name");
  const email = profileForm.querySelector("#profile-email");
  const phone = profileForm.querySelector("#profile-phone");
  const location = profileForm.querySelector("#profile-location");
  const bio = profileForm.querySelector("#profile-bio");

  // REQUERIDO: distrito
  const hasRequired = location.value.trim().length > 0;

  // OPCIONALES: nombre, email, teléfono, bio, foto, verificación
  const optionalChecks = [
    name.value.trim(),
    email.value.trim(),
    phone.value.trim(),
    bio.value.trim(),
    profileState.photo,
    profileState.verified,
  ];

  // Si no tiene el requerido, progreso es 0%. Si tiene, se calcula sobre opcionales
  let percent = 0;
  if (hasRequired) {
    const completedOptional = optionalChecks.filter(Boolean).length;
    percent = Math.round((completedOptional / 6) * 100);
  }

  if (profileProgressFill) profileProgressFill.style.width = `${percent}%`;
  if (profileProgressBar)
    profileProgressBar.setAttribute("aria-valuenow", String(percent));
  if (profileProgressValue) profileProgressValue.textContent = `${percent}%`;

  if (profileState.verified && profileBadge) {
    profileBadge.textContent = "Identidad verificada";
    profileBadge.classList.add("profile-card__badge--verified");
  }
};

// T13 - HU03: Validación distingue requeridos vs opcionales
const handleProfileValidation = (form) => {
  let hasErrors = false;
  form.querySelectorAll("input, textarea").forEach((input) => {
    let message = "";
    if (input.type === "email") message = validateEmail(input);
    else if (input.id === "profile-phone") message = validatePhone(input);
    else if (input.id === "profile-location") message = validateLocation(input);
    else if (input.id === "profile-bio") message = validateBio(input);
    // Nombre NO es obligatorio según HU03
    setFieldError(input, message);
    if (message) hasErrors = true;
  });
  return hasErrors;
};

// T13 - HU03: Hidratación incluye bio y actualiza contador
const hydrateProfileWithUser = (user) => {
  if (!user || !profileForm) return;
  const map = {
    name: "#profile-name",
    email: "#profile-email",
    phone: "#profile-phone",
    location: "#profile-location",
    bio: "#profile-bio",
  };
  Object.entries(map).forEach(([key, selector]) => {
    const node = profileForm.querySelector(selector);
    if (node && user[key]) {
      node.value = user[key];
      // Actualizar contador si es el bio
      if (key === "bio" && bioTextarea && bioCharCount) {
        const length = node.value.length;
        bioCharCount.textContent = length;
        charCountContainer.classList.toggle("warning", length > 130);
        charCountContainer.classList.toggle("error", length > 150);
      }
    }
  });
  if (profileSummary.name && user.name)
    profileSummary.name.textContent = user.name;
  if (profileSummary.email && user.email)
    profileSummary.email.textContent = user.email;
  if (profileSummary.phone && user.phone)
    profileSummary.phone.textContent = user.phone;
  if (profileSummary.location && user.location)
    profileSummary.location.textContent = user.location;

  // T13 - HU03: Verificar validez del formulario al cargar
  checkFormValidity();
  updateProfileProgress();
};

if (profilePhotoInput && profilePhotoPreview) {
  const photoButtons = document.querySelectorAll("[data-photo-upload]");
  photoButtons.forEach((btn) => {
    btn.addEventListener("click", () => profilePhotoInput.click());
  });

  profilePhotoInput.addEventListener("change", () => {
    const file = profilePhotoInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      profilePhotoPreview.src = event.target?.result;
      profileState.photo = true;
      updateProfileProgress();
    };
    reader.readAsDataURL(file);
  });
}

if (profileInputs.length) {
  profileInputs.forEach((input) => {
    input.addEventListener("input", updateProfileProgress);
  });
}

if (profileForm) {
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const hasErrors = handleProfileValidation(profileForm);
    if (!hasErrors) {
      setFormSuccess(profileForm, "Perfil actualizado (simulado).");
      const user = {
        name: profileForm.name.value,
        email: profileForm.email.value,
        phone: profileForm.phone.value,
        location: profileForm.location.value,
      };
      hydrateProfileWithUser(user);
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } catch (error) {
        console.warn("No se pudo persistir el perfil", error);
      }
    }
  });
}

if (saveProfileButtons.length && profileForm) {
  saveProfileButtons.forEach((btn) => {
    btn.addEventListener("click", () => profileForm.requestSubmit());
  });
}

modalOpeners.forEach((opener) => {
  opener.addEventListener("click", (event) => {
    event.preventDefault();
    const target = opener.dataset.openModal;
    if (target === "identity") toggleModalVisibility(identityModal, true);
  });
});

modalClosers.forEach((closer) => {
  closer.addEventListener("click", () =>
    toggleModalVisibility(identityModal, false)
  );
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") toggleModalVisibility(identityModal, false);
});

if (simulateIdentityBtn) {
  simulateIdentityBtn.addEventListener("click", () => {
    if (identityError) identityError.textContent = "Procesando verificación...";
    if (identitySuccess) identitySuccess.hidden = true;
    simulateIdentityBtn.disabled = true;
    setTimeout(() => {
      if (identityError) identityError.textContent = "";
      if (identitySuccess) {
        identitySuccess.hidden = false;
        identitySuccess.textContent = "Verificación completada. Confianza +20%";
      }
      profileState.verified = true;
      updateProfileProgress();
      toggleModalVisibility(identityModal, false);
      simulateIdentityBtn.disabled = false;
    }, 1000);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    clearSession();
    window.location.href = "auth.html";
  });
}

const sessionUser = getSessionUser();
hydrateProfileWithUser(sessionUser || demoUser);
updateProfileProgress();
