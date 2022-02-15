require('dotenv').config();
const Twit = require("twit");

const manager = require("./components/manager")

const client = Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000
});

console.log(`Waiting tweets as ${process.env.USERNAME}`)

// Importing functions
const downloader = require("./components/downloader");

var stream = client.stream('statuses/filter', { track: [`@${process.env.USERNAME}`] });
stream.on('tweet', newTweet);

async function newTweet(tweet) {
    if(tweet.in_reply_to_status_id_str != null && tweet.in_reply_to_user_id_str == process.env.BOTID) return console.log("Ignoring tweet from a bot..."); // Ignora todos os tweets provenientes de um bot
    
    manager(tweet)
}
