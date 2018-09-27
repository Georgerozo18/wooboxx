'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const access_token = 'EAAUQMW2ZC2kQBAIzFNSdH0NejgIbhZBcZCmPYHOBnZBdAyMFrsmfZCIjTXe96sJZBeytHtK4aSKYGcIAXt8RbziDcV74CGcjZCC5FDUqcuHe4RPVgwojOOOnpxCVQ9z1qckBZB7RzDc5tdTLHd5dwF3NoEx6qxE3SAZCubf37guZC0egZDZD';

const app = express();

app.set('port', 5000);
app.use(bodyParser.json());

app.get('/', function(req, response){
  response.send('Hola :V');
})

app.get('/webhook', function(req, response){
  if (req.query['hub.verify_token'] === 'wooboxx_token') {
    response.send(req.query['hub.challenge']);
  } else {
    response.send('wooboxx no tienes permisos.')
  }
});

app.post('/webhook/', function(req, response){
  const webhook_event = req.body.entry[0];
  if(webhook_event.messaging){
    webhook_event.messaging.forEach(event =>{
      handleMessage(event);
    })
  }
  response.sendStatus(200);
});

// Manejador de mensajes
function handleMessage(event){
  // Quien envia el mensaje
  const senderId = event.sender.id;
  // Extraer el mensaje
  const messageText = event.message.text;
  // Objeto construido con la informacion para enviarlo a la api y que este se conecte a la api de facebook messenger
  const messageData = {
    recipient:{
      id: senderId
    },
      message:{
        text: messageText
      }
  }
  // Funcion para enviar la informacion al bot
  callSendApi(messageData);
}

function callSendApi(response){
  request({
    "uri" : "https://graph.facebook.com/me/messages/",
    "qs" : {
      "access_token" : access_token
    },
    "method" : "POST",
    "json" : response
  },
  function(err){
    if(err){
      console.log('Ha ocurrido un error')
    } else {
      console.log('Mensaje enviado')
    }
  }
)}

app.listen(app.get('port'), function(){
  console.log('Nuestro servidor esta funcionando en el puerto', app.get('port'));
})
