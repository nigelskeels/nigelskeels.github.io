Jackdaw.Storagemanager = ( function( ) {

  function Init(){
    console.log("Hello ");
    
    // if(which==undefined){
      which=Object.keys(patterns)[0];  
    // }
    // Which=which;
    patt=patterns[which];
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
      // Init();
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

var patt;

var sounds = {"git":"sounds/Guitar1.wav","drumkit3":"sounds/drumkit3.wav","amen":"sounds/Amen-break.wav"};

//voices
//samplesettings


// trackvoices [ sound ,slicetoplay for pitch or false for drums, oneshot/repeat, total slices for this sound OR slicepoint times [[in,out],[in,out],[in,out]]
var trackvoices =  [
                     ["drumkit3",  false,  true,  40],
                     ["git",          12,  true,  [0,1.23]],
                     ["git",          6,  true, 80],
                     ["amen",          1,  true, 40]
                   ];

//in patterns the array values are [track,beat,subbeat,volume]
//proposed new version  values are [track,beat,subbeat,volume,length,keypressvalue]

var patterns =  {

          "Another beat":{
                         "tracks":4,
                          "beats":8,
                           "snap":96,
                        "pattern":[
                                    // [2,1,0,1],[2,2,0,0.5],[2,3,0,1],[2,4,0,0.5]
                                    // [1,1,0,1,1,1]
                                    [1,1,0,1,1,1],[1,2,0,1,1,3],[1,3,0,1,1,1],[1,4,0,0.5,1,3],
                                    [1,5,0,1,1,1],[1,6,0,1,1,3],[1,7,0,1,1,1],[1,8,0,0.5,1,3],[1,7,120,1,0.4,8],[1,7,220,1,0.4,10],[1,8,80,1,1,24]
                                    , [3,1,0,1,1,13] ,[3,2,0,1,1,13],[3,3,0,1,1,14],[3,4,0,0.5,1,16],[3,6,0,1,1,6],[3,6,100,1,1,6],[3,6,200,1,1,6],[3,6,300,1,1,12],[3,8,0,1,1,8]
                                  ]
                    },

          "Blue Monday":{
                         "tracks":4,
                          "beats":8,
                           "snap":96,
                        "pattern":[
                                    [2,1,0,1],[2,2,0,1],[2,3,0,1],[2,3,96,1],[2,3,192,1],[2,3,288,1],[2,4,0,1],[2,4,96,1],[2,4,192,1],[2,4,288,1],[2,5,0,1],[2,6,0,1],[2,7,0,1],[2,8,0,1]
                                  ]
                    },

          "Dynamico":{"tracks":4,"beats":4,"snap":96,"pattern":[[2,1,0,0.1],[2,2,0,0.3],[2,3,0,0.6],[2,4,0,1]]}
          // ,
          // "Blank":{
          //                "tracks":4,
          //                 "beats":1,
          //                  "snap":384
          //               "pattern":[]
          //           }
}


var songs = {
              "First song":{
                              "tempo":120,                              
                              // "tracksettings":["git","drumkit3","amen"],  
                              "structure": [
                                            ["Blue Monday",1],
                                            ["blue2",9],
                                            ["Blue Monday",17],
                                            ["blue2",25],
                                            ["Blue Monday",33],
                                            ["blue2",41]
                                          ]

              }
              // ,
              // "Another song":{
              //                 "tempo":110,
              //                 "tracksettings":["git","drumkit3","amen"],  
              //                 "structure": [                         
              //                               ["Blue Monday",1],
              //                               ["Last beat",8],
              //                               ["Last beat",12]
              //                             ]
              // }
            }