import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import cn from 'classnames';

import compat from './util/compat';
import Widget from './Widget';
import Header from './Header';
import Footer from './Footer';
import Month from './Month';
import Year from './Year';
import Decade from './Decade';
import Century from './Century';
import { date as dateLocalizer } from './util/localizers';
import CustomPropTypes from './util/propTypes';

import createUncontrolledWidget from 'uncontrollable';
import SlideTransition from './SlideTransition';
import dates from './util/dates';
import * as constants from './util/constants';
import _ from './util/_'; //values, omit
import { instanceId, notify } from './util/widgetHelpers';
import { widgetEditable } from './util/interaction';

let dir    = constants.directions
  , values = obj => Object.keys(obj).map( k => obj[k] )
  , invert = obj => _.transform(obj, (o, val, key) => { o[val] = key }, {});

let views        = constants.calendarViews
  , VIEW_OPTIONS = values(views)
  , ALT_VIEW     = invert(constants.calendarViewHierarchy)
  , NEXT_VIEW    = constants.calendarViewHierarchy
  , VIEW_UNIT    = constants.calendarViewUnits
  , VIEW  = {
      [views.MONTH]:   Month,
      [views.YEAR]:    Year,
      [views.DECADE]:  Decade,
      [views.CENTURY]: Century
    };

let ARROWS_TO_DIRECTION = {
  ArrowDown:  dir.DOWN,
  ArrowUp:    dir.UP,
  ArrowRight: dir.RIGHT,
  ArrowLeft:  dir.LEFT
}

let OPPOSITE_DIRECTION = {
  [dir.LEFT]:  dir.RIGHT,
  [dir.RIGHT]: dir.LEFT
};

let MULTIPLIER = {
  [views.YEAR]:    1,
  [views.DECADE]:  10,
  [views.CENTURY]: 100
};

let format = (props, f) => dateLocalizer.getFormat(f, props[f + 'Format'])


let propTypes = {

  disabled:       CustomPropTypes.disabled,
  readOnly:       CustomPropTypes.readOnly,

  onChange:      PropTypes.func,
  value:         PropTypes.instanceOf(Date),

  min:           PropTypes.instanceOf(Date),
  max:           PropTypes.instanceOf(Date),

  currentDate:         PropTypes.instanceOf(Date),
  onCurrentDateChange: PropTypes.func,

  view: PropTypes.oneOf(VIEW_OPTIONS),
  initialView: PropTypes.oneOf(VIEW_OPTIONS),


  finalView(props, propName, componentName, ...args) {
    var err = PropTypes.oneOf(VIEW_OPTIONS)(props, propName, componentName, ...args)

    if (err) return err
    if (VIEW_OPTIONS.indexOf(props[propName]) < VIEW_OPTIONS.indexOf(props.initialView))
      return new Error(`The \`${propName}\` prop: \`${props[propName]}\` cannot be 'lower' than the \`initialView\`
        prop. This creates a range that cannot be rendered.`.replace(/\n\t/g, ''))
  },

  onViewChange:  PropTypes.func,
  onNavigate:    PropTypes.func,
  culture:       PropTypes.string,
  footer:        PropTypes.bool,

  dayComponent:  CustomPropTypes.elementType,
  headerFormat:  CustomPropTypes.dateFormat,
  footerFormat:  CustomPropTypes.dateFormat,

  dayFormat:     CustomPropTypes.dateFormat,
  dateFormat:    CustomPropTypes.dateFormat,
  monthFormat:   CustomPropTypes.dateFormat,
  yearFormat:    CustomPropTypes.dateFormat,
  decadeFormat:  CustomPropTypes.dateFormat,
  centuryFormat: CustomPropTypes.dateFormat,

  messages:      PropTypes.shape({
    moveBack:     PropTypes.string,
    moveForward:  PropTypes.string
  })
}

