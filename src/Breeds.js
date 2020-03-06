import * as React from "react";

class Breeds extends React.Component {
    headerStyle = {"fontWeight": "bold"};
    constructor(props) {
        super(props);
        this.state = { breeds: [], searchString: "", selectedOrigin: "", origins: [] };
        this.searchEl = React.createRef();
        this.handleOriginChange = this.handleOriginChange.bind(this);
    }    

    handleSearchInput = () => {
        if (this && this.searchEl.current) {
            const searchString = this.searchEl.current.value;
            this.setState({ searchString: searchString });
            this.showBreeds(searchString, this.state.selectedOrigin);
        }
    }

    handleOriginChange(event) {
        const selectedOrigin = event.target.value === "Choose origin" ? "" :  event.target.value;
        this.setState({ selectedOrigin: selectedOrigin });
        this.showBreeds(this.state.searchString, selectedOrigin);        
    }

    showBreeds(search, origin) {
        if (search === "" && origin === "") {
            this.loadAllBreeds();
        } else {
            this.filterBreeds(search, origin);
        }
    }

    componentDidMount() {
        this.getOrigins();
        this.loadAllBreeds();
    }

    render() {
        return (
            <div className="breeds">
                <h2 className="app-header">Cat breeds</h2>
                <div className="selection">              
                <input type="text" placeholder="Search by name.." className="search-box" ref={this.searchEl} onKeyUp={this.handleSearchInput}></input>
                    <select className="origin-select" value={this.state.value} onChange={this.handleOriginChange}>
                        <option value="Choose origin">Choose origin</option>
                        {this.state.origins.map(origin => 
                            <option value={origin}>{origin}</option>
                        )}
                    </select>
                </div>
                <ul className="breeds-list">
                    <li key={"header"} className="breed-list-item" style={this.headerStyle}>
                        <span className="name" title="Name">Name</span>
                        <span className="description" title="Description">Description</span>
                        <span className="temperament" title="Temperament">Temperament</span>
                        <span className="origin" title="Origin">Origin</span>
                    </li>
                    {this.state.breeds.map(b => 
                        <li key={b._id} className="breed-list-item">
                            <span className="name" title={b.name}>{b.name}</span>
                            <span className="description" title={b.description}>{b.description}</span>
                            <span className="temperament" title={b.temperament}>{b.temperament}</span>
                            <span className="origin" title={b.origin}>{b.origin}</span>
                        </li>
                    )}
                </ul>
            </div>
        );
    };

    getOrigins() {
        const requestBody = {
            query: `{origins}`
        };
        fetch("http://localhost:5000/graphql", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-type": "application/json"
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error("Failed");
            }
            return res.json();
        })
        .then(resData => {
            this.setState({ origins: resData.data.origins });           
        })
        .catch(err => {
            console.log(err);
        });
    }

    loadAllBreeds() {
        const requestBody = {
            query: `{
                breeds {
                    _id
                    name 
                    description
                    temperament
                    origin
                }
            }`
        };

       this.loadBreeds(requestBody);        
    }

    filterBreeds(search, origin) {
        const requestBody = {
            query: `{
                filterBreeds(search: "${search}", origin: "${origin}") {
                    _id
                    name 
                    description
                    temperament
                    origin
                }                
            }`
        };

        this.loadBreeds(requestBody);
    }

    loadBreeds(requestBody) {
        fetch("http://localhost:5000/graphql", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-type": "application/json"
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error("Failed");
            }
            return res.json();
        })
        .then(resData => {
            if (resData.data.breeds) {
                const breeds = resData.data.breeds;
                this.setState({ breeds: breeds });
            } else if (resData.data.filterBreeds) {
                const breeds = resData.data.filterBreeds;
                this.setState({ breeds: breeds });
            }
        })
        .catch(err => {
            console.log(err);
        });
    }
};

export default Breeds;