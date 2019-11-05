
var express = require('express');
var app = express();
var mysql = require('mysql');
var request = require('request');
var crypto = require('crypto');
app.use(express.urlencoded());
app.use(express.json());
var connection = mysql.createConnection({
 
  host     : 'localhost',
  user     : 'root',
  password : 'love1998!!',
  database : 'qpay'
});
app.listen(8000);

app.get('/login',function(req,res){ 
   var userID = req.query.userID;
   var userPassword = req.query.userPassword;
   var result_length = '';
   var str = '';
   console.log("로그인 요청이 들어옴"); 
   console.log("ID : "+userID);
   console.log("PASSWORD : "+userPassword);   
   connection.query('SELECT * FROM user WHERE u_id = ? and u_password = ? '
  ,[userID,userPassword],function(err,result){
    result_length = result.length;
    
    if(result_length=='0'){
      console.log("로그인 실패");
      console.log("----------------------------------------------------------------------");
      str ="로그인실패 0";
      res.send(str);
    }else{
      
      var tokenNum= '';
      var rtnum = '';
      var password = crypto.createHash('sha512').update('kisa03').digest('hex');
      
    request({ uri: "http://54.180.42.30:8888/api/auth/"+userID,method : "POST",form: { 'pw' : password }},function (error, response,body) {
     var data = JSON.parse(body);
    rtnum = data.rtoken
    
      request({ uri: "http://54.180.42.30:8888/api/token/kisa03?rt="+rtnum,method : "GET"},function (error, response,body) {
    
        var data2 = JSON.parse(body);
        tokenNum = data2.token;
        str = "로그인완료 "+tokenNum;
        console.log("로그인 완료");
        console.log("Token : "+tokenNum);
        console.log("----------------------------------------------------------------------");
        res.send(str);
        });
       
      });
    }
  });
   
 
   
 

   
});


app.get('/register',function(req,res){

  var userID = req.query.userID;
  var userPassword = req.query.userPassword;
  console.log("회원가입요청 들어옴"); 
  console.log("ID : "+userID);
  console.log("PASSWORD : "+userPassword);
  connection.query('INSERT into user (u_id,u_password) VALUES (?,?)'
  ,[userID,userPassword],function(err,result){
    var register_result = result.affectedRows;
    if(register_result == '1'){
        console.log("회원가입 완료");
        console.log("----------------------------------------------------------------------");
        res.send('회원가입완료');
    }else{
      console.log("회원가입 실패");
      console.log("----------------------------------------------------------------------");
      res.send('회원가입실패');
     
    }
});

    
 

 
  
});


app.get('/cost',function(req,res){
  var tokenNum= '';
  var rtnum = '';
  var password = crypto.createHash('sha512').update('kisa03').digest('hex');
  var CostAmount = req.query.CostAmount;
  console.log("결제요청 들어옴");
  
request({ uri: "http://54.180.42.30:8888/api/auth/kisa03",method : "POST",form: {'pw' : password }},function (error, response,body) {
 var data = JSON.parse(body);
rtnum = data.rtoken;
  
  request({ uri: "http://54.180.42.30:8888/api/token/kisa03?rt="+rtnum,method : "GET"},function (error, response,body) {

    var data2 = JSON.parse(body);
    tokenNum = data2.token;
  
    request({ uri: "http://54.180.42.30:8888/api/payment/receipt/card/kisa03",method : "POST",form: { 
    'token' : tokenNum,
    'cardno': '0000111122223333',
    'amount': CostAmount,
    'exprY': '19',
    'exprM': '05',
    'quota': '12',
    'bno': '930220',
    'card2pw': '08'
    
  }},function (error, response,body) {
   var data = JSON.parse(body);
   console.log("결제번호 : "+data.tno);
   console.log("결제금액 : "+data.amount);
   console.log("결제시간 : "
   +data.app_time[0]
   +data.app_time[1]
   +data.app_time[2]
   +data.app_time[3]+"년"
   +data.app_time[4]
   +data.app_time[5]+"월"
   +data.app_time[6]
   +data.app_time[7]+"일"
   +data.app_time[8]
   +data.app_time[9]+"시"
   +data.app_time[10]
   +data.app_time[11]+"분"
   +data.app_time[12]
   +data.app_time[13]+"초"
   );
   console.log("결제완료");
   console.log("----------------------------------------------------------------------");
   res.send("결제완료");
   
    });



    });
   
  });
 
});



