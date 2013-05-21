/**
 * Created with JetBrains WebStorm.
 * User: jtl2
 * Date: 5/11/13
 * Time: 6:52 PM
 * To change this template use File | Settings | File Templates.
 */


var mongo = require('mongoose');
var collectionName = 'VideoStreams';
var _ = require('underscore');

export class MongoRepository {
    private mongoUrl:any;
    private _db:any;
    private _streamData:any;
    constructor(url){
        this.mongoUrl = url;
        this._connect();
    }
    public addStream(data){
        this._streamData.update({id:data.id},{
            id:data.id,
            friendlyName:data.friendlyName,
            public:data.public,
            data:data.data,
            date:data.date
        },{upsert:true}).exec();
    }
    public removeStream(id){
        //var query = this._streamData.remove({id:id});
        //query.exec();
    }
    public getAllPublicStreams(callback){
        this._streamData.find({public:'checked', date: { $gt: ((new Date()).getTime()-1000000) }}, function (err, docs) {
            callback(docs);
        });
    }
    public getStreamImage(id,callback){
        this._streamData.find({id:id },null,{limit:1}, function (err, docs) {
            callback(docs);
        });
    }
    public destroyAllStreams(){
        this._streamData.collection.drop();
    }
    private _connect(){
        var repo = this;
        mongo.connect(this.mongoUrl);
        this._db = mongo.connection;
        this._db.on('error',console.error.bind(console,'connection error:'));
        this._db.once('open',function(){
            console.log('DB Connected!');
            var Schema = mongo.Schema;
            var schema = new Schema({
                id:String,
                friendlyName:String,
                public:String,
                data:String,
                date:Number
            });
            repo._streamData=mongo.model(collectionName,schema);
        });
    }
}

//id
//friendlyName
//public
//data
//date