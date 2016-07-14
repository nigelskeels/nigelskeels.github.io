var currenttrackselected = 1;

Jackdaw.Ui = ( function(  ) {

var keysdownarray = [];
var mode = "pattern";
var lastbeforeshift = "pattern";
var padlights = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var xbutlights = [0,0,0,0,0,0,0,0];
var lightsetting = [];
var stepassignment = [];
var beatpos = 1;
var deletemode = false;
var displayoffset = 0;

var labeltext = {   
                    "buttons":{
                        "pattern":[
                                    function(){
                                        //init pattern mode
                                        console.info("pattern trigger something");

                                        lightsetting = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] 
                                        var count=0;

                                        console.info("what patterns",patterns,selectedpattern);
                                        for(i in patterns){
                                             if( patterns.hasOwnProperty( i ) ) {
                                                console.info("patttty = ",i);
                                                if(i==selectedpattern){
                                                    lightsetting[count]=1;
                                                }else{
                                                    lightsetting[count]=2;
                                                }
                                                count++;
                                             }
                                        }
                                        Setpadlights(lightsetting)


                                    },
                                    function(which){
                                        //pattern mode number key press down
                                        console.info("pattern mode number button press down = ",which);
                                        selectedpattern=Object.keys(patterns)[which-1];
                                        labeltext.buttons["pattern"][0]();  
                                    },
                                    function(which){
                                        //pattern mode number key press up 
                                        console.info("pattern mode number button press up = ",which);
                                    },
                                    ["New"],["Copy"],["Insert"],["Move"],["Chain"],["Complete"],[""],["Delete"]
                                  ],
                           "step":[
                                    function(){
                                        //init step mode
                                        console.info("step trigger something");


                                        //get the pattern, check the beats and subbeats
                                        // console.info("selectedpattern =",selectedpattern, "step beats = ",ss," sub beats = ",ss);
                                        // console.info("selectedpattern =",selectedpattern,patterns[selectedpattern].beats,patterns[selectedpattern].snap);

                                        lightsetting = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                                        stepassignment = [];
                                       
                                        for (var p = 0; p < patterns[selectedpattern].pattern.length; p++) {
                                            var count = 0;
                                            for (var i = displayoffset; i < patterns[selectedpattern].beats; i++) {
                                                for (var s = 0; s < ppb; s++) {
                                                    if(s %patterns[selectedpattern].snap === 0){
                                                        
                                                        if(s==0){
                                                            lightsetting[count]=1;
                                                        }
                                                        
                                                        else{                                                    
                                                            lightsetting[count]=3;
                                                        }
                                                        count++;
                                                        stepassignment[count]=[i+1,s];
                                                        // console.info("test beat ui ",i,s," count = ",count)
                                                    }
                                                }
                                            };
                                        };




                                        //loop through patterns[selectedpattern].pattern find tracks that are currenttrackselected
                                        for (var p = 0; p < patterns[selectedpattern].pattern.length; p++) {
                                            if(patterns[selectedpattern].pattern[p][0]==currenttrackselected){

                                                // console.info("show beats in track",currenttrackselected,"  = ",patterns[selectedpattern].pattern[p])
                                         
                                                var count = 0;
                                                for (var i = displayoffset; i < patterns[selectedpattern].beats; i++) {
                                                    for (var s = 0; s < ppb; s++) {
                                                        if(s %patterns[selectedpattern].snap === 0){
                                                            
                                                            if(s==0){
                                                             
                                                                // lightsetting[count]=1;

                                                                // console.info("test ",patterns[selectedpattern].pattern[p],i+1)
                                                                if(patterns[selectedpattern].pattern[p][1]==i+1 && patterns[selectedpattern].pattern[p][2]==0){
                                                                    lightsetting[count]=2;
                                                                }
                                                            }
                                                            else{
                                                                if(patterns[selectedpattern].pattern[p][1]==i+1 && patterns[selectedpattern].pattern[p][2]==s){
                                                                    lightsetting[count]=2;
                                                                }

                                                                // console.info("beat ui ",i,s," count = ",count)
                                                            }
                                                            
                                                            count++;
                                                        }
                                                    }
                                                };

                                            }
                                        };
                                        
                                        Setpadlights(lightsetting)
                                        // console.info("stepassignment",stepassignment);

//384,192,96,48,24
                                    },
                                    function(which){
                                        console.info("step mode number button press down = ",which,stepassignment[which]);
                                        beatpos=which;

                                        function checkselected(){
                                            for (var p = 0; p < patterns[selectedpattern].pattern.length; p++) {
                                               if(patterns[selectedpattern].pattern[p][0]==currenttrackselected){
                                                 if(patterns[selectedpattern].pattern[p][1]==stepassignment[which][0] && patterns[selectedpattern].pattern[p][2]==stepassignment[which][1]){
                                                    return p;
                                                 }
                                               }
                                            }
                                            return "false";
                                        }
                                        
                                        var check = checkselected();

                                        if(check=="false"){
                                          console.log("Beat not selected");
                                          // patterns[selectedpattern].pattern.push([currenttrackselected,stepassignment[which][0],stepassignment[which][1],1,1,1])
                                        }
                                        else{
                                          console.log("Beat is selected");
                                          if(deletemode==true){
                                            patterns[selectedpattern].pattern.splice(check,1)
                                          }
                                        }
                                        //now reload the lights
                                        labeltext.buttons["step"][0]();
                                    },
                                    function(which){
                                        console.info("step mode number button press up = ",which);
                                    },
                                    ["Up",
                                        function(){
                                            if(patterns[selectedpattern].beats>displayoffset+1){
                                                displayoffset=displayoffset+1;
                                                labeltext.buttons["step"][0]();
                                                console.info("displayoffset",displayoffset); 
                                            }
                                        }
                                    ],
                                    ["Down",
                                        function(){
                                            if(displayoffset>0){
                                                displayoffset=displayoffset-1;
                                                labeltext.buttons["step"][0](); 
                                                console.info("displayoffset",displayoffset); 
                                            } 
                                        }
                                    ],
                                    ["Quantalise +",
                                        function(){
                                            if(patterns[selectedpattern].snap!=24){
                                                patterns[selectedpattern].snap=patterns[selectedpattern].snap/2;
                                                labeltext.buttons["step"][0]();  
                                            }
                                            console.info("snap for quant = ",patterns[selectedpattern].snap)
                                        }
                                    ],
                                    ["Quantalise -",
                                        function(){
                                            //options 24 = 1/16, 48 = 1/8, 96 = 1/4, 192 = 1/2, 384 = 1/1
                                            if(patterns[selectedpattern].snap!=384){
                                                patterns[selectedpattern].snap=patterns[selectedpattern].snap*2;
                                                labeltext.buttons["step"][0]();  
                                            }
                                            console.info("snap for quant = ",patterns[selectedpattern].snap)
                                        }
                                    ],
                                    ["Length"],["Active Step"],[""],
                                    ["Delete",
                                        function(){
                                                    console.info("Delete button down - stepmode");
                                                    deletemode=true;
                                                    set_xlabels(mode)
                                        },
                                        function(){   
                                                    console.info("Delete button Up - stepmode");
                                                    deletemode=false;
                                                    set_xlabels(mode)
                                        }
                                    ]
                                  ],
                          "voice":[
                                    function(){
                                        console.info("Voice trigger something",bufferLoader.bufferList);
                                        lightsetting = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] 
                                        
                                        var count=0;
                                        for(i in bufferLoader.bufferList){
                                            if( bufferLoader.bufferList.hasOwnProperty( i ) ) {
                                                // console.info("Voice trigger buffy = ",i);
                                                lightsetting[count]=1;
                                                count++;
                                            } 
                                        }

                                        Setpadlights(lightsetting)

                                    },
                                    function(which){
                                        var keys = Object.keys( bufferLoader.bufferList );
                                        console.info("voice mode number button press down = ",which,keys[which-1]);
                                        trackvoices[currenttrackselected-1][0]=keys[which-1];
                                        Jackdaw.Realtimeinteraction.playsound(1,1,13);

                                    },
                                    function(which){
                                        console.info("voice mode number button press up = ",which);
                                    },
                                    ["Track 1"],["Track 2"],["Track 3"],["Track 4"],["Track 5"],["Track 6"],["Track 7"],["Track 8"]
                                  ],
                         "sample":[
                                    function(){
                                        console.info("sample trigger something");

                                        //read how many slices
                                        //set the lights to show it
                                        lightsetting = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
                                        for (var i = 0; i < trackvoices[currenttrackselected-1][3]; i++) {
                                            lightsetting[i]=2;
                                        };
                                        Setpadlights(lightsetting);
                                        
                                    },
                                    function(which){
                                        console.info("sample mode number button press down = ",which);
                                        //if not in drum mode
                                        trackvoices[currenttrackselected-1][1]=which;

                                        Jackdaw.Realtimeinteraction.playsound(which,1,13);

                                    },
                                    function(which){
                                        console.info("sample mode number button press up = ",which);
                                        Jackdaw.Realtimeinteraction.stopsound(which,1,13);
                                    },
                                    ["Slices +",function(){
                                        trackvoices[currenttrackselected-1][3]++;
                                        //now reload the lights
                                        labeltext.buttons["sample"][0]();
                                    }],
                                    ["Slices -",function(){
                                        trackvoices[currenttrackselected-1][3]--;
                                        //now reload the lights
                                        labeltext.buttons["sample"][0]();
                                    }],
                                    ["Import"],
                                    ["Insert"],
                                    ["Drums", function(){ 
                                                              console.log('hello keymode');
                                                              if(trackvoices[currenttrackselected-1][1]!=false){
                                                                trackvoices[currenttrackselected-1][1]=false;
                                                              }else{
                                                                trackvoices[currenttrackselected-1][1]=beatpos;
                                                              }
                                                              set_xlabels(mode)
                                                              // Setpadlights([1,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
                                                          }
                                    ],
                                    ["Oneshot", function(){
                                                            console.info("Hello loopmode");
                                                            if(trackvoices[currenttrackselected-1][2]==true){
                                                                trackvoices[currenttrackselected-1][2]=false;
                                                            }else{
                                                                trackvoices[currenttrackselected-1][2]=true;
                                                            }
                                                            set_xlabels(mode);
                                                        }

                                    ],["Reverse"],["Delete"]
                                  ],
                             "fx":[
                                    function(){
                                        console.info("fx trigger something");
                                        lightsetting = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
                                        Setpadlights(lightsetting);
                                    },
                                    function(which){
                                        console.info("fx mode number button press down = ",which);
                                    },
                                    function(which){
                                        console.info("fx mode number button press up = ",which);
                                    },

                                    ["Track 1"],["Track 2"],["Track 3"],["Track 4"],["Track 5"],["Track 6"],["Track 7"],["Track 8"]
                                  ],
                          "shift":[
                                    function(){
                                        console.info("shift trigger something");
                                    },
                                    function(which){
                                        console.info("shift mode number button press down = ",which);
                                    },
                                    function(which){
                                        console.info("shift mode number button press up = ",which);
                                    },
                                    ["Track 1"],["Track 2"],["Track 3"],["Track 4"],["Track 5"],["Track 6"],["Track 7"],["Track 8"]
                                  ]
                     },
                     "sliders":{
                        "pattern":[["Vol 1"],["Vol 2"],["Vol 3"],["Vol 4"],["Vol 5"],["Vol 6"],["Vol 7"],["Vol 8"]],
                           "step":[["Vol 1"],["Vol 2"],["Vol 3"],["Vol 4"],["Vol 5"],["Vol 6"],["Vol 7"],["Vol 8"]],
                          "voice":[["Vol 1"],["Vol 2"],["Vol 3"],["Vol 4"],["Vol 5"],["Vol 6"],["Vol 7"],["Vol 8"]],
                         "sample":[["Start"],["Start Fine"],["Length"],["Length Fine"],["Attack"],["Decay"],["Sustain"],["Release"]],
                             "fx":[["Vol 1"],["Vol 2"],["Vol 3"],["Vol 4"],["Vol 5"],["Vol 6"],["Vol 7"],["Vol 8"]],
                          "shift":[["Vol 1"],["Vol 2"],["Vol 3"],["Vol 4"],["Vol 5"],["Vol 6"],["Vol 7"],["Vol 8"]]  
                     }
            }



