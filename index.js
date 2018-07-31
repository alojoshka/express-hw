const express = require('express');
const app = express();

app.get('/', function (req, res) {
    console.log("route index started");
    res.send('Hello World!');
  });
  const port = process.env.PORT || 8080;
  app.listen(port, function () {
    console.log('Example app listening on port 8080!');
  });