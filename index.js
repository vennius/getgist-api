const express = require("express")
const axios = require("axios")
const { Telegraf, Telegram } = require('telegraf')
const app = express()
require('dotenv').config()
const bot = new Telegraf(process.env.BOT_TOKEN)
const tele = new Telegram(process.env.BOT_TOKEN)

app.get("/getgist/:id", async (req, res) => {
  try {
    const response = await axios({
    method: "GET",
    url: "https://api.github.com/gists/"+req.params.id,
    headers: {
      "Authorization": "Bearer "+process.env.TOKEN
    },
    responseType: "json"
     })
    for(key in response.data.files){
      res.send(response.data.files[key].content)
    }
  } catch (error) {
    res.send("Error")
  }
})

app.post("/send", async (req, res) => {
  try{
    if(!req.query.data) throw "Data query not found!"
    const data = req.query.data.replace("[SPASI]", " ").replace("[ENTER]", "\n")
    await tele.sendMessage(process.env.SENDTO_ID, data)
    res.json({
      status: "oke"
    })
  }catch(error){
    res.json({
      status: "error",
      error
    })
  }
})

bot.launch();

app.listen(3000, () => console.log("App Listening to 3000"))
