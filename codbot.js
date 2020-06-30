const discord = require('discord.js');
const client = new discord.Client();
const request = require('request');
const axios = require('axios');
const cheerio = require('cheerio');
// const fs = require('fs');

const token = 'Njg2ODk2MDYwNTI2MTAwNDkw.XvoXJA.CcoT-nZbT93etpamrCy1D8-A2dI';
const codURL = "https://www.infinityward.com/news/";

// file that holds that latest update-date
const updateFile = "update-date.json";

// Initialise a var which will hold the data contained in file (data)
// Initialise a var which contains the date of the last update
var updateFileData, lastPostedDate;

client.on("ready", () => {
    console.log("Bot is now connected");
});


// Scraper Code
// -------------------------------------------------------------------------------------------------

axios.get('https://www.infinityward.com/news')
    .then(res => {
        const $ = cheerio.load(res.data);
        const url_path = "div.news-item.news-headline.news-tout0 > a";
        const link = $(url_path).attr('href');
        console.log(link);
        client.on("message", msg => {
            if(msg.content == '!test'){
                client.channels.get('727177768046952478').send(link);
            }
        });
    })

// -------------------------------------------------------------------------------------------------

client.login(token);