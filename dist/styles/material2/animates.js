(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ptrAnimatesMaterial2 = factory());
}(this, (function () { 'use strict';

var animates = {
  pulling: function pulling(d, opts) {
    if (!opts.elControl) opts.elControl = opts.container.querySelector('.pull-to-refresh-material2__control');

    var container = opts.container,
        threshold = opts.threshold,
        elControl = opts.elControl;


    var p = d / threshold;
    if (p > 1) p = 1;else p = p * p * p;

    var y = d / 2.5;
    container.style.transform = y ? 'translate3d(0, ' + y + 'px, 0)' : '';
    elControl.style.opacity = p;
    elControl.style.transform = 'translate3d(-50%, 0, 0) rotate(' + 360 * p + 'deg)';
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
      if (container.style.transform) {
        container.style.transition = 'transform 0.3s';
        container.style.transform = 'translate3d(0, 0, 0)';
        container.addEventListener('transitionend', function () {
          container.style.transition = '';
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
};

animates.aborting = animates.restoring;

return animates;

})));
