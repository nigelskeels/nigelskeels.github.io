var patt;

Jackdaw.DrumGrid = ( function( ) {

  var Which;
      
  function Init(patterns,which,update){

    //buildgrid
    //set checkboxes
    if(which==undefined){
      which=Object.keys(patterns)[0];  
    }
    Which=which;
    patt=patterns[which];
    
        //might need to properly remove grid and re-add it to clear out all the listeners and prevent a memory leak?
        var grid = document.getElementById("grid")
        grid.innerHTML="";
        
        document.getElementById("beatName").value = which;
        
        var tracks = document.getElementById("tracks");
        var beats = document.getElementById("beats");
        var snap = document.getElementById("snap");

        if(update){
          patt.tracks = parseInt(tracks.value) 
          patt.beats = parseInt(beats.value)
          patt.snap = parseInt(snap.value)
        }else{ 
            tracks.value = patt.tracks;
            beats.value = patt.beats;
            snap.value = patt.snap;
        }
        

        for (var t = 1; t < patt.tracks+1; t++) {
          var track = document.createElement("div");
          track.className="track";
          var count=0;

          // var drumname ="";
          if(Object.keys(sounds)[t-1]!=undefined){
            drumname =Object.keys(sounds)[t-1];
            track.innerHTML="<span class='drumsoundnames'>"+drumname+"</span>";
          }
          // console.log("track",t);

          for (var b = 1; b < patt.beats+1; b++) {
            count++;
            var beat = document.createElement("input");
            beat.type="checkbox";
            beat.id = "track"+t+"_beat"+b+"_subdiv0";
            beat.className = "beat beatnum"+count;
            
            beat.title="70";
            beat.addEventListener("mouseover",_addwheellistening);
            beat.addEventListener("mouseout",_addwheellistening);
            
            // console.log("beat",b);
            track.appendChild(beat);
            
            for (var s = 1; s < ppb; s++) {
              count++;
              if(s %patt.snap === 0){
                var subdivs = document.createElement("input");
                subdivs.type="checkbox";
                subdivs.id = "track"+t+"_beat"+b+"_subdiv"+s;
                subdivs.className = "beatnum"+count;
                
                subdivs.title = "70";
                subdivs.addEventListener("mouseover",_addwheellistening);
                subdivs.addEventListener("mouseout",_addwheellistening);
                
                track.appendChild(subdivs);
              }
              // console.log("subdivs",s);
            };
          };
          grid.appendChild(track);
        };
    
    _setpattern();
  }

  function _addwheellistening(w){
    console.log("addwheellistening",w.target.id, "volume = ",parseInt(w.target.title));
    if(w.type=="mouseover"){  
      w.target.addEventListener("wheel", _wheelmove);
    }else{
      w.target.removeEventListener("wheel", _wheelmove);
    }
  }

  function _wheelmove(w){
    var volumeamount =  parseInt(w.target.title);
    console.log(volumeamount,"wheelmove",w.target.id, w.deltaY , w);
    
    if(w.deltaY<0){
      if(volumeamount<100){
        volumeamount = volumeamount +1;
        console.log("increasing");
      }
    }
    if(w.deltaY>0){
      if(volumeamount>0){
        volumeamount = volumeamount -1;
        console.log("decreasing");  
      }
    }
    w.target.title=volumeamount;
    // w.target.value=volumeamount;
  }

  function _setpattern(){
    for (var i = 0; i < patt.pattern.length; i++) {
       t = patt.pattern[i][0]
       b = patt.pattern[i][1]
       s = patt.pattern[i][2]
       thisbox = document.getElementById("track"+t+"_beat"+b+"_subdiv"+s);
       if(thisbox!=undefined){
          thisbox.checked=true;
          thisbox.title=patt.pattern[i][3]*100;
       }
    };
  }

  function Getpattern(){
    var patttosave = {};
    patttosave.pattern=[]
    
    for (var t = 1; t < patt.tracks+1; t++) {
      for (var b = 1; b < patt.beats+1; b++) {   
          for (var s = 0; s < ppb; s++) {
            var box = document.getElementById("track"+t+"_beat"+b+"_subdiv"+s);
            if(box!=undefined){
              if(box.checked==true){
                   console.log("box checked [",t,b,s,box.title/100,"]");
                   //the 1 at the end adds the dynamic articulation value, this needs to be adjustable through the ui
                  patttosave.pattern.push([t,b,s,box.title/100]);
              };
            }
          };
      };
    };
    patttosave.tracks = parseInt(document.getElementById("tracks").value);
    patttosave.beats = parseInt(document.getElementById("beats").value);
    patttosave.snap = parseInt(document.getElementById("snap").value);

    var beatname = document.getElementById("beatName").value

    patterns[beatname] = patttosave;
    if(beatname!=Which){
        delete patterns[Which];
    }

    Jackdaw.DrumPatternManager.save(patterns);
    Init(patterns,beatname);

    console.log("get patterns",patterns);
  }

  function UpdateGrid(){
    console.log("UpdateGrid",Which);
    Init(patterns,Which,true);
  }

  
  return{
          init:Init,
    getpattern:Getpattern,
    updategrid:UpdateGrid
  };


} (  ));