Jackdaw.Midi = ( function( window, undefined ) {

  var midi = null;  // global MIDIAccess object
  var thisid = null;
  var printout;

  function Init(){
      
      printout = document.getElementById("midistatus");
      
      console.log("Hello midi")
      if (navigator.requestMIDIAccess){
          // navigator.requestMIDIAccess().then( onMIDISuccess, onMIDIFailure );
          navigator.requestMIDIAccess({ sysex: true }).then( onMIDISuccess, onMIDIFailure );
      }
      else{
          printout.innerHTML="No MIDI support present in your browser.  You're gonna have a bad time.";
          // alert("No MIDI support present in your browser.  You're gonna have a bad time.")
      }
  }


  function onMIDISuccess( midiAccess ) {
    console.log( "MIDI ready!" );
    midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)
    listInputsAndOutputs(midi);
    midi.onstatechange = function(e){
      console.log("MIDI device "+e.port.state);
      listInputsAndOutputs(midi);
    }
  }

  function onMIDIFailure(msg) {
    console.log( "Failed to get MIDI access - " + msg );
  }




  function listInputsAndOutputs( midiAccess ) {

      var haveAtLeastOneDevice=false;
    var inputs=midiAccess.inputs.values();
    for ( var input = inputs.next(); input && !input.done; input = inputs.next()) {
      input.value.onmidimessage = MIDIMessageEventHandler;
      haveAtLeastOneDevice = true;
      console.log("Midi Inputs =",input.value)
      // console.log(midiAccess.inputs.values())
    }

    if (!haveAtLeastOneDevice){
      // printout.innerHTML="No MIDI devices present on your browser.";
      console.log("No MIDI input devices present.  You're gonna have a bad time.");
    }

    var outputs=midiAccess.outputs.values();
    for ( var output = outputs.next(); output && !output.done; output = outputs.next()) {
      console.log("Midi outputs",output.value);
      if(output.value.name=="APC Key 25"){
        thisid=output.value.id;
      }
    }

    console.log("output id = ",thisid)

  }


  function sendlight(something,pad,onoff){
    // var noteOnMessage = [0x90, 36, 01];
    var noteOnMessage = [something, pad, onoff];   

    var output = midi.outputs.get(thisid);
    output.send( noteOnMessage );
  }

  
  var padlightsmap = {
                        0:32,1:33,2:34,3:35,4:36,5:37,6:38,7:39,
                        8:24,9:25,10:26,11:27,12:28,13:29,14:30,15:31,
                        16:16,17:17,18:18,19:19,20:20,21:21,22:22,23:23,
                        24:8,25:9,26:10,27:11,28:12,29:13,30:14,31:15,
                        32:0,33:1,34:2,35:3,36:4,37:5,38:6,39:7,
                        "play":91,"rec":93,"shift_big":98,
                        "x_1":64,"x_2":65,"x_3":66,"x_4":67,"x_5":68,"x_6":69,"x_7":70,"x_8":71,
                        "pattern":82,"step":83,"voice":84,"sample":85,"fx":86,"shift":81,

                      }
  

  function Setnumberpadlights(padlights){

      for (var i = 0; i < 40; i++) {
         var colorcode;
         switch(padlights[i]){
           case 0:
             //red
             colorcode=00;
             break;
           case 1:
             //red
             colorcode=03;
             break;
           case 2:
             //green
             colorcode=01;
             break;
           case 3:
             //yellow
             colorcode=05;
             break;
           case 4:
             //fashing red
             colorcode=04;
             break;
           case 5:
             //flashing green
             colorcode=02;
             break;
           case 6:
             //flashing yellow
             colorcode=06;
             break;
           default: 
             //blank off
         }
         if(padlightsmap[i]!=undefined){
           if (thisid){
            var output = midi.outputs.get(thisid);
            output.send( [144,padlightsmap[i],colorcode] );
           }
         }
      };
  }


  function Setotherlights(which,colorcode){
          if (thisid){
            var output = midi.outputs.get(thisid);
            output.send( [144,padlightsmap[which],colorcode] );
          }
  }


  // function sendsysexec(){
  //   //this is to set the template for the Akai LPD8
  //   var output = midi.outputs.get(thisid);
  //   output.send([240, 71, 127, 117, 97, 0, 58, 1, 0, 36, 0, 9, 0, 37, 1, 10, 0, 38, 2, 11, 0, 39, 3, 12, 0, 40, 4, 13, 0, 41, 5, 14, 0, 42, 6, 15, 0, 43, 7, 16, 0, 1, 0, 127, 2, 0, 127, 3, 0, 127, 4, 0, 127, 5, 0, 127, 6, 0, 127, 7, 0, 127, 8, 0, 127,247])

  //   //sysex example on ableton push
  //   // output.send([240, 71, 127, 21, (24+line_number), 0, (number_of_chars + 1), offset, char_1, char_2 … char_n, 247])
  // }

function reversemap(value){
    var key = Object.keys(padlightsmap).filter(function(key) {return padlightsmap[key] === value})[0];
    return key
}



function MIDIMessageEventHandler(event) {
  
 console.log("input event = ",event.data[0],event.data[1],event.data[2]);
 printout.innerHTML = "input event = "+event.data[0]+","+event.data[1]+","+event.data[2]
  // Mask off the lower nibble (MIDI channel, which we don't care about)
  switch (event.data[0] & 0xf0) {
    case 0x90:
      //note on
      if (event.data[2]!=0) {  // if velocity != 0, this is a note-on message
       
        printout.innerHTML=event.data[1];
        
        if(event.data[0]==145){
          //pianokey down
          var holdingobject={}
              holdingobject.target={};
              holdingobject.id={};
              holdingobject.target.id = "key_"+(event.data[1]-47) 
              Jackdaw.Ui.pianokeydown(holdingobject);
        }
        if(event.data[0]==144){
          //number key down
          if( isNaN(reversemap(event.data[1])) ){

              if(reversemap(event.data[1]).charAt(0)=="x"){
                  console.log("xxxxxxxxxxxxxxxxxxxxxx "+reversemap(event.data[1]))
                  Jackdaw.Ui.x_but_down(undefined,reversemap(event.data[1]));
              }else{
                  console.log("yyyyyyyyyyyyyyyyyyyyyy "+reversemap(event.data[1]))
              }

          }else{
            Jackdaw.Ui.numberbuttonpressdown(1+(parseInt(reversemap(event.data[1]))));
          }
        }    
        return;
      }
    case 0x80:
      //note off
      console.log(event.data[1]);
      printout.innerHTML=event.data[1];

      if(event.data[0]==129){
          //pianokey down
          var holdingobject={}
              holdingobject.target={};
              holdingobject.id={};
              holdingobject.target.id = "key_"+(event.data[1]-47) 
              Jackdaw.Ui.pianokeyup(holdingobject);
      }
      if(event.data[0]==128){
          //number key up
          Jackdaw.Ui.numberbuttonpressup(1+(parseInt(reversemap(event.data[1]))));
      }    
      return;

    case 0xB0:
          //cc value
          console.log("CC value = ",event.data[2], "knob = k",event.data[1]);

          var slider = document.getElementById("slider"+(event.data[1]-47))
          if(slider!=null){
            slider.value=event.data[2];
          }else{
            if(event.data[1]==64 && event.data[2]==127 ){
                alert("sustain button")
            }
          }
  }
}






return{
                    init:Init,
      setnumberpadlights:Setnumberpadlights,
          setotherlights:Setotherlights
};


} )( window );
