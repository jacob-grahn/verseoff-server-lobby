/* @flow */

// thinky.createModel needs to be called as thinky.createModel, nust just
// createModel. For some reason
const thinky = require('../util/thinky.js'),
      r = thinky.r,
      type = thinky.type;

type User =  {
  id: string
}

const Lobby = thinky.createModel("Lobby", {
  id: type.string(),
  members: [{
    id: type.string(),
    language: type.string(),
    friends: [type.string()],
    joinTime: type.date(),
    assignedRoom: type.string()
  }]
})

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