function Init(){

    console.log("Hello ui");

    var slices = trackvoices[currenttrackselected-1][3];

    for (var i = 1; i <= slices; i++) {
        var slicebutton = document.createElement("button");
        slicebutton.classname=drumsound;
        slicebutton.innerHTML=i;
        slicebutton.id="slice"+i;
        document.getElementById("butts").appendChild(slicebutton);

        (function(_slicebutton,_i){
            
            _slicebutton.addEventListener("mousedown", function(){
                Numberbuttonpressdown(_i);
            });
            
            _slicebutton.addEventListener("mouseup", function(){
                Numberbuttonpressup(_i);
            });

            _slicebutton.addEventListener("touchstart", function(e){
               e.preventDefault();
               Numberbuttonpressdown(_i);
            });

            _slicebutton.addEventListener("touchend", function(e){
               e.preventDefault();
               Numberbuttonpressup(_i);
            });
            
        })(slicebutton,i)

    };
    
    Setpadlights();

    document.addEventListener("keydown", keydowntest);
    document.addEventListener("keyup",keyuptest);

    document.getElementById("piano").addEventListener("mousedown",Pianokeydown);
    document.getElementById("piano").addEventListener("mouseup",Pianokeyup);
    document.getElementById("piano").addEventListener("touchstart",function(e){
        e.preventDefault();
        Pianokeydown(e);
    });
    document.getElementById("piano").addEventListener("touchend",function(e){   
        e.preventDefault();
        Pianokeyup(e);
    });

    var functions_y_buttons = document.getElementById("functions_y").addEventListener("mousedown",Y_but_down);
    var functions_y_buttons = document.getElementById("functions_y").addEventListener("mouseup",Y_but_up);
    var functions_x_buttons = document.getElementById("functions_x").addEventListener("mousedown",X_but_down);
    var functions_x_buttons = document.getElementById("functions_x").addEventListener("mouseup",X_but_up);

    set_xlabels("pattern");

    var transportcontrols = document.getElementById("transport").addEventListener("mousedown",transportbuts_mousedown);
    
    //now start in pattern mode
    labeltext.buttons["pattern"][0]();  
}


