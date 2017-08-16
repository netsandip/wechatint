/**
 * Created by DELL on 4/26/2016.
 */
var mongoose = require('mongoose');
module.exports =  mongoose.Schema({
    deviceID: String,
    temperature: String,
    waterlevel:String,
    humidity:String,
    TimeStamp:Date
});
