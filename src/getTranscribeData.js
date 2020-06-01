import React from 'react';

class TranscribeData extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            body: '',
        };
    }

    async componentDidMount() {
        const url = "https://3xeam2g64j.execute-api.us-east-1.amazonaws.com/transcribe/transcribe";
        const response = await fetch(url)
        const data = await response.json();
        console.log(data);
        this.setState({ body: data.body })
    }    

    render() {
        return (
            <div>
                {this.state.body}
            </div>
        )
    }
}

export default TranscribeData;