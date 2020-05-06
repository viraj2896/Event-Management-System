const express = require('express');
const app = express();
const config = require('config');
var cors = require('cors');
const connectDB = require('./config/connectDB');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3000;

const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': config.get('paypal_clientId'),
    'client_secret': config.get('paypal_secret')
});

// connect to db
connectDB();

app.use(express.static(path.join(__dirname, 'client/build')));

app.use(cors());
app.use(express.json());

require('./api/routes')(app);

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, (err) => {
    if (err) {
        console.log('ERROR while starting server: ', err);
    }
    console.log('Server is running on port ' + port);
});

module.exports = app;
