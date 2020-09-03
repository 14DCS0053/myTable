
import React, { Component } from 'react';

class List extends Component {
   /*  constructor() {
        super();
        console.log('constructor');
    } */
   /*  componentWillReceiveProps(){
        console.log(`componentWillReceiveProps${this.props.text}`);
    } */
    componentWillUnmount(){
        console.log(`componentWillUnmount${this.props.text}`);
    }
    componentDidMount(){
        console.log(`componentDidMount${this.props.text}`);
    }
    render() {
        /* console.log('render'); */
        return (
            <li>{this.props.text}{this.props.index}<i className="fa fa-close" onClick={this.props.remove}></i></li>
        );
    }
}

export default List;
