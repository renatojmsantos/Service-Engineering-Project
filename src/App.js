import React from 'react';
import './App.css';
import MicRecorder from 'mic-recorder-to-mp3';
import AWS from 'aws-sdk';

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


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isRecording: false,
      blobURL: '',
      isBlocked: false,
    };
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

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={this.start} disabled={this.state.isRecording}>Record</button>
          <button onClick={this.stop} disabled={!this.state.isRecording}>Stop</button>
          <audio src={this.state.blobURL} controls="controls" />
        </header>
      </div>
    );
  }
}

export default App;
