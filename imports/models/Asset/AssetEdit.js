import React, { Component } from 'react';
import { Button, Form } from 'semantic-ui-react'
import { withTracker } from 'meteor/react-meteor-data';

import './Asset.css'

import Assets from '../../api/tweets.js';

class AssetEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMounted: false,
      isEditObject: !!this.props.itemId,
      isDeleteObject: false,
      asset: this.props.asset,
      errors: [],
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.callbackFunc = this.callbackFunc.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  componentWillReceiveProps(nextProps){
    let isEdit = !!nextProps.itemId
    this.setState({
      asset: isEdit ? Assets.findOne(nextProps.itemId) : Assets.initObject(),
      isEditObject: isEdit,
    })
  }

  handleChange (e) {
    var asset = this.state.asset
    let errors = this.state.errors
    let targetName = e.target.name

    asset[targetName] = e.target.value

    if(this.hasErrors(targetName)) {
      errors = _.reject(errors, (a) => { return a.name == targetName })
    }
    this.setState({asset: asset, errors: errors})
  }

  callbackFunc (error, result) {
    if(!error) {
      let returnId = this.state.isDeleteObject ? "" :
                     this.state.isEditObject ? this.props.itemId : result
      this.props.handleSuccess(returnId);
    } else {
      console.log("Callback function Error:", error);
      this.setState({errors: error.invalidKeys})
    }
  }

  handleSubmit (e, data) {
    e.preventDefault();

    if(this.state.isEditObject) {
      Assets.update(this.state.asset._id, { $set: _.omit(this.state.asset, '_id')}, this.callbackFunc);
    } else {
      Assets.insert(this.state.asset, this.callbackFunc);
    }
  }

  handleDelete(e) {
    e.preventDefault();

    if (!!this.state.asset._id) {
      this.setState({isDeleteObject: true})
      Assets.remove(this.state.asset._id, this.callbackFunc);
    }
  }

  hasErrors(name = null) {
    if(name) {
      return !!_.find(this.state.errors, (a) => { return a.name == name })
    } else {
      return !_.isEmpty(this.state.errors)
    }
  }

  render() {
    if(!this.state.isMounted || this.state.isDeleteObject) {
      return <p>LOADING</p>
    }

    var deleteButton = this.state.isEditObject ? <Button className="AssetEdit__delete negative" onClick={this.handleDelete}>Delete object</Button> : null;
    var actionString = this.state.isEditObject? "Edit" : "Create"

    return (
      <div className="AssetEdit">
        <h2>{ actionString } asset</h2>
        <Form name="form" onSubmit={this.handleSubmit} onChange={this.handleChange} error={this.hasErrors()}>
          <Form.Input
            name="name"
            label='Name'
            placeholder='Name'
            value={this.state.asset.name || ""}
            error={this.hasErrors('name')}
          />
          <Form.TextArea
            name="description"
            label='Description'
            placeholder='Tell us more about the asset...'
            value={this.state.asset.description || ""}
            error={this.hasErrors('description')}
          />
          <div className="AssetEdit__buttons-container">
            { deleteButton }
            <Form.Button className="AssetEdit__submit primary">{ actionString }</Form.Button>
          </div>
        </Form>
      </div>
    );
  }

          //   <input placeholder="name" className={styles['form-field']} ref="name" />
          // <select className={styles['form-field']} ref="_t">{this.state.itemTypes.map(this.listOfItems)}</select>
          // <input placeholder="category" className={styles['form-field']} ref="category" />
          // <input placeholder="description" className={styles['form-field']} ref="description" />
          // <input placeholder="image" className={styles['form-field']} ref="image" />
          // <input placeholder="stage" className={styles['form-field']} ref="stage" />
}

export default withTracker(({itemId}) => {
  return {
    asset: !!itemId ? Assets.findOne(itemId) : Assets.initObject(),
  };
})(AssetEdit);
