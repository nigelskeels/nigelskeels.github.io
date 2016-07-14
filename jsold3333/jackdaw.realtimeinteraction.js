var sound = {};
// var slices = 40;
var lastsliceplayed=1;
var drumsound="drumkit3";
var bufferLoader;


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



function Playsound(slice,pitch,keyid){

        console.log("play sound ",slice,pitch,keyid);

        var soundname = trackvoices[currenttrackselected-1][0];
        var pitchmodeslice = trackvoices[currenttrackselected-1][1];
        var pitch = pitch || "1";

        if(pitchmodeslice==false){
            if(slice==false){
                slice=keyid;
            }else{
                keyid=slice;
            }
            pitch=1;
        }
        else{
            slice=pitchmodeslice; 
        } 

        Jackdaw.Ui.setbuttonstate(slice,true,keyid,"buttonRed")

        // console.log("play sound ",trackvoices[currenttrackselected-1][1], slice,pitch,keyid);

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
        sound[soundname+slice+"_"+pitch].connect(context.destination);                    
        sound[soundname+slice+"_"+pitch].loop = true;
        
        var amountslices = trackvoices[currenttrackselected-1][3];
        var slicelength=sound[soundname+slice+"_"+pitch].buffer.duration/amountslices;
        var starttime = (slicelength*(slice-1));
        
        console.info("Currenttime = ",context.currentTime," starttime = ",starttime, " Endtime = ", starttime+slice+length)

        //if(playmode=="noteon"){
        if(trackvoices[currenttrackselected-1][2]==false){
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

function Stopsound(slice,pitch,keyid){
    
    var pitch = pitch || "1";
    
        if(trackvoices[currenttrackselected-1][1]!=false){
            slice=trackvoices[currenttrackselected-1][1];
        }
        else{
            if(slice==false){
                slice=keyid;
            }else{
                keyid=slice;
            }
            pitch=1;
        } 

    Jackdaw.Ui.setbuttonstate(slice,false,keyid,"buttonRed")
    

    

    if(trackvoices[currenttrackselected-1][2]==false){
        var soundname = trackvoices[currenttrackselected-1][0];    
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
    startrecording:Startrecording,
     stoprecording:Stoprecording
};


} )(  );
