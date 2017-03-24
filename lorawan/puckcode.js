var RN2483 = require("https://nigelskeels.github.io/lorawan/RN2483.js");
Serial1.setup(57600, { tx:D28, rx:D29 });
var lora = new RN2483(Serial1);

//LED1.write(true);


lora.getVersion(function(e) {
  console.log("ver ",e);
});

var devAddr = "26011CB3"; 
var nwkSKey = "B9EE9BE8637F01707FE364B640ABC231";
var appSKey = "2675415A240EF573BE94C21C58A315B5";

lora.LoRaWAN(devAddr,nwkSKey,appSKey, function(e) {
  console.log("lorawan reg ",e);
  
});

setWatch(function() {
  console.log("Pressed");
  lora.loraTX("Hello",function(e) {
    console.log("message",e);
  });
  
  //lora.sendquery("mac get adr",function(e) {
   // console.log("query >>> ",e);
  //});
  
}, BTN, {edge:"rising", debounce:50, repeat:true});


//Serial1.on('data',function(e){
 //   console.log("serial 1 data",e);
//});


lora.loraRX(function(e){
    console.log("Recieved data = ",e);
});


//setTimeout(function() {
//    LED1.write(false);
//}, 1000);

//lora.getStatus(function(e) {
//  console.log("status ",e);
//  LED1.write(false);
//});
