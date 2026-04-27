// hero.js

import { translations } from './i18n.js'

const INTERVAL = 5000 // 5s

const avatars = document.querySelectorAll('.avatar')
const text = document.querySelector('.hero__testimonials-content p')
const name = document.querySelector('.hero__testimonials-author strong')
const role = document.querySelector('.hero__testimonials-author span')

let current = 0
let timer = null

/* =========================
   GET CURRENT LANG
========================= */

function getCurrentLang() {
  return document.documentElement.getAttribute('lang') || 'pt'
}

/* =========================
   GET TESTIMONIALS (SAFE)
========================= */

function getTestimonials() {
  const lang = getCurrentLang()

  const langData = translations?.[lang]
  const hero = langData?.hero
  const testimonials = hero?.testimonials

  if (!testimonials || !Array.isArray(testimonials)) {
    return []
  }

  return testimonials
}

/* =========================
   UPDATE UI
========================= */

function update(index) {
  const testimonials = getTestimonials()

  if (!testimonials.length) return

  const item = testimonials[index]
  if (!item) return

  if (text) text.textContent = `“${item.text}”`
  if (name) name.textContent = item.name
  if (role) role.textContent = item.role

  avatars.forEach((avatar, i) => {
    avatar.classList.toggle('is-active', i === index)
  })

  current = index
}

/* =========================
   AUTOPLAY
========================= */

function startAutoplay() {
  stopAutoplay()

  timer = setInterval(() => {
    const testimonials = getTestimonials()

    if (!testimonials.length) return

    let next = current + 1
    if (next >= testimonials.length) next = 0

    update(next)
  }, INTERVAL)
}

function stopAutoplay() {
  if (timer) clearInterval(timer)
}

/* =========================
   EVENTS
========================= */

function bindEvents() {
  avatars.forEach((avatar, index) => {
    avatar.addEventListener('click', () => {
      update(index)

      stopAutoplay()
      setTimeout(startAutoplay, 8000)
    })
  })
}

/* =========================
   LANGUAGE CHANGE
========================= */

function handleLanguageChange() {
  document.addEventListener('languageChanged', () => {
    update(0)
  })
}

/* =========================
   INIT
========================= */

function initHero() {
  if (!avatars.length) return

  bindEvents()
  handleLanguageChange()

  update(0)
  startAutoplay()
}

initHero()