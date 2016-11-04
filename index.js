var express = require("express");
var app = express();

var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static('public'));
app.set('views', 'public');
app.set('view engine', 'html');
app.set("port", process.env.PORT || 3000);


app.get("/", function(req, res){
	res.render("index.html");
})
var buses = require('./buses')
app.use('/buses', buses)



io.on('connection', function(socket){
	console.log('a user connected');
});

http.listen(app.get("port"), function(){
	console.log("Listening on port 3000");
});
