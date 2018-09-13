# Installation
- In the terminal navigate to this project's directory
- Run `node index.js` at the root level
- Open another terminal and run `nc localhost 3000`
- Open one more terminal and run `nc localhost 3000` again, you now have to clients communicating across a server!

# Available Commands
- `@all <your message here>` @all followed by a message will broadcast that message to all other connected users
- `@list` will list all currently connected users
- `@dm <to-user> <your message>` @dm followed by the user nickname, followed by a message will send the message to just that user
- `@quit` will disconnect the user and destroy the socket