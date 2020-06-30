const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
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
    const appointmentDetails = req.body;
    appointmentDetails.appointmentTime = new Date();
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointment");
        collection.insertOne(appointmentDetails,(err, result)=>{
            if(err){
                res.status(500).send({message:err});
            }
            else{
                res.send(result.ops[0]);
            }
        })
        client.close();
    });
});

app.post('/modifyAppointmentByKey', (req, res) => {
    const key = req.body.key;
    const action = req.body.action;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("doctorsPortal").collection("appointment");
        collection.updateOne({"key": key}, {"$set": {"action": action}}, (err, result)=>{
            if(err){
                res.status(500).send({message:err});
            }
            else{
                res.send(result);
            }
        })
        client.close();
    });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Listening 4000'));