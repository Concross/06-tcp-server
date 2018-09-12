'use strict';

const uuid = require('uuid/v4');

class User {
  constructor(socket) {
    this.id = uuid();
    this.nickname = `USER-${this.id}`;
    this.socket = socket;
  }
}

module.exports = User;