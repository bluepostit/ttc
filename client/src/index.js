import '../style/style.scss'
import { Collapse } from 'bootstrap' // eslint-disable-line

import { loadVueForPage } from './vue-loader'

document.addEventListener('DOMContentLoaded', () => {
  loadVueForPage()
})

// Load ServiceWorker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/client/dist/service-worker.js')
  })
}
