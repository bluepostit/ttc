import '../style/style.scss'

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.back-button').addEventListener('click', (e) => {
    history.back()
  })
})
