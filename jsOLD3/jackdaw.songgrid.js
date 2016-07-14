Jackdaw.SongGrid = ( function( ) {

  var moveover;
  var patternblocktomove;
  var patternblocknametomove;
  var song;
  var finalbeatofsong;
  var lasttotalbeatsplayed;

  function Init(songs,which){
    console.log("songgrid init",which);
    song=which;

    var songgrid = document.getElementById("songgrid");
    songgrid.innerHTML="";
    var timeline = document.createElement("div");
    timeline.className="timeline";
    timeline.id="timeline";
    
    for (var b = 1; b < 100; b++) {
      var timelinebeat = document.createElement("div");
      // console.log("modtest",patt.beats%b)
      // if(b==1 || b % patt.beats ===0){
      if(b==1 || b % 4 ===0){
          var timelinebeatnum = document.createElement("div");
          timelinebeatnum.className="timelinebeatnum";
          timelinebeatnum.innerHTML=b;
          timelinebeat.appendChild(timelinebeatnum);
      }
      
      timelinebeat.className="timelinebeat";
      timelinebeat.id="timelinebeat"+b;
      timeline.appendChild(timelinebeat);
     
      (function(which,timelinebeat){
        timelinebeat.addEventListener("mouseover", function( event ) { 
          moveover=which;
          // console.log("moveover",moveover,event);
          if(event.relatedTarget.dataset.patternname!=undefined){
            // console.warn("patterndropped on timeline!!!!!!!!!! = ",event.relatedTarget.dataset.patternname);
            songs[song].structure.push([event.relatedTarget.dataset.patternname,moveover])
            LoadSong(song);
            _findendbeatofsong();
          }
        });
      })(b,timelinebeat)
    };

    songgrid.appendChild(timeline);
    LoadSong(which);
  }

  function LoadSong(which){
    if(which!=undefined){
      song = which;  
    }
    else{
      if(song==undefined){
        song = Object.keys(songs)[0];
      }
    }

    document.getElementById("songName").value=song;

    // remove all patternblocks
    var allpatternblocks = document.getElementsByClassName("patternblock");    
    while( allpatternblocks[0]) {
        allpatternblocks[0].parentNode.removeChild( allpatternblocks[0] );
    }
     
    // console.log("song to load is =",song, songs[song] );
    // console.log("tempo is ",songs[song].tempo)
    // console.log("patterns to use ", songs[song].structure);

    for (var i = 0; i < songs[song].structure.length; i++) {
      // console.log("pattern name =",songs[song].structure[i][0]," Beat to trigger pattern =",songs[song].structure[i][1] );
      // console.log("beat lenght of this pattern", patterns[ songs[song].structure[i][0] ].beats)

      var patternblock = document.createElement("div");
      patternblock.className="patternblock";
      patternblock.id="patternblock"+i;
      patternblock.style.width=(patterns[ songs[song].structure[i][0] ].beats*20)-1 +"px";
      patternblock.innerHTML=songs[song].structure[i][0];
   
      var beatcoordinates = document.getElementById("timelinebeat"+songs[song].structure[i][1]).getBoundingClientRect();
      patternblock.style.left = ((beatcoordinates.left+timeline.scrollLeft)-20)+"px";
      patternblock.style.top = "15px";

      (function(patternblock,i){
        
        patternblock.addEventListener("mousedown", function(e) {
            document.body.style.cursor="move";
            patternblocktomove = e.target;
            patternblocknametomove=songs[song].structure[i][0];
            songs[song].structure.splice(i,1)

            timeline.addEventListener('mousemove', _mover );
              window.addEventListener("mouseup", _mouseup )
        }, false);

      })(patternblock,i)
   
      timeline.appendChild(patternblock);

    }
    //set first pattern. This is wrong.
    //needs to loop through song structure and find what the lowest value is of structure[0][lowest].maybe a sort.
    if(songs[song].structure.length==0){
        Jackdaw.DrumGrid.init(patterns,undefined,false);
    }else{
        Jackdaw.DrumGrid.init(patterns,songs[song].structure[0][0] ,false);
    }

    _findendbeatofsong();
    lasttotalbeatsplayed=undefined
  }

  //things to do
  // - when song play is presses the entrire song needs to be loaded into a pattern type object and the played

  function _mover(e){ 

          var timelineoffset = timeline.getBoundingClientRect();
          patternblocktomove.style.left =(e.clientX-(timelineoffset.left-timeline.scrollLeft) )+"px"; 
          patternblocktomove.style.top = (e.clientY-timelineoffset.top)+"px";
  }

  function _mouseup(e){
            timeline.removeEventListener('mousemove', _mover );
            document.body.style.cursor="default";
            window.removeEventListener('mouseup',_mouseup);
            songs[song].structure.push([patternblocknametomove,moveover])
            LoadSong(song);
            _findendbeatofsong();
  }


  function Update(totalbeatsplayed,totalsubdivsplayed,loop){
    //update the display red line indicator
    var songpos = document.getElementById("songpos");
    songpos.innerHTML = "beat = "+totalbeatsplayed+" | total subdivs played = "+totalsubdivsplayed+" | loop = "+loop;
    var x = document.getElementsByTagName("STYLE")[1];
    x.innerHTML="#timelinebeat"+totalbeatsplayed+"{ border-left: solid red 1px!important;  }";
  }

  function Triggerpatternchange(totalbeatsplayed,totalsubdivsplayed){
      

      if(lasttotalbeatsplayed!=totalbeatsplayed){

          for (var i = 0; i < songs[song].structure.length; i++) {        
            
              if( songs[song].structure[i][1] == totalbeatsplayed ){
                console.log("beat = ",totalbeatsplayed," | play this", songs[song].structure[i][0] );  
                Jackdaw.DrumGrid.init(patterns,songs[song].structure[i][0] ,false);
                // patt=patterns[songs[song].structure[i][0]]
              }   

              else if (totalbeatsplayed == patterns[songs[song].structure[i][0]].beats+ songs[song].structure[i][1]) {
                //needs to know when end of each pattern is to be able to set blank loop until next block
                console.log(songs[song].structure[i][0],"pattern end point", patterns[songs[song].structure[i][0]].beats + songs[song].structure[i][1],"totalbeatsplayed" ,totalbeatsplayed  )
                Jackdaw.DrumGrid.init(patterns,"Blank" ,false);
              }     
          }
          lasttotalbeatsplayed=totalbeatsplayed;
          
          if(totalbeatsplayed>=finalbeatofsong){
            console.log("End of song stop",totalbeatsplayed,finalbeatofsong);
            // Jackdaw.Scheduler.songplay();
            //loop song with next line
            LoadSong(song);
            Jackdaw.Scheduler.resettostart();
          }
          // console.info("Triggerpatternchange",totalbeatsplayed,totalsubdivsplayed);
      }
  }

  function _findendbeatofsong(){
    if(songs[song].structure.length==0 || undefined){
      finalbeatofsong = 0;
    }else{
      var max = songs[song].structure[0][1];
      var maxIndex = 0;

      for (var i = 1; i < songs[song].structure.length; i++) {        
          if (songs[song].structure[i][1] > max) {
              maxIndex = i;
              max = songs[song].structure[i][1];
          }
      }
      
      finalbeatofsong = max + parseInt(patterns[songs[song].structure[maxIndex][0]].beats);


      // console.log("buildmax",songs[song].structure[maxIndex][0], max );
      // console.log("length of this pattern = ", patterns[songs[song].structure[maxIndex][0]].beats )
      // console.log("Final beat of this song = ",finalbeatofsong);
    }
  }

  function _getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
  }


  function GetSongs(){
    return songs;
  }

  function Updatesongname(){
      //get the current song
      var currentsongname = song;
      currentsongobject = songs[song];

      delete songs[song];
      var newsongname=document.getElementById("songName").value;
      songs[newsongname]=currentsongobject;

      Jackdaw.SongPatternManager.init();
      LoadSong(newsongname);
  }

  

  return{
                  init:Init,
                update:Update,
              getsongs:GetSongs,
              loadsong:LoadSong,
  triggerpatternchange:Triggerpatternchange,
        updatesongname:Updatesongname
  };


}( ));

