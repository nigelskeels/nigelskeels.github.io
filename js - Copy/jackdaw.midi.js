Jackdaw.Midi = ( function( window, undefined ) {

var midi = null;  // global MIDIAccess object

var printout;

function Init(){
    
    printout = document.getElementById("midistatus");
    
    console.log("Hello midi")
    if (navigator.requestMIDIAccess){
        navigator.requestMIDIAccess().then( onMIDIInit, onMIDIReject );
    }
    else{
        printout.innerHTML="No MIDI support present in your browser.  You're gonna have a bad time.";
        // alert("No MIDI support present in your browser.  You're gonna have a bad time.")
    }
}


function onMIDIInit(midi) {
  midiAccess = midi;

  var haveAtLeastOneDevice=false;
  var inputs=midiAccess.inputs.values();
  for ( var input = inputs.next(); input && !input.done; input = inputs.next()) {
    input.value.onmidimessage = MIDIMessageEventHandler;
    haveAtLeastOneDevice = true;
  }
  if (!haveAtLeastOneDevice){
    printout.innerHTML="No MIDI devices present on your browser.";
    // alert("No MIDI input devices present.  You're gonna have a bad time.");
  }
}


function onMIDIReject(err) {
  alert("The MIDI system failed to start.  You're gonna have a bad time.");
}


function MIDIMessageEventHandler(event) {
  // Mask off the lower nibble (MIDI channel, which we don't care about)
  switch (event.data[0] & 0xf0) {
    case 0x90:
      if (event.data[2]!=0) {  // if velocity != 0, this is a note-on message
        console.log(event.data[1]);
        printout.innerHTML=event.data[1];
        var rate = ((event.data[1]-49) *0.06)+0.24;
        
        Jackdaw.Scheduler.playsound(drumsound,lastsliceplayed,rate,(event.data[1]-49));
        return;
      }
      // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
    case 0x80:
      console.log(event.data[1]);
      printout.innerHTML=event.data[1];
      var rate = ((event.data[1]-49) *0.06)+0.24;

      Jackdaw.Scheduler.stopsound(drumsound,lastsliceplayed,rate,(event.data[1]-49))
      return;
  }
}






return{
      init:Init
};


} )( window );
