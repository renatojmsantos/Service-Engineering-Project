import React, { Component } from 'react';
import AddressSuggest from './AddressSuggest';
import AddressInput from './AddressInput';
import axios from 'axios';
import TranscribeFetch from './getTranscribeStatus';


class AddressForm extends Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();
    this.onSearch = this.onSearch.bind(this);
    this.onCheck = this.onCheck.bind(this);
  }

  onSearch(evt) {
    const search = evt.target.value;

    if (!search.length > 0) {
      this.setState(this.getInitialState());
      return;
    }

    const sugestao = this;
    axios.get('https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json',
      {'params': {
        'query': search,
        'apiKey': 'tX1z9uiD44rPpVd1CGR_eG3VBZ4mubljw0ljaLFIaRQ',
        'maxresults': 20, // nr de resultados relacionados com a palavras pesquisadas
      }}).then(function (response) {
        console.log("sugestao");
          console.log(response);
          if (response.data.suggestions.length > 0) {
            const id = response.data.suggestions[0].locationId;
            const address = response.data.suggestions[0].address;
            sugestao.setState({
              'address' : address,
              'locationId': id
            })
          } else {
            const state = sugestao.getInitialState();
            sugestao.setState(state);
          }
      });
  }
  
  getInitialState() {
    //console.log(this.getText());
    var textTranscribe = this
    axios.get('https://3xeam2g64j.execute-api.us-east-1.amazonaws.com/transcribe/transcribe'
      ).then(function (response) {
          textTranscribe = response.data.body;
          console.log("transcrito... = "+textTranscribe); // string bem...
      });
    //console.log("trans..."+JSON.stringify(textTranscribe)); // object object
    console.log("----- transcribe ------");
    console.log(textTranscribe);
    return {
      'address': {
        'street': '',//textTranscribe.toString(), //white white, //inserir aqui texto do transcribe
        'city': '',
        'postalCode': '',
        'country': ''
      },
      'locationId': '',
      'isChecked': false,
      'coords': {},
      'currentCoors':{},
      'viagem':{},
    }
  }

  onAddressChange(evt) {
    const id = evt.target.id
    const val = evt.target.value

    var state = this.state
    state.address[id] = val;
    this.setState(state);
  }

  onCheck(evt) {
    // --------------------------------------—————---
    // -------- CHECK ADDRESS AND ROUTE -------------
    // --------------------------------------—————---

    const place = this;
    axios.get('https://geocoder.ls.hereapi.com/6.2/geocode.json',
      {'params': {
        'apiKey': 'tX1z9uiD44rPpVd1CGR_eG3VBZ4mubljw0ljaLFIaRQ',
        'searchtext': this.state.address.street + this.state.address.city + this.state.address.postalCode + this.state.address.country,
      }}).then(function (response) {
        console.log("validar");
        console.log(response);

        const location = response.data.Response.View[0].Result[0].Location;
        place.setState({
          'isChecked': 'true',
          'locationId': '',
          'query': location.Address.Label,
          'address': {
            'street': location.Address.Street,
            'city': location.Address.City,
            'postalCode': location.Address.PostalCode,
            'country': location.Address.Country
          },
          'coordsDestino': {
            'latitude': location.DisplayPosition.Latitude,
            'longitude': location.DisplayPosition.Longitude
          }
        })
      })
      
    // localizacao atual
    const current = this;
    navigator.geolocation.getCurrentPosition(function(position) {
      current.setState({
        'currentCoors':{
          'latitude': position.coords.latitude,
          'longitude': position.coords.longitude,
        }
      });
    });

    //console.log("teste latitude");
    //console.log(this.setState.currentCoors.latitude);
  }

  verificaEndereco() {
    if (!this.state.isChecked) {
      return;
    }
    //console.log("##Latitude is :", this.state.currentCoors.latitude);
    //console.log("$$$Longitude is :", this.state.currentCoors.longitude);
    //console.log("###Distancia", this.state.viagem.distance);
    //console.log("###Tempo", this.state.viagem.travelTime);

    if (this.state.coordsDestino === null) {
      return (
        <div id="erro">
          Enderenço inválido!
        </div>
      );
    } else {
          // request route
          const simpleRoute = this;
          axios.get('https://route.ls.hereapi.com/routing/7.2/calculateroute.json',
            {'params': {
              'apiKey': 'tX1z9uiD44rPpVd1CGR_eG3VBZ4mubljw0ljaLFIaRQ',
              'waypoint0': this.state.currentCoors.latitude+','+this.state.currentCoors.longitude,
              'waypoint1': this.state.coordsDestino.latitude+','+this.state.coordsDestino.longitude,
              //'mode': 'fastest;car;traffic:enabled',
              'mode': 'shortest;car;traffic:enabled',
            }}).then(result => {
              console.log("request route");
              console.log(result.data);
              console.log("distancia e tempo");
              console.log(result.data.response.route[0].summary.distance);
              console.log(result.data.response.route[0].summary.travelTime);

              //console.log("teste latitude");
              //console.log(this.setState.currentCoors.latitude);

              const rota = result.data.response.route[0].summary;
              var precoV = (rota.distance/1000) * 0.70 + (rota.travelTime/60/2) * 0.30;
              simpleRoute.setState({
                'viagem':{
                  'distance': rota.distance/1000,
                  'travelTime': rota.travelTime/60/2,
                  'preco': precoV,
                }
              })
              },error => {
                console.error(error);
              });

      return (
        <div id="resultados">
         Coordenadas Atuais: {this.state.currentCoors.latitude}, {this.state.currentCoors.longitude}
         <br></br>
         Coordenadas Destino: {this.state.coordsDestino.latitude}, {this.state.coordsDestino.longitude}
         <br></br>
          Distancia: {this.state.viagem.distance} km
          <br></br>
          Tempo: {this.state.viagem.travelTime} min<br></br>
          Preço: {this.state.viagem.preco} €
        </div>
      );
    }
  }

  render() {
    var verifyAdress = this.verificaEndereco();
    return (
        <div>
          <AddressSuggest
            search={this.state.search} //text
            onChange={this.onSearch} 
            />
          <AddressInput
            street={this.state.address.street}
            city={this.state.address.city}
            postalCode={this.state.address.postalCode}
            country={this.state.address.country}
            onChange={this.onAddressChange}
            />
          <br/>
          {verifyAdress}
          <button type="submit" onClick={this.onCheck}>Ver preço!</button>
        </div>
      );
  }
}

export default AddressForm;