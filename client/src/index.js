import '../style/style.scss'
import 'bootstrap/js/dist/collapse'

document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.querySelector('.back-button')
  backButton && backButton.addEventListener('click', (e) => {
    window.history.back()
  })
})

// Load ServiceWorker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
  })
}
