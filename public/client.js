var socket;
var busData = {};
var busStops = [];
var selectedBusStop = '';
var hoursRemaining;
var minutesRemaining;
var secondsRemaining;
var selectIndex = 0;
// request the data for bus three from server
var busNum = window.location.pathname;
var noBuses = false;
busNum = parseInt(busNum.substring(7));

$( document ).ready(function() {
  socket = io();
  Materialize.fadeInImage('#title')
  Materialize.fadeInImage('#time');
  getDataFromServer();
});

function getDataFromServer(){
  busData = {};
  busStops = [];
  hoursRemaining = 0;
  minutesRemaining = 0;
  secondsRemaining = 0;
  socket.emit('busData', busNum );
  socket.on('busData', function(bd){
    console.log('Got updated data');
    busData = bd;
    parseBusStops();
    selectedBusStop = busStops[selectIndex];
    calcDiffs();
    countdown();
  });

}
function calcDiffs(){
  var dateDifference = 0;
  var currentdate = new Date
  for (var i = selectIndex; i < busData.busTimes.length; i=i+busStops.length) {
    if (busData.busTimes[i]==null) {
      continue;
    }
    cur = new Date(busData.busTimes[i].datetime);
    if (cur-currentdate < 0) {
      continue;
    }else{
      dateDifference = cur-currentdate;
      break;
    }
  }
  if (dateDifference == 0) {
    noBuses = true;
    return;
  }
  secondsRemaining = Math.floor(dateDifference)/1000;
  minutesRemaining = Math.floor(secondsRemaining/60);
  secondsRemaining = Math.floor(secondsRemaining) % 60;
}
function countdown() {
  t1 = (new Date).getTime();
  $("#minutes").html(minutesRemaining);
  if (secondsRemaining.toString().length==1) {
    $("#seconds").html("0"+secondsRemaining);
  }else{
    $("#seconds").html(secondsRemaining);
  }

  if (secondsRemaining<=0) {
    minutesRemaining--;
    secondsRemaining = 60+secondsRemaining;
  }
  if(noBuses){
    $("#time").html("There are no buses availiable for the rest of today");
    Materialize.fadeInImage('#time')
    return;
  }
  else if(minutesRemaining<0){
    $("#time").html("Your bus is departing!");
    Materialize.fadeInImage('#time')
    return;
  }
  secondsRemaining--;
  // creating a pseudosecond clock
  deltaT = (new Date).getTime() - t1;
  console.log(deltaT);
  // recursively call countdown again
  timeout = setTimeout(countdown, 1000 - deltaT);
}


function parseBusStops(){
  for(var i = 0; i < busData.busStops.length - 1; i++){
    if (i!=0 && busData.busStops[0] == busData.busStops[i]) {
      busStops.push(busData.busStops[i]);
      break;
    }else{
      busStops.push(busData.busStops[i]);
    }
  }
  // The last bus stop is always the "arrival" to the main hub. Therefore it is redundant to have both the first and last stops so I removed the last one
  for (var i = 0; i < busStops.length - 1; i++) {

    colWidth = (13 / (busStops.length - 1)) | 0;

    if (i==0) {
      $("#stop-tabs").append('<li class="tab col s'+colWidth+'"><a class="bus-stop-tab active" id="bus-stop'+i+'" href="#">'+busStops[i]+'</a></li>');
    }else{
    $("#stop-tabs").append('<li class="tab col s'+colWidth+'"><a class="bus-stop-tab" id="bus-stop'+i+'" href="#">'+busStops[i]+'</a></li>');
  }
  $("#location").html(" @ "+busStops[0]);
}
  $(".bus-stop-tab").click(function() {
    id = ($(this).attr("id"));
    id = id.replace("bus-stop", "");
    id = parseInt(id);
    selectIndex = id;
    $("#location").html(" @ "+busStops[selectIndex]);
    calcDiffs();
  });
}
