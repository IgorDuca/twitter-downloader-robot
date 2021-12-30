const axios = require("axios");
const Twit = require("twit");

const client = Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000
});

async function response(links, thumbnail, tweet) {
    var parsed_links = links.map(link => {
        return { name: link.format, url: link.url }
    });

    console.log(parsed_links);
    console.log(thumbnail);

    await axios.get(`https://baixesaporra.netlify.app/api/galleries/findcreate/${tweet.user.screen_name}`);
    const video_create_req = (await axios.post(`https://baixesaporra.netlify.app/api/galleries/videos/create/${tweet.user.screen_name}`, {
        formats: parsed_links,
        thumb: thumbnail
    })).data;

    console.log(video_create_req);

    var finalLink = `https://baixesaporra.netlify.app/galleries/${tweet.user.screen_name}`

    var res = {
        status: `Baixado, @${tweet.user.screen_name}! Pode entrar na sua galeria no meu site e baixar o vídeo mais recente. \n${finalLink}`,
        in_reply_to_status_id: '' + tweet.id_str
    };

    client.post('statuses/update', res,
        function(err, data, response) {
            console.log(data);
        }
    );
}

module.exports = response