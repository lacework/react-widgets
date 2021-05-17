import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import cn from 'classnames';
import _  from './util/_';
import createUncontrolledWidget from 'uncontrollable';

import Widget from './Widget';
import Popup from './Popup';
import SelectInput from './MultiselectInput';
import TagList from './MultiselectTagList';
import CustomPropTypes from './util/propTypes';
import PlainList from './List';
import GroupableList from './ListGroupable';

import validateList from './util/validateListInterface';
import { dataItem, dataText, valueMatcher } from './util/dataHelpers';
import { widgetEditable } from './util/interaction';
import { instanceId, notify, isFirstFocusedRender } from './util/widgetHelpers';

var compatCreate = (props, msgs) => typeof msgs.createNew === 'function'
  ? msgs.createNew(props)
  : [<strong key='dumb'>{`"${props.searchTerm}"`}</strong>, ' ' + msgs.createNew]

let { splat } = _;

var propTypes = {
  ...Popup.propTypes,

  data:            PropTypes.array,
  //-- controlled props --
  value:           PropTypes.array,
  onChange:        PropTypes.func,

  searchTerm:      PropTypes.string,
  onSearch:        PropTypes.func,

  open:            PropTypes.bool,
  onToggle:        PropTypes.func,
  //-------------------------------------------

  valueField:      PropTypes.string,
  textField:       CustomPropTypes.accessor,

  tagComponent:    CustomPropTypes.elementType,
  itemComponent:   CustomPropTypes.elementType,
  listComponent:   CustomPropTypes.elementType,

  groupComponent:  CustomPropTypes.elementType,
  groupBy:         CustomPropTypes.accessor,

  createComponent: CustomPropTypes.elementType,

  onSelect:        PropTypes.func,
  onCreate:        PropTypes.oneOfType([
                     PropTypes.oneOf([false]),
                     PropTypes.func
                   ]),

  inputSize:       PropTypes.func,

  busy:            PropTypes.bool,
  dropUp:          PropTypes.bool,

  placeholder:     PropTypes.string,

  autoFocus:      PropTypes.bool,
  disabled:       CustomPropTypes.disabled.acceptsArray,
  readOnly:       CustomPropTypes.readOnly.acceptsArray,

  messages:        PropTypes.shape({
    open:          CustomPropTypes.message,
    emptyList:     CustomPropTypes.message,
    emptyFilter:   CustomPropTypes.message,
    createNew:     CustomPropTypes.message
  })
};

