'use strict';

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Button = require('./Button');

var _Button2 = _interopRequireDefault(_Button);

var _localizers = require('./util/localizers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var format = function format(props) {
  return _localizers.date.getFormat('footer', props.format);
};

module.exports = (_temp = _class = function (_React$Component) {
  _inherits(_class, _React$Component);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  _class.prototype.render = function render() {
    var _props = this.props,
        disabled = _props.disabled,
        readOnly = _props.readOnly,
        value = _props.value;


    return _react2.default.createElement(
      'div',
      { className: 'rw-footer' },
      _react2.default.createElement(
        _Button2.default,
        {
          disabled: !!(disabled || readOnly),
          onClick: this.props.onClick.bind(null, value)
        },
        _localizers.date.format(value, format(this.props), this.props.culture)
      )
    );
  };

  return _class;
}(_react2.default.Component), _class.displayName = 'Footer', _temp);