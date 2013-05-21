/**
 *
 */
var socket = io.connect('http://'+document.domain+':'+location.port);

var getUserMedia = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia
    , URL = window.URL || window.webkitURL

function LocalMediaStream(videoElem, callback) {
    return getUserMedia.call(navigator, {video: true, audio: true},
        function (stream) {
        videoElem.src = URL.createObjectURL(stream);
        callback(stream);

        var stunServer = 'stun4.l.google.com:19302';

    })
}

LocalMediaStream(document.getElementById("local-webrtc"),function(myStream){

    var canvas =document.getElementById('local-canvas');

    var ctx = canvas.getContext('2d');

    timer = setInterval(function () {
        ctx.drawImage(document.getElementById("local-webrtc"), 0, 0, 320, 240);
        var data = canvas.toDataURL('image/png');
        socket.emit("clientUpdate", {
            id:socket.socket.sessionid,
            friendlyName:$("#friendlyName").val(),
            public:$("#makePublic").attr('checked'),
            data:data,
            date:(new Date()).getTime()});
    }, 1000);

});

socket.on('connect',function(){
    $('a#link').attr('href','/AvailableStreams?id='+socket.socket.sessionid).attr('target','_blank').text('http://'+document.domain+':'+location.port+'/AvailableStreams?id='+socket.socket.sessionid);
});






