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

var _propTypes3 = require('./util/propTypes');

var _propTypes4 = _interopRequireDefault(_propTypes3);

var _localizers = require('./util/localizers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getFormat = function getFormat(props) {
  return _localizers.number.getFormat('default', props.format);
};

var propTypes = {
  value: _propTypes2.default.number,
  editing: _propTypes2.default.bool,
  placeholder: _propTypes2.default.string,

  format: _propTypes4.default.numberFormat,

  parse: _propTypes2.default.func,
  culture: _propTypes2.default.string,

  min: _propTypes2.default.number,

  onChange: _propTypes2.default.func.isRequired,
  onKeyDown: _propTypes2.default.func
};

var _default = (_temp2 = _class = function (_React$Component) {
  _inherits(_default, _React$Component);

  function _default() {
    var _temp, _this, _ret;

    _classCallCheck(this, _default);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.getDefaultState = function () {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.props;

      var value = props.value,
          decimal = _localizers.number.decimalChar(null, props.culture),
          format = getFormat(props);

      if (value == null || isNaN(props.value)) value = '';else value = props.editing ? ('' + value).replace('.', decimal) : _localizers.number.format(value, format, props.culture);

      return {
        stringValue: '' + value
      };
    }, _this._change = function (e) {
      var val = e.target.value,
          number = _this._parse(e.target.value);

      var isIntermediate = _this.isIntermediateValue(number, val);

      if (val == null || val.trim() === '') {
        _this.current('');
        return _this.props.onChange(null);
      }

      if (!isIntermediate) {
        if (number !== _this.props.value) {
          return _this.props.onChange(number);
        }
      } else {
        _this.current(e.target.value);
      }
    }, _this._finish = function () {
      var str = _this.state.stringValue,
          number = _this._parse(str);

      // if number is below the min
      // we need to flush low values and decimal stops, onBlur means i'm done inputing
      if (_this.isIntermediateValue(number, str)) {
        if (isNaN(number)) {
          number = null;
        }
        _this.props.onChange(number);
      }
    }, _this._parse = function (strVal) {
      var culture = _this.props.culture,
          delimChar = _localizers.number.decimalChar(null, culture),
          userParse = _this.props.parse;

      if (userParse) return userParse(strVal, culture);

      strVal = strVal.replace(delimChar, '.');
      strVal = parseFloat(strVal);

      return strVal;
    }, _this.isIntermediateValue = function (num, str) {
      return !!(num < _this.props.min || _this.isSign(str) || _this.isAtDelimiter(num, str) || _this.isPaddedZeros(str));
    }, _this.isSign = function (val) {
      return (val || '').trim() === '-';
    }, _this.isPaddedZeros = function (str) {
      var localeChar = _localizers.number.decimalChar(null, _this.props.culture);

      var _str$split = str.split(localeChar),
          _ = _str$split[0],
          decimals = _str$split[1];

      return !!(decimals && decimals.match(/0+$/));
    }, _this.isAtDelimiter = function (num, str) {
      var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _this.props;

      var localeChar = _localizers.number.decimalChar(null, props.culture),
          lastIndex = str.length - 1,
          char;

      if (str.length < 1) return false;

      char = str[lastIndex];

      return !!(char === localeChar && str.indexOf(char) === lastIndex);
    }, _this.isValid = function (num) {
      if (typeof num !== 'number' || isNaN(num)) return false;
      return num >= _this.props.min;
    }, _this.current = function (stringValue) {
      _this.setState({ stringValue: stringValue });
    }, _this.state = _this.getDefaultState(), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _default.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState(this.getDefaultState(nextProps));
  };

  _default.prototype.render = function render() {
    var value = this.state.stringValue;
    var props = _3.default.omitOwnProps(this);

    return _react2.default.createElement('input', _extends({}, props, {
      type: 'text',
      className: 'rw-input',
      onChange: this._change,
      onBlur: this._finish,
      'aria-disabled': this.props.disabled,
      'aria-readonly': this.props.readOnly,
      disabled: this.props.disabled,
      readOnly: this.props.readOnly,
      placeholder: this.props.placeholder,
      value: value
    }));
  };

  //this intermediate state is for when one runs into the decimal or are typing the number


  return _default;
}(_react2.default.Component), _class.displayName = 'NumberPickerInput', _class.propTypes = propTypes, _class.defaultProps = {
  value: null,
  editing: false
}, _temp2);

exports.default = _default;
module.exports = exports['default'];