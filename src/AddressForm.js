import React, { Component } from 'react';
import AddressSuggest from './AddressSuggest';
import AddressInput from './AddressInput';
import axios from 'axios';

const API_KEY = 'tX1z9uiD44rPpVd1CGR_eG3VBZ4mubljw0ljaLFIaRQ';

class AddressForm extends Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();

    // User has entered something in the address bar
    this.onQuery = this.onQuery.bind(this);
    // User has entered something in an address field
    this.onAddressChange = this.onAddressChange.bind(this);
    // User has clicked the check button
    this.onCheck = this.onCheck.bind(this);
    // User has clicked the clear button
    this.onClear = this.onClear.bind(this);
  }

  onQuery(evt) {
    const query = evt.target.value;

    if (!query.length > 0) {
      this.setState(this.getInitialState());
      return;
    }

    const self = this;
    axios.get('https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json',
      {'params': {
        'query': query,
        'apiKey': API_KEY,
        'maxresults': 10, //10
      }}).then(function (response) {
          console.log(response);
          if (response.data.suggestions.length > 0) {
            const id = response.data.suggestions[0].locationId;
            const address = response.data.suggestions[0].address;
            self.setState({
              'address' : address,
              'query' : query,
              'locationId': id
            })
          } else {
            const state = self.getInitialState();
            self.setState(state);
          }
      });
  }

  getInitialState() {
    return {
      'address': {
        'street': '',
        'city': '',
        'postalCode': '',
        'country': ''
      },
      'query': '',
      'locationId': '',
      'isChecked': false,
      'coords': {}
    }
  }

  onClear(evt) {
    const state = this.getInitialState();
    this.setState(state);
  }

  onAddressChange(evt) {
    const id = evt.target.id
    const val = evt.target.value

    let state = this.state
    state.address[id] = val;
    this.setState(state);
  }

  onCheck(evt) {
    let params = {
        'apiKey': API_KEY,
    }

    if (this.state.locationId.length > 0) {
      params['locationId'] = this.state.locationId;
    } else {
      params['searchtext'] = this.state.address.street
        + this.state.address.city
        + this.state.address.postalCode
        + this.state.address.country;
    }

    // -----------------------------------------
    // ------------- CHECK ADDRESS -------------
    // -----------------------------------------

    const self = this;
    axios.get('https://geocoder.ls.hereapi.com/6.2/geocode.json',
      {'params': params }
      ).then(function (response) {
        console.log(response);
        const view = response.data.Response.View
        if (view.length > 0 && view[0].Result.length > 0) {
          const location = view[0].Result[0].Location;

          self.setState({
            'isChecked': 'true',
            'locationId': '',
            'query': location.Address.Label,
            'address': {
              'street': location.Address.HouseNumber + ' ' + location.Address.Street,
              'city': location.Address.City,
              'postalCode': location.Address.PostalCode,
              'country': location.Address.Country
            },
            'coords': {
              'lat': location.DisplayPosition.Latitude,
              'lon': location.DisplayPosition.Longitude
            }
          });
        } else {
          self.setState({
            'isChecked': true,
            'coords': null,
          })
        }

      })
      .catch(function (error) {
        console.log('caught failed query');
        self.setState({
          'isChecked': true,
          'coords': null,
        });
      });
  }

  alert() {
    if (!this.state.isChecked) {
      return;
    }

    if (this.state.coords === null) {
      return (
        <div className="alert alert-warning" role="alert">
          <b>Enderenço inválido!</b> 
        </div>
      );
    } else {
      return (
        <div className="alert alert-success" role="alert">
         Coordenadas: {this.state.coords.lat}, {this.state.coords.lon}.
        </div>
      );
    }
  }

  render() {
    let result = this.alert();
    return (
        <div className="container">
          <AddressSuggest
            query={this.state.query} //text
            onChange={this.onQuery} 
            />
          <AddressInput
            street={this.state.address.street}
            city={this.state.address.city}
            postalCode={this.state.address.postalCode}
            country={this.state.address.country}
            onChange={this.onAddressChange}
            />
          <br/>
          { result }
          <button type="submit" className="btn btn-primary" onClick={this.onCheck}>Check</button>
          <button type="submit" className="btn btn-outline-secondary" onClick={this.onClear}>Clear</button>
        </div>
      );
  }
}

export default AddressForm;