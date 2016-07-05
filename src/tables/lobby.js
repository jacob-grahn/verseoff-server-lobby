/* @flow */

const LOBBY_TABLE_NAME = 'lobby';
const { r, db } = require('../util/db')
const lobbyTable = r.table(LOBBY_TABLE_NAME)
import type User from '../user'

db.tableCreate(LOBBY_TABLE_NAME).run()
.catch(err => {})

type LobbyTableContnet = {
  id: string,
  lobbyId: string,
  language: string,
  friends: [string],
  joinTime: Date,
  assignedRoom: string
}

const Lobby = {
  assignRoom,
  getWaitingMembers
}

function assignRoom (users: Array<User>, roomId: string): Promise {
  const userIds = users.map(user => user.id)
  return lobbyTable.getAll(...userIds)
  .update({assignedRoom: roomId})
}

function getWaitingMembers (lobbyId: string): Promise {
  return lobbyTable.filter({lobbyId, assignedRoom: 'none'}).run()
}


module.exports = Lobby;
