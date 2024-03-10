
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const collaborationRoute = require('./collaboration');
const resourceRoute = require('./resource');

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

app.use((req, res, next) => {
    req.db = db;
    next();
});

app.use('/collaborations', collaborationRoute);
app.use('/resources', resourceRoute);


app.listen(5000, () => {
    console.log(`Server running at http://localhost:5000`);
});