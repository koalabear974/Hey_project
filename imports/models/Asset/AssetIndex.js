import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import './Asset.css'

import Assets from '../../api/tweets.js';

class AssetIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMounted: false,
    }
  }

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  render() {
    if(!this.state.isMounted) {
      return <p>LOADING</p>
    }
    return (
      <div className="AssetIndex">
        Asset index
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    assets: Assets.find({}).fetch(),
  };
})(AssetIndex);
