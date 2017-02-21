export default {
  pulling(d, opts) {
    if (!opts.elRefresh) opts.elRefresh = opts.container.querySelector('.pull-to-refresh')

    const { container, threshold, elRefresh } = opts

    let p = d / threshold
    if (p > 1) p = 1
    else p = p * p * p
    container.style.transform = `translate3d(0, ${d / 2.5}px, 0)`
    elRefresh.style.opacity = p
    elRefresh.style.transform = `translate3d(-50%, 0, 0) rotate(${360 * p}deg)`
  },

  refreshing({ container, threshold }) {
    container.style.transition = 'transform 0.1s'
    container.style.transform = `translate3d(0, ${threshold / 2.5}px, 0)`
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
