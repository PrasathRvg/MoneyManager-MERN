var express = require("express");
var cors =require("cors");
var a = express();

a.use(cors());

const { MongoClient,ObjectId } = require('mongodb');
var url ="mongodb://localhost:27017";


a.use(express.urlencoded({extended: true}))
a.use(express.json());

a.get("/",function(req,res){
    MongoClient.connect(url,function(err,con){
        var db =con.db("moneymanager");
        db.collection("Rbudget").find()
        .toArray(function(err,data){
            res.send(data);
            })
        })
    })

    a.get("/getform",function(req,res){
        MongoClient.connect(url,function(err,con){
            var db =con.db("moneymanager");
            db.collection("Rbudget").find().sort({_id:-1})
            .toArray(function(err,data){
                res.send(data);
                })
            })
        })
        a.get("/getincome",function(req,res){
            var category=req.body.categorytype;
            MongoClient.connect(url,function(err,con){
                var db =con.db("moneymanager");
                db.collection("bTransaction").find({categorytype:"income"},{amount:true}).toArray(function(err,data){
                    res.send(data);
                    //console.log("hello world")
                    })
                })
            })
     

a.post("/add",function(req,res){    
    MongoClient.connect(url,function(err,con){
        var db =con.db("moneymanager");
        db.collection("Rbudget").insertOne(req.body,function(err,data){
            res.send(data);
            
        })
        
        })
    })
    a.delete("/remove/:_id",function(req,res){
        MongoClient.connect(url,function(err,con){
            var db =con.db("moneymanager");
            db.collection("Rbudget").deleteOne({_id:ObjectId(req.params._id)},function(err,data){
                res.send(data);
                
            })
            
        })
    })
    a.put("/update_budget",function(req,res){
        MongoClient.connect(url,function(err,con){
            console.log(req.body)
            var db =con.db("moneymanager");
            db.collection("Rbudget").updateOne(
                {_id:ObjectId(req.body._id)},
                {
                    $set:{
                       
                            amount:req.body.amount,
                            budget_plan:req.body.budget_plan,
                            modified_date:req.body.modified_date
                        
                    }
                },
            function(err,data){
                console.log(data)
                res.redirect('/')
            }
        )
            
        })
    })

    a.get('/par_view/:id',(req,res)=>{

        MongoClient.connect(url,(err,conn)=>{
    
            var dbo=conn.db('moneymanager')
    
            dbo.collection('Rbudget').findOne({_id:ObjectId(req.params.id)},(err,data)=>{
    
                res.send(data)
    
            })
    
        })
    
    })

   
    a.listen(9090,function(){
        console.log("listening in 9090")
    })