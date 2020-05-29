class HelloWorld extends React.Component {
    constructor(props) {
        super(props)
        this.counter = 0
    }
    render() {
        var sentence = "";
        console.log('Counter inside render = ', this.counter)

        if (this.counter % 3 == 0)
            sentence = "Hello"
        else
            if (this.counter % 3 == 1)
                sentence = "Hello World!"

        return (
            <p>{sentence}</p>
        )
    }
    tick() {
        this.counter++
        console.log('Counter inside tick = ', this.counter)
        console.log('this = ', this)
    }
    componentDidMount() {
        setInterval(this.tick.bind(this), 1000)
    }
}


ReactDOM.render(<HelloWorld/>, reacthere);