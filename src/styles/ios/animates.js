export default {
  pulling(d, { container }) {
    container.style.transform = `translate3d(0, ${d / 2.5}px, 0)`
  },

  refreshing({ container, indicatorHeight }) {
    container.style.transition = 'transform 0.1s'
    container.style.transform = `translate3d(0, ${indicatorHeight}px, 0)`
  },

  restoring({ container }) {
    return new Promise(resolve => {
      container.style.transition = 'transform 0.3s'
      container.style.transform = 'translate3d(0, 0, 0)'
      container.addEventListener('transitionend', () => {
        container.style.transition = ''
        resolve()
      })
    })
  }
}
