const config = require('./config')
const twit = require('twit')
const T = new twit(config)

// specifies twitter account
var params = {
    screen_name: 'Activision',
}

// 
function gotData(err, data) {
    retweet_status = data.status.retweeted_status;
    if (retweet_status == null) {
        link = data.status.entities.urls[0].url;
        console.log(link)
    } else {
        link = data.status.retweeted_status.entities.urls[0].url;
        console.log(link);
    }
}

T.get('users/show', params, gotData);