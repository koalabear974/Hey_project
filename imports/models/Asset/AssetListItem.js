import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

import './Asset.css'

export default class AssetListItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let itemClass = "AssetListItem " + (this.props.isActive ? "AssetListItem--active" : "")
    let onClickFunc = () => this.props.handleItemClick(this.props.asset._id, false)
    let onClickEditFunc = (e) => { e.stopPropagation(); this.props.handleItemClick(this.props.asset._id, true) }
    return (
      <div className={itemClass} onClick={onClickFunc}>
        <div className="AssetListItem__name">
          {this.props.asset.name}
        </div>
        <Button className="AssetListItem__edit-button" icon onClick={onClickEditFunc}>
          <i className="edit icon" />
        </Button>
      </div>
    );
  }
}

