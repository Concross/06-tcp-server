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
    dispatchAction(user.id, buffer);
  });
});

const dispatchAction = (userId, buffer) => {
  let message = parse(buffer);
  events.emit(message.command, userId, message);
};

/***********************************
*  EVENT LISTENERS < CAN ABSTRACT  *
************************************/
events.on('@all', (sender, message) => {
  let senderName = userPool[sender].nickname;
  for (let userId in userPool) {
    let user = userPool[userId];
    user.socket.write(`<${senderName}>: ${message.payload}\n`);
  }
});

events.on('@nickname', (sender, message) => {
  let user = userPool[sender];
  user.nickname = message.payload;
  user.socket.write(`Name was succesfully changed to <${user.nickname}>!\n`);
});

events.on('@list', (sender, message) => {
  let user = userPool[sender];
  for (let userId in userPool) {
    user.socket.write(`<${userPool[userId].nickname}>\n`);
  }
});

events.on('@dm', (sender, message) => {
  let senderName = userPool[sender].nickname;
  let recipientName = message.payload.match(/[^\s]+/)[0];

  for (let userId in userPool) {
    if (userPool[userId].nickname === recipientName) {
      let user = userPool[userId];
      user.socket.write(`<${senderName}> ${message.payload.match(/[\s].*/gm)}\n`);
    }
  }
});

events.on('@quit', (sender) => {
  let user = userPool[sender];
  user.socket.write(`Goodbye, ${user.nickname}!`);
  user.socket.destroy();
  delete userPool[sender];
  user.socket.emit('close');
});

let parse = (buffer) => {
  let text = buffer.toString().trim();
  if (!text.startsWith('@')) { console.log('whoops'); }

  let [command, payload] = text.split(/\s+(.*)/);
  console.log(command);
  return { command, payload };
};

server.listen(port, () => {
  console.log(`Chat server is up and running on port ${port}!`);
});