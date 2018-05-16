const express = require('express')
const app = express()
var path = require('path');

app.all('/mock/*', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../' + req.originalUrl + '.json'))
})

var server = app.listen(18080, function () {
    var host = server.address().address
    var port = server.address().port
 
    console.log("Mock Server http://%s:%s", host, port)
})