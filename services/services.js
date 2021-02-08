module.exports = function(router, path, db) {
    const routes = require('./routes')(router, path, db);
};