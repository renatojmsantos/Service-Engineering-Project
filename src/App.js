import React, { Component } from "react";
import './App.css';
import MicRecorder from 'mic-recorder-to-mp3';
import AWS from 'aws-sdk';
import SearchLocation from './SearchLocation';
import ReactDom from 'react-dom';
import {Redirect} from 'react-router-dom';


const Mp3Recorder = new MicRecorder({ bitRate: 128 });


var bucketName = "proj-es-s3/Voice";
var bucketRegion = "us-east-1";
var IdentityPoolId = "us-east-1:4797cc31-91b9-4466-8732-8e4707b5cfbc";

AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: IdentityPoolId
  })
});


var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: bucketName }
});

function SearchLocationPage(props) {
  if (!props.pesq) {
    return null;
  }

  return (
    <div className="searching">
      Endereços
    </div>
  );
}

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isRecording: false,
      blobURL: '',
      isBlocked: false,
    };
    this.state = {showSearchLocation: false};
    this.goSearch = this.goSearch.bind(this);
  }

  start = () => {
    if (this.state.isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder
        .start()
        .then(() => {
          this.setState({ isRecording: true });
        }).catch((e) => console.error(e));
    }
  };

  stop = () => {
    Mp3Recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob)
        this.setState({ blobURL, isRecording: false });

        this.addAudio(blob)
      }).catch((e) => console.log(e));
  };

  componentDidMount() {
    navigator.getUserMedia({ audio: true },
      () => {
        console.log('Permission Granted');
        this.setState({ isBlocked: false });
      },
      () => {
        console.log('Permission Denied');
        this.setState({ isBlocked: true })
      },
    );
  }

  addAudio = (audio) => {
    console.log(audio)
    var fileName = "audio.mp3";
    if(!audio.size) {
      return alert("No File to upload !!");
    }
    
    var upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: bucketName,
        Key: fileName,
        Body: audio
      }  
    });

    var promise = upload.promise();

    promise.then(
      function(data) {
        alert("Audio inserido na Storage");
      },
      function(err) {
        return alert("ERROR: ", err.message);
      }
    )
  }

  goSearch(){
      console.log('submiittt');
      this.setState(state => ({
        showSearchLocation: !state.showSearchLocation
      }));
  }

  /*
  onSubmit = () => {
    console.log("submit");
    //return <Redirect  to="/SearchLocation/" /> 
    return this.setState({ Redirect :  "/SearchLocation"})
 }

  state = { Redirect: null };
*/
  render(){
    if(this.state.Redirect){
      return <Redirect to={this.state.Redirect} />
    }
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={this.start} disabled={this.state.isRecording}>Record</button>
          <button onClick={this.stop} disabled={!this.state.isRecording}>Stop</button>
          <audio src={this.state.blobURL} controls="controls" />
          
          <SearchLocationPage pesq = {this.state.showSearchLocation}/>
        <button onClick={this.goSearch}> {this.state.showSearchLocation}Pesquisar enderecos!</button>

        </header>
      </div>
    );
  }
 
}

class AddressForm extends Component {
  constructor(props) {
    super(props);

    const address = this.getEmptyAddress();
    this.state = {
      'address': address,
      'query': '',
      'locationId': ''
    }

    this.onQuery = this.onQuery.bind(this);
  }

  onQuery(evt) {
    const query = evt.target.value;
    if (!query.length > 0) {
      const address = this.getEmptyAddress();
      return this.setState({
        'address': address,
        'query': '',
        'locationId': ''
        })
    }

    const self = this;
    axios.get('https://autocomplete.geocoder.api.here.com/6.2/geocode.json', {
      'params': {
        'app_id': 'devportal-demo-20180625',
        'app_code': '9v2BkviRwi9Ot26kp2IysQ',
        'query': query,
        'maxresults': 1,
      }}).then(function (response) {
        const address = response.data.suggestions[0].address;
        const id = response.data.suggestions[0].locationId;
        self.setState({
          'address': address,
          'query': query,
          'locationId': id,
          });
      });
  }

  render() {
    return (
      <div class="container">
        <AddressSuggest
          query={this.state.query}
          onChange={this.onQuery}
          />
        <AddressInput
          street={this.state.address.street}
          city={this.state.address.city}
          state={this.state.address.state}
          postalCode={this.state.address.postalCode}
          country={this.state.address.country}
          />
        ></div>
      );
  }
}


export default App;
