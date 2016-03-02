var sound = {};
var slices = 40;
var lastsliceplayed=1;
var drumsound="amen";
var bufferLoader;
var playmode="noteon";


Jackdaw.Realtimeinteraction = ( function() {

var context = null;
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

}

function Setpadplaymode(_playmode){
    playmode=_playmode;
    console.info("setpadplaymode ",playmode);

}


function Playsound(which,slice,pitch,keyid){

        var which = drumsound;
        var pitch = pitch || "1";

        console.log("play sound ",which,slice,pitch);

        Jackdaw.Ui.setbuttonstate(slice,true,keyid,"buttonRed")
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

    Jackdaw.Ui.setbuttonstate(slice,false,keyid,"buttonRed")

    if(playmode=="noteon"){
        var soundname = which;    
        if(sound[soundname+slice+"_"+pitch]!=undefined){
                sound[soundname+slice+"_"+pitch].stop();
                delete sound[soundname+slice+"_"+pitch];
        }
    }
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
    startrecording:Startrecording,
     stoprecording:Stoprecording
};


} )(  );
