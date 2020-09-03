
import React, { Component } from 'react';
import List from './lists';

class Form extends Component {
    constructor() {
        super();
        this.state = {
            listData: [],
            inputvalue: ""
        }
    }
    change = (e) => {
        this.setState({ inputvalue: e.target.value})
    }
    add = e => {
        e.preventDefault();
        if (this.state.inputvalue!== "") {
            this.setState({
                inputvalue: "",
                listData: [...this.state.listData,this.state.inputvalue]
            });
        }
    }
    remove = (index) => {
        this.state.listData.splice(index, 1);
        this.setState(
            { listData: this.state.listData}
        );
    }
    render() {
        return (
            <div className="my-container">
                <form onSubmit={this.add}>
                    <input type="text" placeholder="Enter an item to add into list" onChange={this.change} value={this.state.inputvalue} />
                    <input type="submit" value="additem"/>
                </form>
                {this.state.listData.length > 0 && < ul >
                    {this.state.listData.map((t, index) => {
                        return <List text={t} key={index}index={index} remove={this.remove.bind(this, index)} />
                    })}
                </ul>}
		  </div>
	  );
	}
}

export default Form;
