import React, { Component } from 'react';
import AddressItem from './AddressItem';


class AddressSuggest extends Component {
  render() {
    return (
        <AddressItem
          label="Endereço"
          value={this.props.query}
          onChange={this.props.onChange}
          placeholder="digite o destino" />
    );
  }
}

export default AddressSuggest;