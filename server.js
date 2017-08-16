/**
 * Created by DELL on 4/22/2016.
 */

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var model = require('./model');
var tempmodel = require('./tempmodel');
var sprinklermodel = require('./sprinklermodel');
var firemodel = require('./firemodel');
var connection = require('./connection');
var Info = mongoose.model('info', model, 'infos');
var TempInfo = mongoose.model('tempinfo', tempmodel, 'tempinfo');
var SprinkInfo = mongoose.model('sprinkinfo', sprinklermodel, 'sprinkinfo');
var FireInfo = mongoose.model('fireinfo', firemodel, 'fireinfo');
var favicon = require('serve-favicon');
var config = require('./config');
var cmd = require('node-cmd');
var exec = require('child_process').exec;


/*app.use(favicon(__dirname + '/public/images/favicon.ico'));*/
app.use(express.static(__dirname + '/public'));
app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use(bodyparser.json());

var setTempValue =24;

mongoose.connect(connection.connectionString);

app.get('/getinfo',function(req,res){

    Info.find(function (err, docs) {
        if (err) return console.error(err);
        res.json(docs);
    });
});

app.get('/getWaterinfo/:id',function(req,res){
    id = req.params.id;
    Info.findOne({'deviceID': req.params.id},{"waterlevel":true, "_id":false}, {sort: {'TimeStamp' : -1}},function (err, docs) {
        if (err) return console.error(err);                
        var level = parseInt(docs.waterlevel);
        var resultInPercent = 0;
        if (level >= 950) {
                resultInPercent = 0;
        }
        else if (level <= 500) { resultInPercent = 100;}
        else
        {
            resultInPercent = ((level - 500)/(950-500)) * 100;
			resultInPercent = 100 - resultInPercent;
        }
        console.log(level);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");   
        res.json(resultInPercent);
    });
});

app.get('/getHeatinfo/:id',function(req,res){
    id = req.params.id;
    Info.find({'deviceID': req.params.id},{"temperature":true,"TimeStamp":true, "_id":false}, {sort: {'TimeStamp' : -1}, limit:10},function (err, docs) {
        if (err) return console.error(err);                                
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");   
        res.json(docs);
    });
});

app.post('/getinfo',function(req,res){
    var info = new  Info (
        req.body
    );
    console.log(req.body);
    info.save(function(err){
    if (err) return console.error(err);
        res.json(info);
});
});

app.delete('/getinfo/:id',function(req,res){

var id = req.params.id;
    Info.remove( {'_id': mongoose.Types.ObjectId(id)}, function(error,docs){
     if (error) {
        console.log(error);
     }
        res.json(docs);
     })
});


app.put('/getinfo/:id',function(req,res) {
    var id = req.params.id;
    console.log(req.body.firstname);
    console.log(req.body.lastname);
    console.log(mongoose.Types.ObjectId(id));
    var query = { '_id': mongoose.Types.ObjectId(id) };
    var update = { '$set': { 'firstname': req.body.firstname, 'lastname':req.body.lastname} };
    var options = { 'new': true };
    Info.findOneAndUpdate(query, update, options, function (err, docs) {
        if (err)   console.log(err);
        res.json(docs);
    });

});

app.post('/settempinfo/:id',function(req,res){  
    var myJSONObject = { 
                         'temperature': req.params.id,
                          };
    var tempinfo = new  TempInfo (
        myJSONObject    
    );    
    console.log(req.params.id);
    tempinfo.save(function(err){
    if (err) return console.error(err);
        res.send('Temperature Set ' + req.params.id);    
    }); 
    
});

app.post('/setsprinkleroff/:id',function(req,res){    
    var myJSONObject = { 
                         'sprinkler': req.params.id,
                          };
    var sprinkinfo = new  SprinkInfo (
        myJSONObject    
    );    
    console.log(req.params.id);
    sprinkinfo.save(function(err){
    if (err) return console.error(err);
        res.send('sprinkler is set to OFF');    
    }); 
    
});


app.post('/setsprinkleron/:id',function(req,res){
   var myJSONObject = { 
                         'sprinkler': req.params.id,
                          };
    var sprinkinfo = new  SprinkInfo (
        myJSONObject    
    );    
    console.log(req.params.id);
    sprinkinfo.save(function(err){
    if (err) return console.error(err);
        res.send('sprinkler is set to ON');    
    }); 
});


app.post('/setfiremodeon/:id',function(req,res){    
    var myJSONObject = { 
                         'fire': req.params.id,
                          };
    var fireinfo = new  FireInfo (
        myJSONObject    
    );    
    console.log(req.params.id);
    fireinfo.save(function(err){
    if (err) return console.error(err);
        res.send('Fire Mode is set to ON');      
    }); 
   
});


app.post('/setfiremodeoff/:id',function(req,res){
   var myJSONObject = { 
                         'fire': req.params.id,
                          };
    var fireinfo = new  FireInfo (
        myJSONObject    
    );    
    console.log(req.params.id);
    fireinfo.save(function(err){
    if (err) return console.error(err);
        res.send('Fire Mode is set to OFF');          
    }); 

});


var Port = process.env.PORT || 3000;
app.listen(Port);
console.log("server running on port " + Port);