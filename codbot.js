const Discord = require("discord.js");
token = '';
const client = new Discord.Client();

client.on("ready", () => {
    console.log("Bot is now connected");
});

client.login(token);