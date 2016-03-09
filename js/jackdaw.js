var Jackdaw = ( function( ) {

  function Init(){  
  	window.addEventListener("load", 
      function(){
  		  Jackdaw.Realtimeinteraction.init(); 
        Jackdaw.Scheduler.init();
        Jackdaw.Storagemanager.init()  
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