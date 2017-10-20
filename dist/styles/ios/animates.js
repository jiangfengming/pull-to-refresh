(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ptrAnimatesIos = factory());
}(this, (function () { 'use strict';

var animates = {
  pulling: function pulling(d, opts) {
    if (!opts.elSpinner) {
      opts.elMain = opts.container.querySelector('.pull-to-refresh-ios__main');
      opts.elSpinner = opts.container.querySelector('.pull-to-refresh-ios__spinner');
    }

    var threshold = opts.threshold,
        elMain = opts.elMain,
        elSpinner = opts.elSpinner;


    var p = d / threshold;
    if (p > 1) p = 1;else p = p * p * p;

    var spinnerCls = Math.floor(p * 12);
    if (opts.spinnerCls !== spinnerCls) {
      if (opts.spinnerCls) elSpinner.classList.remove('pull-to-refresh-ios__spinner--s' + opts.spinnerCls);
      if (spinnerCls) elSpinner.classList.add('pull-to-refresh-ios__spinner--s' + spinnerCls);
      opts.spinnerCls = spinnerCls;
    }

    var y = d / 2.5;
    elMain.style.transform = y ? 'translate3d(0, ' + y + 'px, 0)' : '';
  },
  refreshing: function refreshing(_ref) {
    var elMain = _ref.elMain,
        threshold = _ref.threshold;

    elMain.style.transition = 'transform 0.2s';
    elMain.style.transform = 'translate3d(0, ' + threshold / 2.5 + 'px, 0)';
  },
  aborting: function aborting(opts) {
    return new Promise(function (resolve) {
      var elMain = opts.elMain,
          elSpinner = opts.elSpinner;


      var n = opts.spinnerCls;
      opts.spinnerCls = null;
      if (n) {
        var timer = setInterval(function () {
          elSpinner.classList.remove('pull-to-refresh-ios__spinner--s' + n);
          if (--n === 0) clearInterval(timer);else elSpinner.classList.add('pull-to-refresh-ios__spinner--s' + n);
        }, 300 / n);
      }

      if (elMain.style.transform) {
        elMain.style.transition = 'transform 0.3s';
        elMain.style.transform = 'translate3d(0, 0, 0)';
        elMain.addEventListener('transitionend', function () {
          elMain.style.transition = '';
          resolve();
        });
      } else {
        resolve();
      }
    });
  },
  restoring: function restoring(opts) {
    return new Promise(function (resolve) {
      var elMain = opts.elMain,
          elSpinner = opts.elSpinner,
          spinnerCls = opts.spinnerCls;

      if (spinnerCls) elSpinner.classList.remove('pull-to-refresh-ios__spinner--s' + spinnerCls);
      opts.spinnerCls = null;
      elMain.style.transition = 'transform 0.3s';
      elMain.style.transform = 'translate3d(0, 0, 0)';
      elMain.addEventListener('transitionend', function () {
        elMain.style.transition = '';
        resolve();
      });
    });
  }
};

return animates;

})));
