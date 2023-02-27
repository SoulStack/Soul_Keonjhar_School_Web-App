let express = require('express');
let app=express();
let bodyParser=require('body-parser');
const encoder=bodyParser.urlencoded();
let dotenv=require('dotenv');
dotenv.config();
const path=require('path');
let port=process.env.PORT||9100;
let mysql=require('mysql2');

app.use(bodyParser.json());

app.use(express.static(__dirname+'/public'))

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

const con = mysql.createConnection({
  host: 'souliot.mariadb.database.azure.com',
  user: 'okcliot@souliot',
  password: 'Siva@123',
  database: 'okcldb'

});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/', function(req, res) {
  res.render('index');
});

app.post("/welcome",encoder,function(req,res){
    var username=req.body.username;
    var user_password=req.body.user_password;

con.query("select * from user_data where username=? and user_password=?",[username,user_password],function(err,results,fields){
        if(results.length>0){
         res.render('welcome',{title:'hii user'});

        }
        else{
             res.redirect("/");  
        }
        res.end();
    
    })
})

app.listen(port, (err) =>{
    if (err) throw err
    console.log(`server listening on ${port}`);
})