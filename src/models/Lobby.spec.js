/* @flow */

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { r } = require('../util/thinky')
const Lobby = require('./Lobby')

chai.use(chaiAsPromised);


describe("Lobby model", () => {

  beforeEach(done => {{
    r.table('lobby').update(
      {id: 'test-lobby', members: [
        {id: 'u1', assignedRoom: 'none'},
        {id: 'u2', assignedRoom: 'none'},
        {id: 'u3', assignedRoom: 'r1'},
        {id: 'u4', assignedRoom: 'none'},
      ]}
    ).run()
    .then(done)
  }})

  afterEach(done => {
    r.table('lobby').delete('test-lobby')
    .then(done)
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
