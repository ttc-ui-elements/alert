(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TtcAlert = function (_HTMLElement) {
  _inherits(TtcAlert, _HTMLElement);

  _createClass(TtcAlert, [{
    key: 'type',
    get: function get() {
      return this.getAttribute('type');
    },
    set: function set(value) {
      return this.setAttribute('type', value);
    }
  }, {
    key: 'dismiss',
    get: function get() {
      return this.getAttribute('dismiss');
    },
    set: function set(value) {
      return this.setAttribute('type', value);
    }
  }, {
    key: 'buttonText',
    get: function get() {
      return this.getAttribute('button-text') || 'Close';
    },
    set: function set(value) {
      return this.setAttribute('button-text', value);
    }
  }], [{
    key: 'observedAttributes',

    /*
     * Attributes
     *
     * type: controls the color of the alert
     * dismiss: Sets a close button for discarding the alert
     * button-text: The text of the button (for i18n)
     *
     */

    /*
     * Events
     *
     * ttc.alert.show: fired on alert display
     * ttc.alert.hide: fired on alert dismiss
     *
     */

    /*
     * Methods
     *
     * close: dismisses the alert
     *
     */

    /* Attributes to monitor */
    get: function get() {
      return ['type', 'dismiss'];
    }
  }]);

  function TtcAlert() {
    _classCallCheck(this, TtcAlert);

    var _this = _possibleConstructorReturn(this, (TtcAlert.__proto__ || Object.getPrototypeOf(TtcAlert)).call(this));

    _this.hasDismissButton = false;
    _this.closeButton = '';

    _this.dispatchCustomEvent = _this.dispatchCustomEvent.bind(_this);
    _this.appendCloseButton = _this.appendCloseButton.bind(_this);
    _this.removeCloseButton = _this.removeCloseButton.bind(_this);
    _this.render = _this.render.bind(_this);
    _this.close = _this.close.bind(_this);
    return _this;
  }

  /* Lifecycle, element appended to the DOM */


  _createClass(TtcAlert, [{
    key: 'connectedCallback',
    value: function connectedCallback() {
      if (!this.type || this.type && ['info', 'warning', 'danger', 'success'].indexOf(this.type) === -1) {
        this.type = 'info';
      }

      this.render();

      this.dispatchCustomEvent('ttc.alert.show');
    }

    /* Lifecycle, element removed from the DOM */

  }, {
    key: 'disconnectedCallback',
    value: function disconnectedCallback() {
      if (this.closeButton) {
        this.closeButton.removeEventListener('click', this.close);
      }
    }

    /* Respond to attribute changes */

  }, {
    key: 'attributeChangedCallback',
    value: function attributeChangedCallback(attr, oldValue, newValue) {
      switch (attr) {
        case 'type':
          if (!newValue || newValue && ['info', 'warning', 'danger', 'success'].indexOf(newValue) === -1) {
            this.type = 'info';
          }
          break;
        case 'dismiss':
        case 'title':
        case 'message':
        case 'button-text':
          this.render();
          break;
        default:
          break;
      }
    }

    /* Method to dispatch events */

  }, {
    key: 'dispatchCustomEvent',
    value: function dispatchCustomEvent(eventName) {
      var OriginalCustomEvent = new CustomEvent(eventName);
      this.dispatchEvent(OriginalCustomEvent);
      this.removeEventListener(eventName, OriginalCustomEvent);
    }

    /* Method to close the alert */

  }, {
    key: 'close',
    value: function close() {
      this.dispatchCustomEvent('ttc.alert.hide');
      this.removeAttribute('show');
      this.parentNode.removeChild(this);
    }

    /* Method to create the close button */

  }, {
    key: 'appendCloseButton',
    value: function appendCloseButton() {
      this.setAttribute('role', 'alert');
      this.closeButton = this.querySelector('button');

      if (!this.closeButton) {
        this.closeButton = document.createElement('button');
      }

      this.closeButton.innerText = this.buttonText;
      this.closeButton.setAttribute('aria-label', this.buttonText);
      this.closeButton.setAttribute('type', 'button');
      this.insertAdjacentElement('afterbegin', this.closeButton);
      this.closeButton.addEventListener('click', this.close);
      this.closeButton.focus();
    }

    /* Method to remove the close button */

  }, {
    key: 'removeCloseButton',
    value: function removeCloseButton() {
      if (this.closeButton) {
        this.closeButton.removeEventListener('click', this.close);
        this.removeChild(this.closeButton);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.hasAttribute('dismiss') || this.dismiss && this.dismiss !== 'false') {
        this.removeCloseButton();
      } else {
        this.appendCloseButton();
      }
    }
  }]);

  return TtcAlert;
}(HTMLElement);

exports.default = TtcAlert;

},{}]},{},[1]);
