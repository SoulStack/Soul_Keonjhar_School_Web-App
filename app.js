let express = require("express");
let app = express();
// let bodyParser = require("body-parser");
// const encoder = bodyParser.urlencoded();
let dotenv = require("dotenv");
// const bcrypt=require('bcrypt');
dotenv.config();
const Chart = require('chart.js');

//const path=require('path');
let port = process.env.PORT || 9100;
let mysql = require("mysql2");
var md5=require('md5')
// app.use(bodyParser.json());


//middleware
app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
//app.set('views',path.join(__dirname,'views'));



//all database connection information
const connection = mysql.createConnection({
  host: "souliot.mariadb.database.azure.com",
  user: "okcliot@souliot",
  password: "Siva@123",
  database: "okcldb",
});


//database connection check
connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

//index page login
app.get("/", function (req, res) {
  res.render("index", { error: "",v:"",device_id:"",device_type:"",device_mq2:"",
  device_temp:"",device_hum:"",
  device_heartbeat_status:"",data:""});
});

app.get('/registration',function(req,res){
 res.render('index',{error:""});
})

// registration page
app.post("/registration",  function (req, res) {
  var username = req.body.name;
  var user_password = req.body.password;
  var password=md5(user_password)
  console.log(username)
  // var sql = "SELECT username FROM user_data WHERE username = " + username.toString();
  connection.query('select school_id from keonjhar_school',(err,p)=>
  {
    if (err) throw err;
    //here I have assigned the school_id data to the global variable that I have defined in the app.get in order to overcome the ejs error
    v=p
  
      connection.query("select username,privileges_user,school_id from user_data where username=?",[username],(err,x)=>{
        console.log(v)
        connection.query('select user_password from user_data where user_password=?',[md5(user_password)],(err,y)=>{
       
console.log(x)
                if(x.length>0 && x[0].username===username){
                    // console.log(results)
                    console.log(x)
                    console.log(y)
                    if(y.length==0){
                      console.log(y)
                      res.render("index", { error: "Invalid Password" })
                    }
                    else if(x[0].username===username && y[0].user_password==password && x[0].privileges_user=="admin"){
                      console.log(p)
                      res.render("user",{v});
                    }else if(x[0].username===username && y[0].user_password==password && x[0].privileges_user=="user"){
                      if(x[0].school_id==1){
                      res.redirect("/school1");
                    }
                    else if(x[0].school_id==2){
                      res.redirect('/school2')
                    }
                    }
                    else if(y.length==0){
                      console.log(y)
                      res.render("index", { error: "Invalid Password" })
                    }                    
                  }                   
                    else if(x.length==0){
                      console.log(y.user_password)
                      return res.render("index", { error: "Invalid Username" });}
                    
                    })    
            })
          })   
  });



//registration page1
app.post("/d" , (req , res)=> {
  const {name , password ,scid,eid, pu, mobile} = req.body
  console.log(req.body.name)
  console.log(req.body.password)
  console.log(req.body);
  console.log({name , password ,scid,eid, pu, mobile})
  // connection.query("select school_id from okcl_school where school_id=?",[scid],(error,results)=>{
  //   if (error) throw error;
  //     console.log(results.length)})

  // const saltRounds = 10;
  const alertMessage = "Username already exist"
  // const notification="school_id not exist"
                
                  // let scidExist=false;
                  // Boolean(scidExist)
                  // var message;
                  // let nam=false 
                  // Boolean(nam)
                  // console.log(scid)
                  // var sql = "SELECT school_id FROM okcl_school WHERE school_id = " + scid.toString();
                  
                 
                  // connection.query(sql,(error,w)=>{
                    // if (error) throw error;
                    // console.log(w)
                    //   console.log(w.length)
                      // if(w==null){
                      //     message='does not exist';
                      //     console.log(message)
                         
                      //     // console.log(error)
                        
                      //     return
                      // }
                      // if(w.length>0){
                      //     scidExist=true
                      //     console.log(scidExist,"if ra")
                          // if(scidExist){
                              connection.query('select username from user_data where username=?',[name],(err,x)=>{
                            if(x.length>0 && x[0].username===name){
                                // console.log(results)
                                
                                       
                                        message="username exists"
                                console.log(message)
                                return res.render('user',{alertMessage});
                           
                                    
                                }
                                else{
                                 
                                      connection.query('INSERT INTO user_data SET ?',{username:name,user_password:md5(password), user_contact:mobile, privileges_user:pu,school_id:scid,emp_id:eid},(error,y)=>{
                                                               if(error){
                                                                 console.log(error);
                                                               }
                                                                else{
                                                                
                                                                // res.sendStatus(200)
                             res.render('ok')  ;                                 
                                                             }
                                                             }) 
                                  }
                                })
                      // }
                  // } 
                      // else if(w.length==0){
                      //     message=' scid does not exist';
                      //     console.log(message)   
                      //     console.log(error)
                      //     return res.render('user',{notification})
                      // }    
              // })       
                              })

