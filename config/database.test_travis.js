/*
  Should be used when process.env.NODE_ENV='travis_test'
  Travis tests use this database configuration.
*/
exports.config = {
  type: 'mysql',
  hostname: '127.0.0.1',
  port: 3306,
  db: 't_cartography',
  user: 'root',
  password: ''
};