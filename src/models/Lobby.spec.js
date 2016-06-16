/* @flow */

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised")
const Lobby = require('./Lobby')
const { r, db } = require('../util/db')

chai.use(chaiAsPromised);
const expect = chai.expect;


describe("Lobby model", () => {

  beforeEach(function() {{
    return r.table('lobby').update(
      {id: 'test-lobby', members: [
        {id: 'u1', assignedRoom: 'none'},
        {id: 'u2', assignedRoom: 'none'},
        {id: 'u3', assignedRoom: 'r1'},
        {id: 'u4', assignedRoom: 'none'},
      ]}
    ).run()
  }})

  afterEach(function() {
    return r.table('lobby').delete('test-lobby')
  })

  it("gets users who have an assignedRoom of 'none'", function () {
    return expect(
      Lobby.getWaitingMembers()
    ).to.eventually.have.property('length', 3);
  })

  it("assigns a list of users to a room", function () {
    return expect(
      Lobby.assignRoom('lala', ['u1', 'u2'])
    ).to.eventually.have.property('updated', 2)
  })
})
