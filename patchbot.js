const discord = require('discord.js');
const client = new discord.Client();
const config = require('./config')
const twit = require('twit')
const T = new twit(config)

// File containing token
const auth = require('./token.json');

client.on("ready", () => {
    console.log("Bot is now connected");
});

var params = {
    screen_name: 'Activision',
}

function gotData(err, data) {
    let tweets = data.status.entities.urls[0].url;
    let tweet_link = JSON.stringify(tweets);
    tweet_link = tweet_link.slice(1, -1);
    client.channels.get('735878413880918026').send(tweet_link);
    console.log(tweet_link);

    if (err) throw err;
}

client.on("message", msg => {
    if (msg.content.includes('patch')) {
        T.get('users/show', params, gotData);
    }
});

// fs.writeFile('Output2.json', data, (err) => {

    // In case of a error throw err. 
//         if (err) throw err;
//     })

client.login(auth.token);