function Numberbuttonpressdown(i){
   labeltext.buttons[mode][1](i);
}

function Numberbuttonpressup(i){
   labeltext.buttons[mode][2](i);
}


function transportbuts_mousedown(e){
    var functions_y_buttons = e.target.parentNode.getElementsByTagName("button");
    if(e.target.localName=="button"){
        console.log("transportbuts_mousedown",e.target.id);
        if(mode=="sample"){
            if(e.target.id=="record"){
                Jackdaw.Realtimeinteraction.startrecording();
            }
            if(e.target.id=="playstop"){
                Jackdaw.Realtimeinteraction.stoprecording();
            }
        }
        else{
            if(e.target.id=="playstop"){
                console.info("play pattern")
                Jackdaw.Scheduler.play(); 
            }

        }

    }

}


function Y_but_down(e){
    var functions_y_buttons = e.target.parentNode.getElementsByTagName("button");
    if(e.target.localName=="button"){
        
        labeltext.buttons[e.target.id][0]();


        if(e.target.id!="shift"){        
            for (var i = 0; i < functions_y_buttons.length; i++) {
                functions_y_buttons[i].className="";
            }
            lastbeforeshift=e.target.id;

            // console.info("Y_but_down = ",e,e.target.id);
        }
        e.target.className="buttonRed";
        set_xlabels(e.target.id);
    }
}

