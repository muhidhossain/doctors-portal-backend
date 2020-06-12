const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express();

app.use(cors());
app.use(bodyParser.json());
const uri = process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true });

app.get('/appointment', (req, res) =>{
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointment");
        collection.find().toArray((err, documents)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(documents);
            }
        })
        client.close();
      });
});

app.post('/addAppointment', (req, res) => {
    const orderDetails = req.body;
    orderDetails.orderTime = new Date();
    console.log(orderDetails);
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointment");
        collection.insertOne(orderDetails,(err, result)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(result.ops[0]);
            }
        })
        client.close();
    });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Listening 4000'));