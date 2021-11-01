import '../style/style.scss'
import 'bootstrap/js/dist/collapse'

import { loadVueForPage } from './vue-loader'

const setupBackButton = () => {
  const backButton = document.querySelector('.back-button')
  backButton && backButton.addEventListener('click', (e) => {
    window.history.back()
  })
}

document.addEventListener('DOMContentLoaded', () => {
  setupBackButton()
  loadVueForPage()
})

// Load ServiceWorker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/client/dist/service-worker.js')
  })
}
