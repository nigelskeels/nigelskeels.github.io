Jackdaw.SongPatternManager = ( function( ) {

  function Init(){
    var songpatternmanager = document.getElementById("songpatternmanager");
    songpatternmanager.innerHTML="";

    // Load();

    for(i in songs){
      (function(i){
        var songname = document.createElement("div");
        songname.className="songname"
        songname.innerHTML=songname.innerHTML+i;
        songname.dataset.patternname = i;
        songname.draggable=true;


        songname.addEventListener( "click",         
          function(){ 
            console.log("Select pattern ",i);
            Jackdaw.SongGrid.init(songs,i); 
        });

        var removebut = document.createElement("button");
        removebut.innerHTML="x";
        removebut.className="removebut"

        removebut.addEventListener( "click",         
          function(){ 
            Removesong(i); 
        });

        songname.appendChild(removebut);
        songpatternmanager.appendChild(songname);
      }(i))
    }
  }

  function Save(){
      localStorage.setItem("Jackdaw.Songs", JSON.stringify(songs));
  }

  function Load(){
      if(localStorage.getItem("Jackdaw.Songs")!=undefined){
        if(Object.keys( JSON.parse(localStorage.getItem("Jackdaw.Songs") )).length > 0){
          songs=JSON.parse(localStorage.getItem("Jackdaw.Songs"));
        }else{
          localStorage.clear();
        }
      }
      // Init();
  }

  function Removesong(which){
      //remove the pattern
      console.log("remove the song ", which);
      delete songs[which]
      localStorage.setItem("Jackdaw.Songs", JSON.stringify(songs));
      Jackdaw.SongGrid.init(songs,Object.keys(songs)[0]); 
      Init();
  }

  function Addsong(){
      var newsong = {}
      newsong.tempo=120;
      newsong.structure=[];
      songs["Enter a Name"]=newsong;
      Jackdaw.SongGrid.init(songs,"Enter a Name"); 
      // Init();
  }

  return{
              init:Init,
              save:Save,
              load:Load,
     removesong:Removesong,
        addsong:Addsong
  };


}( ));

var songs = {
              "First song":{
                              "tempo":120,
                              "structure": [
                                            ["Blue Monday",1],
                                            ["blue2",9],
                                            ["Blue Monday",17],
                                            ["blue2",25],
                                            ["Blue Monday",33],
                                            ["blue2",41]
                                          ]

              },
              "Another song":{
                              "tempo":110,
                              "structure": [
                                           
                                            ["Blue Monday",1],
                                            ["Last beat",8],
                                            ["Last beat",12]
                                          ]

              }
            }