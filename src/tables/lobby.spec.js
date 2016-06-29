/* @flow */

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised")
const Lobby = require('./lobby')
const { r, db } = require('../util/db')
const LOBBY_ID = 'test-lobby';

chai.use(chaiAsPromised);
const expect = chai.expect;


describe("table: Lobby", function () {

  beforeEach(function () {
    return r.table('lobby').insert([
      {id: 'u1', lobbyId: LOBBY_ID, assignedRoom: 'none'},
      {id: 'u2', lobbyId: LOBBY_ID, assignedRoom: 'none'},
      {id: 'u3', lobbyId: LOBBY_ID, assignedRoom: 'r1'},
      {id: 'u4', lobbyId: LOBBY_ID, assignedRoom: 'none'},
    ]).run()
  })

  afterEach(function () {
    return r.table('lobby').delete()
  })

  it("gets users who have an assignedRoom of 'none'", function () {
    return expect(
      Lobby.getWaitingMembers('test-lobby')
    ).to.eventually.have.property('length', 3);
  })

  it("assigns a list of users to a room", function () {
    const users = [
      {id: 'u1'},
      {id: 'u2'}
    ]
    return expect(
      Lobby.assignRoom(users, 'lala')
    ).to.eventually.have.property('replaced', 2)
  })
})
