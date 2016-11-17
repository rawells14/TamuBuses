var socket = io();
var busData = {};
var busStops = [];
var selectedBusStop = '';
var hoursRemaining;
var minutesRemaining;
var secondsRemaining;
// request the data for bus three from server
socket.emit('busData', 3);

$( document ).ready(function() {

  Materialize.fadeInImage('#title')
  Materialize.fadeInImage('#time');

  socket.on('busData', function(bd){
    busData = bd;
    parseBusStops();
    // temporary
    selectIndex = 1;
    selectedBusStop = busStops[selectIndex];
    var dateDifference = 0;
    var currentdate = new Date();
    var clientDateTime = { hours : currentdate.getHours(),
      minutes : currentdate.getMinutes(),
      seconds : currentdate.getSeconds()
    };
    for (var i = selectIndex; i < busData.busTimes.length; i=i+busStops.length) {
      cur = new Date(busData.busTimes[i].datetime);
      if (cur-currentdate < 0) {
        continue;
      }else{
        dateDifference = cur-currentdate;
        break;
      }
    }
    secondsRemaining = Math.floor(dateDifference)/1000;
    console.log(secondsRemaining);
    minutesRemaining = Math.floor(secondsRemaining/60);
    secondsRemaining = Math.floor(secondsRemaining) % 60;
    countdown();
  });
});


function countdown() {
  $("#minutes").html(minutesRemaining);
  $("#seconds").html(secondsRemaining);
  console.log(hoursRemaining+':'+minutesRemaining+':'+secondsRemaining)

  if (secondsRemaining<=0) {
    minutesRemaining--;
    secondsRemaining = 60+secondsRemaining;
  }
  secondsRemaining--;
  timeoutMyOswego = setTimeout(countdown, 1000);
}


function parseBusStops(){
  for(var i = 0; i < busData.busStops.length; i++){
    if (i!=0 && busData.busStops[0] == busData.busStops[i]) {
      busStops.push(busData.busStops[i]);
      break;
    }else{
      busStops.push(busData.busStops[i]);
    }
  }
}