app.get('/cancel',function(req,res){
  console.log("결제취소요청 들어옴");
  console.log("----------------------------------------------------------------------");
  var tno = req.query.tno;
  var tokenNum= '';
  var rtnum = '';
  var password = crypto.createHash('sha512').update('kisa03').digest('hex');
  
request({ uri: "http://54.180.42.30:8888/api/auth/kisa03",method : "POST",form: { 'pw' : password }},function (error, response,body) {
 var data = JSON.parse(body);
rtnum = data.rtoken


  request({ uri: "http://54.180.42.30:8888/api/token/kisa03?rt="+rtnum,method : "GET"},function (error, response,body) {

    var data2 = JSON.parse(body);
     tokenNum = data2.token;

     request({ uri: "http://54.180.42.30:8888/api/payment/receipt/card/kisa03/"+tno+"?token="+tokenNum,method : "PUT"},function (error, response,body) {
      
      var res_cancel = JSON.parse(body);
      var cancel_str = '';
      if(res_cancel.errCode == '0'){
      cancel_str += '<html><body>';
      cancel_str += '결제번호 : '+res_cancel.tno +'</br>';
      cancel_str += '취소시간 : '+res_cancel.canc_dt +'</br>';
      cancel_str += 'id : '+res_cancel.id +'</br>';
      cancel_str += '</body></html>';
      res.send(cancel_str);
      }else{
        res.send('이미 취소된 건입니다.');
      }
      

     
     
      });

    });
   
  });


});

app.get('/find',function(req,res){
  console.log("결제조회요청 들어옴");
  console.log("----------------------------------------------------------------------");
  var tokenNum= '';
  var rtnum = '';
  var password = crypto.createHash('sha512').update('kisa03').digest('hex');
  var tno = "25151425486714";  

request({ uri: "http://54.180.42.30:8888/api/auth/kisa03",method : "POST",form: { 'pw' : password }},function (error, response,body) {
 var data = JSON.parse(body);
rtnum = data.rtoken

  request({ uri: "http://54.180.42.30:8888/api/token/kisa03?rt="+rtnum,method : "GET"},function (error, response,body) {

    var data2 = JSON.parse(body);
    tokenNum = data2.token;

    request({ uri: "http://54.180.42.30:8888/api/payment/receipt/card/kisa03"+"?token="+tokenNum,method : "GET"},function (error, response,body) {
      var data3 = JSON.parse(body);
      var arr = data3.list;
      var receipt = "";
      receipt += "<html><body>";
      for(var i=0;i<arr.length;i++){
        receipt += (i+1)+"번째 결제요청<br/>";
        receipt += "결제번호 : "+arr[i].tno+"<br/>";
        receipt += "카드번호 : "+arr[i].card_no+"<br/>";
        receipt += "결제금액 : "+arr[i].amount+"<br/>";
        receipt += "---------------------------------------------<br/>";
      }
      receipt += "</body></html>";
      res.send(receipt);
      
 
    });

    });
   
  });
  
  

  


  

});

app.get('/one',function(req,res){
  console.log("결제조회요청 들어옴");
 
  var tokenNum= '';
  var rtnum = '';
  var password = crypto.createHash('sha512').update('kisa03').digest('hex');
  var tno = req.query.tno;  
  console.log("카드번호 : "+tno);
  console.log("----------------------------------------------------------------------");
request({ uri: "http://54.180.42.30:8888/api/auth/kisa03",method : "POST",form: { 'pw' : password }},function (error, response,body) {
 var data = JSON.parse(body);
rtnum = data.rtoken

  request({ uri: "http://54.180.42.30:8888/api/token/kisa03?rt="+rtnum,method : "GET"},function (error, response,body) {

    var data2 = JSON.parse(body);
    tokenNum = data2.token;

    request({ uri: "http://54.180.42.30:8888/api/payment/receipt/card/kisa03/"+tno+"?token="+tokenNum,method : "GET"},function (error, response,body) {
      var data3 = JSON.parse(body);
      var receiptone = "";
      receiptone += "<html><body>";
     
      receiptone += "결제요청<br/>";
      receiptone += "결제번호 : "+tno+"<br/>";
      receiptone += "카드번호 : "+data3.card_no+"<br/>";
      receiptone += "결제금액 : "+data3.amount+"<br/>";
      receiptone += "---------------------------------------------<br/>";
      receiptone += "</body></html>";

      res.send(receiptone);
  
      
 
    });

    });
   
  });
  
  

  


  

});


