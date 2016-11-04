var express = require("express");
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static('public'));
app.set("port", process.env.PORT || 3000);


app.get("/", function(req, res){
	req.render("index.html");
});

app.get("/3", function(req, res){
	req.render("index.html");
});

io.on('connection', function(socket){
	console.log('a user connected');
});

http.listen(app.get("port"), function(){
	console.log("Listening on port 3000");
});
