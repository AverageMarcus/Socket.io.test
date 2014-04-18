var onlineUsers = 0,
    socket;

var requestName = function requestName(){
  sendMessage('Hey, what\s your name?', 'Sender', false);
};  

var updateOnlineUsers = function updateOnlineUsers(increase){
  if(increase){
    onlineUsers++
  }else{
    onlineUsers--;
  }
  socket.emit('user count', onlineUsers);
  socket.broadcast.emit('user count', onlineUsers);
};

var recieveName = function recieveName(name){
  socket.set('user', name, function(){
    console.log('Got new user: '+name);
    sendMessage('Hello '+name, 'Server', false);
  });
};

var sendMessage = function sendMessage(text, sender, toAll){
  var message = sender +' says: ' + text;
  if(toAll){
    socket.broadcast.emit('message', {text: message});
  }
  socket.emit('message', {text: message});
};

var changeBackground = function changeBackground(hex){
  socket.broadcast.emit('change background', hex);
  socket.emit('change background', hex);
};

var playGame = function playGame(action){
  socket.broadcast.emit('move gamepiece', action);
  socket.emit('move gamepiece', action);
};

var submitVote = function submitVote(vote){
  socket.broadcast.emit('update chart', vote);
  socket.emit('update chart', vote);
};

exports.init = function(socketIn) {
  socket = socketIn;
  return {
    requestName      : requestName,
    updateOnlineUsers: updateOnlineUsers,
    recieveName      : recieveName,
    sendMessage      : sendMessage,
    changeBackground : changeBackground,
    playGame         : playGame,
    submitVote : submitVote
  };
};
