/* Config */
var fs = require('fs');
var https = require('spdy');
var express = require('express');
var app = express();
var options = {
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.crt')
};
var config = {
  name: 'A Better Syges',
  url: 'a-better-syges.io',
  port: "8880"
};

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  res.send('Hello World! Welcome to ' + config.name + ' default route :^)');
});

app.get('/abs.js', (req, res) => res.sendFile(__dirname + '/abs.js'))

// TODO : have scss file & serve css
app.get('/abs.css', (req, res) => res.sendFile(__dirname + '/abs.css'))

https.createServer(options, app).listen(config.port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log(config.name + ' server started and is accessible here :')
    console.log('https://' + config.url + ':' + config.port)
  }
});
