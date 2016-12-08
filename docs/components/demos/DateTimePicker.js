import React from 'react';
import dates from 'date-arithmetic';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import RW from 'react-widgets';

import Demo, { createSetter } from '../Demo';
import Layout from '../Layout';
import { CULTURES, VIEWS } from './Calendar';


export default class DateTimePickerDemo extends React.Component {
  state = {
    calendar: true,
    time: true,
    format: 'f',
    views: VIEWS,
  }


  render() {
    const {
        isRtl, min, max, views, format, culture
      , disabled, readOnly, time, calendar } = this.state


    let minMaxFormat = time && calendar
      ? 'MM/dd/yyyy h:mm tt'
      : time ? 't' : 'd'

    let setter = createSetter(this)

    let props = {
      max: max || undefined,
      min: min || undefined,
      ...this.state,
    }


    return (
      <Demo shortcuts={this.props.shortcuts}>
        <Demo.Stage>
          <div className='form-group'>
            <RW.DateTimePicker defaultValue={new Date()} {...props}/>
          </div>
          <div className='form-group'>
            <label>Custom Rendering</label>
            <RW.DateTimePicker {...props} timeComponent={itemComp}/>
          </div>
        </Demo.Stage>
        <Demo.Controls>
          <Layout justify="space-between">
            <Demo.Control label='culture' flex>
              <RW.DropdownList
                value={culture || CULTURES[0]}
                data={CULTURES}
                onChange={setter('culture')}
              />
            </Demo.Control>

            <Demo.Control flex>
              <ButtonGroup>
                <Button
                  active={disabled}
                  onClick={setter('disabled', !disabled)}
                >
                  Disable
                </Button>
                <Button
                  active={readOnly}
                  onClick={setter('readOnly', !readOnly)}
                >
                  Readonly
                </Button>
              </ButtonGroup>
            </Demo.Control>
          </Layout>

          <Demo.Control label="views" flex>
            <RW.Multiselect
              value={views.length ? views : ['month']}
              data={VIEWS}
              onChange={(views) => setter('views')(
                VIEWS.filter(v => ~views.indexOf(v) // correct order
              ))}
            />
          </Demo.Control>
          <Demo.Control label="min" >
            <RW.DateTimePicker
              value={min}
              ime={time}
              culture={culture}
              calendar={calendar}
              format={minMaxFormat}
              onChange={setter('min')}
            />
          </Demo.Control>
          <Demo.Control label="max">
            <RW.DateTimePicker
              value={max}
              time={time}
              culture={culture}
              calendar={calendar}
              format={minMaxFormat}
              onChange={setter('max')}
            />
          </Demo.Control>
          <Layout justify="flex-start">
            <Demo.Control>
              <Checkbox
                inline
                checked={!!isRtl}
                onChange={setter('isRtl', !isRtl)}
              >
                right-to-left
              </Checkbox>
            </Demo.Control>
            <Demo.Control>
              <Checkbox
                inline
                checked={calendar}
                onChange={setter('calendar', !calendar)}
              >
                date
              </Checkbox>
            </Demo.Control>
            <Demo.Control>
              <Checkbox
                inline
                checked={time}
                onChange={setter('time', !time)}
              >
                time
              </Checkbox>
            </Demo.Control>
          </Layout>
        </Demo.Controls>
    </Demo>
    )
  }
}


var itemComp = React.createClass({
  render: function() {
    var date   = merge(new Date, this.props.item.date)
      , inPast = dates.lt(date, new Date, 'minutes')

    return (
      <div className={inPast ? 'overdue' : ''}>
        <i className={'fa fa-' + (inPast ? 'history' : 'clock')}></i>
        { '  ' + this.props.item.label}
      </div>
    );
  }
});


function merge(date, time){
  if( time == null && date == null)
    return null

  if( time == null) time = new Date
  if( date == null) date = new Date

  date = dates.startOf(date, 'day')
  date = dates.hours(date,        dates.hours(time))
  date = dates.minutes(date,      dates.minutes(time))
  date = dates.seconds(date,      dates.seconds(time))
  return dates.milliseconds(date, dates.milliseconds(time))
}
