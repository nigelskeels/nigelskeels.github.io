var keysdownarray = [];
var sound = {};
var slices = 40;
var lastsliceplayed=1;
var drumsound="amen";

Jackdaw.Scheduler = ( function( window, undefined ) {

var bufferLoader;
var context = null;
var playmode="noteon";
var recorder;


function Init(){
    
    context = new AudioContext();
    
    //using the global sounds!!!

    bufferLoader = new BufferLoader(
        context,
        sounds
    );
    bufferLoader.load();


    //recorder
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
      console.log('No live audio input: ' + e);
    });

    

    for (var i = 1; i <= slices; i++) {
        var slicebutton = document.createElement("button");
        slicebutton.classname=drumsound;
        slicebutton.innerHTML=i;
        slicebutton.id="slice"+i;
        document.getElementById("butts").appendChild(slicebutton);

        (function(_slicebutton,_i,_drumsound){
            
            _slicebutton.addEventListener("mousedown", function(){
               Playsound(_drumsound,_i,1,13);
            });
            
            _slicebutton.addEventListener("mouseup", function(){
               Stopsound(_drumsound,_i,1,13);
            });

            _slicebutton.addEventListener("touchstart", function(e){
               e.preventDefault();
               Playsound(_drumsound,_i,1,13);
            });

            _slicebutton.addEventListener("touchend", function(e){
               e.preventDefault();
               Stopsound(_drumsound,_i,1,13);
            });
            
        })(slicebutton,i,drumsound)

    };


    document.addEventListener("keydown", keydowntest);
    document.addEventListener("keyup",keyuptest);

    document.getElementById("piano").addEventListener("mousedown",pianokeydown);
    document.getElementById("piano").addEventListener("mouseup",pianokeyup);
    document.getElementById("piano").addEventListener("touchstart",function(e){
        e.preventDefault();
        pianokeydown(e);
    });
    document.getElementById("piano").addEventListener("touchend",function(e){   
        e.preventDefault();
        pianokeyup(e);
    });


}

function Setpadplaymode(_playmode){
    playmode=_playmode;
    console.info("setpadplaymode ",playmode);

}

function pianokeydown(e){
    var rate = (e.target.id.replace("key_","") *0.06)+0.24;

    console.info("pianokeydown",e.target.id, rate);

    Playsound(drumsound,lastsliceplayed,rate,e.target.id.replace("key_",""))
}

function pianokeyup(e){
    var rate = (e.target.id.replace("key_","") *0.06)+0.24;
    
    console.info("pianokeyup",e.target.id);
    Stopsound(drumsound,lastsliceplayed,rate,e.target.id.replace("key_",""))
}


function keydowntest(e){
    if(keysdownarray.indexOf(e.which)==-1){

        var rate = ((e.which-48) *0.06)+0.24;
        // Playsound(drumsound,e.which-48);
        Playsound(drumsound,lastsliceplayed,rate,(e.which-48));
        keysdownarray.push(e.which)          
        console.log("Keydown",e.which-48,rate)
        
    }
    // console.log("keysdownarray",keysdownarray)
}

function keyuptest(e){
    
    var rate = ((e.which-48) *0.06)+0.24;

    var pos = keysdownarray.indexOf(e.which)
    keysdownarray.splice(pos,1);
    console.log("Keyup",e.which-48);
    // Stopsound(drumsound,e.which-48);
    Stopsound(drumsound,lastsliceplayed,rate,(e.which-48));

}

function setbuttonstate(slice,pressedstate,keyid){
    // console.log("setbuttonstate",slice)
    var but = document.getElementById("slice"+slice);
            if(pressedstate==true){
                but.className="pressed";
            }else{
                but.className="";
            }

    var key = document.getElementById("key_"+keyid);
           if(key!=null){
                console.info("keyid",keyid,key)
                if(pressedstate==true){
                    key.className="anchor down";
                }else{
                    key.className="anchor";
                }
           }
}


