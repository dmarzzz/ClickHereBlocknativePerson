var express     = require('express');
var draftRoutes = require('./routes/draftRoutes');

function api(){
    const app = express.Router();
    draftRoutes(app);
    return app;
}


module.exports = api;