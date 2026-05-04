export function initDeslizae() {
  console.log("🔥 initDeslizae ready");

  function setup(container) {
    // evita reinicializar
    if (container.dataset.ready) return;
    container.dataset.ready = "true";

    console.log("✅ iniciando deslizae");

    const items = container.querySelectorAll(".deslizae_item");
    const images = container.querySelectorAll(".deslizae_img");
    const title = container.querySelector("#deslizae_title_dynamic");
    const description = container.querySelector("#deslizae_description");
    const activeBg = container.querySelector(".deslizae_active-bg");

    if (
      !items.length ||
      images.length < 2 ||
      !title ||
      !description ||
      !activeBg
    ) {
      console.log("❌ estrutura incompleta");
      return;
    }

    let current = 0;

    const data = [
      {
        image: "./iruas/img/iruas-deslizae-default.png",
        title: "Explorar imóveis",
        description:
          "Cada imóvel é uma nova possibilidade. Explore com liberdade e encontre espaços que realmente conectam com o seu momento.",
      },
      {
        image: "./iruas/img/iruas-deslizae-not-liked.png",
        title: "Agora não",
        description:
          "<strong>Deslize para a esquerda</strong>  para pular este imóvele continuar descobrindo opções que combinam mais com você.",
      },
      {
        image: "./iruas/img/iruas-deslizae-liked.png",
        title: "Gostei",
        description:
          "<strong>Deslize para a direita</strong> para mostrar interesse e continuar explorando outras opções.",
      },
      {
        image: "./iruas/img/iruas-deslizae-loved.png",
        title: "Amei",
        description:
          "Quando algo realmente faz sentido, <strong>deslize para cima</strong> e mantenha em destaque.",
      },
    ];

    function moveActive(index) {
      const item = items[index];
      const offset = item.offsetTop;
      activeBg.style.transform = `translateY(${offset}px)`;
    }

    function updateContent(index) {
      const next = current === 0 ? 1 : 0;

      const nextImg = images[next];
      const currentImg = images[current];

      // troca imagem
      nextImg.src = data[index].image;

      // força render
      nextImg.offsetHeight;

      requestAnimationFrame(() => {
        nextImg.classList.add("is-active");
        currentImg.classList.remove("is-active");
      });

      current = next;

      // 🔥 agora com HTML (permite <strong>)
      title.textContent = data[index].title;
      description.innerHTML = data[index].description;

      // move highlight
      moveActive(index);
    }

    items.forEach((item, index) => {
      item.addEventListener("click", () => {
        items.forEach((i) => i.classList.remove("is-active"));
        item.classList.add("is-active");

        updateContent(index);
      });
    });

    // estado inicial
    images[0].classList.add("is-active");
    updateContent(0);
  }

  // observer (resolve navegação sem reload)
  const observer = new MutationObserver(() => {
    const el = document.querySelector(".deslizae");
    if (el) setup(el);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // inicial imediato
  const existing = document.querySelector(".deslizae");
  if (existing) setup(existing);
}
