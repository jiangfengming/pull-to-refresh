import ontouchpan from './ontouchpan'

export default function(opts) {
  if (!opts.scrollable) opts.scrollable = document.body
  if (!opts.onStateChange) opts.onStateChange = () => { /* noop */ }
  const { container, scrollable, threshold, refresh, onStateChange, animates } = opts

  let distance, offset, state // state: pulling, aborting, reached, refreshing, restoring

  function addClass(cls) {
    container.classList.add('pull-to-refresh--' + cls)
  }

  function removeClass(cls) {
    container.classList.remove('pull-to-refresh--' + cls)
  }

  return ontouchpan({
    element: container,

    onpanmove(e) {
      let d = e.deltaY

      if (scrollable.scrollTop !== 0 || d < 0 && !state || state in { refreshing: 1, restoring: 1 }) return

      e.preventDefault()

      if (distance == null) {
        offset = d
        state = 'pulling'
        addClass(state)
        onStateChange(state, opts)
      }

      d = d - offset
      if (d < 0) d = 0
      distance = d

      if (d >= threshold && state !== 'reached' || d < threshold && state !== 'pulling') {
        removeClass(state)
        state = state === 'reached' ? 'pulling' : 'reached'
        addClass(state)
        onStateChange(state, opts)
      }

      animates.pulling(distance, opts)
    },

    onpanend() {
      if (state == null) return

      if (state === 'pulling') {
        removeClass(state)
        state = 'aborting'
        onStateChange(state)
        addClass(state)
        animates.aborting(opts).then(() => {
          removeClass(state)
          distance = state = offset = null
          onStateChange(state)
        })
      } else {
        removeClass(state)
        state = 'refreshing'
        addClass(state)
        onStateChange(state, opts)
        animates.refreshing(opts)

        refresh().then(() => {
          removeClass(state)
          state = 'restoring'
          addClass(state)
          onStateChange(state)

          animates.restoring(opts).then(() => {
            removeClass(state)
            distance = state = offset = null
            onStateChange(state)
          })
        })
      }
    }
  })
}
