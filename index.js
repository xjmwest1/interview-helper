var express = require('express')
var app = express()

app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res, next) {
    res.sendFile('/public/index.html', { root: __dirname })
})

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}!`)
})