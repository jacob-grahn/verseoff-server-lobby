/* @flow */

const { r, db } = require('../util/db')
const lobbyTable = r.table('lobby')
import type User from '../user'

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

const Lobby = {
  assignRoom,
  getWaitingMembers
}

function assignRoom (roomId: string, users: Array<User>): Promise {
  return r.expr(users)
  .forEach(user => {
    return lobbyTable.get(user.id)
    .update({assignedRoom: roomId})
  })
  .run()
}

function getWaitingMembers (): Promise {
  return lobbyTable.filter({assignedRoom: 'none'}).run()
}


module.exports = Lobby;
