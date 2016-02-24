var keysdownarray = [];
var sound = {};
var slices = 40;

Jackdaw.Scheduler = ( function( window, undefined ) {

var bufferLoader;
var context = null;
var drumsound="amen";
var playmode="noteon";
var lastsliceplayed;

function Init(){
    
    context = new AudioContext();
    
    //using the global sounds!!!

    bufferLoader = new BufferLoader(
        context,
        sounds
    );
    bufferLoader.load();


    //newbit


    for (var i = 1; i <= slices; i++) {
        var slicebutton = document.createElement("button");
        slicebutton.classname=drumsound;
        slicebutton.innerHTML=i;
        slicebutton.id="slice"+i;
        document.getElementById("butts").appendChild(slicebutton);

        (function(_slicebutton,_i,_drumsound){
            _slicebutton.addEventListener("mousedown", function(){
               Playsound(_drumsound,_i);
            });
            
            _slicebutton.addEventListener("mouseup", function(){
               Stopsound(_drumsound,_i);
            });

            _slicebutton.addEventListener("touchstart", function(e){
               e.preventDefault();
               Playsound(_drumsound,_i);
            });

            _slicebutton.addEventListener("touchend", function(e){
               e.preventDefault();
               Stopsound(_drumsound,_i);
            });
            
        })(slicebutton,i,drumsound)

    };


    document.addEventListener("keydown", keydowntest);
    document.addEventListener("keyup",keyuptest);

    document.getElementById("piano").addEventListener("mousedown",pianokeydown);
    document.getElementById("piano").addEventListener("mouseup",pianokeyup);
    document.getElementById("piano").addEventListener("touchstart",function(e){
     e.preventDefault();   
     pianokeydown();
    });
    document.getElementById("piano").addEventListener("touchend",function(e){
     e.preventDefault();   
     pianokeyup();
    });


}

function Setpadplaymode(_playmode){
    playmode=_playmode;
    console.info("setpadplaymode ",playmode);

}

function pianokeydown(e){
    var rate = (e.target.id.replace("key_","") *0.06)+0.24;

    console.info("pianokeydown",e.target.id, rate);

    Playsound(drumsound,lastsliceplayed,rate)
}

function pianokeyup(e){
    console.info("pianokeyup",e.target.id);
    Stopsound(drumsound,lastsliceplayed)
}


function keydowntest(e){
    if(keysdownarray.indexOf(e.which)==-1){

        var rate = ((e.which-48) *0.06)+0.24;
        // Playsound(drumsound,e.which-48);
        Playsound(drumsound,lastsliceplayed,rate);
        keysdownarray.push(e.which)          
        console.log("Keydown",e.which-48,rate)
        
    }
    // console.log("keysdownarray",keysdownarray)
}

function keyuptest(e){
    var pos = keysdownarray.indexOf(e.which)
    keysdownarray.splice(pos,1);
    console.log("Keyup",e.which-48);
    // Stopsound(drumsound,e.which-48);
    Stopsound(drumsound,lastsliceplayed);

}

function setbuttonstate(slice,pressedstate){
    // console.log("setbuttonstate",slice)
    var but = document.getElementById("slice"+slice)
            if(pressedstate==true){
                but.className="pressed";
            }else{
                but.className="";
            }
}


function Playsound(which,slice,pitch){

        var pitch = pitch || "1";

        console.log("play sound ",which,slice,pitch);

        setbuttonstate(slice,true)
        lastsliceplayed=slice;
        
        var soundname = which;
        if(sound[soundname+slice]!=undefined){
            sound[soundname+slice].stop();
        }
        sound[soundname+slice] = context.createBufferSource();
        sound[soundname+slice].buffer = bufferLoader.bufferList[soundname];
        
        // console.log("Bufferlength of ",which,sound[soundname+slice].buffer.duration," pitch = ",pitch);
        
        if(pitch!=undefined){
             sound[soundname+slice].playbackRate.value=pitch;
        }
         var slicelength=sound[soundname+slice].buffer.duration/slices;

        // console.log("Slicelength = ",slicelength)

        var starttime = (slicelength*(slice-1));
        console.log("Currenttime = ",context.currentTime," starttime = ",starttime, " Endtime = ", starttime+slicelength)

        sound[soundname+slice].connect(context.destination);                    
        sound[soundname+slice].loop = true;
        if(playmode=="noteon"){
            sound[soundname+slice].start(0,starttime);
            sound[soundname+slice].loopStart = starttime;
            sound[soundname+slice].loopEnd = starttime+slicelength;
        }else{    
            sound[soundname+slice].start(0,starttime);
            
            if(pitch!=undefined){
                sound[soundname+slice].stop(context.currentTime+(slicelength/pitch));
            }else{
                sound[soundname+slice].stop(context.currentTime+slicelength);
            }
        }

        console.log("sound",sound);
}

function Stopsound(which,slice){
    setbuttonstate(slice,false)

    if(playmode=="noteon"){
        var soundname = which;    
        if(sound[soundname+slice]!=undefined){
                sound[soundname+slice].stop();
        }
    }
}

function Changeslider(which,value){
    console.info("Change slider = ",which,value)
}

return{
              init:Init,
         playsound:Playsound,
         stopsound:Stopsound,
    setpadplaymode:Setpadplaymode,
      changeslider:Changeslider
};


} )( window );
