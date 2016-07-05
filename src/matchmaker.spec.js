/* @flow */

const sinon = require('sinon')
const chai = require("chai")
const Lobby = require('./tables/lobby')
const Matchmaker = require('./matchmaker')
const lobbyId = 'LobbyId1'
import type User from './user'
let matchmaker, users, _Promise
const expect = chai.expect


describe("matchmaker", function () {

  beforeEach(function () {
    matchmaker = new Matchmaker({
      id: lobbyId,
      fullRoom: 2,
      startThreshold: 100,
      maxWaitSeconds: 10
    })
    users = [
      {id: 'u0', language: 'fr', joinTime: new Date(), friends: []},
      {id: 'u1', language: 'en', joinTime: new Date(), friends: []},
      {id: 'u2', language: 'sp', joinTime: new Date(), friends: []},
      {id: 'u3', language: 'ge', joinTime: new Date(), friends: []}
    ]
  })

  afterEach(function () {
  })

  it("matches at an interval", sinon.test(function () {
    const gwm = this.stub(Lobby, 'getWaitingMembers');
    gwm.returns(Promise.resolve([]));

    matchmaker.start(25)
    expect(gwm.callCount).to.equal(1);

    this.clock.tick(24);
    expect(gwm.callCount).to.equal(1);

    this.clock.tick(1);
    expect(gwm.callCount).to.equal(2);

    matchmaker.stop()
  }))

  it("matches people with the same language", function () {
    users[0].language = 'zz'
    users[2].language = 'zz'
    const gwm = sinon.stub(Lobby, 'getWaitingMembers').returns(Promise.resolve(users))
    const ar = sinon.stub(Lobby, 'assignRoom').returns(true)

    return matchmaker.runOnce()
    .then(() => {
      const args = ar.getCall(0).args
      ar.restore()
      gwm.restore()
      expect(args[0][0].id).to.equal('u0')
      expect(args[0][1].id).to.equal('u2')
      expect(typeof args[1]).to.equal('string')
    })
  })

  it("matches people who are friends", function () {
    users[0].friends = ['u3']
    users[3].friends = ['u0']
    const gwm = sinon.stub(Lobby, 'getWaitingMembers').returns(Promise.resolve(users))
    const ar = sinon.stub(Lobby, 'assignRoom').returns(Promise.resolve(true))

    return matchmaker.runOnce()
    .then(() => {
      const args = ar.getCall(0).args
      ar.restore()
      gwm.restore()
      expect(args[0][0].id).to.equal('u0')
      expect(args[0][1].id).to.equal('u3')
    })
  })

  it("has a maximum room size", function () {
    const gwm = sinon.stub(Lobby, 'getWaitingMembers').returns(Promise.resolve(users))
    const ar = sinon.stub(Lobby, 'assignRoom').returns(Promise.resolve(true))

    return matchmaker.runOnce()
    .then(() => {
      const args = ar.getCall(0).args
      ar.restore()
      gwm.restore()
      expect(args[0].length).to.equal(2)
    })
  })

  it("match will start if members have waited a long time", function () {
    const user = users[0]
    user.joinTime = new Date( new Date().getTime() - 30000 )
    const lonelyUsers = [user]
    const gwm = sinon.stub(Lobby, 'getWaitingMembers')
    .returns(Promise.resolve(lonelyUsers))
    const ar = sinon.stub(Lobby, 'assignRoom')
    .returns(Promise.resolve(true))

    return matchmaker.runOnce()
    .then(() => {
      expect(ar.callCount).to.equal(1)
      gwm.restore()
      ar.restore()
    })
  })
})
