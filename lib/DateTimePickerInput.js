'use strict';

exports.__esModule = true;
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp, _initialiseProps;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _2 = require('./util/_');

var _3 = _interopRequireDefault(_2);

var _Input = require('./Input');

var _Input2 = _interopRequireDefault(_Input);

var _compat = require('./util/compat');

var _compat2 = _interopRequireDefault(_compat);

var _localizers = require('./util/localizers');

var _propTypes3 = require('./util/propTypes');

var _propTypes4 = _interopRequireDefault(_propTypes3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _default = (_temp = _class = function (_React$Component) {
  _inherits(_default, _React$Component);

  function _default(props) {
    _classCallCheck(this, _default);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _initialiseProps.call(_this);

    var value = props.value,
        editing = props.editing,
        editFormat = props.editFormat,
        format = props.format,
        culture = props.culture;


    _this.state = {
      textValue: formatDate(value, editing && editFormat ? editFormat : format, culture)
    };
    return _this;
  }

  _default.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var value = nextProps.value,
        editing = nextProps.editing,
        editFormat = nextProps.editFormat,
        format = nextProps.format,
        culture = nextProps.culture;


    this.setState({
      textValue: formatDate(value, editing && editFormat ? editFormat : format, culture)
    });
  };

  _default.prototype.render = function render() {
    var _props = this.props,
        disabled = _props.disabled,
        readOnly = _props.readOnly;
    var textValue = this.state.textValue;


    var props = _3.default.omitOwnProps(this);

    return _react2.default.createElement(_Input2.default, _extends({}, props, {
      type: 'text',
      value: textValue,
      disabled: disabled,
      readOnly: readOnly,
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      onKeyDown: this.handleKeyDown,
      size: textValue.length
    }));
  };

  return _default;
}(_react2.default.Component), _class.displayName = 'DateTimePickerInput', _class.propTypes = {
  format: _propTypes4.default.dateFormat.isRequired,
  editing: _propTypes2.default.bool,
  editFormat: _propTypes4.default.dateFormat,
  parse: _propTypes2.default.func.isRequired,

  value: _propTypes2.default.instanceOf(Date),
  onChange: _propTypes2.default.func.isRequired,
  culture: _propTypes2.default.string
}, _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.handleKeyDown = function (event) {
    if (event.key == 'Enter') {
      var date = _this2.props.parse(event.target.value);
      _compat2.default.findDOMNode(_this2).blur();
      _this2.props.onChange(date, formatDate(date, _this2.props.format, _this2.props.culture));
    } else if (event.key == 'Escape') {
      _compat2.default.findDOMNode(_this2).blur();
    }
  };

  this.handleChange = function (_ref) {
    var value = _ref.target.value;

    _this2._needsFlush = true;
    _this2.setState({ textValue: value });
  };

  this.handleBlur = function (event) {
    var _props2 = _this2.props,
        format = _props2.format,
        culture = _props2.culture,
        parse = _props2.parse,
        onChange = _props2.onChange,
        onBlur = _props2.onBlur;


    onBlur && onBlur(event);

    if (_this2._needsFlush) {
      var date = parse(event.target.value);

      _this2._needsFlush = false;
      onChange(date, formatDate(date, format, culture));
    }
  };

  this.focus = function () {
    _compat2.default.findDOMNode(_this2).focus();
  };
}, _temp);

exports.default = _default;


function isValid(d) {
  return !isNaN(d.getTime());
}

function formatDate(date, format, culture) {
  var val = '';

  if (date instanceof Date && isValid(date)) val = _localizers.date.format(date, format, culture);

  return val;
}
module.exports = exports['default'];