//registration page2
app.post('/d2',(req,res)=>{
const{sid,dt,idate,pdate,ds,rds}=req.body;
  connection.query('INSERT INTO okcldb.keonjhar_school_device SET ?',{school_id:sid, device_type:dt,device_status:ds,device_reset_status:rds, installation_date:idate, software_path_date:pdate},(error,y)=>{
    if(error){
      console.log(error);
    }
     else{
      // res.sendStatus(200)
      res.render('ok')  ;
    
  }
  }) 
})

//registration page3
app.post('/d3',(req,res)=>{
  const{sclName,sclAddress,sclType,sclNumber,Inf,gps}=req.body;
  console.log({sclName,sclAddress,sclType,sclNumber,Inf,gps})
    connection.query('INSERT INTO okcldb.keonjhar_school SET ?',{school_Name:sclName, school_address:sclAddress, school_type:sclType, school_contact:sclNumber,internet_facility:Inf,gps_cooridinate:gps},(error,y)=>{
      if(error){
        console.log(error);
      }
       else{
     
      //  res.sendStatus(200)
       res.render('ok')  ;
    }
    }) 
  })


//dashboard school_id1
  app.get('/school1',(req,res)=>{
    let device_id= req.body.device_id;
    let device_type= req.body.device_type;
    let devicemq2= req.body.device_mq2;
    let device_temp= req.body.device_temp;
    let device_hum= req.body.device_hum;
    let status= req.body.device_heartbeat_status;
    // let door_reset=req.body.device_status;
    // let device_smoke_data=req.body.device_smoke_data;
    // let device_temperature=req.body.device_temperature;
    // let device_humidity=req.body.device_humidity;
    // console.log(door_reset);
       connection.query("select * from keonjhar_school_device where school_id=1",
       function(err,result,fields){
        res.render('dashboard',{device_id:device_id,device_type:device_type,
          device_mq2:devicemq2,
          device_temp:device_temp,device_hum:device_hum,
          device_heartbeat_status:status,data:result});
        
      //  connection.query("select * from okcldb.sensor_data_keonjhar where school_id=1",function(err,result,fields){
      //   res.render('dashboard',{device_temperature:device_temperature,device_humidity:device_humidity,device_smoke_data:device_smoke_data,data:result})
      //  })   
        
      //  connection.query("update keonjhar_school_device set device_status='1' where device_type='door'",function(err,result,fields){
      //    res.render('dashboard',{door_reset:door_reset,data:result})
         // console.log(door_reset, device_id);
        })  
       })
   // con.query('update keonjhar_school_device SET device_status = Case When device_status = 1 Then 0 When device_status = 0 Then 1 End WHERE device_type="door"',function(err,result,fields){
   //   res.render('index');
   // })
  //  })
   
  
//sensor1 school_id=1
   app.get('/sensor1',(req,res)=>{
   let device_id= req.body.device_id;
    let device_type= req.body.device_type;
    let devicemq2= req.body.device_mq2;
    let device_temp= req.body.device_temp;
    let device_hum= req.body.device_hum;
    let status= req.body.device_heartbeat_status;
    let device_ip=req.body.device_ip;
    let device_mac=req.body.device_mac;
    
       connection.query("select * from keonjhar_school_device where school_id=1",
       function(err,result,fields){
        res.render('sensor1',{device_id:device_id,device_type:device_type,device_mq2:devicemq2,
         device_temp:device_temp,device_hum:device_hum,
         device_heartbeat_status:status,device_ip:device_ip,device_mac:device_mac,data:result});
        })
     
   })


