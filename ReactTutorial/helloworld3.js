class HelloWorld extends React.Component {
    constructor(props) {
        super(props)
        this.state = { counter : 0 }
    }
    render() {
        var sentence = "";
        console.log('Counter inside render = ', this.state.counter)

        if (this.state.counter % 3 == 0)
            sentence = "Hello"
        else
            if (this.state.counter % 3 == 1)
                sentence = "Hello World!"

        return (
            <p>{sentence}</p>
        )
    }
    tick() {
        this.setState(state => ({counter : state.counter + 1}))
        console.log('Counter inside tick = ', this.state.counter)
        console.log('this = ', this)
    }
    componentDidMount() {
        setInterval(() => this.tick(), 1000)
    }
}


ReactDOM.render(<HelloWorld/>, reacthere);