var express = require('express');
var app = express();
var request = require('request');
var path = require('path');
var cors = require('cors');
var parser = require("xml2js");

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'love1998!!',
  database : 'kisapay'
});
app.use(express.urlencoded());
app.use(express.json());

console.log(path.join(__dirname,'views'));
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(cors());
/*
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
*/
app.get('/join',function(req,res){
    res.render('join');
});
app.get('/sampleDesign',function(req,res){
    res.render('designSample');
});
app.get('/sampleDesign2',function(req,res){
    res.render('starter');
});

app.post('/join', function(req, res){
    
    var name = req.body.name;
    var id = req.body.id;
    var password = req.body.password;
    var values = [[id,password,name]];
    
    connection.connect();
    connection.query('INSERT INTO kisapay.user(userid,userpassword,username) VALUES ?',[values],function (error, results, fields) {
      if (error) throw error;
      console.log('입력완료');
    });
    
    connection.end();
    res.render('designSample');
})

app.get('/', function (req, res) {
    /*
    request('http://www.naver.com', function (error, response, body) {
      console.log('body:', body); // Print the HTML for the Google homepage.
      res.send(body);
    });
    */
   res.render('starter');
});

app.get('/home', function (req, res) {
    res.send('<html><body><h1>hello home</h1></body></html>');
})

app.get('/about', function (req, res) {
    res.send('about');
})
 
app.listen(3000)
