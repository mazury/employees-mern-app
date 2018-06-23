const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const data = require('./data').offices;
const routes = require('./routes/routes');
const app = express();
const MongoClient = require('mongodb').MongoClient;

if (process.env.NODE_ENV === 'production') {
    connectToDbAndInsertData().catch(e => {
        console.error('Error while initialising application:\n', e);
    });
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: 'false' }));
app.use(express.static(path.join(__dirname, 'build')));

app.use('/api', routes);

// TODO: better error handling - views in UI

app.use((err, req, res, next) => {
    res.status(err.code || 500);
    res.send(err.message);
    res.render('error', {
        message: err.message,
    });
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

async function connectToDbAndInsertData () {
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017');
        console.log('application connected to db');
        const db = client.db('locations-app');
        await db.collection('locations').insertMany(data);
        console.log('inserted initial data');
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = app;
