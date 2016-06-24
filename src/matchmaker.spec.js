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
    matchmaker = new Matchmaker({id: lobbyId})
    users = [
      {id: 'u1'},
      {id: 'u2'},
      {id: 'u3'},
      {id: 'u4'},
      {id: 'u5'}
    ]

    clock = sinon.useFakeTimers()
  })

  afterEach(function () {
    matchmaker.stop()
    clock.restore()
  })

  it("matches at an interval", function () {
    const stub = sinon.stub(Lobby, 'getWaitingMembers');
    stub.returns(Promise.resolve([]));

    matchmaker.start(25)
    expect(stub.callCount).to.equal(1);

    clock.tick(24);
    expect(stub.callCount).to.equal(1);

    clock.tick(1);
    expect(stub.callCount).to.equal(2);

    stub.restore();
  })

  it("matches people with the same language", function () {

  })

  /*it("matches people who are friends", function () {

  })

  it("has a maximum room size", function () {

  })

  it("has a maximum wait time", function () {

  })*/
})
