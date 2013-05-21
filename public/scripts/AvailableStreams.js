//WTF batman... did i code this? nono... i stole it
function querystring(key) {
    var re=new RegExp('(?:\\?|&)'+key+'=(.*?)(?=&|$)','gi');
    var r=[], m;
    while ((m=re.exec(document.location.search)) != null) r.push(m[1]);
    return r;
}

var qs = querystring('id');

var socket = io.connect('http://'+document.domain+':'+location.port);

if(qs.length===1)
{
    socket.on('VideoStream',function(items){
        var item = items[0];
        if(item)
        {
            if($('img#streamImg').length===0)
            {
                $('#streamHeading').text(item.friendlyName);
                $('#list').html('' +
                    '<div id="'+item.id+'" class="pagination-centered viewer">' +
                    '   <img class="imgviewer" id="streamImg" src="'+item.data+'" width="320" height="240">' +
                    '   </img>' +
                    '</div>');
            }
            else
            {
                var name = item.friendlyName||"";
                $('#streamHeading').text(name);
                $('img#streamImg').attr('src',item.data);
            }
        }

    });

    socket.emit('getVideoStream',{id:qs[0]});
}
else
{
    socket.on('PublicStreams',function(items){
        if(items.length>0)
        {
            $('#streamHeading').text("Available Streams");
            if($('#list').children().length===0)
            {
                _.each(items,function(item){
                    //console.log(JSON.stringify(item));
                    $('#list').append('' +
                        '<div id="'+item.id+'" class="span3 pagination-centered viewer">' +
                        '   <a href="/AvailableStreams?id='+item.id+'">' +
                        '       <h5>'+item.friendlyName+'</h5>' +
                        '       <img class="imgviewer" id="'+item.id+'" src="'+item.data+'" width="320" height="240">' +
                        '       </img>' +
                        '   </a>' +
                        '</div>');
                });
            }
            else
            {
                var ids= [];
                $('.imgviewer').each(function(){
                    ids.push(this.id);
                });

                var itemIds = _.pluck(items, 'id');
                console.log(_.difference(ids,itemIds));
                _.each(_.difference(ids,itemIds),function(id){
                    $('div#'+id).remove();
                });

                _.each(items,function(item){
                    if($('img#'+item.id).length===1)
                    {
                        $('img#'+item.id).attr('src',item.data);
                    }
                    else
                    {
                        $('#list').append('' +
                            '<div id="'+item.id+'" class="span3 pagination-centered viewer">' +
                            '   <a href="/AvailableStreams?id='+item.id+'">' +
                            '       <h5>'+item.friendlyName+'</h5>' +
                            '       <img class="imgviewer" id="'+item.id+'" src="'+item.data+'" width="320" height="240">' +
                            '       </img>' +
                            '   </a>' +
                            '</div>');
                    }
                });
            }
        }
        else
        {
            $('#streamHeading').text("No one is sharing ):");
            $('#list').children().remove();
        }


    });

    socket.emit('getPublicStreams');
}