const express = require("express")
const axios = require("axios")
const app = express()
require('dotenv').config()

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

app.listen(3000, () => console.log("App Listening to 3000"))
