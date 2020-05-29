class ListBox extends React.Component {
	constructor(props) {
		super(props)
	}
	
	render() {
		var options = []
		console.log('Persons = ' + this.props.persons)
		for (name of this.props.persons)
			options.push(<option key={name}>{name}</option>)
		return (
			<div>
				<select ref={this.props.reference} name="sometext" size="5">
					{options}
				</select>
			</div>
		)
	}
}




class PairBoxes extends React.Component {
	constructor(props) {
		super(props)
		this.listboxref1 = React.createRef();
		this.listboxref2 = React.createRef();
		console.log(this.listboxref1)
		console.log(this.listboxref2)
		this.state = { personsin : [], personsout : [] }
		this.getData();
	}
	
	getData() {
		var theobject = this
		fetch(this.props.theserver).then(function(data) {
			return data.json();
		}).then(function(json) {
			var arr = json.map((obj) => (obj.name))
			theobject.setState(function(state, props) {
				console.log('this.state.personsin = ', this.state.personsin[0], typeof this.state.personsin[0])
				var pin = this.state.personsin.filter(x => arr.includes(x))
				var pout = arr.filter(x => !pin.includes(x))
				console.log('pin = ', pin[0], typeof pin[0])
				console.log('pout = ', pout[0], typeof pout[0])
				return { personsin : pin, personsout : pout}
			})
		})
	}
	
	componentDidMount() {
		this.timer = setInterval(this.timeout.bind(this), this.props.updateinterval)
	}
	
	componentWillUnmount() {
		clearInterval(this.timer)
	}
	
	timeout() {
		this.getData()
	}
	
	move(fromarray, toarray, person) {
		console.log('move: ' + fromarray + '--' + toarray)
		console.log(fromarray[0], typeof fromarray[0], person, typeof person)
		var index = fromarray.indexOf(person)
		console.log('index = ' + index)
		if (index != -1) {
			var toremove = fromarray.indexOf(person)
			var removed = fromarray.splice(toremove, 1)
			toarray.push(removed[0])
			//console.log('toarray = ', toarray[0], typeof toarray[0])
			//console.log('move: ' + fromarray + ' -- ' + toarray)
		}
	}
	
	add() {
		var person = String(this.listboxref2.current.value)
		//console.log('Outside adding ' + person + ' typeof = ' + typeof person)
		this.setState(function(state, props) {
			//console.log('Inside adding ' + person + ' typeof = ' + typeof person)
			this.move(state.personsout, state.personsin, person)
			return { personsin : state.personsin, personsout : state.personsout}
		})
	}
	
	subtract() {
		var person = String(this.listboxref1.current.value)
		console.log(this.listboxref1.current.value)
		this.setState(function(state, props) {
			this.move(state.personsin, state.personsout, person)
			return { personsin : state.personsin, personsout : state.personsout}
		})
	}
	
	render() {
		this.leftbox = <ListBox reference={this.listboxref1} persons={this.state.personsin}/>
		this.rightbox = <ListBox reference={this.listboxref2} persons={this.state.personsout}/>
		return (
			<div>
				{this.leftbox}
				<button onClick={this.subtract.bind(this)}>--&gt;</button>
				<button onClick={this.add.bind(this)}>&lt;--</button>
				{this.rightbox}
			</div>
		)
	}
}



ReactDOM.render(<PairBoxes theserver="http://localhost:9998/persons/list" updateinterval="5000"/>, reacthere)
