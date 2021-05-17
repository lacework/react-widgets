'use strict';
var PropTypes = require('prop-types');
var React = require('react')

module.exports = {

  propTypes: {
    isRtl: PropTypes.bool
  },

  contextTypes: {
    isRtl: PropTypes.bool
  },

  childContextTypes: {
    isRtl: PropTypes.bool
  },

  getChildContext() {
    return {
      isRtl: !!(this.props.isRtl || (this.context && this.context.isRtl))
    }
  },

  isRtl() {
    return !!(this.props.isRtl || (this.context && this.context.isRtl))
  }

}
