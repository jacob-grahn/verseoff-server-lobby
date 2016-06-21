/* @flow */

const sinon = require('sinon')
const chai = require("chai")
const expect = chai.expect
const chaiAsPromised = require("chai-as-promised")
const Matchmaker = require('./matchmaker')
const Lobby = require('./tables/lobby')
const lobbyId = 'LobbyId1'
let matchmaker, users, clock
import type User from './user'

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
        return Promise.resolve(users)
      }
      return Promise.resolve([])
    }

    Lobby.assignRoom = function(users: Array<User>, roomId: string): Promise {
      return Promise.resolve(true)
    }

    clock = sinon.useFakeTimers()
  })

  afterEach(function () {
    matchmaker.stop()
    clock.restore()
  })

  it("matches at an interval", sinon.test(function () {
    const mock = this.mock(Lobby).expects('getWaitingMembers').once();
    matchmaker.start(25)

    clock.tick(24);
    expect(mock.notCalled).toBe(true);

    clock.tick(1);
    expect(mock.calledOnce).toBe(true);
  }))

  it("matches people with the same language", function () {

  })

  it("matches people who are friends", function () {

  })

  it("has a maximum room size", function () {

  })

  it("has a maximum wait time", function () {

  })
})
