var mongo = require('mongoose');
var collectionName = 'VideoStreams';
var _ = require('underscore');
var MongoRepository = (function () {
    function MongoRepository(url) {
        this.mongoUrl = url;
        this._connect();
    }
    MongoRepository.prototype.addStream = function (data) {
        this._streamData.update({
            id: data.id
        }, {
            id: data.id,
            friendlyName: data.friendlyName,
            public: data.public,
            data: data.data,
            date: data.date
        }, {
            upsert: true
        }).exec();
    };
    MongoRepository.prototype.removeStream = function (id) {
    };
    MongoRepository.prototype.getAllPublicStreams = function (callback) {
        this._streamData.find({
            public: 'checked',
            date: {
                $gt: ((new Date()).getTime() - 1000000)
            }
        }, function (err, docs) {
            callback(docs);
        });
    };
    MongoRepository.prototype.getStreamImage = function (id, callback) {
        this._streamData.find({
            id: id
        }, null, {
            limit: 1
        }, function (err, docs) {
            callback(docs);
        });
    };
    MongoRepository.prototype.destroyAllStreams = function () {
        this._streamData.collection.drop();
    };
    MongoRepository.prototype._connect = function () {
        var repo = this;
        mongo.connect(this.mongoUrl);
        this._db = mongo.connection;
        this._db.on('error', console.error.bind(console, 'connection error:'));
        this._db.once('open', function () {
            console.log('DB Connected!');
            var Schema = mongo.Schema;
            var schema = new Schema({
                id: String,
                friendlyName: String,
                public: String,
                data: String,
                date: Number
            });
            repo._streamData = mongo.model(collectionName, schema);
        });
    };
    return MongoRepository;
})();
exports.MongoRepository = MongoRepository;
//@ sourceMappingURL=MongoRepository.js.map
