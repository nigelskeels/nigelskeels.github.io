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


var sounds = {"git":"sounds/Guitar1.wav","amen":"sounds/Amen-break.wav"};