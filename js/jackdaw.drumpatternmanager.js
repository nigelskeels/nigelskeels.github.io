Jackdaw.DrumPatternManager = ( function( ) {

  function Init(){
    var drumpatternmanager = document.getElementById("drumpatternmanager");
    drumpatternmanager.innerHTML="";

    // Load();

    for(i in patterns){
      if(i!="Blank"){
        (function(i){
          var pattname = document.createElement("div");
          pattname.className="pattname"
          pattname.innerHTML=  '<a data-patternname="'+i+'"><i class="icon-playlist"></i>'+pattname.innerHTML+i+'</a>';
          // pattname.dataset.patternname = i;
          pattname.draggable=true;


          pattname.addEventListener( "click",         
            function(){ 
              console.log("Select pattern ",i);
              Jackdaw.DrumGrid.init(patterns,i); 
          });

          pattname.addEventListener( "dragstart",         
            function(e){ 
                var dragdiv = document.createElement("div")
                dragdiv.id="dragdiv";
                dragdiv.className="patternblock";
                dragdiv.innerHTML=i;
                dragdiv.style.width=(patterns[i].beats*20)-1 +"px";
                dragdiv.style.position="relative";
                 document.getElementById("hidden").appendChild(dragdiv)
                e.dataTransfer.setDragImage(dragdiv, 0, 0);
                // firefox fix
                e.dataTransfer.setData('Text', this.id);
                console.log("dragstart",dragdiv)

          });

          pattname.addEventListener("dragend",function(){
              var dragdiv =  document.getElementById("dragdiv")
              console.log("dragend")
              dragdiv.parentNode.removeChild(dragdiv);              
          })

          var removebut = document.createElement("button");
          removebut.innerHTML="x";
          removebut.className="removebut"

          removebut.addEventListener( "click",         
            function(){ 
              Removepattern(i); 
          });

          pattname.appendChild(removebut);
          drumpatternmanager.appendChild(pattname);
        }(i))
      }
    }
  }

  function Save(patterns){
      localStorage.setItem("Jackdaw.DrumPatterns", JSON.stringify(patterns));
  }

  function Load(){
      if(localStorage.getItem("Jackdaw.DrumPatterns")!=undefined){
        if(Object.keys( JSON.parse(localStorage.getItem("Jackdaw.DrumPatterns") )).length > 0){
          patterns=JSON.parse(localStorage.getItem("Jackdaw.DrumPatterns"));
        }else{
          localStorage.clear();
        }
      }
      patterns["Blank"]={
                           "tracks":4,
                            "beats":1,
                             "snap":96,
                          "pattern":[]
                        }
      Init();
  }

  function Removepattern(which){
      //remove the pattern
      console.log("remove the pattern ", which);
      delete patterns[which]
      localStorage.setItem("Jackdaw.DrumPatterns", JSON.stringify(patterns));
      Init();
  }

  function Addpattern(){
      var newpattern = {}
      newpattern.tracks=4;
      newpattern.beats=4;
      newpattern.snap=96;
      newpattern.pattern=[];
      patterns["Enter a Name"]=newpattern;
      Init();
      Jackdaw.DrumGrid.init(patterns,"Enter a Name"); 
      document.getElementById("beatName").focus();
  }

  return{
              init:Init,
              save:Save,
              load:Load,
     removepattern:Removepattern,
        addpattern:Addpattern
  };


}( ));



var patterns =  {

          "Blue Monday":{
                         "tracks":4,
                          "beats":8,
                           "snap":96,
                        "pattern":[
                                    [2,1,0,1],[2,2,0,1],[2,3,0,1],[2,3,96,1],[2,3,192,1],[2,3,288,1],[2,4,0,1],[2,4,96,1],[2,4,192,1],[2,4,288,1],[2,5,0,1],[2,6,0,1],[2,7,0,1],[2,8,0,1]
                                  ]
                    },
          "blue2":{
                         "tracks":4,
                          "beats":8,
                           "snap":96,
                        "pattern":[
                                    [1,1,0,0.7],[1,2,0,0.7],[1,3,0,0.7],[1,4,0,0.7],[1,5,0,0.7],[1,6,0,0.7],[1,7,0,0.7],[1,8,0,0.7],[2,1,0,1],[2,2,0,1],[2,3,0,1],[2,3,96,1],[2,3,192,1],[2,3,288,1],[2,4,0,1],[2,4,96,1],[2,4,192,1],[2,4,288,1],[2,5,0,1],[2,6,0,1],[2,7,0,1],[2,8,0,1]
                                  ]
                    },
          "Another beat":{
                         "tracks":4,
                          "beats":4,
                           "snap":96,
                        "pattern":[
                                    [2,1,0,1],[2,2,0,0.5],[2,3,0,0.5],[2,4,0,0.5]
                                  ]
                    },
          "Last beat":{
                         "tracks":4,
                          "beats":4,
                           "snap":96,
                        "pattern":[
                                    [1,1,0,1],
                                    [1,2,0,0.2]
                                  ]
                    },
          "Dynamico":{"pattern":[[2,1,0,0.1],[2,2,0,0.3],[2,3,0,0.6],[2,4,0,1]],"tracks":4,"beats":4,"snap":96}
          // ,
          // "Blank":{
          //                "tracks":4,
          //                 "beats":1,
          //                  "snap":384,
          //               "pattern":[]
          //           }
}
