
Jackdaw.Ui = ( function( window, undefined ) {

var keysdownarray = [];
var mode = "pattern";
var labeltext;

function Init(){

    console.log("Hello ui");

    for (var i = 1; i <= slices; i++) {
        var slicebutton = document.createElement("button");
        slicebutton.classname=drumsound;
        slicebutton.innerHTML=i;
        slicebutton.id="slice"+i;
        document.getElementById("butts").appendChild(slicebutton);

        (function(_slicebutton,_i,_drumsound){
            
            _slicebutton.addEventListener("mousedown", function(){
               Jackdaw.Realtimeinteraction.playsound(_drumsound,_i,1,13);
            });
            
            _slicebutton.addEventListener("mouseup", function(){
               Jackdaw.Realtimeinteraction.stopsound(_drumsound,_i,1,13);
            });

            _slicebutton.addEventListener("touchstart", function(e){
               e.preventDefault();
               Jackdaw.Realtimeinteraction.playsound(_drumsound,_i,1,13);
            });

            _slicebutton.addEventListener("touchend", function(e){
               e.preventDefault();
               Jackdaw.Realtimeinteraction.stopsound(_drumsound,_i,1,13);
            });
            
        })(slicebutton,i,drumsound)

    };


    document.addEventListener("keydown", keydowntest);
    document.addEventListener("keyup",keyuptest);

    document.getElementById("piano").addEventListener("mousedown",pianokeydown);
    document.getElementById("piano").addEventListener("mouseup",pianokeyup);
    document.getElementById("piano").addEventListener("touchstart",function(e){
        e.preventDefault();
        pianokeydown(e);
    });
    document.getElementById("piano").addEventListener("touchend",function(e){   
        e.preventDefault();
        pianokeyup(e);
    });

    var functions_y_buttons = document.getElementById("functions_y").addEventListener("mousedown",y_but_down);
    var functions_x_buttons = document.getElementById("functions_x").addEventListener("mousedown",x_but_down);

    set_xlabels("pattern");
}

function y_but_down(e){
    var functions_y_buttons = e.target.parentNode.getElementsByTagName("button");
    if(e.target.localName=="button"){
        for (var i = 0; i < functions_y_buttons.length; i++) {
            functions_y_buttons[i].className="";
        }
        console.info("y_but_down = ",e,e.target.id);
            e.target.className="buttonRed";
            
        set_xlabels(e.target.id);
    }
}

function x_but_down(e){
    var functions_x_buttons = e.target.parentNode.getElementsByTagName("button");
    if(e.target.localName=="button"){
        // for (var i = 0; i < functions_x_buttons.length; i++) {
        //     functions_x_buttons[i].className="";
        // }
        // console.info("x_but_down = ",e,e.target.id.slice(1));
        // e.target.className="buttonRed";
        console.log("xbut", labeltext["buttons"][mode][e.target.id.slice(1)-1][0])
        if(labeltext["buttons"][mode][e.target.id.slice(1)-1][1]!=undefined){
            console.log("xbut function to call", labeltext["buttons"][mode][e.target.id.slice(1)-1][1])
            labeltext["buttons"][mode][e.target.id.slice(1)-1][1];
        }
    }
}


function set_xlabels(_mode){
    mode=_mode;

    labeltext = {   
                        "buttons":{
                            "pattern":[["New"],["Copy"],["Insert"],["Move"],["Chain"],["Complete"],[""],["Delete"],["Shift"]],
                               "step":[["Track 1"],["Track 2"],["Track 3"],["Track 4"],["Track 5"],["Track 6"],["Track 7"],["Track 8"],["Shift"]],
                              "voice":[["Quantalise +"],["Quantalise -"],["Length"],["Active Step"],[""],[""],[""],["Delete"],["Shift"]],
                             "sample":[["Slices +"],["Slices -"],["Import"],["Insert"],["Keymode","function(){console.log('hello')()}"],["Drummode"],["Reverse"],["Delete"],["Shift"]],
                                 "fx":[["Track 1"],["Track 2"],["Track 3"],["Track 4"],["Track 5"],["Track 6"],["Track 7"],["Track 8"],["Shift"]]
                         },
                         "sliders":{
                            "pattern":[["Vol 1"],["Vol 2"],["Vol 3"],["Vol 4"],["Vol 5"],["Vol 6"],["Vol 7"],["Vol 8"]],
                               "step":[["Vol 1"],["Vol 2"],["Vol 3"],["Vol 4"],["Vol 5"],["Vol 6"],["Vol 7"],["Vol 8"]],
                              "voice":[["Vol 1"],["Vol 2"],["Vol 3"],["Vol 4"],["Vol 5"],["Vol 6"],["Vol 7"],["Vol 8"]],
                             "sample":[["Start"],["Start Fine"],["Length"],["Length Fine"],["Attack"],["Decay"],["Sustain"],["Release"]],
                                 "fx":[["Vol 1"],["Vol 2"],["Vol 3"],["Vol 4"],["Vol 5"],["Vol 6"],["Vol 7"],["Vol 8"]] 
                         }
                    }


    

    var functions_x_labels = document.getElementById("functions_x").getElementsByTagName("label");
    for (var i = 0; i < functions_x_labels.length; i++) {
        functions_x_labels[i].innerHTML=labeltext.buttons[mode][i][0];
        console.info("set_xlabels",functions_x_labels[i][0]);
    }

    var functions_x_sliders = document.getElementById("sliders").getElementsByTagName("label");
    for (var i = 0; i < functions_x_sliders.length; i++) {
        functions_x_sliders[i].innerHTML=labeltext.sliders[mode][i][0];
        console.info("functions_x_sliders",functions_x_sliders[i][0]);
    }
}


function Setpadplaymode(_playmode){
    playmode=_playmode;
    console.info("setpadplaymode ",playmode);

}

function pianokeydown(e){
    var rate = (e.target.id.replace("key_","") *0.06)+0.24;

    console.info("pianokeydown",e.target.id, rate);

    Jackdaw.Realtimeinteraction.playsound(drumsound,lastsliceplayed,rate,e.target.id.replace("key_",""))
}

function pianokeyup(e){
    var rate = (e.target.id.replace("key_","") *0.06)+0.24;
    
    console.info("pianokeyup",e.target.id);
    Jackdaw.Realtimeinteraction.stopsound(drumsound,lastsliceplayed,rate,e.target.id.replace("key_",""))
}


function keydowntest(e){
    if(keysdownarray.indexOf(e.which)==-1){

        var rate = ((e.which-48) *0.06)+0.24;
        // Playsound(drumsound,e.which-48);
        Jackdaw.Realtimeinteraction.playsound(drumsound,lastsliceplayed,rate,(e.which-48));
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
    Jackdaw.Realtimeinteraction.stopsound(drumsound,lastsliceplayed,rate,(e.which-48));

}

function Setbuttonstate(slice,pressedstate,keyid,colour){
    // console.log("setbuttonstate",slice)
    var but = document.getElementById("slice"+slice);
            if(pressedstate==true){

                but.className=colour;
            }else{
                but.className="";
            }

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


function Changeslider(which,value){
    console.info("Change slider = ",which,value)
}




return{
              init:Init,
    setbuttonstate:Setbuttonstate,
      changeslider:Changeslider
};


} )( window );
