const discord = require("discord.js");
const client = new discord.Client();
const axios = require("axios");
const cheerio = require("cheerio");

const websiteUrl = "https://www.infinityward.com/news";
const textChannel = "865587916520554546";

// jsonbin.io
const X_Master_Key =
  "$2b$10$HgY.gdnJfmPDFogOE9UVUeuqauf7ay8IU7aZY.t2.aLkLjqsBfAmK";

// For Testing Purposes
// ------------------------------------------------------------------------------------------
client.on("ready", () => {
  console.log("Cod Website Bot is now connected");
});
// ------------------------------------------------------------------------------------------

client.on("message", (msg) => {
  if (msg.content.substring(0, 1) == "!") {
    var args = msg.content.substring(1).split(" ");
    var cmd = args[0];

    args = args.splice(1);
    // switch (cmd) {
    //   // !ping
    //   case "ping":
    //     msg.reply("Pong!");
    //     break;
    //   case "news":
    //     getCodUpdate();
    //     break;
    //   case "patch":
    //     T.get("users/show", params, gotData);
    // }
  }
});

// Writes the Date of the Latest Update to the json File (do this after you send the update) (last step)
function setDateInFile() {
  axios.get(websiteUrl).then((res) => {
    // get date from website
    const $ = cheerio.load(res.data);
    let datePath =
      "div.news-item.news-headline.news-tout0 > a > h3 > span.date";
    let yearPath =
      "div.news-item.news-headline.news-tout0 > a > h3 > span.year";
    let date = $(datePath).contents().text();
    let year = $(yearPath).contents().text();
    // WEBSITE DATE FORMAT: MONTH DAY YEAR => E.G JUN 29 2020
    let fullDate = date + " " + year;
    let jsonDate = {
      date: fullDate,
    };

    // Write to file
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var req = new XMLHttpRequest();

    req.onreadystatechange = () => {
      if (req.readyState == XMLHttpRequest.DONE) {
        console.log("New date set: " + req.responseText);
      }
    };

    req.open(
      "PUT",
      "https://api.jsonbin.io/v3/b/61073ea2e454211587874156",
      false
    );
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", X_Master_Key);
    req.send(JSON.stringify(jsonDate));
  });
}

function sendUpdateToChannel() {
  axios.get(websiteUrl).then((res) => {
    const $ = cheerio.load(res.data);
    const url_path = "div.news-item.news-headline.news-tout0 > a";
    const link = $(url_path).attr("href");
    client.channels.get(textChannel).send(link);
  });
}

function getCodUpdate() {
  axios.get(websiteUrl).then((res) => {
    const $ = cheerio.load(res.data);
    let datePath =
      "div.news-item.news-headline.news-tout0 > a > h3 > span.date";
    let yearPath =
      "div.news-item.news-headline.news-tout0 > a > h3 > span.year";
    let date = $(datePath).contents().text();
    let year = $(yearPath).contents().text();
    // WEBSITE DATE FORMAT: MONTH DAY YEAR => E.G JUN 29 2020
    let fullDate = new Date(date + " " + year);

    // get date from file
    axios
      .get("https://api.jsonbin.io/b/61073ea2e454211587874156/latest")
      .then((res) => {
        let lastSentUpdate = new Date(res.data["date"]);
        // Link is only sent if it is dates are equal AND update has not been sent
        if (fullDate.toDateString() != lastSentUpdate.toDateString()) {
          sendUpdateToChannel();
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // Updates the date inside the json file
    setDateInFile();
  });
}

// --------------------------------------------------------------------------------------
// Twitter Bot

const consumerKey = "flzgunLsTXow6xqXcgk26Li4f";
const secretConsumer = "GPJ58scuvGOIVMDiZgkoPuS39V4sRNdoDXYMtKEfGjjnCIPyGK";
const accessToken = "1282702294136627207-QdrIyovQhEFMNVSS5zzbA3X0uGNPsP";
const secretAccess = "k0HUQDd0mW6tEkowEIFUsFqjDoNB2QsVc8LFZj2am6VJ5";

const twit = require("twit");
const T = new twit({
  consumer_key: consumerKey,
  consumer_secret: secretConsumer,
  access_token: accessToken,
  access_token_secret: secretAccess,
});

// testing purposes
client.on("ready", () => {
  console.log("Twitter Bot is now connected");
});

// specifies twitter account
var params = {
  screen_name: "Activision",
};

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

// Run website and twitter scripts
getCodUpdate();
// T.get("users/show", params, gotData);

client.login(process.env.TOKEN);
