import PropTypes from 'prop-types';
import React from 'react';

import _  from './util/_';

import Input from './Input';
import compat from './util/compat';
import { date as dateLocalizer } from './util/localizers';
import CustomPropTypes from './util/propTypes';

export default class extends React.Component {
  static displayName = 'DateTimePickerInput';

  static propTypes = {
    format: CustomPropTypes.dateFormat.isRequired,
    editing: PropTypes.bool,
    editFormat: CustomPropTypes.dateFormat,
    parse: PropTypes.func.isRequired,

    value: PropTypes.instanceOf(Date),
    onChange: PropTypes.func.isRequired,
    culture: PropTypes.string
  };

  constructor(props) {
    super(props);
    let { value, editing, editFormat, format, culture } = props;

    this.state = {
      textValue: formatDate(
          value
        , editing && editFormat ? editFormat : format
        , culture
      )
    };
  }

  componentWillReceiveProps(nextProps) {
    let { value, editing, editFormat, format, culture } = nextProps;

    this.setState({
      textValue: formatDate(
          value
        , editing && editFormat ? editFormat : format
        , culture
      )
    })
  }

  render() {
    let { disabled, readOnly } = this.props
    let { textValue } = this.state

    let props = _.omitOwnProps(this);

    return (
      <Input
        {...props}
        type='text'
        value={textValue}
        disabled={disabled}
        readOnly={readOnly}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        onKeyDown={this.handleKeyDown}
        size={textValue.length}
      />
    )
  }

  handleKeyDown = (event) => {
    if(event.key == 'Enter') {
      let date = this.props.parse(event.target.value);
      compat.findDOMNode(this).blur();
      this.props.onChange(date, formatDate(date, this.props.format, this.props.culture));
    } else if(event.key == 'Escape') {
      compat.findDOMNode(this).blur();
    }
  };

  handleChange = ({ target: { value } }) => {
    this._needsFlush = true
    this.setState({ textValue: value });
  };

  handleBlur = (event) => {
    let { format, culture, parse, onChange, onBlur } = this.props;

    onBlur && onBlur(event)

    if (this._needsFlush) {
      let date = parse(event.target.value);

      this._needsFlush = false
      onChange(date, formatDate(date, format, culture))
    }
  };

  focus = () => {
    compat.findDOMNode(this).focus()
  };
}

function isValid(d) {
  return !isNaN(d.getTime());
}

function formatDate(date, format, culture){
  var val = ''

  if ( (date instanceof Date) && isValid(date) )
    val = dateLocalizer.format(date, format, culture)

  return val;
}
