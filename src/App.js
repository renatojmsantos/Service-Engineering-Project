import React, { Component } from "react";
import './App.css';
import MicRecorder from 'mic-recorder-to-mp3';
import AWS from 'aws-sdk';
import SearchLocation from './SearchLocation';
import ReactDom from 'react-dom';
import {Redirect} from 'react-router-dom';
import AddressItem from './AddressItem';
import AddressForm from './AddressForm';
import TranscribeFetch from './getTranscribeStatus';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

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
    <div className="container">
      <AddressForm/>
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
      aux: false,
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

    navigator.geolocation.getCurrentPosition(function(position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    });

  }

  addAudio = (audio) => {
    console.log(audio)
    var fileName = "audio.mp3";
    if(!audio.size) {
      return alert("No File to upload!");
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
        alert("Audio inserido para Transcriçao");
        sleep(3000).then(() => {
          alert("Ja pode ir buscar a localização")
        })           
      },
      function(err) {
        return alert("ERROR: ", err.message);
      }
    )
    
  }

  goSearch(){
      console.log('submiittt');
      this.setState(state => ({
        showSearchLocation: true
        //showSearchLocation: !state.showSearchLocation
      }));
  }


  showTranscribe(){
    this.setState({ aux: true });
  }



 render(){
  if(!this.state.aux){
    return (  
      <div className="App">
        <header className="App-header">
          <button onClick={this.start} disabled={this.state.isRecording}>Record</button>
          <button onClick={this.stop} disabled={!this.state.isRecording}>Stop</button> 
          <audio src={this.state.blobURL} controls="controls" />
          <h3>
            <button onClick={this.showTranscribe.bind(this)}>Get Location</button>
          </h3>
        </header>
      </div>
    );
  } else {
    return(
      <div className="App">
        <header className="App-header">
          <button onClick={this.start} disabled={this.state.isRecording}>Record</button>
          <button onClick={this.stop} disabled={!this.state.isRecording}>Stop</button> 
          <audio src={this.state.blobURL} controls="controls" />
          <h3>
            Results:
            <TranscribeFetch />
          </h3>
          <h4>
          <SearchLocationPage pesq = {this.state.showSearchLocation}/>
           <button onClick={this.goSearch}> Introduzir endereco!</button>
          </h4>
        </header>
      </div> 
    )
        
  }
  
}
 
}

export default App;
