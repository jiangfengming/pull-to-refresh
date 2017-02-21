(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.pullToRefresh = factory());
}(this, (function () { 'use strict';

var ontouchpan = function (_ref) {
  var element = _ref.element,
      onpanstart = _ref.onpanstart,
      onpanmove = _ref.onpanmove,
      onpanend = _ref.onpanend;

  var touchId = void 0,
      startX = void 0,
      startY = void 0,
      panstartCalled = void 0;

  function calcMovement(e) {
    for (var _iterator = e.changedTouches, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref2 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref2 = _i.value;
      }

      var touch = _ref2;

      if (touch.identifier === touchId) {
        e.deltaX = touch.screenX - startX;
        e.deltaY = touch.screenY - startY;
        return true;
      }
    }
  }

  function touchstart(e) {
    var touch = e.changedTouches[0];
    touchId = touch.identifier;
    startX = touch.screenX;
    startY = touch.screenY;
  }

  function touchmove(e) {
    if (calcMovement(e)) {
      if (onpanstart && !panstartCalled) {
        onpanstart(e);
        panstartCalled = true;
      }

      onpanmove(e);
    }
  }

  function touchend(e) {
    if (calcMovement(e)) onpanend(e);
  }

  element.addEventListener('touchstart', touchstart);
  if (onpanmove) element.addEventListener('touchmove', touchmove);
  if (onpanend) element.addEventListener('touchend', touchend);

  return function () {
    element.removeEventListener('touchstart', touchstart);
    if (onpanmove) element.removeEventListener('touchmove', touchmove);
    if (onpanend) element.removeEventListener('touchend', touchend);
  };
};

var pullToRefresh = function (opts) {
  if (!opts.scrollable) opts.scrollable = document.body;
  if (!opts.onStateChange) opts.onStateChange = function () {/* noop */};
  var container = opts.container,
      scrollable = opts.scrollable,
      threshold = opts.threshold,
      refresh = opts.refresh,
      onStateChange = opts.onStateChange,
      animates = opts.animates;


  var distance = void 0,
      offset = void 0,
      state = void 0; // state: pulling, aborting, reached, refreshing, restoring

  function addClass(cls) {
    container.classList.add('pull-to-refresh--' + cls);
  }

  function removeClass(cls) {
    container.classList.remove('pull-to-refresh--' + cls);
  }

  return ontouchpan({
    element: container,

    onpanmove: function onpanmove(e) {
      var d = e.deltaY;

      if (scrollable.scrollTop !== 0 || d < 0 && !state || state in { refreshing: 1, restoring: 1 }) return;

      e.preventDefault();

      if (distance == null) {
        offset = d;
        state = 'pulling';
        addClass(state);
        onStateChange(state, opts);
      }

      d = d - offset;
      if (d < 0) d = 0;
      distance = d;

      if (d >= threshold && state !== 'reached' || d < threshold && state !== 'pulling') {
        removeClass(state);
        state = state === 'reached' ? 'pulling' : 'reached';
        addClass(state);
        onStateChange(state, opts);
      }

      animates.pulling(distance, opts);
    },
    onpanend: function onpanend() {
      if (state == null) return;

      if (state === 'pulling') {
        removeClass(state);
        state = 'aborting';
        onStateChange(state);
        addClass(state);
        animates.aborting(opts).then(function () {
          removeClass(state);
          distance = state = offset = null;
          onStateChange(state);
        });
      } else {
        removeClass(state);
        state = 'refreshing';
        addClass(state);
        onStateChange(state, opts);
        animates.refreshing(opts);

        refresh().then(function () {
          removeClass(state);
          state = 'restoring';
          addClass(state);
          onStateChange(state);

          animates.restoring(opts).then(function () {
            removeClass(state);
            distance = state = offset = null;
            onStateChange(state);
          });
        });
      }
    }
  });
};

return pullToRefresh;

})));
