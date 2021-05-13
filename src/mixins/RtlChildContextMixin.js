import PropTypes from 'prop-types';
import  React from 'react';

export default {

  contextTypes: {
    isRtl: PropTypes.bool
  },

  isRtl() {
    return !!this.context.isRtl
  }

}
