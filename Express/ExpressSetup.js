var express = require('express')
    , path = require('path');

module.exports = function(mongoRepo,dir){
    var app = express();

    app.set('port', process.env.VMC_APP_PORT || 3000);
    app.set('views', dir + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(dir,'public')));

    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    app.get('/', function(req, res){
        res.render('index', { title: 'Two Cent Security' });
    });
    app.get('/StartStream', function(req, res){
        res.render('StartStream', { title: 'Start Stream' });
    });
    app.get('/AvailableStreams', function(req, res){
        res.render('AvailableStreams', { title: 'Available Streams'});
    });

    app.get('/kill',function(req,res){
        mongoRepo.destroyAllStreams();
        res.send(200, 'killed!');
    });

    app.all('*', function(err,req,res,next) {
        console.log('This is a global error handler at route level....');
        return next(err);
    });

    return app;
};