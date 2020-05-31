
import React , { Component } from 'react';
import ReactDom from 'react-dom';
import ReactS3 from 'react-s3';


const config = {
    bucketName: 'proj-es-s3',
    dirName: 'Voice', /* optional */
    region: 'us-east-1',
    accessKeyId: 'ASIA6HCXC5AB3CZZ45PC',
    secretAccessKey: 'Tj7El0Q//KsFn5K2XSr54q+ZjbUu2TgeRUFJ92c4',
}

class Home extends Component {
    constructor(){ 
        super();
    }

    upload(e){
        console.log(e.target.files);
        ReactS3.uploadFile( e.target.files[0] , config)
        .then( (data)=>{
            console.log(data.location);
        })
        .catch( (err)=>{
            alert(err);
        })
    }

    render(){
        return (
            <div>
                <h3>
                    aws test
                </h3>
                <input type="file" onChange={this.upload}/>
            </div>
        );
    }
}

export default Home;