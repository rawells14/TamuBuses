var express = require("express");
var cheerio = require('cheerio');
var request = require('request');
var app = express();

var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static('public'));
app.set('views', 'public');
app.set('view engine', 'ejs');
app.set("port", process.env.PORT || 3000);
app.engine('html', require('ejs').renderFile);


app.get("/", function(req, res){
	res.render("index.html");
});
app.get("/buses/3", function(req, res){
	json = getBusData(3);
	res.send(json);
});

io.on('connection', function(socket){
	console.log('a user connected');
});

http.listen(app.get("port"), function(){
	console.log("Listening on port 3000");
});


function getBusData(bus, callback){
	url = 'http://transport.tamu.edu/BusRoutes/Routes.aspx?r=0'+bus;


	request(url, function(error, response, html){

		if(!error){
			var $ = cheerio.load(html);
			var data = { busStops : [], busTimes : []};
			$(".headRow > th").each(function(i, v){
        data.busStops.push($(this).text());
			});
		}
		
	});
};
