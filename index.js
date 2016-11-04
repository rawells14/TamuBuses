var express = require("express");
var app = express();

var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static('public'));
app.set('views', 'public');
app.set('view engine', 'ejs');
app.set("port", process.env.PORT || 3000);
app.engine('html', require('ejs').renderFile);

<!-- Dropdown Trigger -->
 <a class='dropdown-button btn' href='#' data-activates='dropdown1'>Drop Me!</a>

 <!-- Dropdown Structure -->
 <ul id='dropdown1' class='dropdown-content'>
	 <li><a href="#!">one</a></li>
	 <li><a href="#!">two</a></li>
	 <li class="divider"></li>
	 <li><a href="#!">three</a></li>
 </ul>
app.get("/", function(req, res){
	res.render("index.html");
});
app.get("/buses/3", function(req, res){
	res.render("bus.html");
});

io.on('connection', function(socket){
	console.log('a user connected');
});

http.listen(app.get("port"), function(){
	console.log("Listening on port 3000");
});
