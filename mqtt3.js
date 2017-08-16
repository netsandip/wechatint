var mqtt = require('mqtt');
var config = require('./config');
var mongoose = require('mongoose');
var connection = require('./connection');
var model = require('./model');
var Info = mongoose.model('info', model, 'infos');
var client  = mqtt.connect(config.BrokerAddress);
var request = require('request');

 
client.on('connect', function () {
	console.log('MQTT Connected');			
  	client.subscribe(config.TemperatureTopic);  	
  	client.subscribe(config.SubSense);
  	client.subscribe(config.PubSense);  
})
 
client.on('message', function (topic, message) {
  // message is Buffer     
  var messageCheck = message.toString(),
    substring = "|";  
    //console.log(topic.toString() + " " + message.toString());
  var deviceID = "", temperature = "", waterlevel = "", humidity = "", TimeStamp = "";
  if (messageCheck.indexOf(substring) !== -1) {
  	console.log(topic.toString() + " " + message.toString());
  	var str = messageCheck;
	var arr = str.split(substring);

	if (arr.length == 2) {
		//console.log(JSON.stringify(arr));
		var waterlevelInfo = arr[1];
		var Waterarr = waterlevelInfo.split(":");		
		deviceID = arr[0];
		waterlevel = Waterarr[1];			

		var myJSONObject = { 'deviceID': deviceID,
  						 'waterlevel': waterlevel,
  						 'temperature': '',
  						 'humidity': '',
  						 'TimeStamp': new Date() };
		request({
    		url: "http://localhost:3000/getinfo",
    		method: "POST",
    		json: true,   // <--Very important!!!
    		body: myJSONObject
		}, function (error, response, body){
    		console.log("Water level Record saved");
		});
	}

	if (arr.length == 3) {
		//console.log(JSON.stringify(arr));
		var tempInfo = arr[1];
		var humidInfo = arr[2];
		var temparr = tempInfo.split(":");		
		var humidarr = humidInfo.split(":");		
		deviceID = arr[0];
		temperature = temparr[1];			
		humidity = humidarr[1];			

		var myJSONObject = { 'deviceID': deviceID,
  						 'waterlevel': '',
  						 'temperature': temperature,
  						 'humidity': humidity,
  						 'TimeStamp': new Date() };
		request({
    		url: "http://localhost:3000/getinfo",
    		method: "POST",
    		json: true,   // <--Very important!!!
    		body: myJSONObject
		}, function (error, response, body){
    		console.log("Temperature and humidity Record saved");
		});
	}

	
  }  
  //client.end()
})

