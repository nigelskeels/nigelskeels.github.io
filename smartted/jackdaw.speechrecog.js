Jackdaw={}
Jackdaw.Speechrecog = ( function() {

    var recognition = new webkitSpeechRecognition();
    recognition.lang = "en-GB";
    recognition.continuous = true;
    recognition.interimResults = true;
    
    // var output;
    var status;
    var curruserid;
    var currenttranslation = [];
    var transcriptionid;
    var speechend=false;
    var currentlystarted=false;

    function Init(){
        console.log("Hello Speech recog");
        recognition = new webkitSpeechRecognition();
        recognition.lang = "en-GB";
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        
        // var output;
        currenttranslation = [];
        speechend=false;
        currentlystarted=false;
    } 

    function Startrecog(userid,_transcriptionid){
        // if(Jackdaw.Options.speechrecognitionenabled()==true){
            if(currentlystarted==false){
                currentlystarted=true;
                curruserid=userid;
                transcriptionid=_transcriptionid;
                try {
                    recognition.start()
                }catch(err){
                    console.info("Start speech transcription",err)
                }
            }
        // }
    }

    function Stoprecog(userid,_transcriptionid){
        // if(Jackdaw.Options.speechrecognitionenabled()==true){
            currentlystarted=false;
            curruserid=userid;
            transcriptionid=_transcriptionid;
            recognition.stop();
        // }
    }

    recognition.onresult = function(event) { 
      var test = event;
      console.log("Speech recog event",test)
      // output.innerHTML="";

      currenttranslation=[];

      for (var i = 0; i < event.results.length; i++) {
         
          // output.innerHTML=event.results[i][0].transcript;
        var nativerecorderevent = new CustomEvent('speechrecogevent', { 'detail': event.results[i][0].transcript});
        document.body.dispatchEvent(nativerecorderevent);

         
          if(event.results[i].isFinal==true){
            
            currenttranslation.push(event.results[i][0].transcript);
            
         
          }
      };

    }


    // recognition.onaudiostart = function(event) { 
    //     console.log("Speech recog ","audiostart");
    // }

    // recognition.onsoundstart = function(event) { 
    //     console.log("Speech recog ","soundstart");
    // }

    // recognition.onspeechstart = function(event) { 
    //     console.log("Speech recog ","speechstart");
    // }

    recognition.onspeechend  = function(event) { 
        console.log("Speech recog ","speechend");

        speechend=true;

        
    }

    // recognition.onsoundend  = function(event) { 
    //    console.log("Speech recog ","soundend");
    // }

    // recognition.onaudioend = function(event) { 
    //    console.log("Speech recog ","audioend");
    // }

    // recognition.onnomatch = function(event) { 
    //     console.log("Speech recog ","nomatch");
    // }

    // recognition.onstart = function(event) { 
    //     console.log("Speech recog ","start");
    // }

    recognition.onend = function(event) { 
        console.log("Speech recog ","end");

        var joined;
        if(currenttranslation.length==1){
            joined = currenttranslation[0];
        }else{
            joined = currenttranslation.join();
        }

        var nativerecorderevent = new CustomEvent('speechrecogevent', { 'detail': joined});
        document.body.dispatchEvent(nativerecorderevent);

    }


    recognition.onerror = function(event) {
           console.warn("Speech to text error",event)
    }


    return {
                  init:Init,
            startrecog:Startrecog,
             stoprecog:Stoprecog
    };
  
} ( Jackdaw.Speechrecog || {} ));
    
