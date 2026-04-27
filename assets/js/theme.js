// theme.js

const STORAGE_KEY = 'theme'

const html = document.documentElement
const toggle = document.querySelector('[data-theme-toggle]')

/* =========================
   GET INITIAL THEME
========================= */

function getInitialTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEY)

  if (savedTheme) return savedTheme

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  return prefersDark ? 'dark' : 'light'
}

/* =========================
   APPLY THEME
========================= */

function applyTheme(theme) {
  html.setAttribute('data-theme', theme)
  localStorage.setItem(STORAGE_KEY, theme)

  updateToggleLabel(theme)
}

/* =========================
   TOGGLE THEME
========================= */

function toggleTheme() {
  const current = html.getAttribute('data-theme')
  const next = current === 'dark' ? 'light' : 'dark'

  applyTheme(next)
}

/* =========================
   UPDATE BUTTON (opcional)
========================= */

function updateToggleLabel(theme) {
  if (!toggle) return

  toggle.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode'
}

/* =========================
   INIT
========================= */

function initTheme() {
  const initialTheme = getInitialTheme()
  applyTheme(initialTheme)

  if (toggle) {
    toggle.addEventListener('click', toggleTheme)
  }
}

initTheme()