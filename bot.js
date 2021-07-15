const discord = require('discord.js');
const client = new discord.Client();
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const websiteUrl = "https://www.infinityward.com/news";
const textChannel = "864587986195447812"
// Stores the date and other contents all in one json file
const dateFile = 'date.json';

// For Testing Purposes
// ------------------------------------------------------------------------------------------
client.on("ready", () => {
    console.log("Cod Website Bot is now connected");
});
// ------------------------------------------------------------------------------------------

client.on('message', msg => {
    if (msg.content.substring(0, 1) == '!') {
        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch (cmd) {
            // !ping
            case 'ping':
                msg.reply('Pong!');
                break
            case 'news':
                getCodUpdate()
                break
            case 'patch':
                T.get('users/show', params, gotData);
        }
    }
});

// Gets the date of the update that was last sent from the json file
function getLastSentUpdate() {
    let file = fs.readFileSync(dateFile);
    let parsedfile = JSON.parse(file);
    let date = new Date(parsedfile.date);
    return date;
}

// Writes the Date of the Latest Update to the json File (do this after you send the update) (last step)
function setDateInFile() {
    axios.get(websiteUrl)
        .then(res => {
            const $ = cheerio.load(res.data);
            let datePath = "div.news-item.news-headline.news-tout0 > a > h3 > span.date";
            let yearPath = "div.news-item.news-headline.news-tout0 > a > h3 > span.year";
            let date = $(datePath).contents().text();
            let year = $(yearPath).contents().text();
            // WEBSITE DATE FORMAT: MONTH DAY YEAR => E.G JUN 29 2020
            let fullDate = date + ' ' + year;
            // Write to file
            let file = fs.readFileSync(dateFile);
            let parsedfile = JSON.parse(file);
            // Assign fullDate to date variable in json file
            parsedfile.date = fullDate;
            let data = JSON.stringify(parsedfile);
            fs.writeFileSync(dateFile, data);
        })
}

function sendUpdateToChannel() {
    axios.get(websiteUrl)
        .then(res => {
            const $ = cheerio.load(res.data);
            const url_path = "div.news-item.news-headline.news-tout0 > a";
            const link = $(url_path).attr('href');
            client.channels.get(textChannel).send(link);
        })
}

function getCodUpdate() {
    axios.get(websiteUrl)
        .then(res => {
            const $ = cheerio.load(res.data);
            let datePath = "div.news-item.news-headline.news-tout0 > a > h3 > span.date";
            let yearPath = "div.news-item.news-headline.news-tout0 > a > h3 > span.year";
            let date = $(datePath).contents().text();
            let year = $(yearPath).contents().text();
            // WEBSITE DATE FORMAT: MONTH DAY YEAR => E.G JUN 29 2020
            let fullDate = new Date(date + ' ' + year);
            // Link is only sent if it is dates are equal AND update has not been sent
            if (fullDate.toDateString() != getLastSentUpdate().toDateString()) {
                sendUpdateToChannel();
            }
            // Updates the date inside the json file
            setDateInFile()
        })
}

// --------------------------------------------------------------------------------------
// Twitter Bot

const consumerKey = "flzgunLsTXow6xqXcgk26Li4f"
const secretConsumer = "GPJ58scuvGOIVMDiZgkoPuS39V4sRNdoDXYMtKEfGjjnCIPyGK"
const accessToken = "1282702294136627207-QdrIyovQhEFMNVSS5zzbA3X0uGNPsP"
const secretAccess = "k0HUQDd0mW6tEkowEIFUsFqjDoNB2QsVc8LFZj2am6VJ5"

const twit = require('twit')
const T = new twit({
    consumer_key: consumerKey,
    consumer_secret: secretConsumer,
    access_token: accessToken,
    access_token_secret: secretAccess
})

// testing purposes
client.on("ready", () => {
    console.log("Twitter Bot is now connected");
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
        client.channels.get(textChannel).send(link);
    // else if it is a retweet
    } else {
        link = data.status.retweeted_status.entities.urls[0].url;
        client.channels.get(textChannel).send(link);
    }
}

client.login(auth.TOKEN);