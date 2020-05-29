class HelloWorld extends React.Component {
    constructor(props) {
        super(props)
        this.myarray = props.phrase.split(' ')
        this.state = { counter : 0 }
    }
    render() {
        var sentence = "";
        var period = this.myarray.length + 1;

        for (var i = 0; i < this.state.counter % period; i++)
            sentence += this.myarray[i] + " "; // please forgive me for the extra space in the end

        return (
            <p>{sentence}</p>
        )
    }
    tick() {
        this.setState(state => ({counter : state.counter + 1}))
    }
    componentDidMount() {
        setInterval(() => this.tick(), 1000)
    }
}


ReactDOM.render(<HelloWorld phrase="Hello World! What a nice day."/>, reacthere);