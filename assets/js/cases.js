export default function initCases() {
  const cards = document.querySelectorAll(".case-card");
  const overlay = document.querySelector(".case-overlay");
  const content = document.querySelector(".case-overlay__content");
  const closeBtn = document.querySelector(".case-close");

  if (!overlay || !content) return;

  // ========================================
  // 🔥 BASE DINÂMICA
  // ========================================
  const BASE = window.location.hostname.includes("github.io")
    ? "/portfolio"
    : "";

  const CASES_PATH = `${BASE}/cases`;

  // ========================================
  // 🔥 ABRIR CASE
  // ========================================
  async function openCase(slug, push = true) {
    try {
      const cleanSlug = slug.replace(/^\/|\/$/g, "");
      const url = `${CASES_PATH}/${cleanSlug}/`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const html = await res.text();

      content.innerHTML = html;

      overlay.classList.add("is-active");
      document.body.style.overflow = "hidden";

      // 👉 delay para aparecer o botão
      setTimeout(() => {
        document.body.classList.add("case-open");
      }, 300);

      if (push) {
        history.pushState({}, "", `${CASES_PATH}/${cleanSlug}`);
      }
    } catch (err) {
      console.error("Erro ao carregar case:", err);
    }
  }

  // ========================================
  // 🔥 CLICK NOS CARDS
  // ========================================
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const slug = card.dataset.slug;

      if (!slug) return;

      openCase(slug);
    });
  });

  // ========================================
  // 🔥 FECHAR CASE
  // ========================================
  function closeCase() {
    overlay.classList.remove("is-active");

    // 👉 remove imediatamente
    document.body.classList.remove("case-open");

    setTimeout(() => {
      content.innerHTML = "";
      document.body.style.overflow = "";
    }, 300);
  }

  // ========================================
  // 🔥 BOTÃO FECHAR
  // ========================================
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      history.pushState({}, "", BASE || "/");
      closeCase();
    });
  }

  // ========================================
  // 🔥 VOLTAR NAVEGADOR
  // ========================================
  window.addEventListener("popstate", () => {
    const path = window.location.pathname;

    if (path.startsWith(CASES_PATH)) {
      const slug = path.replace(`${CASES_PATH}/`, "");
      openCase(slug, false);
    } else {
      closeCase();
    }
  });

  // ========================================
  // 🔥 ESC FECHA
  // ========================================
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      history.pushState({}, "", BASE || "/");
      closeCase();
    }
  });

  // ========================================
  // 🔥 CLICK FORA FECHA
  // ========================================
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      history.pushState({}, "", BASE || "/");
      closeCase();
    }
  });

  // ========================================
  // 🔥 LOAD INICIAL
  // ========================================
  const path = window.location.pathname;

  if (path.startsWith(CASES_PATH)) {
    const slug = path.replace(`${CASES_PATH}/`, "");

    if (slug) {
      openCase(slug, false);
    }
  }
}