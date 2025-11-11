document.addEventListener("DOMContentLoaded", () => {
  /* ======== ELEMENTOS ======== */
  const languageToggle = document.getElementById("language-toggle");
  const themeToggle = document.getElementById("theme-toggle");
  const textElements = document.querySelectorAll("[data-i18n]");
  const avatars = Array.from(document.querySelectorAll(".avatars img"));
  const testimonialTextEl = document.querySelector(".testimonial-text");
  const testimonialAuthorEl = document.querySelector(".testimonial-author");
  const testimonialRoleEl = document.querySelector(".testimonial-role");
  const featuresCarousel = document.querySelector(".features-carousel");
  const processGrid = document.querySelector(".process-grid");
  const processCards = document.querySelectorAll(".process-card");

  let currentLang = localStorage.getItem("lang") || "pt";
  let currentTheme = localStorage.getItem("theme") || "dark";
  let currentTestimonial =
    Number(localStorage.getItem("testimonialIndex")) || 0;

  /* ======== TEMA ======== */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeToggle) themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    currentTheme = theme;
    localStorage.setItem("theme", theme);
  }

  /* ======== IDIOMA ======== */
  function applyLanguage(lang) {
    if (typeof translations === "undefined" || !translations[lang]) return;

    document.body.classList.add("fade-out");
    setTimeout(() => {
      textElements.forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (!key) return;

        const parts = key.split(".");
        let value = translations[lang];
        for (const p of parts) {
          if (value && Object.prototype.hasOwnProperty.call(value, p)) {
            value = value[p];
          } else {
            value = "";
            break;
          }
        }
        el.textContent = value || "";
      });

      avatars.forEach((imgEl, idx) => {
        const t =
          translations[lang].testimonials &&
          translations[lang].testimonials[idx];
        if (t && t.avatar) imgEl.src = t.avatar;
      });

      currentLang = lang;
      if (languageToggle)
        languageToggle.textContent = lang === "pt" ? "EN" : "PT";
      localStorage.setItem("lang", lang);

      updateTestimonial(currentTestimonial);

      document.body.classList.remove("fade-out");
      document.body.classList.add("fade-in");
      setTimeout(() => document.body.classList.remove("fade-in"), 300);
    }, 180);
  }

  /* ======== TESTEMUNHOS ======== */
  function updateTestimonial(index) {
    const list =
      (translations &&
        translations[currentLang] &&
        translations[currentLang].testimonials) ||
      [];
    const t = list[index] || list[0] || { text: "", author: "", role: "" };

    if (testimonialTextEl) testimonialTextEl.textContent = t.text;
    if (testimonialAuthorEl) testimonialAuthorEl.textContent = t.author;
    if (testimonialRoleEl) testimonialRoleEl.textContent = t.role;

    avatars.forEach((a) => a.classList.remove("active"));
    const activeAvatar = avatars[index];
    if (activeAvatar) activeAvatar.classList.add("active");

    currentTestimonial = index;
    localStorage.setItem("testimonialIndex", String(index));
  }

  /* ======== FEATURES CAROUSEL ======== */
  function initFeaturesDrag(carousel) {
    if (!carousel) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener("mousedown", (e) => {
      isDown = true;
      carousel.classList.add("dragging");
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener("mouseleave", () => {
      isDown = false;
      carousel.classList.remove("dragging");
    });

    carousel.addEventListener("mouseup", () => {
      isDown = false;
      carousel.classList.remove("dragging");
    });

    carousel.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
    });
  }

  /* ======== PROCESSO ======== */
  function initProcessCards() {
    if (!processCards.length) return;

    // Um card ativo por vez
    processCards.forEach((card, idx) => {
      if (idx === 0) card.classList.add("active");
      else card.classList.add("closed");
    });

    processCards.forEach((card, idx) => {
      card.addEventListener("click", () => {
        if (card.classList.contains("active")) return;

        processCards.forEach((c, i) => {
          c.classList.remove("active");
          c.classList.add("closed");
        });

        card.classList.add("active");
        card.classList.remove("closed");
        centerCard(card);
      });
    });

    // Centraliza card ativo no scroll horizontal
    function centerCard(card) {
      const gridRect = processGrid.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const offset =
        cardRect.left - gridRect.left - (gridRect.width - cardRect.width) / 2;
      processGrid.scrollTo({
        left: processGrid.scrollLeft + offset,
        behavior: "smooth",
      });
    }

    // Drag horizontal (desktop e mobile)
    let isDown = false;
    let startX;
    let scrollLeft;

    processGrid.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - processGrid.offsetLeft;
      scrollLeft = processGrid.scrollLeft;
      processGrid.classList.add("dragging");
    });
    processGrid.addEventListener("mouseleave", () => {
      isDown = false;
      processGrid.classList.remove("dragging");
    });
    processGrid.addEventListener("mouseup", () => {
      isDown = false;
      processGrid.classList.remove("dragging");
    });
    processGrid.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - processGrid.offsetLeft;
      const walk = (x - startX) * 2;
      processGrid.scrollLeft = scrollLeft - walk;
    });

    processGrid.addEventListener("touchstart", (e) => {
      isDown = true;
      startX = e.touches[0].pageX - processGrid.offsetLeft;
      scrollLeft = processGrid.scrollLeft;
    });
    processGrid.addEventListener("touchend", () => (isDown = false));
    processGrid.addEventListener("touchmove", (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - processGrid.offsetLeft;
      const walk = (x - startX) * 2;
      processGrid.scrollLeft = scrollLeft - walk;
    });
  }

  /* ======== EVENTOS ======== */
  if (languageToggle) {
    languageToggle.addEventListener("click", () => {
      const next = currentLang === "pt" ? "en" : "pt";
      applyLanguage(next);
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = currentTheme === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  avatars.forEach((avatar, idx) => {
    avatar.addEventListener("click", () => updateTestimonial(idx));
  });

  /* ======== INIT ======== */
  applyTheme(currentTheme);
  applyLanguage(currentLang);

  if (!avatars.some((a) => a.classList.contains("active")) && avatars[0]) {
    avatars[0].classList.add("active");
  }

  initFeaturesDrag(featuresCarousel);
  initProcessCards();
});
