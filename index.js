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
app.get("/buses/:id", function(req, res){
	getBusData(req.params.id, function(data) {
		res.send(data);
	});
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
		var data = { busStops : [], busTimes : []};
		if(!error){
			var $ = cheerio.load(html);
			// removes arrive/leave row
			$("#TimeTableGridView > tr").first().remove();

			$("#TimeTableGridView > tr > td").each(function(i, v) {
				$this = $(this)
				$time =$this.children();
				var $th = $this.closest('table').find('th').eq($this.index());
				data.busStops.push($th.html());
				data.busTimes.push($time.attr());

			});
			$('.timetable').children('tbody').each(function(i, v){
				//console.log($(this).html());
			});
		}
		callback(data);
	});
};
