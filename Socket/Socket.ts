var socketio = require('socket.io');

export class SocketController{
    private _io:any;
    private _mongo:any;
    private _server:any;

    constructor(server:any,mongoRepo:any){
        this._mongo=mongoRepo;
        this._server=server;
    }

    public start(){
        var controller = this;
        controller._io = socketio.listen(this._server);

        //Kill annoying debug output
        controller._io.set('log level', 1);

        //Force into xhr polling mode... AppFog has no WebSockets :(
        controller._io.configure(function () {
            controller._io.set("transports", ["xhr-polling"]);
            controller._io.set("polling duration", 10);
        });

        controller._io.sockets.on('connection', function (socket) {
            var id = socket.id;

            socket.on('getPublicStreams', function () {
                controller.getPublicStreams(function(items){
                    socket.emit('PublicStreams', items);
                });
            });

            socket.on('getVideoStream', function (id) {
                controller.getVideoStream(id,function(item){
                    socket.emit('VideoStream', item);
                });
            });

            socket.on('clientUpdate',function(data){
                controller.clientUpdate(data);
            });

            socket.on('disconnect', function(){
                controller.disconnect(id);
            });
        });
    }

    getPublicStreams(callback){
        var controller = this;
        controller._mongo.getAllPublicStreams(function (items) {
            callback(items);
        });
        var streamId = setInterval(function () {
            controller._mongo.getAllPublicStreams(function (items) {
                callback(items);
            });
        }, 5000);
    }



    getVideoStream(id,callback){
        var controller = this;
        var streamId = setInterval(function () {
            controller._mongo.getStreamImage(id.id, function (item) {
                callback(item);
            });
        }, 1000);
    }

    clientUpdate(data){
        this._mongo.addStream(data);
    }

    disconnect(id){
        console.log('Disconnecting ID:' + id);
        try {
            //mongoRepo.removeStream(id);
        }
        catch (ex) {
            console.log('caught it');
        }
    }
}