var Multiselect = createReactClass({

  displayName: 'Multiselect',

  mixins: [
    require('./mixins/TimeoutMixin'),
    require('./mixins/DataFilterMixin'),
    require('./mixins/PopupScrollToMixin'),
    require('./mixins/RtlParentContextMixin'),
    require('./mixins/FocusMixin')({
      willHandle(focused) {
        focused && this.focus()
      },
      didHandle(focused) {
        if (!focused) this.close()

        if (!focused && this.refs.tagList)
          this.setState({focusedTag: null})

        if (focused && !this.props.open)
          this.open()
      }
    }),
    require('./mixins/AriaDescendantMixin')('input', function (key, id) {
      let {ariaActiveDescendantKey: myKey} = this.props;

      let createIsActive =
          (!this._data().length || this.state.focusedItem === null)
          && key === myKey;

      let tagIsActive = this.state.focusedTag != null && key === 'taglist';
      let listIsActive = this.state.focusedTag == null && key === 'list';

      if (createIsActive || tagIsActive || listIsActive)
        return id;
    })
  ],

  propTypes,

  getDefaultProps() {
    return {
      data: [],
      filter: 'startsWith',
      value: [],
      open: false,
      searchTerm: '',
      ariaActiveDescendantKey: 'multiselect',
      messages: {
        createNew: '(create new tag)',
        emptyList: 'There are no items in this list',
        emptyFilter: 'The filter returned no results',
        tagsLabel: 'selected items',
        selectedItems: 'selected items',
        noneSelected: 'no selected items',
        removeLabel: 'remove selected item'
      }
    }
  },

  getInitialState() {
    var {data, value, valueField, searchTerm} = this.props
        , dataItems = splat(value).map(item => dataItem(data, item, valueField))
        , processedData = this.process(data, dataItems, searchTerm)

    return {
      focusedTag: null,
      focusedItem: processedData[0],
      processedData: processedData,
      dataItems: dataItems
    }
  },

  componentDidUpdate() {
    this.ariaActiveDescendant(
        instanceId(this, '__createlist_option'))

    this.refs.list && validateList(this.refs.list)
  },

  componentWillReceiveProps(nextProps) {
    var {data, value, valueField, searchTerm} = nextProps
        , values = _.splat(value)
        , current = this.state.focusedItem
        , items = this.process(data, values, searchTerm)

    this.setState({
      processedData: items,
      focusedItem: items.indexOf(current) === -1 ? items[0] : current,
      dataItems: values.map(item => dataItem(data, item, valueField))
    })
  },

  renderCreateItem(id, messages) {
    let {searchTerm} = this.props;
    let {focusedItem} = this.state;

    let createIsFocused = !this._data().length || focusedItem === null;
    let optionID = instanceId(this, '__createlist_option');

    return (
        <ul
            id={id}
            role='listbox'
            className="rw-list rw-multiselect-create-tag"
        >
          <li
              id={optionID}
              role='option'
              onClick={() => this.handleCreate(searchTerm)}
              className={cn(
                  'rw-list-option',
                  'rw-create-list-option',
                  createIsFocused && 'rw-state-focus'
              )}
          >
            {compatCreate(this.props, messages)}
          </li>
        </ul>
    )
  },

  renderInput(owns) {
    let {
      searchTerm
      , maxLength
      , tabIndex
      , busy
      , open
      , disabled
      , readOnly
    } = this.props;

    return (
        <SelectInput
            ref='input'
            tabIndex={tabIndex || 0}
            role='listbox'
            aria-expanded={!!open}
            aria-busy={!!busy}
            autoFocus={this.props.autoFocus}
            aria-owns={owns}
            aria-haspopup={true}
            value={searchTerm}
            maxLength={maxLength}
            disabled={disabled === true}
            readOnly={readOnly === true}
            placeholder={this.getPlaceholder()}
            inputSize={this.props.inputSize}
            onKeyDown={this.handleSearchKeyDown}
            onKeyUp={this.handleSearchKeyUp}
            onChange={this.handleInputChange}
            onClick={this.handleInputInteraction}
            onTouchEnd={this.handleInputInteraction}
        />
    )
  },

  renderList(List, id, messages) {
    let {open, disabled, readOnly} = this.props;
    let {focusedItem} = this.state;

    let listProps = _.pickProps(this.props, List);
    let items = this._data();

    return (
        <List ref="list"
              key={0}
              {...listProps}
              readOnly={readOnly}
              disabled={disabled}
              id={id}
              aria-live='polite'
              aria-labelledby={instanceId(this)}
              aria-hidden={!open}
              ariaActiveDescendantKey='list'
              data={items}
              focused={focusedItem}
              onSelect={this.handleSelect}
              onMove={this._scrollTo}
              messages={{
                emptyList: this._lengthWithoutValues
                    ? messages.emptyFilter
                    : messages.emptyList
              }}
        />
    )
  },

  renderNotificationArea(id, messages) {
    let {textField} = this.props;
    let {focused, dataItems} = this.state;

    return (
        <span
            id={id}
            role="status"
            className='rw-sr'
            aria-live='assertive'
            aria-atomic="true"
            aria-relevant="additions removals text"
        >
        {focused && (
            dataItems.length
                ? (messages.selectedItems + ': ' + dataItems.map(item => dataText(item, textField)).join(', '))
                : messages.noneSelected
        )}
      </span>
    )
  },

  renderTags(id, messages) {
    let {disabled, readOnly, valueField, textField} = this.props;
    let {focusedTag, dataItems} = this.state;

    let Component = this.props.tagComponent;

    return (
        <TagList
            ref='tagList'
            id={id}
            valueField={valueField}
            textField={textField}
            aria-label={messages.tagsLabel}
            value={dataItems}
            focused={focusedTag}
            disabled={disabled}
            readOnly={readOnly}
            onDelete={this.handleDelete}
            valueComponent={Component}
            ariaActiveDescendantKey='taglist'
        />
    )
  },

  render() {
    let {
      className
      , groupBy
      , messages
      , busy
      , dropUp
      , open
      , duration
      , disabled
      , readOnly
      , listComponent: List
    } = this.props;

    let {focused, dataItems} = this.state;

    List = List || (groupBy && GroupableList) || PlainList

    let elementProps = _.omitOwnProps(this, List);

    let shouldRenderTags = !!dataItems.length
        , shouldRenderPopup = isFirstFocusedRender(this) || open
        , shouldShowCreate = this.shouldShowCreate();

    let tagsID = instanceId(this, '_taglist')
        , listID = instanceId(this, '__listbox')
        , createID = instanceId(this, '__createlist')
        , notifyID = instanceId(this, '__notify');

    let inputOwns = `${listID} ${notifyID} `
        + (shouldRenderTags ? tagsID : '')
        + (shouldShowCreate ? createID : '');

    messages = msgs(messages);

    return (
        <Widget
            {...elementProps}
            id={instanceId(this)}
            open={open}
            dropUp={dropUp}
            focused={focused}
            disabled={disabled === true}
            readOnly={readOnly === true}
            onKeyDown={this.handleKeyDown}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onTouchEnd={this.handleFocus}
            className={cn(className, 'rw-multiselect')}
        >
          {this.renderNotificationArea(notifyID, messages)}

          <div className='rw-multiselect-wrapper'>
            {busy && <span className="rw-i rw-loading"/>}

            {shouldRenderTags &&
            this.renderTags(tagsID, messages)
            }

            {this.renderInput(inputOwns)}
          </div>
          {shouldRenderPopup &&
          <Popup
              dropUp={dropUp}
              open={open}
              duration={duration}
              onOpening={() => this.refs.list.forceUpdate()}
          >
            <div>
              {this.renderList(List, listID, messages)}

              {shouldShowCreate &&
              this.renderCreateItem(createID, messages)
              }
            </div>
          </Popup>
          }
        </Widget>
    )
  },

  _data() {
    return this.state.processedData
  },

  handleDelete(value) {
    this.focus()
    this.change(
        this.state.dataItems.filter(d => d !== value))
  },

  handleSearchKeyDown(e) {
    if (e.key === 'Backspace' && e.target.value && !this._deletingText)
      this._deletingText = true
  },

  handleSearchKeyUp(e) {
    if (e.key === 'Backspace' && this._deletingText)
      this._deletingText = false
  },

  handleInputChange(e) {
    notify(this.props.onSearch, [e.target.value])
    this.open()
  },

  @widgetEditable
  handleInputInteraction() {
    this.open()
  }
})

function msgs(msgs){
  return {
    createNew:     '(create new tag)',
    emptyList:     'There are no items in this list',
    emptyFilter:   'The filter returned no results',
    tagsLabel:     'selected items',
    selectedItems: 'selected items',
    removeLabel:   'remove selected item',
    ...msgs
  }
}

export default createUncontrolledWidget(Multiselect
    , { open: 'onToggle', value: 'onChange', searchTerm: 'onSearch' }, ['focus']);
