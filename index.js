const express = require('express');
const app = express();

app.get('/', function (req, res) {
    console.log("route index started");
    res.send('Hello World!');
  });
  
  app.listen(3333, function () {
    console.log('Example app listening on port 3333!');
  });