function Playsound(which,slice,pitch,keyid){

        var which = drumsound;
        var pitch = pitch || "1";

        console.log("play sound ",which,slice,pitch);

        setbuttonstate(slice,true,keyid)
        lastsliceplayed=slice;
        
        var soundname = which;
        if(sound[soundname+slice+"_"+pitch]!=undefined){
            sound[soundname+slice+"_"+pitch].stop();
        }
        sound[soundname+slice+"_"+pitch] = context.createBufferSource();
        sound[soundname+slice+"_"+pitch].buffer = bufferLoader.bufferList[soundname];

        Jackdaw.Waveformdisplay.drawbuffer(sound[soundname+slice+"_"+pitch].buffer);
        
        // console.log("Bufferlength of ",which,sound[soundname+slice+"_"+pitch].buffer.duration," pitch = ",pitch);
        
        if(pitch!=undefined){
             sound[soundname+slice+"_"+pitch].playbackRate.value=pitch;
        }
         var slicelength=sound[soundname+slice+"_"+pitch].buffer.duration/slices;

        // console.log("Slicelength = ",slicelength)

        var starttime = (slicelength*(slice-1));
        console.log("Currenttime = ",context.currentTime," starttime = ",starttime, " Endtime = ", starttime+slice+length)

        sound[soundname+slice+"_"+pitch].connect(context.destination);                    
        sound[soundname+slice+"_"+pitch].loop = true;
        if(playmode=="noteon"){
            sound[soundname+slice+"_"+pitch].start(0,starttime);
            sound[soundname+slice+"_"+pitch].loopStart = starttime;
            sound[soundname+slice+"_"+pitch].loopEnd = starttime+slicelength;
        }else{    
            sound[soundname+slice+"_"+pitch].start(0,starttime);
            
            if(pitch!=undefined){
                sound[soundname+slice+"_"+pitch].stop(context.currentTime+(slicelength/pitch));
            }else{
                sound[soundname+slice+"_"+pitch].stop(context.currentTime+slice+length);
            }
        }

        console.log("sound",sound);
}

function Stopsound(which,slice,pitch,keyid){
    
    var which = drumsound;
    var pitch = pitch || "1";

    setbuttonstate(slice,false,keyid)

    if(playmode=="noteon"){
        var soundname = which;    
        if(sound[soundname+slice+"_"+pitch]!=undefined){
                sound[soundname+slice+"_"+pitch].stop();
        }
    }
}

function Changeslider(which,value){
    console.info("Change slider = ",which,value)
}

//recorder
function startUserMedia(stream){
    var input = context.createMediaStreamSource(stream);
    console.log('Media stream created.');

    // Uncomment if you want the audio to feedback directly
    //input.connect(audio_context.destination);
    //console.log('Input connected to audio context destination.');
    
    recorder = new Recorder(input);
    console.log('Recorder initialised.');
}

function Startrecording(){
    recorder && recorder.record();
    console.log('Recording...');
}

function Stoprecording(){
    recorder && recorder.stop();
    console.log('Stopped recording.');
    
    // create WAV download link using audio data blob
    getbufferedsound();
    recorder.clear();
}

function getbufferedsound(){
    recorder && recorder.getBuffer(function(buffers) {
        var newSource = context.createBufferSource();
        var newBuffer = context.createBuffer( 2, buffers[0].length, context.sampleRate );
        newBuffer.getChannelData(0).set(buffers[0]);
        newBuffer.getChannelData(1).set(buffers[1]);
        newSource.buffer = newBuffer;
        // newSource.connect( context.destination );
        // newSource.start(0); 
        Jackdaw.Waveformdisplay.drawbuffer(newBuffer)
        bufferLoader.bufferList["sample"]=newBuffer;
        drumsound="sample"
        console.log("recording buffer = ",bufferLoader.bufferList);
    });
}


return{
              init:Init,
         playsound:Playsound,
         stopsound:Stopsound,
    setpadplaymode:Setpadplaymode,
      changeslider:Changeslider,
    startrecording:Startrecording,
     stoprecording:Stoprecording
};


} )( window );
