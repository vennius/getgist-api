const express = require("express")
const axios = require("axios")
const app = express()
const mongoose = require('mongoose');
require('dotenv').config()

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

const serverSchema = new mongoose.Schema({
  ip: String,
  port: String,
  name: String
})

const Server = mongoose.model('Server', serverSchema);

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

app.get("/addserver", async (req, res) => {
  try {
    const { ip, port, name } = req.query
    if(!(ip && port && name)) throw "Data gak lengkap!"
    const newServer = new Server({ ip, port, name })
    await newServer.save()
    res.json({
      status: "oke"
    })
  } catch (error) {
    console.log(error)
    res.json({
      status: "error",
      error
    })
  }

})

app.listen(3000, () => console.log("App Listening to 3000"))
