const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://www.infinityward.com/news')
    .then(res => {
        const $ = cheerio.load(res.data);
        // const url_path = "div.news-item.news-headline.news-tout0 > a";
        // const link = $(url_path).attr('href');
        
        

    })