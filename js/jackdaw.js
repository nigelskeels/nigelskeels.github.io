var Jackdaw = ( function( ) {

  function Init(){  
  	window.addEventListener("load", 
      function(){
  		  Jackdaw.Scheduler.init(); 
        Jackdaw.Midi.init(); 
        Jackdaw.Waveformdisplay.init();
        Jackdaw.Ui.init();           
      }
    );
  }

  return{
      init:Init
  };


} (  ));


var sounds = {"amen":"sounds/Amen-break.wav","git":"sounds/Guitar1.wav"};