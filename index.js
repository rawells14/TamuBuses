var express = require("express");
var cheerio = require('cheerio');
var request = require('request');
var app = express();

var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 80;
//uses port 80 on the production server, use 3000 when on public wifi
app.set("port", port);

app.use(express.static('public'));
app.set('views', 'public');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


app.get("/", function (req, res) {
	res.render("index.html");
});
app.get("/buses/:id", function (req, res) {
	res.render("bus.html");
});
app.get("/api/buses/:id", function (req, res) {
	busNumber = req.params["id"];
	getBusData(busNumber, (data) => {
		if (data["busStops"].length == 0 || data["busTimes"] == 0) {
			res.send({
				"message": "No more buses today or bus may not exist"
			});
		} else {
			res.send(JSON.stringify(data));
		}

	})
});
app.get("/api/friendlybuses/:id", function (req, res) {
	busNumber = req.params["id"];
	getBusData(busNumber, (data) => {
		toSend = {};
		toSend["busStops"] = [];
		
		if (data["busStops"].length == 0 || data["busTimes"] == 0) {
			toSend = {
				"message": "No more buses today or bus may not exist"
			};
		} else {
			for (var i = 0; i < data["busStops"].length - 1; i++) {
				if (i != 0 && data["busStops"][0] == data["busStops"][i]) {
					toSend['busStops'].push({"name" : data["busStops"][i]});
					break;
				} else {
					toSend['busStops'].push({"name" : data["busStops"][i]});
				}
			}
			var currentDate = new Date;
			var numRecorded = 0;
			for(var i = 0; i < data["busTimes"].length; i++){
				if(data["busTimes"][i] === undefined || data["busTimes"][i]["datetime"] === undefined){
					continue;
				}
				var dateOfBus = new Date(data["busTimes"][i]["datetime"]);
				if(dateOfBus - currentDate >= 0){
					// FIXME
					toSend["busStops"][numRecorded]["departure"] = dateOfBus;
					numRecorded++;
				}if(numRecorded >= toSend["busStops"].length){
					break;
				}
			}
			for (var key in toSend['busStops']) {
				if(toSend['busStops'][key]['departure'] === undefined){
					continue;
				}
				var hours = toSend['busStops'][key]['departure'].getHours();
				var minutes = toSend['busStops'][key]['departure'].getMinutes();
				var ampm = hours >= 12 ? 'pm' : 'am';
				hours = hours % 12;
				hours = hours ? hours : 12; // the hour '0' should be '12'
				minutes = minutes < 10 ? '0'+minutes : minutes;
				var strTime = hours + ':' + minutes + ' ' + ampm;
				toSend['busStops'][key]['departure'] = strTime;
			}


		}

		res.send(JSON.stringify(toSend));



	})

});

io.on('connection', function (socket) {
	// When a new user connects, it will serve the latest data from Tamu
	// bus servers
	socket.on('busData', function (busID) {
		getBusData(busID, function (data) {
			socket.emit('busData', data);
		});
	});

});

http.listen(app.get("port"), function () {
	console.log("Server Running on " + port);
});


function getBusData(bus, callback) {
	if (bus == null) {
		return;
	}
	if (bus.toString().length == 1) {
		bus = '0' + bus;
	}
	url = 'http://transport.tamu.edu/BusRoutes/Routes.aspx?r=' + bus;

	request(url, function (error, response, html) {
		var data = {
			busStops: [],
			busTimes: []
		};
		if (!error) {
			var $ = cheerio.load(html);
			// removes arrive/leave row
			$("#TimeTableGridView > tr").first().remove();

			$("#TimeTableGridView > tr > td").each(function (i, v) {
				$this = $(this)
				$time = $this.children();
				var $th = $this.closest('table').find('th').eq($this.index());
				data.busStops.push($th.html());
				data.busTimes.push($time.attr());
			});
			$('.timetable').children('tbody').each(function (i, v) {
				//console.log($(this).html());
			});
		}
		callback(data);
	});
};