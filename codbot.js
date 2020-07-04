const discord = require('discord.js');
const client = new discord.Client();
const request = require('request');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const token = '';
const codURL = "https://www.infinityward.com/news";
const botDateFile = "latest-date.txt";

// For Testing Purposes
// ------------------------------------------------------------------------------------------
client.on("ready", () => {
    console.log("Bot is now connected");
});

client.on('message', msg => {
    if (msg.content.substring(0, 1) == '!') {
        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch (cmd) {
            // !ping
            case 'ping':
                msg.reply('Pong!');
            case 'news':
                getCodUpdate();
        }
    }
});
// ------------------------------------------------------------------------------------------

function getTodaysDate() {
    let date = new Date();
    return date;
}

function getDateFromWebsite() {
    let date = new Date(fs.readFileSync(botDateFile).toString());
    return date;
}

// Writes the Date of the Latest Update to the "latest-date.txt" File
function setDateInFile() {
    axios.get(codURL)
        .then(res => {
            const $ = cheerio.load(res.data);
            datePath = "div.news-item.news-headline.news-tout0 > a > h3 > span.date";
            yearPath = "div.news-item.news-headline.news-tout0 > a > h3 > span.year";
            date = $(datePath).contents().text();
            year = $(yearPath).contents().text();
            // WEBSITE DATE FORMAT: MONTH DAY YEAR => E.G JUN 29 2020
            fullDate = date + ' ' + year;
            fs.writeFileSync(botDateFile, fullDate);
        })
}

function sendUpdateToChannel() {
    axios.get(codURL)
        .then(res => {
            const $ = cheerio.load(res.data);
            const url_path = "div.news-item.news-headline.news-tout0 > a";
            const link = $(url_path).attr('href');
            client.channels.get('727922007412572220').send(link);
        })
}


// Main Code
// -------------------------------------------------------------------------------------------------

function getCodUpdate() {
    if ((getDateFromWebsite() == getTodaysDate())) {
        sendUpdateToChannel();
    }
}

// function for date of last update
function checkLastPostDate() {
    
};

// -------------------------------------------------------------------------------------------------


client.login(token);