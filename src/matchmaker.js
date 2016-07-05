/* @flow */

const _ = require('lodash')
const Lobby = require('./tables/lobby')

import type User from './user'
type Room = Array<User>
type MatchmakerSettings = {
  id: string,
  startThreshold: number,
  fullRoom: number
}

// weights for competing goals
const wantFullRoom: number = 100
const wantShortWait: number = 100
const wantSameLanguage: number = 100
const wantFriends: number = 100
const defaultSettings: MatchmakerSettings = {
  id: 'default',
  startThreshold: 200,
  fullRoom: 10
}

class Matchmaker {

  interval: any;
  settings: MatchmakerSettings;

  constructor (settings: Object): void {
    this.settings = Object.assign({}, defaultSettings, settings)
  }

  start (time: number = 100): void {
    this.stop();
    this.interval = setInterval(() => matchmake(this.settings), time)
    matchmake(this.settings)
  }

  stop ():void {
    if(this.interval) {
      clearInterval(this.interval);
      delete this.interval;
    }
  }

  runOnce (): Promise {
    return matchmake(this.settings)
  }
}

function matchmake (settings: MatchmakerSettings): Promise {
  return Lobby.getWaitingMembers(settings.id)
  .then((users: Array<User>) => {
    for(let user of users) {
      user.happiness = calcHappiness(user, users, settings)
    }
    users.sort((a, b) => b.happiness - a.happiness)
    const room: Array<User> = users.splice(0, settings.fullRoom)
    if(averageHappiness(room) > settings.startThreshold) {
      startRoom(room)
    }
  })
}

function makeRoomId (): string {
  return Math.round(Math.random() * 1000000000000).toString();
}

function startRoom (users: Array<User>) {
  const roomId = makeRoomId()
  const result = Lobby.assignRoom(users, roomId)
}

function calcHappiness(user: User, room: Room, settings: MatchmakerSettings): number {
  var happiness = 0;
  happiness += calcHappinessFromFriends(user, room, settings.fullRoom)
  happiness += calcHappinessFromFullRoom(user, room, settings.fullRoom)
  happiness += calcHappinessFromLanguage(user, room, settings.fullRoom)
  happiness += calcHappinessFromBoredom(user)
  return happiness;
}

function calcHappinessFromFriends (user: User, room: Room, fullRoom: number): number {
  if(!user.friends || user.friends.length === 0) {
    return 0;
  }
  let friends = 0;
  for (let otherUser: User of room) {
    if(user.id === otherUser.id) {
      continue
    }
    if(user.friends.indexOf(otherUser.id) !== -1) {
      friends++
    }
  }
  return friends * wantFriends / fullRoom
}

function calcHappinessFromLanguage (user: User, room: Room, fullRoom: number): number {
  let sameLanguage: number = 0;
  for(let otherUser: User of room) {
    if(user !== otherUser && otherUser.language === user.language) {
      sameLanguage++
    }
  }
  return sameLanguage * wantSameLanguage / fullRoom
}

function calcHappinessFromFullRoom (user: User, room: Room, fullRoom: number): number {
  const roomSize = Math.min(room.length, fullRoom)
  return roomSize * wantFullRoom / fullRoom
}

function calcHappinessFromBoredom (user: User): number {
  const curTime: number = new Date().getTime()
  const joinTime: number = user.joinTime.getTime()
  const secondsWaited: number = (curTime - joinTime) / 1000
  return secondsWaited / 10 * wantShortWait
}

function averageHappiness(room: Room): number {
  let total = 0,
      average;
  for(let user of room) {
    total += user.happiness;
  }
  average = total / room.length;
  return average;
}

module.exports = Matchmaker;
