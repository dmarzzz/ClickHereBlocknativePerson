const express = require('express');
const config = require('./config');

const port = process.env.PORT || 7373;

async function startServer() {
    const app = express();
    //segmenting module loading for unit testing purposes
    await require('./loader')({ expressApp: app });

    app.listen(config.port, err => {
        if (err){
            console.log(err);
            process.exit(1);
            return;
        }
        console.log(`
        #####################################
               Li$tening on port ${port}
        #####################################
        `);
    });

}
startServer();