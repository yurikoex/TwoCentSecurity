/**
 * Created with JetBrains WebStorm.
 * User: jtl2
 * Date: 5/14/13
 * Time: 8:20 PM
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose'),
    mongourl = require('../Database/MongoSetup');;

module.exports = {
    setUp: function (callback) {
        mongoose.connect(mongourl);
        callback();
    },
    tearDown: function (callback) {
        mongoose.disconnect()
        callback();
    },
    canConnect: function (test) {
        var conn = mongoose.connection;
        conn.once('open',function(){
            setTimeout(
            test.done(),10000);
        });
    }
};