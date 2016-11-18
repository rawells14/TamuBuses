var socket = io();
var busData = {};
var busStops = [];
var selectedBusStop = '';
var hoursRemaining;
var minutesRemaining;
var secondsRemaining;
var selectIndex = 1;
// request the data for bus three from server
var busNum = window.location.pathname;
busNum = parseInt(busNum.substring(7));

$( document ).ready(function() {
  Materialize.fadeInImage('#title')
  Materialize.fadeInImage('#time');

  getDataFromServer();
});

function getDataFromServer(){
  socket.emit('busData', busNum );
  socket.on('busData', function(bd){
    console.log('got updated data');
    busData = bd;
    parseBusStops();
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
}


function countdown() {
  $("#minutes").html(minutesRemaining);
  if (secondsRemaining.toString().length==1) {
    $("#seconds").html("0"+secondsRemaining);
  }else{
  $("#seconds").html(secondsRemaining);
}
  console.log(minutesRemaining+':'+secondsRemaining)

  if (secondsRemaining<=0) {
    minutesRemaining--;
    secondsRemaining = 60+secondsRemaining;
  }
  if(minutesRemaining<0){
    getDataFromServer();
    return;
  }
  secondsRemaining--;
  timeout = setTimeout(countdown, 1000);
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
  for (var i = 0; i < busStops.length; i++) {
    $("#stop-tabs").append('<li class="tab col s3"><a href="#">'+busStops[i]+'</a></li>');
  }
}
