var noteResolution = 0;     // 0 == 16th, 1 == 8th, 2 == quarter note
var tempo = 120.0;          // tempo (in beats per minute)
var ppb = 384;

Jackdaw.Scheduler = ( function( window, undefined ) {

var songplay=false;

var sound = {};
var current16thNote;            // What note is currently last scheduled?
var current16thNoteTotal;       //i added this to see the current total of notes played
var totalbeatsplayed;           //added to keep track of what beat you are on 
var notesInQueue = [];          // the notes that have been put into the web audio,

var bufferLoader;

var context = null;
var isPlaying = false;          // Are we currently playing?
var startTime;                  // The start time of the entire sequence.
var lookahead = 25.0;           // How frequently to call scheduling function 
                                //(in milliseconds)
var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
                                // This is calculated from lookahead, and overlaps 
                                // with next interval (in case the timer is late)
var nextNoteTime = 0.0;         // when the next note is due.
var noteLength = 0.5;           // length of "beep" (in seconds)
var last16thNoteDrawn = -1;     // the last "box" we drew on the screen
                                // and may or may not have played yet. {note, time}
var timerWorker = null;         // The Web Worker used to fire timer messages

var loopcount = 0;
var volumeNode;

// First, let's shim the requestAnimationFrame API, with a setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( callback ){
        window.setTimeout(callback, 1000 / 60);
    };
})();

function nextNote() {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 0.5 / tempo;    // Notice this picks up the CURRENT 
                                          // tempo value to calculate beat length.
    nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time
    current16thNoteTotal++;
    totalbeatsplayed = Math.floor(current16thNoteTotal/ppb)+1;
    current16thNote++;    // Advance the beat number, wrap to zero
    if (current16thNote >= ppb*patt.beats) {
        current16thNote = 0;
    }
}

function scheduleNote( beatNumber, time, totalsubbeat, totalbeatsplayed) {
    // console.log("scheduleNote", beatNumber, time);
    // push the note on the queue, even if we're not playing.
    // 
    if( (beatNumber)%(patt.snap)==0 ){
      // console.log("beatNumber", (beatNumber+1), (beatNumber+1)%(patt.snap) );
      notesInQueue.push( { note: beatNumber, time: time, subbeattotal:totalsubbeat, totalbeatsplayed:totalbeatsplayed } );

      if(songplay==true){
        Jackdaw.SongGrid.triggerpatternchange(totalbeatsplayed,totalsubbeat+1)
      }
    }


    if ( (noteResolution==1) && (beatNumber%2))
        return; // we're not playing non-8th 16th notes
    if ( (noteResolution==2) && (beatNumber%4))
        return; // we're not playing non-quarter 8th notes



    for (var p = 0; p < patt.pattern.length; p++) {
        for (var t = 0; t < patt.tracks; t++) {
            if(patt.pattern[p][0]==t+1){    
               if(patt.pattern[p][1]==Math.floor(beatNumber/ppb+1) && patt.pattern[p][2]==beatNumber%(ppb) ){
                    // console.log("p - ",beatNumber);
                    var soundname = Object.keys(sounds)[t];
                    sound[soundname] = context.createBufferSource();
                    sound[soundname].buffer = bufferLoader.bufferList[soundname];

                    sound[soundname].volumeNode = context.createGain();
                    sound[soundname].volumeNode.gain.value=patt.pattern[p][3];
                    sound[soundname].connect(sound[soundname].volumeNode);
                    sound[soundname].volumeNode.connect(context.destination);



                    // sound[soundname].connect(context.destination);
                    
                    sound[soundname].start( time );
                    sound[soundname].stop( time + noteLength );
                }                
            }
        }            
    }

    // if (beatNumber % 16 === 0){    
    //     // beat 0 == low pitch
    //     sound["kick"].start( time );
    //     sound["kick"].stop( time + noteLength );
    // }
    // else if (beatNumber % 4 === 0 ) {
    //     // quarter notes = medium pitch       
    //     sound["snaredry"].start( time );
    //     sound["snaredry"].stop( time + noteLength );    
    // }
    // else {
    //     // other 16th notes = high pitch
    // }                       
    // sound["hihat"].start( time );
    // sound["hihat"].stop( time + noteLength );        
}

function scheduler() {
    while (nextNoteTime < context.currentTime + scheduleAheadTime ) {
        scheduleNote( current16thNote, nextNoteTime, current16thNoteTotal,totalbeatsplayed );
        nextNote();
    }
}

function Play() {
    isPlaying = !isPlaying;
    songplay=false;
    ResetToStart();

    if (isPlaying) { // start playing
        nextNoteTime = context.currentTime;
        timerWorker.postMessage("start");
        return "<i class='icon-stop  on-left'></i>Stop pattern";
    } else {
        timerWorker.postMessage("stop");
        return "<i class='icon-play on-left'></i>Play pattern";
    }
}

function SongPlay() {
    isPlaying = !isPlaying;
    songplay=true;

    if (isPlaying) { // start playing
        Jackdaw.SongGrid.loadsong();
        if(current16thNoteTotal==undefined){
            current16thNote = 0;
            loopcount = 0;
            current16thNoteTotal = 0;   
        }
        nextNoteTime = context.currentTime;
        timerWorker.postMessage("start");
        return "<span class='icon-stop'></span>";
    } else {
        timerWorker.postMessage("stop");
        return "<span class='icon-play'></span>";
    }
}

function ResetToStart(){
        current16thNote = 0;
        loopcount = 0;
        current16thNoteTotal = 0;
        totalbeatsplayed=0;
        // var x = document.getElementsByTagName("STYLE")[0];
        // x.innerHTML=".beatnum1 { outline: solid #999999 3px!important;  }";
        // var x = document.getElementsByTagName("STYLE")[1];
        // x.innerHTML="#timelinebeat1 { border-left: solid red 1px!important;  }";
}

function draw() {
    var currentNote = last16thNoteDrawn;
    var currentTime = context.currentTime;

    while (notesInQueue.length && notesInQueue[0].time < currentTime) {
        currentNote = notesInQueue[0].note;
        totalsubdivsplayed =  notesInQueue[0].subbeattotal;
        totalbeatsplayednow =  notesInQueue[0].totalbeatsplayed;
        notesInQueue.splice(0,1);   // remove note from queue
    }

    
    if(last16thNoteDrawn != currentNote){
        var adjustedNote = currentNote+1;            
        // var x = document.getElementsByTagName("STYLE")[0];
        // x.innerHTML=".beatnum"+adjustedNote+"{ outline: solid #999999 3px!important;  }";

        // console.log("beatNumber", adjustedNote );
        if(songplay==true){
            Jackdaw.SongGrid.update(totalbeatsplayednow,totalsubdivsplayed+1,loopcount)         
        }  

        if(adjustedNote==1){
            loopcount++;
        }

    }

    requestAnimFrame(draw);
}

function Init(){
    
    context = new AudioContext();
    
//using the global sounds!!!

    bufferLoader = new BufferLoader(
        context,
        sounds,
        requestAnimFrame(draw)
    );
    bufferLoader.load();

    timerWorker = new Worker("js/jackdaw.scheduleworker.js");

    timerWorker.onmessage = function(e) {
        if (e.data == "tick") {
            // console.log("tick!");
            scheduler();
        }
        else
            console.log("message: " + e.data);
    };
    timerWorker.postMessage({"interval":lookahead});

}


return{
      init:Init,
      play:Play,
      songplay:SongPlay,
      resettostart:ResetToStart
};


} )( window );

