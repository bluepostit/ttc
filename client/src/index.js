import '../style/style.scss'
import 'bootstrap/js/dist/collapse'

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.back-button').addEventListener('click', (e) => {
    window.history.back()
  })
})
