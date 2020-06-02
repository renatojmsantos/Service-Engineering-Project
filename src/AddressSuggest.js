import React, { Component } from 'react';
import AddressItem from './AddressItem';


class AddressSuggest extends Component {
  render() {
    return (
        <AddressItem
          label="Endereço"
          placeholder="digite o destino"
          value={this.props.search}
          onChange={this.props.onChange}
        />
    );
  }
}

export default AddressSuggest;