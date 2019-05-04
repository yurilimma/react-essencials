import React, { Component } from 'react';


export default class InputCustomizado extends Component{
    
    render(){
        return(
            <div className="pure-control-group">
                <label htmlFor={this.props.name}>{this.props.name}</label>
                {/**this.props está com todos os elementos passados por parâmetro */} 
                <input id={this.props.id} type={this.props.type} name={this.props.name} value={this.props.value} onChange={this.props.onChange} />                  
            </div>
        );
    }
}



