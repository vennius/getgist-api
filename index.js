const express = require("express")
const axios = require("axios")
const app = express()
require('dotenv').config()
// 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
app.get("/getgist/:id", async (req, res) => {
  
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

})

app.listen(3000, () => console.log("App Listening to 3000"))
