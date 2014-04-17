var socket = io.connect(window.location.href);
$(document).ready(function() {
  chat.init();
  randomBackground.init();
  game.init();
  vote.init();
});


var chat = (function(){
    var init = function init(){
      socket.on('message', function (data) {
        $('#recieved').append(data.text + "<br/>");
        $('#recieved').get(0).scrollTop = $('#recieved').get(0).scrollHeight;
        socket.emit('acknowledge', { text: 'Got it!' });
      });
      $('#send').on('click', function(event){
        event.preventDefault();
        var message = $('#message').val();
        socket.emit('message', { text: message });
        $('#message').val('');
        return false;
      });
      $('#setname').on('click', function(event){
        event.preventDefault();
        var message = $('#message').val();
        socket.emit('set name', message );
        $('#message').val('');
        $('#send').get(0).disabled = false;
        this.disabled = true;
        return false;
      });
      $('#message').on('keyup', function(){
        if($('#send').get(0).disabled && $('#message').val().length>0){
          $('#setname').get(0).disabled = false;
        }
      });
    };

    return { init : init };
}());

var randomBackground = (function(){
    var generateRandomHex = function generateRandomHex(){
      var hexVals = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
      var randomHex = '#';
      for(var i=0;i<6;i++){
        var pos = Math.floor(Math.random() * (hexVals.length));
        randomHex += hexVals[pos];
      }
      return randomHex;
    };

    var init = function init(){
      $('#backgroundbtn').on('click', function(event){
        event.preventDefault();
        var hex = generateRandomHex();
        socket.emit('random background', hex );
        return false;
      });
      socket.on('change background', function (data) {
        if(data){
          $('body').css('background-color', data);
        }
      });
    };

    return { init : init };
}());

var game = (function(){
  var init = function init(){
    $('#game').on('click', function(event){
      event.preventDefault();
      $(document).keyup(function(event){
        if(event.keyCode == 37) {
          socket.emit('play game', {left: '-=10'});
        }
        else if(event.keyCode == 39) {
          socket.emit('play game', {left: '+=10'});
        }
      });
      return false;
    });
    socket.on('move gamepiece', function (data) {
      console.log("playing");
      if(data){
        $('#gamepiece').animate(data);
      }
    });
  };

  return { init: init };
}());


var vote = (function(){
  var chartResults = { a:0,b:0,c:0};

  var init = function init(){
    var updateChart = function updateChart(data){
      var bar = $('<div/>').css({
        'background-color':'blue',
        'height':'20px',
        'border':'1px solid #111',
        'overflow':'visible',
        'text-align':'center',
        'color':'#ccc',
        'font-weight':'bold',
        'margin-top':'1px'
        });
      var chart = $('#results').css({'border':'1px solid black', 'margin':'10px', 'padding':'5px'}).empty();

      chartResults[data]++;

      var maxVal = 0;
      for (var result in chartResults) {
        maxVal += chartResults[result];
      }

      for (var result in chartResults) {
        var resultBar = bar.clone();
        var percent = Math.floor((chartResults[result] / maxVal) * 100);
        resultBar.append($('<div/>').css('min-width','100px').text(result.toUpperCase() + " ("+chartResults[result]+") - "+ percent +"%"));
        resultBar.css('width', percent+'%');
        chart.append(resultBar);
      }

    };

    socket.on('update chart', function (data) {
      if(data){
        updateChart(data);
      }
    });

    $('#choiceA,#choiceB,#choiceC').on('click', function(){
      var vote = $(this).text().replace('Choice ', '').toLowerCase();
      socket.emit('vote', vote);
    });
  };

  return { init : init };
}());
