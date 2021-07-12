const discord = require('discord.js');
const client = new discord.Client();
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// File containing token
const auth = require('./token.json');
const codURL = "https://www.infinityward.com/news";

// Stores the date and other contents all in one json file
const botInfoFile = 'bot-info.json';

// For Testing Purposes
// ------------------------------------------------------------------------------------------
client.on("ready", () => {
    console.log("Bot is now connected");
});
// ------------------------------------------------------------------------------------------

function getTodaysDate() {
    let date = new Date();
    return date;
}

function getDateFromWebsite() {
    let file = fs.readFileSync(botInfoFile);
    let parsedfile = JSON.parse(file);
    let date = new Date(parsedfile.date).toDateString();
    return date;
}

// Writes the Date of the Latest Update to the "latest-date.txt" File
function setDateInFile() {
    axios.get(codURL)
        .then(res => {
            const $ = cheerio.load(res.data);
            let datePath = "div.news-item.news-headline.news-tout0 > a > h3 > span.date";
            let yearPath = "div.news-item.news-headline.news-tout0 > a > h3 > span.year";
            let date = $(datePath).contents().text();
            let year = $(yearPath).contents().text();
            // WEBSITE DATE FORMAT: MONTH DAY YEAR => E.G JUN 29 2020
            let fullDate = date + ' ' + year;
            // Write to file
            let file = fs.readFileSync(botInfoFile);
            let parsedfile = JSON.parse(file);
            // Assign fullDate to date variable in json file
            parsedfile.date = fullDate;
            let data = JSON.stringify(parsedfile);
            fs.writeFileSync(botInfoFile, data);
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

function getCodUpdate() {
    // Link is only sent if it is dates are equal AND update has not been sent
    // If counter > 0, then update will not be sent
    if (getDateFromWebsite() == getTodaysDate()) {
        sendUpdateToChannel();
    }
}

// As soon as script runs, date is set in the latest-date.txt file
setDateInFile();
getCodUpdate();

client.login(process.env.TOKEN);
