import React, { Component } from 'react';
import AddressItem from './AddressItem';

class AddressInput extends Component {
  constructor(props) {
    super(props);
  }

  handleChange(evt) {
    this.props.onChange(evt);
  }

  render() {
    return (
      <div>
        <AddressItem label="Rua" value={this.props.street}/>
        <AddressItem label="Cidade" value={this.props.city}/>
        <AddressItem label="Código Postal" value={this.props.postalCode}/>
        <AddressItem label="País" value={this.props.country}/>
      </div>
    );
  }
}

export default AddressInput;