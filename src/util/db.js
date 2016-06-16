const servers = [{host: 'localhost', port: 28015}]
const r = require('rethinkdbdash')({servers});
const db = r.db('verseoff')

db.tableCreate('lobby').run()

module.exports = {db, r};
