Jackdaw.Waveformdisplay = ( function( window, undefined ) {

var canvas;

function Init(){
    console.log("Hello waveformdisplay")
    canvas = document.getElementById("waveform");
}


function Drawbuffer(buffer) {
    
    var width = canvas.width;
    var height = canvas.height;
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, width, height);

    var data = buffer.getChannelData( 0 );
    var step = Math.ceil( data.length / width );
    var amp = height / 2;
    for(var i=0; i < width; i++){
        var min = 1.0;
        var max = -1.0;
        for (var j=0; j<step; j++) {
            var datum = data[(i*step)+j]; 
            if (datum < min)
                min = datum;
            if (datum > max)
                max = datum;
        }
        context.fillRect(i,(1+min)*amp,1,Math.max(1,(max-min)*amp));
    }
}


return{
         init:Init,
   drawbuffer:Drawbuffer
};


} )( window );