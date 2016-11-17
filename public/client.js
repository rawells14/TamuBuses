$( document ).ready(function() {
  Materialize.fadeInImage('#title')
  Materialize.fadeInImage('#time');
  var currentdate = new Date();
  var clientDateTime = { hours : currentdate.getHours(),
    minutes : currentdate.getMinutes(),
    seconds : currentdate.getSeconds()
  };
  var nextBusHours = 1;
  var nextBusMinutes = 25;
  var nextBusSeconds = 12;
  var hoursRemaining = nextBusHours - clientDateTime.hours;
  var minutesRemaining = nextBusMinutes - clientDateTime.minutes;
  var secondsRemaining = nextBusSeconds - clientDateTime.seconds;
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
  countdown();
});
