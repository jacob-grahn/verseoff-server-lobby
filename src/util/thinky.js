/* @flow */

const Thinky = require('thinky');

const thinky = Thinky({
  port: 28015,
  host: '127.0.0.1',
  db: 'test'
});

module.exports = thinky;
