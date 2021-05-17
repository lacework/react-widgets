import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import _  from './util/_';

class ListOption extends React.Component {
  static propTypes = {
    dataItem: PropTypes.any,
    focused:  PropTypes.bool,
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool
  };

  render() {
    let { className, children, focused, selected, disabled, readOnly } = this.props;

    let props = _.omitOwnProps(this);

    let classes = {
      'rw-state-focus':    focused,
      'rw-state-selected': selected,
      'rw-state-disabled': disabled,
      'rw-state-readonly': readOnly
    };

    return (
      <li
        role='option'
        tabIndex={!(disabled || readOnly) ? '-1' : undefined}
        aria-selected={!!selected}
        className={cn('rw-list-option', className, classes)}
        {...props}
      >
        {children}
      </li>
    );
  }
}

export default ListOption;
