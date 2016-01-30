
Jackdaw.Ui = ( function( window, undefined ) {

var keysdownarray = [];

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
               Jackdaw.Scheduler.playsound(_drumsound,_i,1,13);
            });
            
            _slicebutton.addEventListener("mouseup", function(){
               Jackdaw.Scheduler.stopsound(_drumsound,_i,1,13);
            });

            _slicebutton.addEventListener("touchstart", function(e){
               e.preventDefault();
               Jackdaw.Scheduler.playsound(_drumsound,_i,1,13);
            });

            _slicebutton.addEventListener("touchend", function(e){
               e.preventDefault();
               Jackdaw.Scheduler.stopsound(_drumsound,_i,1,13);
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

    var functions_y_buttons = document.getElementById("functions_y").addEventListener("mousedown",y_but_down)
}

function y_but_down(e){
    var functions_y_buttons = e.target.parentNode.getElementsByTagName("button");
    for (var i = 0; i < functions_y_buttons.length; i++) {
        functions_y_buttons[i].className="";
    }

    console.info("y_but_down = ",e,e.target.id);
    e.target.className="buttonRed";
}


function Setpadplaymode(_playmode){
    playmode=_playmode;
    console.info("setpadplaymode ",playmode);

}

function pianokeydown(e){
    var rate = (e.target.id.replace("key_","") *0.06)+0.24;

    console.info("pianokeydown",e.target.id, rate);

    Jackdaw.Scheduler.playsound(drumsound,lastsliceplayed,rate,e.target.id.replace("key_",""))
}

function pianokeyup(e){
    var rate = (e.target.id.replace("key_","") *0.06)+0.24;
    
    console.info("pianokeyup",e.target.id);
    Jackdaw.Scheduler.stopsound(drumsound,lastsliceplayed,rate,e.target.id.replace("key_",""))
}


function keydowntest(e){
    if(keysdownarray.indexOf(e.which)==-1){

        var rate = ((e.which-48) *0.06)+0.24;
        // Playsound(drumsound,e.which-48);
        Jackdaw.Scheduler.playsound(drumsound,lastsliceplayed,rate,(e.which-48));
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
    Jackdaw.Scheduler.stopsound(drumsound,lastsliceplayed,rate,(e.which-48));

}

function Setbuttonstate(slice,pressedstate,keyid){
    // console.log("setbuttonstate",slice)
    var but = document.getElementById("slice"+slice);
            if(pressedstate==true){
                but.className="pressed";
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
