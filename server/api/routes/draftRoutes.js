var redis = require('redis');
require('redis-streams')(redis);
const axios = require('axios');


// Poll geth Endpoint and then add to Redis queue
// there isn




module.exports = async function (server) {

    var redisClient = redis.createClient();
    
    redisClient.on("error", function(error) {
        console.error(error);
      });

    redisClient.set("key", "value", redis.print);
    redisClient.get("key", redis.print);
    redisClient.xadd("mystream","*", "value" , "1234" ,redis.print )
    redisClient.xrange("mystream", '-','+', redis.print )

  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //poll geth endpoint 
    //webhook is more efficient but ran out of time on my prototyping timelimit
    const pollAPI = async ({ apiCall, validate, interval, maxAttempts }) => {
        let attempts = 0;
        const executePoll = async (resolve, reject) => {
        const result = await apiCall();
        attempts++;
    
        if (validate(result)) {
            return resolve(result);
        } else if (attempts === maxAttempts) {
            return reject(new Error('Exceeded max attempts'));
        } else {
            setTimeout(executePoll, interval, resolve, reject);
        }
        };
        return new Promise(executePoll);
    };
    
    //Here is where I would extract pending(and or queued) transactions and do something with them
    const doSomethingWithTransactions = (data) => {return "test"};

    const gethAPI = async () => {
        try {
            //local geth endpoint
            let data = await axios.get(
                "https://localhost:8545/",
                    {"jsonrpc":"2.0",
                    "method":"txpool_content",
                    "params":[],
                    "id":67});
                pendingTxTemp = doSomethingWithTransactions(data)
            redisClient.xadd("mystream","*", "results" , pendingTxTemp ,redis.print )
            return data;
        } catch (error) {
            console.log(error)
        }
    };
    const validate = (result) => {return true};
    const POLL_INTERVAL = 1000;
    const pollGeth = pollAPI({
        apiCall: gethAPI,
        validate: validate,
        interval: POLL_INTERVAL,
        maxAttempts: 100,
    })
        .then(result => console.log(result))
        .catch(err => console.error(err));


        //curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"txpool_content","params":[],"id":67}' http://localhost:8545
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    server.post('/api/v0/testpost', function (req, res) {
        const { info } = req.query

        try {
            console.log(info)
            res.status(200).send()
        } catch (error) {
            console.log(error)
            res.status(500).send()
        }
    });


    server.get('/api/v0/testget', async function (req, res, next) {
        try {
            console.log('hello')
            res.status(200).send()
        } catch (error) {
            console.log(error)
            res.status(500).send()
        }
    })

}