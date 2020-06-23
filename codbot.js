const Discord = require("discord.js");
const token = 'Njg2ODk2MDYwNTI2MTAwNDkw.Xu-7-w.F7A06nKa0mJhi7-skgDrpH9r4X0';
const client = new Discord.Client();

client.on("ready", () => {
    console.log("Bot is now connected");
});

client.login(token);