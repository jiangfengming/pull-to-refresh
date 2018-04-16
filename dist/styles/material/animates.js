(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.ptrAnimatesMaterial = factory());
}(this, (function () { 'use strict';

  var animates = {
    pulling: function pulling(d, opts) {
      if (!opts.elControl) opts.elControl = opts.container.querySelector('.pull-to-refresh-material__control');

      var threshold = opts.threshold,
          elControl = opts.elControl;


      var p = d / threshold;
      if (p > 1) p = 1;else p = p * p * p;
      var y = d / 2.5;

      elControl.style.opacity = p;
      elControl.style.transform = y ? 'translate3d(-50%, ' + y + 'px, 0) rotate(' + 360 * p + 'deg)' : '';
    },
    refreshing: function refreshing(_ref) {
      var elControl = _ref.elControl,
          threshold = _ref.threshold;

      elControl.style.transition = 'transform 0.2s';
      elControl.style.transform = 'translate3d(-50%, ' + threshold / 2.5 + 'px, 0)';
    },
    aborting: function aborting(_ref2) {
      var elControl = _ref2.elControl;

      return new Promise(function (resolve) {
        if (elControl.style.transform) {
          elControl.style.transition = 'transform 0.3s, opacity 0.15s';
          elControl.style.transform = 'translate3d(-50%, 0, 0)';
          elControl.style.opacity = 0;
          elControl.addEventListener('transitionend', function () {
            elControl.style.transition = '';
            resolve();
          });
        } else {
          resolve();
        }
      });
    },
    restoring: function restoring(_ref3) {
      var elControl = _ref3.elControl;

      return new Promise(function (resolve) {
        elControl.style.transition = 'transform 0.3s';
        elControl.style.transform += ' scale(0.01)';
        elControl.addEventListener('transitionend', function () {
          elControl.style.transition = '';
          resolve();
        });
      });
    }
  };

  return animates;

})));
