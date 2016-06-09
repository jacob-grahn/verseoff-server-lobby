/* @flow */

const { type, r, createModel } = require('../util/thinky.js')

type User =  {
  id: string
}

const Lobby = createModel("Lobby", {
  id: type.string(),
  members: [{
    id: type.string(),
    language: type.string(),
    friends: [type.string()],
    joinTime: type.date(),
    assignedRoom: type.string()
  }]
}).removeExtra();

Lobby.assignRoom = (roomId: string, users: Array<User>): Promise => {
  return r.expr(users)
  .forEach(user => {
    return Lobby.get(user.id)
    .update({assignedRoom: roomId})
  })
  .run()
}

Lobby.getWaitingMembers = (): Promise => {
  return Lobby.filter({assignedRoom: 'none'}).run()
}

module.exports = Lobby;
