var express = require("express");
var cheerio = require('cheerio');
var request = require('request');
var app = express();

var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;
//uses port 80 on the production server
app.set("port", port);

app.use(express.static('public'));
app.set('views', 'public');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


app.get("/", function(req, res){
	res.render("index.html");
});
app.get("/buses/:id", function(req, res){
	res.render("bus.html");
});

io.on('connection', function(socket){
	// When a new user connects, it will serve the latest data from Tamu
	// bus servers
	socket.on('busData', function(busID){
	 getBusData(busID, function(data) {
		socket.emit('busData', data);
	});
});

});

http.listen(app.get("port"), function(){
	console.log("Server Running on 3000");
});


function getBusData(bus, callback){
	if (bus == null){
		return;
	}
	if(bus.toString().length==1){
		bus = '0' + bus;
	}
	url = 'http://transport.tamu.edu/BusRoutes/Routes.aspx?r='+bus;

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