//sensor2 school_id=1   
   app.get('/sensor2',(req,res)=>{
     let device_id= req.body.device_id;
      let device_type= req.body.device_type;
      let devicemq2= req.body.device_mq2;
      let device_temp= req.body.device_temp;
      let device_hum= req.body.device_hum;
      let status= req.body.device_heartbeat_status;
      let device_ip=req.body.device_ip;
      
         connection.query("select * from keonjhar_school_device where school_id=1",
         function(err,result,fields){
          res.render('sensor2',{device_id:device_id,device_type:device_type,device_mq2:devicemq2,
           device_temp:device_temp,device_hum:device_hum,
           device_heartbeat_status:status,device_ip:device_ip,data:result});
          })
       
     })

 //sensor3 school_id=1  
     app.get('/sensor3',(req,res)=>{
       let device_id= req.body.device_id;
        let device_type= req.body.device_type;
        let devicemq2= req.body.device_mq2;
        let device_temp= req.body.device_temp;
        let device_hum= req.body.device_hum;
        let status= req.body.device_heartbeat_status;
        let device_ip=req.body.device_ip;
        
           connection.query("select * from keonjhar_school_device where school_id=1",
           function(err,result,fields){
            res.render('sensor3',{device_id:device_id,device_type:device_type,device_mq2:devicemq2,
             device_temp:device_temp,device_hum:device_hum,
             device_heartbeat_status:status,device_ip:device_ip,data:result});
            })
         
       })
   
//sensor4 school_id=1   
       app.get('/sensor4',(req,res)=>{
         let device_id= req.body.device_id;
          let device_type= req.body.device_type;
          let devicemq2= req.body.device_mq2;
          let device_temp= req.body.device_temp;
          let device_hum= req.body.device_hum;
          let status= req.body.device_heartbeat_status;
          let device_ip=req.body.device_ip;
          
             connection.query("select * from keonjhar_school_device where school_id=1",
             function(err,result,fields){
              res.render('sensor4',{device_id:device_id,device_type:device_type,device_mq2:devicemq2,
               device_temp:device_temp,device_hum:device_hum,
               device_heartbeat_status:status,device_ip:device_ip,data:result});
              })
           
         })
   
 //sensor5 school_id=1  
         app.get('/sensor5',(req,res)=>{
           let device_id= req.body.device_id;
            let device_type= req.body.device_type;
            let devicemq2= req.body.device_mq2;
            let device_temp= req.body.device_temp;
            let device_hum= req.body.device_hum;
            let status= req.body.device_heartbeat_status;
            let device_ip=req.body.device_ip;
            
               connection.query("select * from keonjhar_school_device where school_id=1",
               function(err,result,fields){
                res.render('sensor5',{device_id:device_id,device_type:device_type,device_mq2:devicemq2,
                 device_temp:device_temp,device_hum:device_hum,
                 device_heartbeat_status:status,device_ip:device_ip,data:result});
                })
             
           })
   
//sensor6 school_id=1   
           app.get('/sensor6',(req,res)=>{
             let device_id= req.body.device_id;
              let device_type= req.body.device_type;
              let devicemq2= req.body.device_mq2;
              let device_temp= req.body.device_temp;
              let device_hum= req.body.device_hum;
              let status= req.body.device_heartbeat_status;
              let device_ip=req.body.device_ip;
              
                 connection.query("select * from keonjhar_school_device where school_id=1",
                 function(err,result,fields){
                  res.render('sensor6',{device_id:device_id,device_type:device_type,device_mq2:devicemq2,
                   device_temp:device_temp,device_hum:device_hum,
                   device_heartbeat_status:status,device_ip:device_ip,data:result});
                  })
               
             })
  
             
//dashboard  school_id=2(if all 6 sensor given then work)           
   app.get('/school2',(req,res)=>{
    let device_id= req.body.device_id;
    let device_type= req.body.device_type;
    let devicemq2= req.body.device_mq2;
    let device_temp= req.body.device_temp;
    let device_hum= req.body.device_hum;
    let status= req.body.device_heartbeat_status;
       connection.query("select * from keonjhar_school_device where school_id=2",
       function(err,result,fields){
        res.render('dashboard',{device_id:device_id,device_type:device_type,device_mq2:devicemq2,
         device_temp:device_temp,device_hum:device_hum,
         device_heartbeat_status:status,data:result});
       
       })
   })

// app.get('/chart1',function(req,res){
//   res.render()
// })   

//dashbaord contact page   
 app.get('/contact',(req,res)=>{
  res.render('contact');
 })




//port connection
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`server listening on ${port}`);
});