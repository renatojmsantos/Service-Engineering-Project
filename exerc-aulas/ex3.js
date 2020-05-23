
class Exercicio_3 extends React.Component { 
    state = {
        pesron: null
    }

    handleUrl() {
        const url = "https://randomuser.me/api/?results=10";
        const response = fetch(url);
        const data = response.json();
        console.log("AQUUI");
        console.log(data.results);
        for (var i=0; i < data.results.length; i++ ) {
            console.log(i);
        }
        
    }

    render() {
        return (
            <div>
                <h3>List Box:</h3>

            </div>           
            
        );
    }

} 


ReactDOM.render(<Exercicio_3/>, reacthere);