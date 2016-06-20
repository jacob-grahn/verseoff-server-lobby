/* @flow */

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised")
const expect = chai.expect
const Matchmaker = require('./matchmaker')
const Lobby = require('./tables/lobby')
const lobbyId = 'LobbyId1';
let matchmaker, users;
import type User from './user';

chai.use(chaiAsPromised);


describe("matchmaker", () => {

  beforeEach(function () {
    matchmaker = new Matchmaker(lobbyId)
    users = [
      {id: 'u1'},
      {id: 'u2'},
      {id: 'u3'},
      {id: 'u4'},
      {id: 'u5'}
    ]

    Lobby.getWaitingMembers = function(id): Promise {
      if(id === lobbyId) {
        return Promise.resolve(users);
      }
      return Promise.resolve([]);
    }

    Lobby.assignRoom = function(users: Array<User>, roomId: string): Promise {
      return Promise.resolve(true);
    }
  })

  afterEach(function () {
    matchmaker.stop()
  })

  it("matches at an interval", function () {
    matchmaker.start(25)
  })

  it("matches people with the same language", function () {

  })

  it("matches people who are friends", function () {

  })

  it("has a maximum room size", function () {

  })

  it("has a maximum wait time", function () {

  })
})
