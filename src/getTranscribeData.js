import React from 'react';

class TranscribeData extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            body: '',
        };
    }

    async componentDidMount() {
        const url = "https://4xfwd1debf.execute-api.us-east-1.amazonaws.com/proj/trasnscribe";
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };
        const response = await fetch(url,requestOptions);
        const data = await response.json();
        console.log(data);
        this.setState({ body: data.body })
        //console.log("--->"+this.state.body);
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