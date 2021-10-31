import '../style/style.scss'
import 'bootstrap/js/dist/collapse'

import { loadIndexPage } from './indexPage'

const setupBackButton = () => {
  const backButton = document.querySelector('.back-button')
  backButton && backButton.addEventListener('click', (e) => {
    window.history.back()
  })
}

document.addEventListener('DOMContentLoaded', () => {
  setupBackButton()
  loadIndexPage()
})

// Load ServiceWorker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/client/dist/service-worker.js')
  })
}
