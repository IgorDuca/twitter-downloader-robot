require('dotenv').config();
const Twit = require("twit");

const client = Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000
});

const downloader = require("../components/downloader");

function manager(tweet) {
    client.get('followers/ids', { screen_name: process.env.USERNAME },  function (err, data, response) {
        if(err) console.log(err);

        var ids = data.ids;

        if(ids.includes(tweet.user.id) == true) {
            if(tweet.in_reply_to_status_id_str == null) return downloadSelector(false, tweet);
            else return downloadSelector(true, tweet);
        } else {
            var res = {
                status: `Oi, @${tweet.user.screen_name}, você precisa me seguir pra baixar seu vídeo, então me siga, apague esse tweet e me marque na publicação novamente 😁`,
                in_reply_to_status_id: '' + tweet.id_str
            };
        
            client.post('statuses/update', res,
                function(err, data, response) {
                    console.log(data);
                }
            );
        }
    });
};

async function downloadSelector(twitter, tweet) {
    var video_thumb = tweet.user.profile_image_url;
    if(twitter == false) {
        var link = tweet.text.split(`@${tokens.USERNAME}`)[1];
        await downloader(link, video_thumb, tweet);
    } else {
        var link = `https://twitter.com/${tweet.in_reply_to_screen_name}/status/${tweet.in_reply_to_status_id_str}`;
        await downloader(link, video_thumb, tweet);
    }
}

module.exports = manager