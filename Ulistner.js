var mongoose = require('mongoose');
var model = require('./model');
var tempmodel = require('./tempmodel');
var sprinklermodel = require('./sprinklermodel');
var firemodel = require('./firemodel');
var connection = require('./connection');
var Info = mongoose.model('info', model, 'infos');
var TempInfo = mongoose.model('tempinfo', tempmodel, 'tempinfo');
var SprinkInfo = mongoose.model('sprinkinfo', sprinklermodel, 'sprinkinfo');
var FireInfo = mongoose.model('fireinfo', firemodel, 'fireinfo');
var schedule = require('node-schedule');
var exec = require('child_process').exec;

mongoose.connect(connection.connectionString);

var j = schedule.scheduleJob('*/5 * * * * *', function(){   

  TempInfo.find(function (err, docs) {
        if (err) return console.error(err);
        //console.log(docs.length);
        if (docs.length >= 1) {
        	var constantV = '';
    		var topicName = '/subsense';
    		constantV = " -t " + topicName + " -m " + 'sett_' + docs[0].temperature;    	
        	var cmd = '"C:\\Program Files (x86)\\mosquitto\\mosquitto_pub.exe"' + constantV;  

        	exec(cmd, function(error, stdout, stderr) {
        		if (error) { console.log(error);}
        		console.log('Temperature is set');                	          		
    		});

        	TempInfo.remove( {'_id': mongoose.Types.ObjectId(docs[0]._id)}, function(error,docs){
     			if (error) {
        			console.log(error);
     			}	        
     		})
     	}
    });

  SprinkInfo.find(function (err, docs) {
        if (err) return console.error(err);
        //console.log(docs.length);
        if (docs.length >= 1) {
        	var constantV = '';
    		var topicName = '/pubsense';
    		constantV = " -t " + topicName + " -m " + docs[0].sprinkler;    	
        	var cmd = '"C:\\Program Files (x86)\\mosquitto\\mosquitto_pub.exe"' + constantV;  

        	exec(cmd, function(error, stdout, stderr) {
        		if (error) { console.log(error);}
        		console.log('sprinkler is set');                	          		
    		});

        	SprinkInfo.remove( {'_id': mongoose.Types.ObjectId(docs[0]._id)}, function(error,docs){
     			if (error) {
        			console.log(error);
     			}	        
     		})
     	}
    });

  FireInfo.find(function (err, docs) {
        if (err) return console.error(err);
        //console.log(docs.length);
        if (docs.length >= 1) {
        	var constantV = '';
    		//var topicName = '/subsense';
    		//constantV = " -t " + topicName + " -m " + 'setl_' + docs[0].fire;    	
        	//var cmd = '"C:\\Program Files (x86)\\mosquitto\\mosquitto_pub.exe"' + constantV;  
			var topicName = 'ustIn';
            constantV = " -h broker.hivemq.com -p 1883 -t " + topicName + " -m " + '0';      
               var cmd = '"C:\\Program Files (x86)\\mosquitto\\mosquitto_pub.exe"' + constantV; 

        	exec(cmd, function(error, stdout, stderr) {
        		if (error) { console.log(error);}
        		console.log('Fire mode is set');                	          		
    		});

        	FireInfo.remove( {'_id': mongoose.Types.ObjectId(docs[0]._id)}, function(error,docs){
     			if (error) {
        			console.log(error);
     			}	        
     		})
     	}
    });

});