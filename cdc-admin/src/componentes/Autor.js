import React, { Component } from 'react';
import $ from 'jquery'
import InputCustomizado from './InputCustomizado'
import PubSub from 'pubsub-js'
import TratadorErros from './TratadorErros'


export class FormularioAutor extends Component{
    constructor(){
        super();
        this.state ={nome: '', email: '', senha: ''};
        /**
         * Basicamente o .bind(this) indica que o elemento
         * pode utilizar as informações contidas no this do construtor da classe,
         * no caso o que está dentro de this.state etc
         */
        this.setNome =this.setNome.bind(this);
        this.setEmail =this.setEmail.bind(this);
        this.setSenha =this.setSenha.bind(this);
        this.enviaForm =this.enviaForm.bind(this);

    }
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
            success: function(novaListagem){
                console.log("gravou com sucesso");
                /**
                 * informa que a listagem de autores precisa
                 * ser atualizada parametros:
                 * canal/topico, nova lista
                 */
                PubSub.publish('atualiza-lista-autores',novaListagem);
            },
            error: function(error){
                console.log("deu erro");
                console.log(error);
                if(error.status === 400){
                    new TratadorErros().publicaErros(error.responseJSON);

                }
            },
            beforeSend: function(){
                PubSub.publish("limpa-erros",{});
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

    render(){
        return(
            <div className="pure-form pure-form-aligned">
            <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm.bind()} method="post">
              <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} />
              <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} />
              <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} />
              
              <div className="pure-control-group">                                  
                <label></label> 
                <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
              </div>
            </form>             

          </div>  

        );
    }
}


export class TabelaAutores extends Component{
    constructor(){
        super();
        this.state ={lista: []};
        
    }
    /** executa antes do componente ser montado, antes da primeira reinderização/render */
  componentWillMount(){
    $.ajax({
      url:"http://localhost:8080/api/autores",
      //url:"http://cdc-react.herokuapp.com/api/autores"
      dataType: 'json',
      success: function(response){
        this.setState ( {lista: response});
      }.bind(this) 
    });
  }
    render(){
        return(
            <table className="pure-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.props.lista.map(function (autor){
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
        );
    }
}


export default class AutorBox extends Component{
constructor(){
    super();
    this.state ={lista: []};
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


    /**
     * se inscreve no canal, quando
     * ouver atualização na lista terá publicação no canal,
     * logo, cairá nessa função aqui embaixo 
     */
    PubSub.subscribe('atualiza-lista-autores', function(topico,novaLista){
        this.setState({lista: novaLista});
    }.bind(this));
}

render(){
    //é necessário uma div encapsulando os componentes pois o jsx entende tudo como xml e nao podemos ter 2 pais no xml
        return(
        <div>  
            <div className="header">
                    <h1>Cadastro de Autores</h1>
            </div>
            <div className="content" id="content">
                <FormularioAutor />
                <TabelaAutores lista={this.state.lista}/>
            </div> 
        </div>
        );
    }
}