function Y_but_up(e){
    var functions_y_buttons = e.target.parentNode.getElementsByTagName("button");
    if(e.target.localName=="button"){
        
        if(e.target.id=="shift"){    
            console.log("shift but up");        
            set_xlabels(lastbeforeshift);
            e.target.className="";
        }
    }
}


function set_xlabels(_mode){
    mode=_mode;
 
    //reset all x button leds
    var xbutlightsetting = [0,0,0,0,0,0,0,0];

    if(mode =="shift" || mode=="voice" || mode=="fx" ){
        xbutlightsetting[currenttrackselected-1] = 1;
    }

    if(mode=="sample"){
        
        if(trackvoices[currenttrackselected-1][1]==false){
            //drummode
            xbutlightsetting[4]=1;               

        }
        if(trackvoices[currenttrackselected-1][2]==true){
            //oneshot
            xbutlightsetting[5]=1;               
        }
    }

    if(mode=="song" || mode=="step" || mode=="sample"){
        if(deletemode==true){
            // x_buttons[7].className="buttonRedblink";
            xbutlightsetting[7] = 4;
        }
    }

    Setxbutlights(xbutlightsetting);

    var functions_x_labels = document.getElementById("functions_x").getElementsByTagName("label");
    for (var i = 0; i < functions_x_labels.length; i++) {
        functions_x_labels[i].innerHTML=labeltext.buttons[mode][i+3][0];
        // console.info("set_xlabels",labeltext.buttons[mode][i][0]);
    }

    var functions_x_sliders = document.getElementById("sliders").getElementsByTagName("label");
    for (var i = 0; i < functions_x_sliders.length; i++) {
        functions_x_sliders[i].innerHTML=labeltext.sliders[mode][i][0];
        // console.info("functions_x_sliders",labeltext.sliders[mode][i][0]);
    }
}


