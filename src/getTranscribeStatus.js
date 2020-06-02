import React from 'react';
import TranscribeData from './getTranscribeData'

class TranscribeFetch extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            aux: 0,
            body: '',
            isLoading: true
        };
    }

    async componentDidMount() {
        const url = "https://3xeam2g64j.execute-api.us-east-1.amazonaws.com/transcribe/getstatus";
        const response = await fetch(url)
        const data = await response.json();
        //console.log(data);
        this.setState({ body: data.body })
        console.log(this.state.body);

        if(this.state.body === String('"IN_PROGRESS"')) {
            this.setState({ aux: 0, isLoading: true })
            this.componentDidMount();
        } else {
            /*if(this.state.aux === 0) {
                console.log("1111")
                this.setState({ aux:1 })
                console.log(this.state.aux);
            } else {
                console.log("2222")
                this.setState({ isLoading: false });
            }    */
            this.setState({ isLoading: false })      
        }
    }    

    render() {
        return (
            <div>
                {this.state.isLoading ? (
                    <div>
                        Loading...
                    </div>                    
                ) : (
                    <div><TranscribeData /></div>
                )}
            </div>
        )
    }
}

export default TranscribeFetch;
