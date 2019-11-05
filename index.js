var express = require('express')
var app = express();
var request = require('request');
var path = require('path');
var cors = require('cors');
var parser = require("xml2js");
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

console.log(path.join(__dirname,'views'));
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(cors());

function weather(callback){
    request('http://www.weather.go.kr/weather/forecast/mid-term-rss3.jsp?stnld=109',
     function (error, response, body) {
        parser.parseString(body, function (err, jsonData) {
            callback(jsonData.rss.channel[0].item[0].description[0].header[0].wf[0]);    
        })
    });
}


app.get('/weather', function (req, res) {
    weather(function(data){
        res.send(data);
    })
});

app.post('/join', function(req, res){
    var name = req.body.name;
    var id = req.body.id;
    var password = req.body.password;
   console.log(name, id, password);
})

app.get('/', function (req, res) {
    request('http://www.naver.com', function (error, response, body) {
      console.log('body:', body); // Print the HTML for the Google homepage.
      res.send(body);
    });
});

app.get('/home', function (req, res) {
    res.send('<html><body><h1>hello home</h1></body></html>');
})

app.get('/about', function (req, res) {
    res.send('about');
})
 
app.listen(3000)
