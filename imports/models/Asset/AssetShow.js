import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Button } from 'semantic-ui-react';

import './Asset.css'

import Assets from '../../api/tweets.js';

class AssetShow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMounted: false,
    }

    this.handleEditClick = this.handleEditClick.bind(this)
  }

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  handleEditClick() {
    this.props.handleItemClick(this.props.asset._id, true);
  }

  render() {
    if(!this.state.isMounted) {
      return <p>LOADING</p>
    }
    if(!this.props.asset) {
      return <p>Asset not found</p>
    }
    return (
      <div className="AssetShow">
        <h2 className="AssetShow__name">{this.props.asset.name}</h2>
        <div className="AssetShow__main">
          <div className="AssetShow__description">
            <label className="AssetShow__label">Description</label>
            {this.props.asset.description ? this.props.asset.description : "No information"}
          </div>
        </div>
        <div className="AssetShow__times">
          <div className="AssetShow__times--left">
            <label className="AssetShow__label">Created At</label>
            {this.props.asset.createdAt ? this.props.asset.createdAt.toString() : "No information"}
          </div>
          <div className="AssetShow__times--right">
            <label className="AssetShow__label">Updated At</label>
            {this.props.asset.updatedAt ? this.props.asset.updatedAt.toString() : "No information"}
          </div>
        </div>
        <div className="AssetShow__actions">
         {
            // return <Button className="AssetShow__actions-delete negative" icon onClick={null}><i className="delete icon" /></Button>
         }
          <Button className="AssetShow__actions-edit" icon onClick={this.handleEditClick}><i className="edit icon" /></Button>
        </div>
      </div>
    );
  }
}

export default withTracker(({itemId}) => {
  return {
    asset: !!itemId ? Assets.findOne(itemId) : Assets.initObject(),
  };
})(AssetShow);
