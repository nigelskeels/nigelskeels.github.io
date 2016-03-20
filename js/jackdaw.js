var Jackdaw = ( function( ) {

  function Init(){  
  	window.addEventListener("load", 
      function(){
        Jackdaw.Storagemanager.init()  
        Jackdaw.Realtimeinteraction.init(); 
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


// var sounds = {"git":"sounds/Guitar1.wav","drumkit3":"sounds/drumkit3.wav","amen":"sounds/Amen-break.wav"};