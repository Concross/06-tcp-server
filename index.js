'use strict';

const EventEmitter = require('events');
const net = require('net');
const User = require('./src/lib/user');

const port = process.env.PORT || 3000;
const server = net.createServer();
const events = new EventEmitter();
const userPool = {};

server.on('connection', (socket) => {
  let user = new User(socket);
  userPool[user.id] = user;

  socket.on('data', (buffer) => {
    dispatchAction(user.nickname, buffer);
  });
});

const dispatchAction = (userNickname, buffer) => {
  let message = parse(buffer);
  events.emit(message.command, userNickname, message);
};

/***********************************
*  EVENT LISTENERS < CAN ABSTRACT  *
************************************/
events.on('@all', (sender, message) => {
  for (let userId in userPool) {
    let user = userPool[userId];
    user.socket.write(`<${sender}>: ${message.payload}\n`);
  }
});

let parse = (buffer) => {
  let text = buffer.toString().trim();
  if (!text.starsWith('@')) { return null; }

  let [command, payload] = text.split(/\s+(.*)/);
  console.log(command);
  return { command, payload };
};

server.listen(port, () => {
  console.log(`Chat server is up and running on port ${port}!`);
});