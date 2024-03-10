const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const userRoute = require('./routes/userRoute');
const projectRoute = require('./routes/projectRoute');
const app = express();

const uri = "mongodb://localhost:27017/?appName=mongodb-vscode&directConnection=true&serverSelectionTimeoutMS=2000";
const dbName = "craft";

app.use(bodyParser.json());

const client = new MongoClient(uri);
let db;
client.connect()
    .then(() => {
        db = client.db(dbName);
        console.log("Connected successfully to Database");
    })
    .catch(err => console.error("Failed to connect to Database", err));

// Middleware to attach db to request object
app.use((req, res, next) => {
    req.db = db;
    next();
});


app.use('/user', userRoute);
app.use('/project',projectRoute);
app.listen(5000, () => {
    console.log(`Server running at http://localhost:5000`);
});


