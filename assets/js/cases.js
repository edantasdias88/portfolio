export default function initCases() {
  const cards = document.querySelectorAll('.case-card')
  const overlay = document.querySelector('.case-overlay')
  const content = document.querySelector('.case-overlay__content')

  if (!overlay || !content) return

  // ========================================
  // 🔥 ABRIR CASE
  // ========================================
  async function openCase(slug, push = true) {
    try {
      const url = `/cases/${slug}/`

      const res = await fetch(url)
      const html = await res.text()

      content.innerHTML = html

      overlay.classList.add('is-active')
      document.body.style.overflow = 'hidden'

      if (push) {
        history.pushState({}, '', `/cases/${slug}`)
      }

      bindCloseButton()

    } catch (err) {
      console.error('Erro ao carregar case:', err)
    }
  }

  // ========================================
  // 🔥 CLICK NOS CARDS
  // ========================================
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const slug = card.dataset.slug
      openCase(slug)
    })
  })

  // ========================================
  // 🔥 FECHAR
  // ========================================
  function closeCase() {
    overlay.classList.remove('is-active')

    setTimeout(() => {
      content.innerHTML = ''
      document.body.style.overflow = ''
    }, 300)
  }

  // ========================================
  // 🔥 BOTÃO CLOSE
  // ========================================
  function bindCloseButton() {
    const btn = content.querySelector('.case-close')

    if (!btn) return

    btn.addEventListener('click', () => {
      history.pushState({}, '', '/')
      closeCase()
    })
  }

  // ========================================
  // 🔥 BACK BUTTON
  // ========================================
  window.addEventListener('popstate', () => {
    const path = window.location.pathname

    if (path.startsWith('/cases/')) {
      const slug = path.split('/cases/')[1]
      openCase(slug, false)
    } else {
      closeCase()
    }
  })

  // ========================================
  // 🔥 ESC
  // ========================================
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      history.pushState({}, '', '/')
      closeCase()
    }
  })

  // ========================================
  // 🔥 CLICK FORA
  // ========================================
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      history.pushState({}, '', '/')
      closeCase()
    }
  })

  // ========================================
  // 🔥 LOAD INICIAL (DEEP LINK)
  // ========================================
  const path = window.location.pathname

  if (path.startsWith('/cases/')) {
    const slug = path.split('/cases/')[1]

    if (slug) {
      openCase(slug, false)
    }
  }
}