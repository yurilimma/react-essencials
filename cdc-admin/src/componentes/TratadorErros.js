import PubSub from 'pubsub-js';



export default class TratadorErros{
    publicaErros(objetoErroRtno){
        for(var i=0; i<objetoErroRtno.errors.length; i++){
            var erro = objetoErroRtno.errors[i];
            console.log(erro);

            PubSub.publish("erro-validacao",erro);
        }
    }
}




