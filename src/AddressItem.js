 
import React, { Component } from 'react';

class AddressItem extends Component {
  render() {
    return (
        <div>
            <label>{this.props.label}</label>
            <div>
              <input defaultValue={this.props.value} onChange={this.props.onChange}/>
            </div>
        </div>
      );
  }
}

export default AddressItem;
