const expressLoader = require('./express');

async function loader({expressApp}){
    await expressLoader({ app: expressApp });

    console.log('Express loaded');
}
module.exports = loader;