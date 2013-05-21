/**
 * Module dependencies.
 */
var _ = require('underscore')
    , http = require('http');

/**
 * Mongo Setup
 */
var mongourl = require('./Database/MongoSetup');
var mongoRepo = new (require('./Database/MongoRepository')).MongoRepository(mongourl);

/**
 * Express Setup
 */
var app = require('./Express/ExpressSetup')(mongoRepo, __dirname);
var server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

/**
 * Socket.IO Stuff
 */
var io = new (require('./Socket/Socket')).SocketController(server, mongoRepo).start();

/**
 * Bug in mongo node driver for remove... temp fix
 */
setInterval(function () {
    mongoRepo.destroyAllStreams();
}, 10000);