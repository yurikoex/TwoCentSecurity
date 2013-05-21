var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var events = require('events');
var BaseController = (function (_super) {
    __extends(BaseController, _super);
    function BaseController() {
        _super.call(this);
    }
    return BaseController;
})(events.EventEmitter);
exports.BaseController = BaseController;
var EventingRequire = require('./EventingRequire.js').EventingRequire;
var BaseController = EventingRequire.Require('/the/above/file.js');
var WorldController = (function (_super) {
    __extends(WorldController, _super);
    function WorldController() {
        _super.call(this);
    }
    return WorldController;
})(BaseController);
exports.WorldController = WorldController;
//@ sourceMappingURL=test.js.map
