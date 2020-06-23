const request = require('request');
const cheerio = require('cheerio');

request('https://support.activision.com/uk/en/modern-warfare/articles/latest-updates-for-call-of-duty-modern-warfare',
(error, response, html) => {
    if (!error && response.statusCode == 200) {
        console.log(html);
        // const $ = cheerio.load(html);

        // const siteheading = $('.site-heading');

        // console.log(siteheading);
    }
});