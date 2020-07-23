const discord = require('discord.js');
const client = new discord.Client();
const config = require('./config')
const twit = require('twit')
const T = new twit(config)

// File containing token
const auth = require('./token.json');

// testing purposes
client.on("ready", () => {
    console.log("Bot is now connected");
});

// specifies twitter account
var params = {
    screen_name: 'Activision',
}

// 
function gotData(err, data) {
    // variable to check if the tweet is a retweet or original tweet
    let retweet_status = data.status.retweeted_status;
    
    // if is an original tweet 
    if (retweet_status == null) {
        link = data.status.entities.urls[0].url;
        client.channels.get('735878413880918026').send(link);
    // else if it is a retweet
    } else {
        link = data.status.retweeted_status.entities.urls[0].url;
        client.channels.get('735878413880918026').send(link);
    }
}

// To test if the bot sends the link
client.on("message", msg => {
    if (msg.content.includes('patch')) {
        T.get('users/show', params, gotData);
    }
});

client.login(auth.token);