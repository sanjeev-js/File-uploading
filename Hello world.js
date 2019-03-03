var express = require("express");
var app = express();

app.get('/', function(request, response ){
    response.send("hello world");
    })

var server = app.listen(8081, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("app is listening at", host, port)
})