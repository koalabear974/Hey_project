import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';

import './Sidebar.css'

import { ItemTypes } from '../../api/utils.js';

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemTypes: this.props.itemTypes,
      currentItemType: ""
    }

    this.handleTypeChange = this.handleTypeChange.bind(this)
    this.handleAddItem = this.handleAddItem.bind(this)
  }

  handleTypeChange(event, data) {
    let currentItemType = _.find(this.state.itemTypes, function(a) { return a.value == data.value});
    this.setState({ currentItemType: currentItemType});
    this.props.handleTypeChange(currentItemType);
  }

  handleAddItem () {
    // to move
  }

  render() {
    return (
      <div className="Sidebar">
        <Dropdown className="Sidebar__types-dropdown" placeholder="Select item type" fluid options={this.state.itemTypes} value={this.state.currentItemType.value} onChange={this.handleTypeChange}/>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    itemTypes: ItemTypes,
  };
})(Sidebar);
