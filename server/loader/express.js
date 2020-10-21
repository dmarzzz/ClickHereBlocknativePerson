const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const api = require('../api')

function expressLoader({ app }) {

    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(api());
    app.get('/status', (req, res) => {
        res.status(200).end();
    });

}


module.exports = expressLoader;