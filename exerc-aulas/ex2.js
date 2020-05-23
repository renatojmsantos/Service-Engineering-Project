class Exercicio_2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = { items: [], text: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    render() {
        return (
            <div>
                <h3>Shopping List:</h3>
                <ShoppinList items={this.state.items} />
                <form onSubmit={this.handleSubmit}>
                    <input
                        id="new-todo"
                        onChange={this.handleChange}
                        value={this.state.text}
                    />
                    <button>
                        Add
                    </button>
                </form>
            </div>
        );
    }
  
    handleChange(e) {
        this.setState({ text: e.target.value });
    }
  
    handleSubmit(e) {
        e.preventDefault();
        if (this.state.text.length === 0) {
            return;
        }
        const newItem = {
            text: this.state.text,
            id: Date.now()
        };
        this.setState(state => ({
            items: state.items.concat(newItem),
            text: ''
        }));
    }
}
  
class ShoppinList extends React.Component {
    render() {
        return (
            <ul>
            {this.props.items.map(item => (
                <li key={item.id}>{item.text} 
                    <button onClick={this.handleClick}> 
                        Delete 
                    </button>
                </li>                
            ))}
            </ul>
        );
    }

    handleClick = itemId => {
        console.log("AQUI");
        const items = this.props.items.filter(item => item.id !== itemId);
        this.setState({ items: items });
    }
}


ReactDOM.render(<Exercicio_2/>, reacthere);