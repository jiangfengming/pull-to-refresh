(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ptrAnimatesMixed = factory());
}(this, (function () { 'use strict';

var animates = {
  pulling: function pulling(d, opts) {
    if (!opts.elRefresh) opts.elRefresh = opts.container.querySelector('.pull-to-refresh');

    var container = opts.container,
        threshold = opts.threshold,
        elRefresh = opts.elRefresh;


    var p = d / threshold;
    if (p > 1) p = 1;else p = p * p * p;
    container.style.transform = 'translate3d(0, ' + d / 2.5 + 'px, 0)';
    elRefresh.style.opacity = p;
    elRefresh.style.transform = 'translate3d(-50%, 0, 0) rotate(' + 360 * p + 'deg)';
  },
  refreshing: function refreshing(_ref) {
    var container = _ref.container,
        threshold = _ref.threshold;

    container.style.transition = 'transform 0.2s';
    container.style.transform = 'translate3d(0, ' + threshold / 2.5 + 'px, 0)';
  },
  restoring: function restoring(_ref2) {
    var container = _ref2.container;

    return new Promise(function (resolve) {
      container.style.transition = 'transform 0.3s';
      container.style.transform = 'translate3d(0, 0, 0)';
      container.addEventListener('transitionend', function () {
        container.style.transition = '';
        resolve();
      });
    });
  }
};

animates.aborting = animates.restoring;

return animates;

})));
