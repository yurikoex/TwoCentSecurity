var socketio = require('socket.io');
var SocketController = (function () {
    function SocketController(server, mongoRepo) {
        this._mongo = mongoRepo;
        this._server = server;
    }
    SocketController.prototype.start = function () {
        var controller = this;
        controller._io = socketio.listen(this._server);
        controller._io.set('log level', 1);
        controller._io.configure(function () {
            controller._io.set("transports", [
                "xhr-polling"
            ]);
            controller._io.set("polling duration", 10);
        });
        controller._io.sockets.on('connection', function (socket) {
            var id = socket.id;
            socket.on('getPublicStreams', function () {
                controller.getPublicStreams(function (items) {
                    socket.emit('PublicStreams', items);
                });
            });
            socket.on('getVideoStream', function (id) {
                controller.getVideoStream(id, function (item) {
                    socket.emit('VideoStream', item);
                });
            });
            socket.on('clientUpdate', function (data) {
                controller.clientUpdate(data);
            });
            socket.on('disconnect', function () {
                controller.disconnect(id);
            });
        });
    };
    SocketController.prototype.getPublicStreams = function (callback) {
        var controller = this;
        controller._mongo.getAllPublicStreams(function (items) {
            callback(items);
        });
        var streamId = setInterval(function () {
            controller._mongo.getAllPublicStreams(function (items) {
                callback(items);
            });
        }, 5000);
    };
    SocketController.prototype.getVideoStream = function (id, callback) {
        var controller = this;
        var streamId = setInterval(function () {
            controller._mongo.getStreamImage(id.id, function (item) {
                callback(item);
            });
        }, 1000);
    };
    SocketController.prototype.clientUpdate = function (data) {
        this._mongo.addStream(data);
    };
    SocketController.prototype.disconnect = function (id) {
        console.log('Disconnecting ID:' + id);
        try  {
        } catch (ex) {
            console.log('caught it');
        }
    };
    return SocketController;
})();
exports.SocketController = SocketController;
//@ sourceMappingURL=Socket.js.map