let Calendar = createReactClass({

  displayName: 'Calendar',

  mixins: [
    require('./mixins/TimeoutMixin'),
    require('./mixins/AutoFocusMixin'),
    require('./mixins/PureRenderMixin'),
    require('./mixins/RtlParentContextMixin'),
    require('./mixins/AriaDescendantMixin')(),
    require('./mixins/FocusMixin')({
      willHandle() {
        if (+this.props.tabIndex === -1)
          return false
      }
    })
  ],

  propTypes,

  getInitialState() {
    return {
      selectedIndex: 0,
      view: this.props.initialView || 'month'
    }
  },

  getDefaultProps() {
    return {

      value: null,
      min: new Date(1900, 0, 1),
      max: new Date(2099, 11, 31),
      currentDate: new Date(),

      initialView: 'month',
      finalView: 'century',

      tabIndex: '0',
      footer: false,

      ariaActiveDescendantKey: 'calendar',
      messages: msgs({})
    }
  },

  componentWillMount() {
    this.changeCurrentDate(this.props.value)
  },

  componentWillReceiveProps(nextProps) {
    var bottom = VIEW_OPTIONS.indexOf(nextProps.initialView)
        , top = VIEW_OPTIONS.indexOf(nextProps.finalView)
        , current = VIEW_OPTIONS.indexOf(this.state.view)
        , view = this.state.view
        , val = this.inRangeValue(nextProps.value);

    if (current < bottom)
      this.setState({view: view = nextProps.initialView})
    else if (current > top)
      this.setState({view: view = nextProps.finalView})

    //if the value changes reset views to the new one
    if (!dates.eq(val, dateOrNull(this.props.value), VIEW_UNIT[view])) {
      this.changeCurrentDate(val, nextProps.currentDate)
    }
  },

  render() {

    let {
      className
      , value
      , footerFormat
      , disabled
      , readOnly
      , finalView
      , footer
      , messages
      , min
      , max
      , culture
      , duration
      , tabIndex
      , currentDate
    } = this.props

    let {view, slideDirection, focused} = this.state;

    var View = VIEW[view]
        , unit = VIEW_UNIT[view]
        , todaysDate = new Date()
        , todayNotInRange = !dates.inRange(todaysDate, min, max, view)

    unit = unit === 'day' ? 'date' : unit

    let viewID = instanceId(this, '_calendar')
        , labelID = instanceId(this, '_calendar_label')
        , key = view + '_' + dates[view](currentDate);

    let elementProps = _.omitOwnProps(this)
        , viewProps = _.pickProps(this.props, View)

    let isDisabled = disabled || readOnly

    messages = msgs(this.props.messages)

    return (
        <Widget
            {...elementProps}
            role='group'
            focused={focused}
            disabled={disabled}
            readOnly={readOnly}
            tabIndex={tabIndex || 0}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onKeyDown={this.handleKeyDown}
            className={cn(className, 'rw-calendar')}
        >
          <Header
              label={this._label()}
              labelId={labelID}
              messages={messages}
              upDisabled={isDisabled || view === finalView}
              prevDisabled={isDisabled || !dates.inRange(this.nextDate(dir.LEFT), min, max, view)}
              nextDisabled={isDisabled || !dates.inRange(this.nextDate(dir.RIGHT), min, max, view)}
              onViewChange={this.navigate.bind(null, dir.UP, null)}
              onMoveLeft={this.navigate.bind(null, dir.LEFT, null)}
              onMoveRight={this.navigate.bind(null, dir.RIGHT, null)}
          />
          <SlideTransition
              ref='animation'
              duration={duration}
              direction={slideDirection}
              onAnimate={() => focused && this.focus()}
          >
            <View
                {...viewProps}
                key={key}
                id={viewID}
                value={value}
                today={todaysDate}
                focused={currentDate}
                onChange={this.change}
                onKeyDown={this.handleKeyDown}
                aria-labelledby={labelID}
                ariaActiveDescendantKey='calendarView'
            />
          </SlideTransition>
          {footer &&
          <Footer
              value={todaysDate}
              format={footerFormat}
              culture={culture}
              disabled={disabled || todayNotInRange}
              readOnly={readOnly}
              onClick={this.select}
          />
          }
        </Widget>
    )
  },

  @widgetEditable
  navigate(direction, date) {
    var view = this.state.view
        , slideDir = (direction === dir.LEFT || direction === dir.UP)
        ? 'right'
        : 'left';

    if (!date)
      date = [dir.LEFT, dir.RIGHT].indexOf(direction) !== -1
          ? this.nextDate(direction)
          : this.props.currentDate

    if (direction === dir.DOWN)
      view = ALT_VIEW[view] || view

    if (direction === dir.UP)
      view = NEXT_VIEW[view] || view

    if (this.isValidView(view) && dates.inRange(date, this.props.min, this.props.max, view)) {
      notify(this.props.onNavigate, [date, slideDir, view])
      this.focus(true);

      this.changeCurrentDate(date);

      this.setState({
        slideDirection: slideDir,
        view: view
      })
    }
  },

  focus() {
    if (+this.props.tabIndex > -1)
      compat.findDOMNode(this).focus()
  },

  @widgetEditable
  change(date) {
    if (this.state.view === this.props.initialView) {
      this.changeCurrentDate(date)
      notify(this.props.onChange, date)
      this.focus();
      return;
    }

    this.navigate(dir.DOWN, date)
  }
});

function dateOrNull(dt){
  if(dt && !isNaN(dt.getTime())) return dt
  return null
}

function msgs(msgs){
  return {
    moveBack:     'navigate back',
    moveForward:  'navigate forward',
    ...msgs
  }
}


export default createUncontrolledWidget(Calendar, {
  value: 'onChange',
  currentDate: 'onCurrentDateChange',
  view: 'onViewChange'
}, ['focus']);
