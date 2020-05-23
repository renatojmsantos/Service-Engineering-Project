
class Exercicio_1 extends React.Component {
    state = {
        value: "Default"
    }

    setValue = (event) => {
        this.setState({
            value: event.target.value
        })
    }

    render() {
        return (
            <div>
                <form>
                    <input value={this.state.value} onChange={this.setValue}/>
                    <hr />
                    <textarea value={this.state.value} onChange={this.setValue} />
                </form>
            </div>
        )
    }
}


ReactDOM.render(<Exercicio_1/>, reacthere);
