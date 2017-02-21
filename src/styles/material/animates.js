export default {
  pulling(d, opts) {
    if (!opts.elRefresh) opts.elRefresh = opts.container.querySelector('.pull-to-refresh')

    const { threshold, elRefresh } = opts

    let p = d / threshold
    if (p > 1) p = 1
    else p = p * p * p
    elRefresh.style.opacity = p
    elRefresh.style.transform = `translate3d(-50%, ${d / 2.5}px, 0) rotate(${360 * p}deg)`
  },

  refreshing({ elRefresh, threshold }) {
    elRefresh.style.transition = 'transform 0.2s'
    elRefresh.style.transform = `translate3d(-50%, ${threshold / 2.5}px, 0)`
  },

  aborting({ elRefresh }) {
    return new Promise(resolve => {
      elRefresh.style.transition = 'transform 0.3s, opacity 0.15s'
      elRefresh.style.transform = 'translate3d(-50%, 0, 0)'
      elRefresh.style.opacity = 0
      elRefresh.addEventListener('transitionend', () => {
        elRefresh.style.transition = ''
        resolve()
      })
    })
  },

  restoring({ elRefresh }) {
    return new Promise(resolve => {
      elRefresh.style.transition = 'transform 0.3s'
      elRefresh.style.transform += ' scale(0.01)'
      elRefresh.addEventListener('transitionend', () => {
        elRefresh.style.transition = ''
        resolve()
      })
    })
  }
}
