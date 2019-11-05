var request = require('request');
var express = require('express');
var app = express();
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
/*
app.get('/', function (req, res) {
    request('http://www.naver.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    res.send(body);
    });
 });

*/
function weather(callback){
request('http://www.weather.go.kr/weather/forecast/mid-term-rss3.jsp?stnld=109', function (error, response, body)
 {    
     parser.parseString(body, function (err, jsonData) {
        console.log(body);        
        console.log(jsonData);
        callback(jsonData.rss.channel[0].item[0].description[0].header[0].wf[0]);
        })
});
}

weather(function(string){
    console.log(string);
});


 //app.listen(3000);
