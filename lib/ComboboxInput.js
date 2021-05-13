'use strict';

exports.__esModule = true;
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp2;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _2 = require('./util/_');

var _3 = _interopRequireDefault(_2);

var _caret = require('./util/caret');

var _caret2 = _interopRequireDefault(_caret);

var _compat = require('./util/compat');

var _compat2 = _interopRequireDefault(_compat);

var _Input = require('./Input');

var _Input2 = _interopRequireDefault(_Input);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _default = (_temp2 = _class = function (_React$Component) {
  _inherits(_default, _React$Component);

  function _default() {
    var _temp, _this, _ret;

    _classCallCheck(this, _default);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.isSuggesting = function () {
      var val = _this.props.value,
          isSuggestion = _this._last != null && val.toLowerCase().indexOf(_this._last.toLowerCase()) !== -1;

      return _this.props.suggest && isSuggestion;
    }, _this.accept = function (removeCaret) {
      var val = _compat2.default.findDOMNode(_this).value || '',
          end = val.length;

      _this._last = null;
      removeCaret && (0, _caret2.default)(_compat2.default.findDOMNode(_this), end, end);
    }, _this.handleChange = function (e) {
      var val = e.target.value,
          pl = !!_this.props.placeholder;

      // IE fires input events when setting/unsetting placeholders.
      // issue #112
      if (pl && !val && val === (_this.props.value || '')) return;

      _this._last = val;
      _this.props.onChange(e, val);
    }, _this.focus = function () {
      _compat2.default.findDOMNode(_this).focus();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _default.prototype.componentDidUpdate = function componentDidUpdate() {
    var input = _compat2.default.findDOMNode(this),
        val = this.props.value;

    if (this.isSuggesting()) {
      var start = val.toLowerCase().indexOf(this._last.toLowerCase()) + this._last.length,
          end = val.length - start;

      if (start >= 0) {
        (0, _caret2.default)(input, start, start + end);
      }
    }
  };

  _default.prototype.render = function render() {
    var _props = this.props,
        onKeyDown = _props.onKeyDown,
        props = _objectWithoutProperties(_props, ['onKeyDown']);

    delete props.suggest;

    return _react2.default.createElement(_Input2.default, _extends({}, props, {
      onKeyDown: onKeyDown,
      onChange: this.handleChange
    }));
  };

  return _default;
}(_react2.default.Component), _class.displayName = 'ComboboxInput', _class.propTypes = {
  value: _propTypes2.default.string,
  suggest: _propTypes2.default.bool,
  onChange: _propTypes2.default.func.isRequired
}, _class.defaultProps = {
  value: ''
}, _temp2);

exports.default = _default;
module.exports = exports['default'];