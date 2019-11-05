var express = require('express')
var app = express();
var request = require('request');
var path = require('path');
var cors = require('cors');
var parser = require("xml2js");
var bodyParser = require('body-parser')
var mysql = require('mysql');
var connection = mysql.createConnection({
 
  host     : 'localhost',
  user     : 'root',
  password : 'love1998!!',
  database : 'project'
});
 
connection.connect();
 
app.use(express.urlencoded());
app.use(express.json());

console.log(path.join(__dirname,'views'));
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(cors());

app.get('/index',function(req,res){
    res.render('home');
}); 

app.get('/camera',function(req,res){
    res.render('camera');
}); 

app.get('/cash',function(req,res){
    res.render('cash');
}); 


app.get('/home',function(req,res){
    res.render('home');
}); 

app.get('/signup',function(req,res){
    res.render('signup');
})

app.get('/loginpage',function(req,res){
    res.render('login');
})

app.get('/authResult',function(req,res){
    var auth_code = req.query.code
    console.log("code : "+auth_code);
    var getTokenUrl = 'https://testapi.open-platform.or.kr/oauth/2.0/token';
    var option = {
        method : "POST",
        url : getTokenUrl,
        headers : {
            "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8" 
        },
        form : {
            code : auth_code,
            client_id : "l7xx2fa7c66cf1c24ad6a16458e3543f0b7e",
            client_secret : "dd56b3d51fb5490d91f43d5bb76f36bc",
            redirect_uri : "http://localhost:3000/authResult",
            grant_type : "authorization_code",
        }

    };
    request(option,function(err,response,body){
        if(err)throw err;
        else{
            console.log(body);
            var acccessRequestResult = JSON.parse(body);
            res.render('resultChild',{data:acccessRequestResult});
        }
    })

})

app.get('/withdraw',function(req,res){
    var accessToken = "6bcb0ee2-d8ae-4994-9dd7-1c8c9bb564ff";
    var getTokenUrl = 'https://testapi.open-platform.or.kr/v1.0/transfer/withdraw';
    var option = {
        method : "POST",
        url : getTokenUrl,
        headers : {
            "Content-Type" : "application/json; charset=UTF-8",
            "Authorization" : "Bearer "+accessToken
        },
        json : {
            dps_print_content : "쇼핑몰환불", 
            fintech_use_num : '199004088057725913020448',
            tran_amt : '1000',
            tran_dtime : '20190308142141',
            print_content : "출금계좌인자내역",
            cms_no : "123456789123"            
        }

    };
    request(option,function(err,response,body){
        if(err)throw err;
        else{
            console.log(body);
            var withdrawResult = body;
            res.send( withdrawResult);
        }
    })

})
app.get('/qrcode',function(req,res){
    res.render('qrcode');
})
app.post('/join',function(req,res){
    var name = req.body.userName;
    var id = req.body.userId;
    var password = req.body.userPassword;
    var  accessToken = req.body.accessToken;
    var  refreshToken = req.body.refreshToken;
    var userseqnum = req.body.useseqnum;
  
    console.log(name + "님 회원 가입 시작");
    
    connection.query('INSERT into user (userid, username, userpassword,accessToken,refreshToken,userseqnum) VALUES (?,?,?,?,?,?)'
    ,[id,name,password,accessToken,refreshToken,userseqnum],
     function (error, results, fields) {
        if (error){ throw error; }
        else {
            console.log(results);
            res.json(1);
        }
    });
})

app.post('/user',function(req,res){
    var accessToken = req.body.accessToken;
    var user_seq_no = req.body.userseqnum;
    var requestURL = "https://testapi.open-platform.or.kr/user/me?user_seq_no="+user_seq_no;
    var option = {
        method : "GET",
        url : requestURL,
        headers : {
            "Authorization" : "Bearer "+accessToken
        }
               
    }

    request(option , function(err,response,body){
        res.send(body);
    });

})

app.post('/balance',function(req, res){
    var accessToken = req.body.accessToken;
    var fintech_use_num = req.body.fintech_use_num;
    var requestURL = "https://testapi.open-platform.or.kr/v1.0/account/balance?fintech_use_num="+fintech_use_num+"&tran_dtime=20190307101010";
    var option = {
        method : "GET",
        url : requestURL,
        headers : {
            "Authorization" : "Bearer " + accessToken
        }
    }
    request(option, function(err, response, body){
        var data = JSON.parse(body);

        res.json(data);
    })
})

app.get('/list',function(req, res){
    var accessToken = "6bcb0ee2-d8ae-4994-9dd7-1c8c9bb564ff";
    var requestURL = "https://testapi.open-platform.or.kr/v1.0/account/transaction_list";
    var qs = 
    "?fintech_use_num=199004088057725913020448" +
    "&inquiry_type=A"+
    "&from_date=20160101"+
    "&to_date=20160101"+
    "&sort_order=A"+
    "&page_index=00001"+
    "&tran_dtime=20190307101010"

    var option = {
        method : "GET",
        url : requestURL+qs,
        headers : {
            "Authorization" : "Bearer " + accessToken
        }
    }
    request(option, function(err, response, body){
        var data = JSON.parse(body);
        res.json(data);
    })
})

app.post('/login',function(req,res){
    var id = req.body.userId;
    var password = req.body.userPassword;
    
   
        connection.query("SELECT * FROM project.user WHERE userid=?",[id],function(err,result){
            if(err){
                throw err;
            }else{
                
                var userData = result;
                
                if(userData[0].userpassword == password){
                    res.json(userData[0].accessToken);
                }
            }
        });
    

})

app.listen(3000);

app.get('/test',function(req,res){
   console.log('test');
})
