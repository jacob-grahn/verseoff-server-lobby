/* @flow */

const { r, db } = require('./util/db')
const lobbyTable = r.table('lobby')

type User =  {
  id: string
}

type LobbyTableContnet = {
  id: string,
  members: [{
    id: string,
    language: string,
    friends: [string],
    joinTime: Date,
    assignedRoom: string
  }]
}

class Lobby {

  lobbyId: string

  constructor (lobbyId: string): void => {
    this.lobbyId = lobbyId
  }

  assignRoom (roomId: string, users: Array<User>): Promise => {
    return r.expr(users)
    .forEach(user => {
      return lobbyTable.get(user.id)
      .update({assignedRoom: roomId})
    })
    .run()
  }

  getWaitingMembers (): Promise => {
    return lobbyTable.filter({assignedRoom: 'none'}).run()
  }
}


module.exports = Lobby;
