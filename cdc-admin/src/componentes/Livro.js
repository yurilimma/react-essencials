import React, { Component } from 'react';
import $ from 'jquery'
import InputCustomizado from './InputCustomizado'
import PubSub from 'pubsub-js'
import TratadorErros from './TratadorErros'


export class FormularioLivro extends Component{
    constructor(){
        super();
        this.state ={titulo: '', preco: '', autorId: ''};
        /**
         * Basicamente o .bind(this) indica que o elemento
         * pode utilizar as informações contidas no this do construtor da classe,
         * no caso o que está dentro de this.state etc
         */
        this.setTitulo =this.setTitulo.bind(this);
        this.setPreco =this.setPreco.bind(this);
        this.setAutorId =this.setAutorId.bind(this);
        this.enviaForm =this.enviaForm.bind(this);
        this.salvaAlteracao =this.salvaAlteracao.bind(this);

        


    }
    enviaForm(evento){
        console.log("dados sendo enviados");
    
        //evita que a página seja recarregada/reinderizada automaticamente ao clicar no evento
        evento.preventDefault();
        
        $.ajax({
            url:"http://localhost:8080/api/livros",
            contentType:"application/json",
            dataType: "json",
            type:"post",
            data: JSON.stringify({titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId}),
            success: function(novaListagem){
                console.log("gravou com sucesso");
                /**
                 * informa que a listagem de autores precisa
                 * ser atualizada parametros:
                 * canal/topico, nova lista
                 */
                PubSub.publish('atualiza-lista-livros',novaListagem);
                this.setState({titulo:'',preco:'',autorId:''});
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
        this.setState({titulo:'',preco:'',autorId:''});
    }

    salvaAlteracao(nomeInput, evento){
        var campo = {};
        campo[nomeInput] = evento.value.target;
        this.setState(campo);
    }

    setTitulo(titulo){
    //Alterar o valor nos objetos dentro do estado, apenas com o setState!!
    this.setState({titulo: titulo.target.value});
    }
    setPreco(preco){
    this.setState({preco: preco.target.value});
    }
    setAutorId(autorId){
    this.setState({autorId: autorId.target.value});
    }

    render(){
        var autores = this.props.autores.map(function(autor){
            return <option key={autor.id} value={autor.id}>{autor.nome}</option>;
        });


        return(
            <div className="pure-form pure-form-aligned">
            <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm}>
            <InputCustomizado id="titulo" name="titulo" label="Titulo: " type="text" value={this.state.titulo} placeholder="Titulo do livro" onChange={this.setTitulo} />
            <InputCustomizado id="preco" name="preco" label="Preco: " type="decimal" value={this.state.preco} placeholder="Preço do livro" onChange={this.setPreco} />

            <div className="pure-control-group">
                <label htmlFor="autorId">autor</label>
                <select value={this.state.autorId}  name="autorId" onChange={this.setAutorId}>
                <option value="">Selecione</option>
                {autores}
                </select>
            </div>
            <div className="pure-control-group">                                  
                <label></label> 
                <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
            </div>          
            </form>             
        </div>

        );
    }
}


export class TabelaLivros extends Component{
   
  render() {
    var livros = this.props.lista.map(function(livro){
      console.log(livro);
      return(
          <tr key={livro.titulo}>
            <td>{livro.titulo}</td>
            <td>{livro.preco}</td>
            <td>{livro.autor.nome}</td>
          </tr>
        );
      });
    return(
      <table className="pure-table">
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Preco</th>
            <th>Autor</th>
          </tr>
        </thead>
        <tbody>
          {livros}
        </tbody>
      </table>
    );
  }
}


export default class LivroBox extends Component{
constructor(props){
    super(props);
    this.state ={lista: [],autores:[]};
}
    /** executa antes do componente ser montado, antes da primeira reinderização/render */
componentWillMount(){
    $.ajax({
      url:"http://localhost:8080/api/livros",
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
    PubSub.subscribe('atualiza-lista-livros', function(topico,novaLista){
        this.setState({lista: novaLista});
    }.bind(this));

    $.ajax({
        url: "http://localhost:8080/api/autores",
        dataType: 'json',
        success: function(data) {
          this.setState({autores: data});
        }.bind(this)
    });
}

render(){
    //é necessário uma div encapsulando os componentes pois o jsx entende tudo como xml e nao podemos ter 2 pais no xml
        return(
        <div>  
            <div className="header">
                    <h1>Cadastro de Livros</h1>
            </div>
            <div className="content" id="content">
                <FormularioLivro autores={this.state.autores}/>
                <TabelaLivros lista={this.state.lista}/>
            </div> 
        </div>
        );
    }



}




