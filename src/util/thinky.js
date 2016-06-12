/* @flow */

const Thinky = require('thinky');

const thinky = Thinky({
  port: 29000,
  host: 'localhost',
  db: 'test'
});

module.exports = thinky;
