/* ===================================================================
   main.js - Hero ajustado para imagem encostada na base
   =================================================================== */

document.addEventListener("DOMContentLoaded", () => {
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
  const heroLeft = document.querySelector("#hero .hero-left");
  const heroRight = document.querySelector("#hero .hero-right");
  const heroImage = document.querySelector(".hero-image");

  let currentLang = localStorage.getItem("lang") || "pt";
  let currentTheme = localStorage.getItem("theme") || "dark";
  let currentTestimonial =
    Number(localStorage.getItem("testimonialIndex")) || 0;

  function safeGetTranslation(lang, key) {
    if (typeof translations === "undefined" || !translations[lang]) return "";
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
    return value || "";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeToggle) themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    currentTheme = theme;
    localStorage.setItem("theme", theme);
  }

  (function initTheme() {
    const saved = localStorage.getItem("theme");
    applyTheme(saved || currentTheme || "dark");
  })();

  function applyLanguage(lang) {
    if (typeof translations === "undefined" || !translations[lang]) return;

    document.body.classList.add("fade-out");
    setTimeout(() => {
      textElements.forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (!key) return;
        el.textContent = safeGetTranslation(lang, key);
      });

      avatars.forEach((imgEl, idx) => {
        const t = translations[lang].testimonials?.[idx];
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
    }, 140);
  }

  (function initLanguage() {
    applyLanguage(localStorage.getItem("lang") || currentLang);
  })();

  function updateTestimonial(index) {
    const list = translations?.[currentLang]?.testimonials || [];
    const t = list[index] || list[0] || { text: "", author: "", role: "" };

    testimonialTextEl && (testimonialTextEl.textContent = t.text || "");
    testimonialAuthorEl && (testimonialAuthorEl.textContent = t.author || "");
    testimonialRoleEl && (testimonialRoleEl.textContent = t.role || "");

    avatars.forEach((a) => a.classList.remove("active"));
    avatars[index]?.classList.add("active");

    currentTestimonial = index;
    localStorage.setItem("testimonialIndex", String(index));
  }

  avatars.forEach((avatar, idx) =>
    avatar.addEventListener("click", () => updateTestimonial(idx))
  );
  avatars[0]?.classList.add("active");

  (function autoRotateTestimonials() {
    if (!avatars.length) return;
    let idx = currentTestimonial || 0;
    setInterval(() => {
      idx = (idx + 1) % avatars.length;
      updateTestimonial(idx);
    }, 6000);
  })();

  function initFeaturesDrag(carousel) {
    if (!carousel) return;
    let isDown = false,
      startX = 0,
      scrollLeft = 0;

    carousel.addEventListener("mousedown", (e) => {
      isDown = true;
      carousel.classList.add("dragging");
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });
    document.addEventListener("mouseup", () => {
      isDown = false;
      carousel.classList.remove("dragging");
    });
    carousel.addEventListener("mouseleave", () => {
      isDown = false;
      carousel.classList.remove("dragging");
    });
    carousel.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      carousel.scrollLeft = scrollLeft - (x - startX) * 2;
    });

    carousel.addEventListener("touchstart", (e) => {
      isDown = true;
      startX = e.touches[0].pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener("touchend", () => {
      isDown = false;
      carousel.classList.remove("dragging");
    });
    carousel.addEventListener("touchmove", (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - carousel.offsetLeft;
      carousel.scrollLeft = scrollLeft - (x - startX) * 2;
    });
  }

  initFeaturesDrag(featuresCarousel);

  function initProcessCards() {
    if (!processCards.length || !processGrid) return;
    processCards.forEach((c, i) =>
      c.classList.add(i === 0 ? "active" : "closed")
    );
    processCards.forEach((card) =>
      card.addEventListener("click", () => {
        if (card.classList.contains("active")) return;
        processCards.forEach((c) => {
          c.classList.remove("active");
          c.classList.add("closed");
        });
        card.classList.remove("closed");
        card.classList.add("active");
        try {
          const gridRect = processGrid.getBoundingClientRect();
          const cardRect = card.getBoundingClientRect();
          const offset =
            cardRect.left -
            gridRect.left -
            (gridRect.width - cardRect.width) / 2;
          processGrid.scrollTo({
            left: processGrid.scrollLeft + offset,
            behavior: "smooth",
          });
        } catch (e) {}
      })
    );

    let isDown = false,
      startX = 0,
      scrollLeft = 0;
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
      processGrid.scrollLeft = scrollLeft - (x - startX) * 2;
    });

    processGrid.addEventListener("touchstart", (e) => {
      isDown = true;
      startX = e.touches[0].pageX - processGrid.offsetLeft;
      scrollLeft = processGrid.scrollLeft;
    });
    processGrid.addEventListener("touchend", () => {
      isDown = false;
    });
    processGrid.addEventListener("touchmove", (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - processGrid.offsetLeft;
      processGrid.scrollLeft = scrollLeft - (x - startX) * 2;
    });
  }

  initProcessCards();

  /* ======== HERO PARALLAX COM BASE FIXA ======== */
  function initHeroParallax() {
    if (!heroImage || !heroLeft || !heroRight) return;
    let ticking = false;

    const heroRect = document.querySelector("#hero").getBoundingClientRect();
    const baseY = heroRect.height - heroImage.offsetHeight;

    function onScroll() {
      const scrollY = window.scrollY;

      heroLeft.style.transform = `translateY(${20 - scrollY * 0.08}px)`;
      heroLeft.style.opacity = `${Math.max(0, 1 - scrollY * 0.0015)}`;

      heroRight.style.transform = `translateY(${20 - scrollY * 0.1}px)`;
      heroRight.style.opacity = `${Math.max(0, 1 - scrollY * 0.0015)}`;

      heroImage.style.transform = `translateY(${baseY + scrollY * 0.05}px)`;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            onScroll();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  initHeroParallax();

  /* ======== REMOVIDO: ARTEMIA-LIKE FADE-IN ======== */
  // Nenhuma animação é executada agora.

  if (languageToggle)
    languageToggle.addEventListener("click", () => {
      applyLanguage(currentLang === "pt" ? "en" : "pt");
    });
  if (themeToggle)
    themeToggle.addEventListener("click", () => {
      applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
});
