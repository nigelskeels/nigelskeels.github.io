var etherlynkobj;

document.addEventListener('DOMContentLoaded', function(){


    etherlynkobj = document.getElementsByTagName("tl-etherlynk")[0];

    //set button hold tiemout
    etherlynkobj.timeoutval=500;

    //listen for events 

    document.body.addEventListener('etherlynk.ui.event', function (e) {
             console.info('etherlynk.ui.event recieved',e.detail)
    }, false);


    document.body.addEventListener('etherlynk.event.held', function (e) {
             console.info('etherlynk.event.held held but recieved',e.detail.button)
             etherlynkobj.setbutton([e.detail.button,"red","Bernard"])
    }, false);


    document.body.addEventListener('etherlynk.event.buttondown', function (e) {
             console.info('etherlynk.event.buttondown but recieved',e.detail.button)
    }, false);

     document.body.addEventListener('etherlynk.event.buttonup', function (e) {
             console.info('etherlynk.event.buttonup but recieved',e.detail.button)
    }, false);




    //test butt listener
    var butts = document.getElementById("butts")
    butts.addEventListener('click', function (e) {

      console.log("buttons = ",e.target.id)
      window[e.target.id]()

    },false)

  
}, false);





  



 function but1(){
    etherlynkobj.loaddefaults();
 }

 function but1a(){

    var buttonmap=[
                      [null],
                      [56,"green","Barclays"], [57,"yellow","UBS FX"], [58,"red","Credit Suisse"], [59,null,"Bank of America"], [60,null], [61,null], [62,null], [63,null],   [82,"green","Long text"],
                      [48,null],[49,null],[50,null],[51,null],[52,null],[53,null],[54,null],[55,null],   [83,null],
                      [40,null],[41,null],[42,null],[43,null],[44,null],[45,null],[46,null],[47,null],   [84,null],
                      [32,null],[33,null],[34,null],[35,null],[36,null],[37,null],[38,null],[39,null],   [85,null],
                      [24,null],[25,null],[26,null],[27,null],[28,null],[29,null],[30,null],[31,null],   [86,null],
                      [16,null],[17,null],[18,null],[19,null],[20,null],[21,null],[22,null],[23,null],   [87,null],
                      [8,null] ,[9,null] ,[10,null],[11,null],[12,null],[13,null],[14,null],[15,null],   [88,null],
                      [0,null] ,[1,null] ,[2,null] ,[3,null] ,[4,null] ,[5,null] ,[6,null] ,[7,null] ,   [89,null],

                      [64,"red","call 1"],[65,null],[66,null],[67,null],[68,null],[69,null],[70,null],[71,null],   [98,null]
    ]
    
    etherlynkobj.data=buttonmap;
 }

 function but2(){
    etherlynkobj.setbutton([23,"red","RBS FX Team Something"])
 }

 function but3(){
    etherlynkobj.setbutton([23,"green","Charlotte"])
 }

 function but4(){
    etherlynkobj.setbutton([19,"yellow","Test"])
 }

 function but5(){
    etherlynkobj.setbutton([7,"greenflash","Barclays"])
 }

 function but6(){
    etherlynkobj.setbutton([23,"redflash","Charlotte"])
 }

 function but7(){
    etherlynkobj.setbutton([23,"yellowflash","Charlotte"])
 }

 function but8(){
    etherlynkobj.setbutton([65,"redflash","Bob smithsoenasd"])
 }

 function but9(){
    etherlynkobj.setbutton([87,"greenflash","Harry blah"])
 }