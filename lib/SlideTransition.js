'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp2, _class2, _temp4;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReplaceTransitionGroup = require('./ReplaceTransitionGroup');

var _ReplaceTransitionGroup2 = _interopRequireDefault(_ReplaceTransitionGroup);

var _compat = require('./util/compat');

var _compat2 = _interopRequireDefault(_compat);

var _style = require('dom-helpers/style');

var _style2 = _interopRequireDefault(_style);

var _width = require('dom-helpers/query/width');

var _width2 = _interopRequireDefault(_width);

var _configuration = require('./util/configuration');

var _configuration2 = _interopRequireDefault(_configuration);

var _2 = require('./util/_');

var _3 = _interopRequireDefault(_2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SlideChildGroup = (_temp2 = _class = function (_React$Component) {
  _inherits(SlideChildGroup, _React$Component);

  function SlideChildGroup() {
    var _temp, _this, _ret;

    _classCallCheck(this, SlideChildGroup);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.componentWillEnter = function (done) {
      var node = _compat2.default.findDOMNode(_this),
          width = (0, _width2.default)(node),
          direction = _this.props.direction;

      width = direction === 'left' ? width : -width;

      _this.ORGINAL_POSITION = node.style.position;

      (0, _style2.default)(node, { position: 'absolute', left: width + 'px', top: 0 });

      _configuration2.default.animate(node, { left: 0 }, _this.props.duration, function () {

        (0, _style2.default)(node, {
          position: _this.ORGINAL_POSITION,
          overflow: 'hidden'
        });

        _this.ORGINAL_POSITION = null;
        done && done();
      });
    }, _this.componentWillLeave = function (done) {
      var node = _compat2.default.findDOMNode(_this),
          width = (0, _width2.default)(node),
          direction = _this.props.direction;

      width = direction === 'left' ? -width : width;

      _this.ORGINAL_POSITION = node.style.position;

      (0, _style2.default)(node, { position: 'absolute', top: 0, left: 0 });

      _configuration2.default.animate(node, { left: width + 'px' }, _this.props.duration, function () {
        (0, _style2.default)(node, {
          position: _this.ORGINAL_POSITION,
          overflow: 'hidden'
        });

        _this.ORGINAL_POSITION = null;
        done && done();
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  SlideChildGroup.prototype.render = function render() {
    return _react2.default.Children.only(this.props.children);
  };

  return SlideChildGroup;
}(_react2.default.Component), _class.propTypes = {
  direction: _propTypes2.default.oneOf(['left', 'right']),
  duration: _propTypes2.default.number
}, _temp2);


module.exports = (_temp4 = _class2 = function (_React$Component2) {
  _inherits(_class2, _React$Component2);

  function _class2() {
    var _temp3, _this2, _ret2;

    _classCallCheck(this, _class2);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp3 = (_this2 = _possibleConstructorReturn(this, _React$Component2.call.apply(_React$Component2, [this].concat(args))), _this2), _this2._wrapChild = function (child, ref) {
      return _react2.default.createElement(
        SlideChildGroup,
        { key: child.key, ref: ref,
          direction: _this2.props.direction,
          duration: _this2.props.duration },
        child
      );
    }, _temp3), _possibleConstructorReturn(_this2, _ret2);
  }

  _class2.prototype.render = function render() {
    var _props = this.props,
        style = _props.style,
        children = _props.children;


    style = _extends({}, style, {
      position: 'relative',
      overflow: 'hidden'
    });

    return _react2.default.createElement(
      _ReplaceTransitionGroup2.default,
      _extends({}, _3.default.omitOwnProps(this), {
        ref: 'container',
        component: 'div',
        childFactory: this._wrapChild,
        style: style
      }),
      children
    );
  };

  return _class2;
}(_react2.default.Component), _class2.propTypes = {
  direction: _propTypes2.default.oneOf(['left', 'right']),
  duration: _propTypes2.default.number
}, _class2.defaultProps = {
  direction: 'left',
  duration: 250
}, _temp4);