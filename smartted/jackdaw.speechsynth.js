Jackdaw.Speechsynth = ( function() {


    var synth = window.speechSynthesis;
    var inputForm
    var inputTxt
    var voiceSelect

    var pitch
    var pitchValue
    var rate
    var rateValue

    var voices = [];

    function Init(){
        console.log("Hello Speech synth");
       
        inputForm = document.querySelector('form');
        inputTxt = document.querySelector('.txt');
        voiceSelect = document.querySelector('select');

        pitch = document.querySelector('#pitch');
        pitchValue = document.querySelector('.pitch-value');
        rate = document.querySelector('#rate');
        rateValue = document.querySelector('.rate-value');

        voices = [];

        // inputForm.onsubmit = function(event) {
        //   event.preventDefault();

        //   speak();

        //   inputTxt.blur();
        // }

        pitch.onchange = function() {
          pitchValue.textContent = pitch.value;
        }

        rate.onchange = function() {
          rateValue.textContent = rate.value;
        }

        voiceSelect.onchange = function(){
          speak("Changed voice to this one");
        }
        populateVoiceList();
    } 

   function populateVoiceList() {
      voices = synth.getVoices();
      var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
      voiceSelect.innerHTML = '';
      for(i = 0; i < voices.length ; i++) {
        var option = document.createElement('option');
        option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
        
        if(voices[i].default) {
          option.textContent += ' -- DEFAULT';
        }

        option.setAttribute('data-lang', voices[i].lang);
        option.setAttribute('data-name', voices[i].name);
        voiceSelect.appendChild(option);
      }
      voiceSelect.selectedIndex = 3;
    }

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    function speak(what){

        var utterThis = new SpeechSynthesisUtterance(what);
        var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
        for(i = 0; i < voices.length ; i++) {
          if(voices[i].name === selectedOption) {
            utterThis.voice = voices[i];
          }
        }
        utterThis.pitch = pitch.value;
        utterThis.rate = rate.value;
        synth.speak(utterThis);
      
    }

   

    


    return {
                  init:Init,
                  speak:speak
    };
  
} ( Jackdaw.Speechsynth || {} ));
    
