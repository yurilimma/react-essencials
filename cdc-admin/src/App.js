import React, { Component } from 'react';
import './App.css';
import './css/pure-min.css';
import './css/side-menu.css';
import $ from 'jquery'
import InputCustomizado from './componentes/InputCustomizado'

class App extends Component {

  constructor(){
    super();
    this.state = {lista: [], nome: '', email: '', senha: ''};
    /**
     * Basicamente o .bind(this) indica que o elemento
     * pode utilizar as informações contidas no this do construtor da classe,
     * no caso o que está dentro de this.state etc
     */
    this.setNome = this.setNome.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setSenha = this.setSenha.bind(this);
    this.enviaForm = this.enviaForm.bind(this);

    
    //this.enviaForm = this.enviaForm.bind(this); //informa que o enviaForm utiliza os elementos do react 
    
  }
  /** executa antes do componente ser montado, antes da primeira reinderização/render */
  componentWillMount(){
    $.ajax({
      url:"http://localhost:8080/api/autores",
      //url:"http://cdc-react.herokuapp.com/api/autores"
      dataType: 'json',
      success: function(response){
        //se nao colocar o bind, pega o this do jquery já que esta dentro do ajax
        this.setState ( {lista: response});
      }.bind(this) //informa que o this a ser usado é do react, de fora
    });
  }
  
 /** executa logo apos o componente ser montado, após a primeira reinderização/render
 componentDidMount(){

 }
 */
  enviaForm(evento){
    console.log("dados sendo enviados");

    //evita que a página seja recarregada/reinderizada automaticamente ao clicar no evento
    evento.preventDefault();

    $.ajax({
      url:"http://localhost:8080/api/autores",
      contentType:"application/json",
      dataType: "json",
      type:"post",
      data: JSON.stringify({nome: this.state.nome, email: this.state.email, senha: this.state.senha}),
      success: function(response){
        
        console.log("gravou com sucesso");
        this.setState ( {lista: response});
      }.bind(this),
      error: function(error){
        console.log("deu erro");
        console.log(error);
      }
    })
  }

  setNome(nome){
    //Alterar o valor nos objetos dentro do estado, apenas com o setState!!
    this.setState({nome: nome.target.value});
  }
  setEmail(email){
    this.setState({email: email.target.value});
  }
  setSenha(senha){
    this.setState({senha: senha.target.value});
  }

  render() {
    return (
      <div id="layout">
      {/** comentario assim*/} 
      <a href="#menu" id="menuLink" className="menu-link">

          <span></span>
      </a>
  
        <div id="menu">
            <div className="pure-menu">
                <a className="pure-menu-heading" href="#">Company</a>
    
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><a href="#" className="pure-menu-link">Home</a></li>
                    <li className="pure-menu-item"><a href="#" className="pure-menu-link">Autor</a></li>
                    <li className="pure-menu-item"><a href="#" className="pure-menu-link">Livros</a></li>

                </ul>
            </div>
        </div>
  
      <div id="main">
          <div className="header">
              <h1>Cadastro de Autores</h1>
          </div>
          <div className="content" id="content">
            <FormularioAutor />
            <TabelaAutores />
              <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm.bind()} method="post">
                  <InputCustomizado id="nome" type="text" name="Nome" value={this.state.nome} onChange={this.setNome} />
                  <InputCustomizado id="email" type="email" name="Email" value={this.state.email} onChange={this.setEmail} />
                  <InputCustomizado id="senha" type="password" name="Senha" value={this.state.senha} onChange={this.setSenha} />
                  
                  <div className="pure-control-group">                                  
                    <label></label> 
                    <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
                  </div>
                </form>             

              </div>  
              <div>            
                <table className="pure-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.lista.map(function (autor){
                        return (
                          <tr key={autor.id}>
                            <td>{autor.nome}</td>
                            <td>{autor.email}</td>
                          </tr>
                        )
                      }) 
                    }
                  </tbody>
                </table> 
              </div>             
            </div>
          
      </div>
  </div>
    );
  }
}

export default App;
