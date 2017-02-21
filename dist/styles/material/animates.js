(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ptrAnimatesMaterial = factory());
}(this, (function () { 'use strict';

var animates = {
  pulling: function pulling(d, opts) {
    if (!opts.elRefresh) opts.elRefresh = opts.container.querySelector('.pull-to-refresh');

    var threshold = opts.threshold,
        elRefresh = opts.elRefresh;


    var p = d / threshold;
    if (p > 1) p = 1;else p = p * p * p;
    elRefresh.style.opacity = p;
    elRefresh.style.transform = 'translate3d(-50%, ' + d / 2.5 + 'px, 0) rotate(' + 360 * p + 'deg)';
  },
  refreshing: function refreshing(_ref) {
    var elRefresh = _ref.elRefresh,
        threshold = _ref.threshold;

    elRefresh.style.transition = 'transform 0.2s';
    elRefresh.style.transform = 'translate3d(-50%, ' + threshold / 2.5 + 'px, 0)';
  },
  aborting: function aborting(_ref2) {
    var elRefresh = _ref2.elRefresh;

    return new Promise(function (resolve) {
      elRefresh.style.transition = 'transform 0.3s, opacity 0.15s';
      elRefresh.style.transform = 'translate3d(-50%, 0, 0)';
      elRefresh.style.opacity = 0;
      elRefresh.addEventListener('transitionend', function () {
        elRefresh.style.transition = '';
        resolve();
      });
    });
  },
  restoring: function restoring(_ref3) {
    var elRefresh = _ref3.elRefresh;

    return new Promise(function (resolve) {
      elRefresh.style.transition = 'transform 0.3s';
      elRefresh.style.transform += ' scale(0.01)';
      elRefresh.addEventListener('transitionend', function () {
        elRefresh.style.transition = '';
        resolve();
      });
    });
  }
};

return animates;

})));