function X_but_down(e,midipressed){
   
    if(midipressed!=undefined || e.target.localName=="button"){
        // console.log("xbut test", e.target.id.slice(1) )
        // console.log("xbut", labeltext["buttons"][mode][(which)][0])
        if(midipressed==undefined){
            var which = parseInt(e.target.id.slice(1))+2;
        }else{
            // console.log("midi",midipressed.replace("x_", "") );
            var which = parseInt(midipressed.replace("x_", ""))+2;
        }

        if(labeltext["buttons"][mode][which][1]!=undefined){
            //this triggers the function if there is one stored in the array.
            if(labeltext["buttons"][mode][which][1]!=undefined){
                // console.info("xbut function to call", labeltext["buttons"][mode][e.target.id.slice(1)-1][1])
                labeltext["buttons"][mode][which][1]();
            }
        }

        if(mode=="shift" || mode=="voice" || mode=="fx" ){
           console.log("shifting",e.target.id.slice(1)); 
           currenttrackselected=e.target.id.slice(1);
           set_xlabels(mode);
        }
    }
}

function X_but_up(e){
    if(e.target.localName=="button"){
        var which = parseInt(e.target.id.slice(1))+2;
        // console.log("xbut", labeltext["buttons"][mode][(which)][0])
        if(labeltext["buttons"][mode][which][1]!=undefined){
            if(labeltext["buttons"][mode][which][2]!=undefined){
                labeltext["buttons"][mode][which][2]();
            }
        }
    }
}



function Setpadlights(_padlights){
    // var padlights = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    if(_padlights){
        padlights = _padlights;
    }

    Jackdaw.Midi.setnumberpadlights(padlights);
    
    var butts = document.getElementById("butts").getElementsByTagName("button");
    for (var i = 0; i < butts.length; i++) {
        butts[i].className = returnlightcolour(padlights[i])
    };
}

function Setxbutlights(_xbutlights){
    if(_xbutlights){
        xbutlights = _xbutlights;
    }

    var butts = document.getElementById("functions_x").getElementsByTagName("button");
    for (var i = 0; i < butts.length; i++) {
        butts[i].className = returnlightcolour(xbutlights[i])
    };
}

function returnlightcolour(which){
    var colourtoreturn;
    switch(which) {
        case 1:
            //red
            colourtoreturn="buttonRed";
            break;
        case 2:
            //green
            colourtoreturn="buttonGreen";
            break;
        case 3:
            //flash red
            colourtoreturn="buttonYellow";
            break;
        case 4:
            //flash red
            colourtoreturn="buttonRedblink";
            break;
        case 5:
            //flash green
            colourtoreturn="buttonGreenblink";
            break;
        case 5:
            //flash green
            colourtoreturn="buttonYellowblink";
            break;
        default:
            //off
            colourtoreturn="";
    }
    return colourtoreturn;
}


