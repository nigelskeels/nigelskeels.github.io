console.log("SW Startup!");

var db;

self.importScripts('pouchdb.js');


// Install Service Worker
self.addEventListener('install', function(event){
    console.log('installed!'); 
    event.waitUntil(self.skipWaiting()); // Activate worker immediately

    db = new PouchDB('http://localhost:5984/bizie');
    
    PouchDB.debug.enable('*');
   
    db.changes({
          since: 'now',
          live: true,
          include_docs: true
        }).on('change', change => {
          console.log('~~~~~~~~ dbWorker change:', change.doc);
          messageall(change.doc)
        });

    simulator()
});

// Service Worker Active
self.addEventListener('activate', function(event){
    console.log('activated!');
    event.waitUntil(self.clients.claim()); // Become available to all pages
});


self.addEventListener('message', function(event){
    console.log("SW Received Message: " + event.data);
    
    // db.info().then(function (info) {
    //   console.log("info here > ",info);
    // })
    messageall(event.data);
});



function messageall(what){
    // console.log("mess all",what)
    self.clients.matchAll().then(function (clients){
      clients.forEach(function(client){
        client.postMessage({
          msg: what
        });
      });
    });
}


var interval;

function simulator(){
  interval = setInterval(function(){

    console.log("test")
    db.get('rec1').then(function (doc) {
        // update their age
        
        for (var i = 1; i < 11; i++) {
          var test = "someval"+i
          doc[test]= random(0, 100);
        };

        // doc.someval1 = random(0, 100);
        // doc.someval2 = random(0, 100);
       // put them back
        return db.put(doc);
      })

     

  }, 500)
}

function random(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}