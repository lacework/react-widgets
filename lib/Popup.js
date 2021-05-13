'use strict';

exports.__esModule = true;
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _OVERFLOW, _class, _temp2;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _2 = require('./util/_');

var _3 = _interopRequireDefault(_2);

var _style = require('dom-helpers/style');

var _style2 = _interopRequireDefault(_style);

var _height = require('dom-helpers/query/height');

var _height2 = _interopRequireDefault(_height);

var _camelizeStyle = require('dom-helpers/util/camelizeStyle');

var _camelizeStyle2 = _interopRequireDefault(_camelizeStyle);

var _configuration = require('./util/configuration');

var _configuration2 = _interopRequireDefault(_configuration);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _compat = require('./util/compat');

var _compat2 = _interopRequireDefault(_compat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var transform = (0, _camelizeStyle2.default)(_configuration2.default.animate.transform);

var CLOSING = 0,
    CLOSED = 1,
    OPENING = 2,
    OPEN = 3;

function properties(prop, value) {
  var _ref, _ref2;

  var TRANSLATION_MAP = _configuration2.default.animate.TRANSLATION_MAP;

  if (TRANSLATION_MAP && TRANSLATION_MAP[prop]) return _ref = {}, _ref[transform] = TRANSLATION_MAP[prop] + '(' + value + ')', _ref;

  return _ref2 = {}, _ref2[prop] = value, _ref2;
}

var OVERFLOW = (_OVERFLOW = {}, _OVERFLOW[CLOSED] = 'hidden', _OVERFLOW[CLOSING] = 'hidden', _OVERFLOW[OPENING] = 'hidden', _OVERFLOW);

var propTypes = {
  open: _propTypes2.default.bool,
  dropUp: _propTypes2.default.bool,
  duration: _propTypes2.default.number,

  onClosing: _propTypes2.default.func,
  onOpening: _propTypes2.default.func,
  onClose: _propTypes2.default.func,
  onOpen: _propTypes2.default.func
};

var _default = (_temp2 = _class = function (_React$Component) {
  _inherits(_default, _React$Component);

  function _default() {
    var _temp, _this, _ret;

    _classCallCheck(this, _default);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      initialRender: true,
      status: _this.props.open ? OPENING : CLOSED
    }, _this.renderChildren = function () {
      if (!_this.props.children) return _react2.default.createElement('span', { className: 'rw-popup rw-widget' });

      var offset = _this.getOffsetForStatus(_this.state.status),
          child = _react2.default.Children.only(_this.props.children);

      return (0, _react.cloneElement)(child, {
        style: _extends({}, child.props.style, offset, {
          position: _this.isTransitioning() ? 'absolute' : undefined
        }),
        className: (0, _classnames2.default)(child.props.className, 'rw-popup rw-widget')
      });
    }, _this.open = function () {
      _this.cancelNextCallback();
      var el = _compat2.default.findDOMNode(_this).firstChild,
          height = _this.height();

      _this.props.onOpening();

      _this.safeSetState({ status: OPENING, height: height }, function () {
        var offset = _this.getOffsetForStatus(OPEN),
            duration = _this.props.duration;

        _this.animate(el, offset, duration, 'ease', function () {
          _this.safeSetState({ status: OPEN }, function () {
            _this.props.onOpen();
          });
        });
      });
    }, _this.close = function () {
      _this.cancelNextCallback();
      var el = _compat2.default.findDOMNode(_this).firstChild,
          height = _this.height();

      _this.props.onClosing();

      _this.safeSetState({ status: CLOSING, height: height }, function () {
        var offset = _this.getOffsetForStatus(CLOSED),
            duration = _this.props.duration;

        _this.animate(el, offset, duration, 'ease', function () {
          return _this.safeSetState({ status: CLOSED }, function () {
            _this.props.onClose();
          });
        });
      });
    }, _this.getOffsetForStatus = function (status) {
      var _CLOSED$CLOSING$OPENI;

      if (_this.state.initialRender) return {};

      var _in = properties('top', _this.props.dropUp ? '100%' : '-100%'),
          out = properties('top', 0);
      return (_CLOSED$CLOSING$OPENI = {}, _CLOSED$CLOSING$OPENI[CLOSED] = _in, _CLOSED$CLOSING$OPENI[CLOSING] = out, _CLOSED$CLOSING$OPENI[OPENING] = _in, _CLOSED$CLOSING$OPENI[OPEN] = out, _CLOSED$CLOSING$OPENI)[status] || {};
    }, _this.height = function () {
      var container = _compat2.default.findDOMNode(_this),
          content = container.firstChild,
          margin = parseInt((0, _style2.default)(content, 'margin-top'), 10) + parseInt((0, _style2.default)(content, 'margin-bottom'), 10);

      var old = container.style.display,
          height = void 0;

      container.style.display = 'block';
      height = ((0, _height2.default)(content) || 0) + (isNaN(margin) ? 0 : margin);
      container.style.display = old;
      return height;
    }, _this.isTransitioning = function () {
      return _this.state.status === OPENING || _this.state.status === CLOSED;
    }, _this.animate = function (el, props, dur, easing, cb) {
      _this._transition = _configuration2.default.animate(el, props, dur, easing, _this.setNextCallback(cb));
    }, _this.cancelNextCallback = function () {
      if (_this._transition && _this._transition.cancel) {
        _this._transition.cancel();
        _this._transition = null;
      }
      if (_this.nextCallback) {
        _this.nextCallback.cancel();
        _this.nextCallback = null;
      }
    }, _this.safeSetState = function (nextState, callback) {
      _this.setState(nextState, _this.setNextCallback(callback));
    }, _this.setNextCallback = function (callback) {
      var active = true;

      _this.nextCallback = function (event) {
        if (active) {
          active = false;
          _this.nextCallback = null;
          callback(event);
        }
      };

      _this.nextCallback.cancel = function () {
        return active = false;
      };
      return _this.nextCallback;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _default.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState({
      contentChanged: childKey(nextProps.children) !== childKey(this.props.children)
    });
  };

  _default.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    var isOpen = this.state.status === OPENING;

    _compat2.default.batchedUpdates(function () {
      _this2.setState({ initialRender: false });
      if (isOpen) {
        _this2.open();
      }
    });
  };

  _default.prototype.componentDidUpdate = function componentDidUpdate(pvProps) {
    var closing = pvProps.open && !this.props.open,
        opening = !pvProps.open && this.props.open,
        open = this.props.open,
        status = this.state.status;

    if (!!pvProps.dropUp !== !!this.props.dropUp) {
      this.cancelNextCallback();
      if (status === OPENING) this.open();
      if (status === CLOSING) this.close();
      return;
    }

    if (opening) this.open();else if (closing) this.close();else if (open) {
      // this.height() returns a floating point number with the desired height
      // for this popup. Because of potential rounding errors in floating point
      // aritmetic we must allow an error margin when comparing to the current
      // state, otherwise we can end up in an infinite loop where the height
      // is never exactly equal to our target value.
      var height = this.height(),
          diff = Math.abs(height - this.state.height);
      if (isNaN(diff) || diff > 0.1) this.setState({ height: height });
    }
  };

  _default.prototype.render = function render() {
    var _props = this.props,
        className = _props.className,
        dropUp = _props.dropUp,
        style = _props.style,
        _state = this.state,
        status = _state.status,
        height = _state.height;


    var overflow = OVERFLOW[status] || 'visible',
        display = status === CLOSED ? 'none' : 'block';

    return _react2.default.createElement(
      'div',
      {
        style: _extends({
          display: display,
          overflow: overflow,
          height: height
        }, style),
        className: (0, _classnames2.default)(className, 'rw-popup-container', dropUp && 'rw-dropup', this.isTransitioning() && 'rw-popup-animating')
      },
      this.renderChildren()
    );
  };

  return _default;
}(_react2.default.Component), _class.displayName = 'Popup', _class.propTypes = propTypes, _class.defaultProps = {
  duration: 200,
  open: false,
  onClosing: function onClosing() {},
  onOpening: function onOpening() {},
  onClose: function onClose() {},
  onOpen: function onOpen() {}
}, _temp2);

exports.default = _default;


function childKey(children) {
  var nextChildMapping = _react2.default.Children.map(children, function (c) {
    return c;
  });
  for (var key in nextChildMapping) {
    return key;
  }
}
module.exports = exports['default'];