function Setpadplaymode(_playmode){
    playmode=_playmode;
    console.info("setpadplaymode ",playmode);
}

function Pianokeydown(e){
    //midi key presses need to come in here too!
    var rate = (e.target.id.replace("key_","") *0.06)+0.24;
    var keyid = e.target.id.replace("key_","");

    console.info("Pianokeydown",e.target.id, rate);
     
    if(mode=="step"){
        console.info("piano down = ",e.target.id," at step = ",beatpos);
        patterns[selectedpattern].pattern.push([currenttrackselected,stepassignment[beatpos][0],stepassignment[beatpos][1],1,1,keyid])
        //set lights on buttons
        labeltext.buttons["step"][0]();
    } 

    Jackdaw.Realtimeinteraction.playsound(false,rate,e.target.id.replace("key_",""))
}

function Pianokeyup(e){
    var rate = (e.target.id.replace("key_","") *0.06)+0.24;
    console.info("Pianokeyup",e.target.id);
    Jackdaw.Realtimeinteraction.stopsound(false,rate,e.target.id.replace("key_",""))
}


function keydowntest(e){
    if(keysdownarray.indexOf(e.which)==-1){
        var rate = ((e.which-48) *0.06)+0.24;
        // Playsound(drumsound,e.which-48);
        Jackdaw.Realtimeinteraction.playsound(rate,(e.which-48));
        keysdownarray.push(e.which)          
        console.log("Keydown",e.which-48,rate)
    }
    // console.log("keysdownarray",keysdownarray)
}

function keyuptest(e){
    var rate = ((e.which-48) *0.06)+0.24;
    var pos = keysdownarray.indexOf(e.which)
    keysdownarray.splice(pos,1);
    console.log("Keyup",e.which-48);
    // Stopsound(drumsound,e.which-48);
    Jackdaw.Realtimeinteraction.stopsound(rate,(e.which-48));
}

function Setbuttonstate(slice,pressedstate,keyid,colour){
    // console.log("setbuttonstate",slice)
    // var but = document.getElementById("slice"+slice);
    if(mode=="sample"){

            if(pressedstate==true){
                // but.className=colour;
                if(colour=="buttonRed"){
                    padlights[slice-1]=1;
                }
                if(colour=="buttonGreen"){
                    padlights[slice-1]=2;
                }
            }else{
                padlights[slice-1]=0;
                if(mode=="sample"){
                    //reset lights to show sample
                    labeltext.buttons["sample"][0]();              
                }
            }
            Setpadlights()

            var key = document.getElementById("key_"+keyid);

            if(key!=null){
                console.info("keyid",keyid,key)
                if(pressedstate==true){
                    key.className="anchor down";
                }else{
                    key.className="anchor";
                }
            }
    }    

}


function Changeslider(which,value){
    console.info("Change slider = ",which,value)
}

function Beatpositionindicator(_beatpos){
    // console.info("pos =",beatpos,patterns[selectedpattern].snap,displayoffset);
    beatpos=_beatpos;
    beatposoffset=_beatpos-((ppb / patterns[selectedpattern].snap) * displayoffset);
    
    console.info("pos calc =",beatpos,beatposoffset );
    
    if(beatposoffset>=0 || beatpos==0){

        if(mode=="step"){
            var currentbeatlights = lightsetting.slice();
            currentbeatlights[beatposoffset]=1;
            Setpadlights(currentbeatlights);
        }
    }
}


return{
                     init:Init,
           setbuttonstate:Setbuttonstate,
             changeslider:Changeslider,
             setpadlights:Setpadlights,
    beatpositionindicator:Beatpositionindicator,
             pianokeydown:Pianokeydown,
               pianokeyup:Pianokeyup,
      numberbuttonpressup:Numberbuttonpressup,
    numberbuttonpressdown:Numberbuttonpressdown,
               x_but_down:X_but_down,
                 x_but_up:X_but_up,
               y_but_down:Y_but_down,
                 y_but_up:Y_but_up
};


} )(  );
