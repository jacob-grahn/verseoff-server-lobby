/* @flow */

const _ = require('lodash')
const Lobby = require('./tables/lobby')

import type User from './user'
type Room = Array<User>
type MatchmakerSettings = {
  id: string,
  maxWaitSeconds: number,
  startThreshold: number,
  fullRoom: number
}

// weights for competing goals
const wantFullRoom: number = 100
const wantNoWait: number = 100
const wantSameLanguage: number = 100
const wantFriends: number = 100
const defaultSettings: MatchmakerSettings = {
  id: 'default',
  maxWaitSeconds: 10,
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
    matchmake(this.settings);
  }

  stop ():void {
    if(this.interval) {
      clearInterval(this.interval);
      delete this.interval;
    }
  }
}

function matchmake (settings: MatchmakerSettings): void {
  Lobby.getWaitingMembers(settings.id)
  .then((users: Array<User>) => {
    _.sortBy(users, calcHappiness);
    users.splice(0, settings.fullRoom);
    if(averageHappiness(users) > settings.startThreshold) {
      startRoom(users);
    }
  })
}

function makeRoomId (): string {
  return Math.round(Math.random() * 1000000000000).toString();
}

function startRoom (users: Array<User>) {
  const roomId = makeRoomId();
  Lobby.assignRoom(users, roomId);
}

function calcHappiness(user: User, room: Room, settings: MatchmakerSettings): number {
  user.happiness = 0;
  user.happiness += calcHappinessFromFriends(user, room, settings.fullRoom);
  user.happiness += calcHappinessFromFullRoom(user, room, settings.fullRoom);
  user.happiness += calcHappinessFromLanguage(user, room, settings.fullRoom);
  user.happiness += calcHappinessFromBoredom(user, settings.maxWaitSeconds);
  return user.happiness;
}

function calcHappinessFromFriends (user: User, room: Room, fullRoom: number): number {
  if(!user.fiends) {
    return 0;
  }
  let friends = 0;
  for (let otherUser: User of room) {
    if(user !== otherUser && user.friends.indexOf(otherUser.id) !== -1) {
      friends++;
    }
  }
  return friends * wantFriends / fullRoom;
}

function calcHappinessFromLanguage (user: User, room: Room, fullRoom: number): number {
  let sameLanguage: number = 0;
  for(let otherUser: User of room) {
    if(user !== otherUser && otherUser.language === user.language) {
      sameLanguage++;
    }
  }
  return sameLanguage * wantSameLanguage / fullRoom;
}

function calcHappinessFromFullRoom (user: User, room: Room, fullRoom: number): number {
  const roomSize = Math.min(room.length, fullRoom);
  return roomSize * wantFullRoom / fullRoom;
}

function calcHappinessFromBoredom (user: User, maxWaitSeconds: number): number {
  const secondsWaited = Math.round((new Date() - user.joinTime) / 1000);
  return secondsWaited * wantNoWait / maxWaitSeconds;
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
