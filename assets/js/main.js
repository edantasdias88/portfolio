// ========================================
// 🔥 IMPORTS
// ========================================
import './theme.js'
import './i18n.js'
import './hero.js'
import initCases from './cases.js'
import '../css/main.css'


// ========================================
// 🔥 INIT GERAL
// ========================================
window.addEventListener('DOMContentLoaded', () => {
  initCases()
  initProcess()
  initSolutionsScroll()
  initCursor()
})


// ========================================
// 🔥 PROCESS (ACCORDION)
// ========================================
function initProcess() {
  const processCards = document.querySelectorAll('.process-card')

  if (!processCards.length) return

  processCards.forEach(card => {
    const desc = card.querySelector('.process-card__description')

    desc.style.height = '0px'
    desc.style.overflow = 'hidden'
    desc.style.transition = 'height 0.4s ease'

    card.addEventListener('click', () => {
      const isActive = card.classList.contains('active')

      // fecha todos
      processCards.forEach(c => {
        c.classList.remove('active')
        const d = c.querySelector('.process-card__description')
        d.style.height = '0px'
      })

      // se clicou no ativo, só fecha
      if (isActive) return

      // abre o clicado
      card.classList.add('active')
      desc.style.height = desc.scrollHeight + 'px'
    })
  })

  // abre o primeiro automaticamente
  const first = processCards[0]
  if (first) {
    first.classList.add('active')
    const desc = first.querySelector('.process-card__description')
    desc.style.height = desc.scrollHeight + 'px'
  }
}


// ========================================
// 🔥 SOLUTIONS SCROLL (DRAG + SNAP)
// ========================================
function initSolutionsScroll() {
  const scrollContainer = document.querySelector('.solutions_scroll')
  const dragCursor = document.querySelector('.drag-cursor')

  if (!scrollContainer) return

  let isDown = false
  let startX
  let scrollLeft

  const track = scrollContainer.querySelector('.solutions_track')
  const card = scrollContainer.querySelector('.solutions_card')

  if (!track || !card) return

  const styles = window.getComputedStyle(track)
  const gap = parseInt(styles.gap) || 0

  const cardWidth = card.offsetWidth + gap

  // cursor show/hide
  if (dragCursor) {
    scrollContainer.addEventListener('mouseenter', () => {
      dragCursor.style.opacity = '1'
    })

    scrollContainer.addEventListener('mouseleave', () => {
      dragCursor.style.opacity = '0'
    })
  }

  // drag start
  scrollContainer.addEventListener('mousedown', (e) => {
    isDown = true
    scrollContainer.classList.add('is-dragging')

    startX = e.pageX - scrollContainer.offsetLeft
    scrollLeft = scrollContainer.scrollLeft

    if (dragCursor) {
      dragCursor.style.transform = 'translate(-50%, -50%) scale(0.9)'
    }
  })

  // snap
  function snapToCard() {
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth

    let index = Math.round(scrollContainer.scrollLeft / cardWidth)
    let target = index * cardWidth

    if (target > maxScroll) {
      target = maxScroll
    }

    scrollContainer.scrollTo({
      left: target,
      behavior: 'smooth'
    })
  }

  // drag end
  scrollContainer.addEventListener('mouseup', () => {
    isDown = false
    scrollContainer.classList.remove('is-dragging')

    snapToCard()

    if (dragCursor) {
      dragCursor.style.transform = 'translate(-50%, -50%) scale(1)'
    }
  })

  scrollContainer.addEventListener('mouseleave', () => {
    if (isDown) snapToCard()

    isDown = false
    scrollContainer.classList.remove('is-dragging')

    if (dragCursor) {
      dragCursor.style.opacity = '0'
      dragCursor.style.transform = 'translate(-50%, -50%) scale(1)'
    }
  })

  // drag move
  scrollContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return
    e.preventDefault()

    const x = e.pageX - scrollContainer.offsetLeft
    const walk = (x - startX) * 1.5
    scrollContainer.scrollLeft = scrollLeft - walk
  })
}


// ========================================
// 🔥 CURSOR GLOBAL
// ========================================
function initCursor() {
  const dragCursor = document.querySelector('.drag-cursor')
  if (!dragCursor) return

  window.addEventListener('mousemove', (e) => {
    dragCursor.style.top = `${e.clientY}px`
    dragCursor.style.left = `${e.clientX}px`
  })
}
