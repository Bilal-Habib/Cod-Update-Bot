const discord = require('discord.js');
const client = new discord.Client();
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const token = 'Njg2ODk2MDYwNTI2MTAwNDkw.Xvt_nA.Iz94EjfxE5UiSi7CPuJjUIDFbZ4';
const codURL = "https://www.infinityward.com/news";
// Stores link of update
const botDateFile = "latest-date.txt";
// Stores number of times update link has been sent
const counterFile = "counter.txt";

// For Testing Purposes
// ------------------------------------------------------------------------------------------
client.on("ready", () => {
    console.log("Bot is now connected");
});

// client.on('message', msg => {
//     if (msg.content.substring(0, 1) == '!') {
//         var args = msg.content.substring(1).split(' ');
//         var cmd = args[0];

//         args = args.splice(1);
//         switch (cmd) {
//             // !ping
//             case 'ping':
//                 msg.reply('Pong!');
//             case 'news':
//                 getCodUpdate();
//         }
//     }
// });
// ------------------------------------------------------------------------------------------

function getTodaysDate() {
    let date = new Date();
    return date;
}

function getDateFromWebsite() {
    let date = new Date(fs.readFileSync(botDateFile).toString());
    return date;
}

function getCounter() {
    let counter = parseInt(fs.readFileSync(counterFile));
    return counter;
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
            // Changes 0 -> 1, to show link has been sent
            let counter = parseInt(fs.readFileSync(counterFile));
            fs.writeFileSync(counterFile, counter + 1)
        })
}

function getCodUpdate() {
    // Link is only sent if it is dates are equal AND update has not been sent
    // If counter > 0, then update will not be sent
    if ( (getDateFromWebsite() == getTodaysDate()) && (getCounter() == 0) ) {
        sendUpdateToChannel();
    }
}

// As soon as script runs, date is set in the latest-date.txt file
setDateInFile();
getCodUpdate();

client.login(token);