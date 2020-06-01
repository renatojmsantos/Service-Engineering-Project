import React, { Component } from 'react';
import AddressItem from './AddressItem';

class AddressInput extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    this.props.onChange(evt);
  }

  render() {
    return (

      <div className="card"><div className="card-body">
      <AddressItem label="Rua" id="street" value={this.props.street} onChange={this.handleChange} placeholder="" />
      <AddressItem label="Cidade" id="city" value={this.props.city} onChange={this.handleChange} placeholder="" />
      <AddressItem label="Código Postal" id="postalCode" value={this.props.postalCode} onChange={this.handleChange} placeholder="" />
      <AddressItem label="País" id="country" value={this.props.country} onChange={this.handleChange} placeholder="" />
      </div></div>
    );
  }
}

export default AddressInput;