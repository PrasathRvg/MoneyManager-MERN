var express = require('express')
var app = express()
var path = require('path')

var cors = require("cors");
app.use(cors());

app.use(express.urlencoded({ extended: true }))
app.use(express.json()); 

var session=require("express-session")
app.use(session({secret: "Shh, its a secret!"}))


const {MongoClient,ObjectId} = require('mongodb');

var url = "mongodb://localhost:27017/mydb";

//register
app.post("/registeruser",function(req,res){
    console.log("req fields",req.body)
    if(req.body.password!==req.body.confirmpassword){
        res.send("password not match")
    }
    else if(req.body.password.length<=6){
        res.send({message :"Password should be more than 6"})
    }
    else{
        MongoClient.connect(url,function(err,conn){
            var db = conn.db("moneymanager");
            db.collection("Register").find({mail:req.body.mail})
            .toArray(function(err,data){
                if(data.length===0){
                    db.collection('Register').insertOne(req.body,function(err,data){
                        if(err){
                            console.log(err)
                        }
                        else{
                        res.send(data)
                        }   
                    })                    
                }
                else{
                    res.send({message: "Already Registered User"});                    
                }
            })
        })
    }
})

//login
app.post("/loginuser",function(req,res){
    MongoClient.connect(url,function(err,conn){
        var db=conn.db("moneymanager");
        db.collection("Register").find({mail:req.body.mail})
        .toArray(function(err,data){
            if(data.length===0){
                res.send({message:"User Doesn't Exist"})
            }
            else{
                if(data[0].password===req.body.password){
                    console.log(data[0]);
                        req.session.mail = req.body.mail;
                        req.session.password = req.body.password;
                        req.session.uid = data[0]._id;
                        res.status(200).send({ message:"login success",
                        _id:data[0]._id,
                        mail:data[0].mail,
                        password:data[0].password,});  
                }
                else{
                    res.send({message :"wrong Password"})
                }
            }
        })
    })
})

app.get("/view",function(req,res){
    MongoClient.connect(url,function(err,conn){
        var db=conn.db("moneymanager");
        db.collection("Register").find().toArray(function(err,data){
            res.send(data);
        })
    })
})
app.listen(8090,function(){console.log("started 8090")})