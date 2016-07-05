const DB_NAME = 'verseoff'
const servers = [{host: 'localhost', port: 28015}]
const r = require('rethinkdbdash')({servers})
const db = r.db(DB_NAME)

r.dbCreate(DB_NAME).run()
.catch(err => {})

module.exports = {db, r};
