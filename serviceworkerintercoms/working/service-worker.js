console.log("SW Startup!");

// Install Service Worker
self.addEventListener('install', function(event){
    console.log('installed!');
});

// Service Worker Active
self.addEventListener('activate', function(event){
    console.log('activated!');
});


self.addEventListener('message', function(event){
    console.log("SW Received Message: " + event.data);
    // messageall(event.data);
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