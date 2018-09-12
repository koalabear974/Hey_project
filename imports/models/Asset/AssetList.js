import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';

import './Asset.css'
import AssetListItem from './AssetListItem.js'

import Assets from '../../api/tweets.js';

class AssetList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMounted: false,
    }

    this.handleAddItem = this.handleAddItem.bind(this)
    this.renderItemList = this.renderItemList.bind(this)
  }

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  handleAddItem () {
    this.props.handleItemClick(null, true)
  }

  renderItemList() {
    if(this.props.assets.length == 0){
      return <div className="main-container__left-empty">No assets yet</div>
    }

    var that = this;
    var itemList = this.props.assets.map(function(asset){
      return <AssetListItem key={asset._id} asset={asset} isActive={that.props.currentItemId == asset._id} handleItemClick={that.props.handleItemClick} />
    })

    return itemList
  }


  render() {
    if(!this.state.isMounted) {
      return <p>LOADING</p>
    }

    return (
      <div className="AssetList">
        <div className="AssetList__container">
          {
            this.renderItemList()
          }
        </div>
        <Button className="AssetList__add-button" onClick={this.handleAddItem}><i className='plus icon' /> Create asset</Button>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    assets: Assets.find({}, {sort: {updatedAt: -1}}).fetch(),
  };
})(AssetList);
