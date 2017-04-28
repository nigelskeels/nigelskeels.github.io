    var currentpeaks;
    var currentends;
    var currentbuffer;
var Jackdaw = {};

Jackdaw.Beatdetection = ( function( window, undefined ) {

    var OfflineContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
     var offlineContext = new OfflineContext(1, 2, 44100);
    //var offlineContext = new OfflineContext(2, 2, 48000);

    var lastsliceplayed=0;


function Init(){
    
    console.log("Hello Beatdetection")
  
}

function Calculatetempo(incommingbuffer){


    offlineContext.decodeAudioData(incommingbuffer, function(buffer) {
      
      Calc(buffer)

    });

}

function Calc(buffer){
    
   

    var text = document.querySelector('#text');
                        // Create buffer source
    var source = offlineContext.createBufferSource();
    source.buffer = buffer;

    // Create filter
    var filter = offlineContext.createBiquadFilter();
    filter.type = "lowpass";

    // Pipe the song into the filter, and the filter into the offline context
    source.connect(filter);
    filter.connect(offlineContext.destination);

    // Schedule the song to start playing at time:0
    source.start(0);

    var peaks,
        initialThresold = 0.4,
        thresold = initialThresold,
        minThresold = 0.5,
        minPeaks = 30;

    do {
      peaks = getPeaksAtThreshold(buffer.getChannelData(0), thresold);
      thresold -= 0.10;
    } while (peaks.length < minPeaks && thresold >= minThresold);

     
    var intervals = countIntervalsBetweenNearbyPeaks(peaks);

    var groups = groupNeighborsByTempo(intervals, buffer.sampleRate);

    var top = groups.sort(function(intA, intB) {
      return intB.count - intA.count;
    }).splice(0,5);

    text.innerHTML =  Math.round(top[0].tempo) + ' BPM</strong>' +
      ' with ' + top[0].count + ' samples.</div>';

    // text.innerHTML += '<div class="small">Other options are ' +
    //   top.slice(1).map(function(group, index) {
    //     return group.tempo + ' BPM (' + group.count + ')';
    //   }).join(', ') +
    //   '</div>';

    var printENBPM = function(tempo) {
      text.innerHTML += '<div class="small">Other sources: The tempo according to The Echo Nest API is ' +
            tempo + ' BPM</div>';

    };
    
    console.info("peaks",peaks)
    // addslicebuttons(peaks,peaks,buffer)
    currentpeaks=peaks;
    currentends=peaks.slice();
    currentends.splice(0,1);    
    currentends.push(buffer.length);
    addslicebuttons(currentpeaks,currentends,buffer)

    currentbuffer=buffer;
}

function updatestartpointslider(){
    var startpointslider = document.getElementById("startpointslider")
    startpointslider.max = currentbuffer.length;
    startpointslider.value =currentpeaks[lastsliceplayed];
}

function updateendpointslider(){
    var endpointslider = document.getElementById("endpointslider")
    endpointslider.max = currentbuffer.length;
    endpointslider.value =currentends[lastsliceplayed];
}

function Updatepeaks(val){
    console.log(lastsliceplayed,"update startpoint",val)
    currentpeaks[lastsliceplayed]=parseInt(val);
    addslicebuttons(currentpeaks,currentends,currentbuffer)
}

function Updateends(val){
    console.log(lastsliceplayed,"update currentends",val)
    currentends[lastsliceplayed]=parseInt(val);
    addslicebuttons(currentpeaks,currentends,currentbuffer)
}

function addslicebuttons(peaks,ends,buffer){

  var slicebuts = document.getElementById("slicebuts")
  slicebuts.innerHTML="";

  var svg = document.querySelector('#svg');
  svg.innerHTML = '';
  var svgNS = 'http://www.w3.org/2000/svg';
    
  for (var i = 0; i < peaks.length; i++) {
    var rect = document.createElementNS(svgNS, 'rect');
    rect.setAttributeNS(null, 'x', (100 * peaks[i] / buffer.length) + '%');
    rect.setAttributeNS(null, 'y', 0);
    rect.setAttributeNS(null, 'width', 1);
    rect.setAttributeNS(null, 'height', '100%');
    
    svg.appendChild(rect);

    var rect2 = document.createElementNS(svgNS, 'rect');
    rect2.setAttributeNS(null, 'x', (100 * ends[i] / buffer.length) + '%');
    rect2.setAttributeNS(null, 'y', 0);
    rect2.setAttributeNS(null, 'width', 2);
    rect2.setAttributeNS(null, 'height', '100%');


    svg.appendChild(rect2);
    
    var but = document.createElement("button");
    but.id="slice"+i;
    but.innerHTML=i;   

    (function(_i){

      but.onclick = function(){
          playslice(_i,peaks,ends,buffer)
      }

    })(i)

    slicebuts.appendChild(but)
  };

  svg.innerHTML = svg.innerHTML;  // force repaint in some browsers

  window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;
   var keyval =  parseInt(String.fromCharCode(key));
   console.log("key",keyval)
   playslice(keyval,peaks,ends,buffer);
  }

}


function playslice(_i,peaks,ends,buffer){

          
          if(peaks[_i]!=undefined){

            var endpadding=0.5;
            var newsource = context.createBufferSource();
            newsource.buffer = buffer;                    
            newsource.connect(context.destination);       
            var time = context.currentTime;


            var start = peaks[(_i)]/buffer.sampleRate;

            newsource.start(time,start);  

            // if(_i!=peaks.length-1){
              // var end = peaks[_i+1]/buffer.sampleRate
              var end = ends[_i]/buffer.sampleRate
              newsource.stop(time+(end-start));
            // }
            lastsliceplayed=_i;
            updatestartpointslider();
            updateendpointslider();
            console.log("but",time,start)
          }
}



// Function to identify peaks
function getPeaksAtThreshold(data, threshold) {
  var peaksArray = [];
  var length = data.length;
  for(var i = 0; i < length;) {
    if (data[i] > threshold) {
      peaksArray.push(i);
      // Skip forward ~ 1/4s to get past this peak.
      i += 10000;
    }
    i++;
  }
  return peaksArray;
}

// Function used to return a histogram of peak intervals
function countIntervalsBetweenNearbyPeaks(peaks) {
  var intervalCounts = [];
  peaks.forEach(function(peak, index) {
    for(var i = 0; i < 10; i++) {
      var interval = peaks[index + i] - peak;
      var foundInterval = intervalCounts.some(function(intervalCount) {
        if (intervalCount.interval === interval)
          return intervalCount.count++;
      });
      if (!foundInterval) {
        intervalCounts.push({
          interval: interval,
          count: 1
        });
      }
    }
  });
  return intervalCounts;
}

// Function used to return a histogram of tempo candidates.
function groupNeighborsByTempo(intervalCounts, sampleRate) {
  var tempoCounts = [];
  intervalCounts.forEach(function(intervalCount, i) {
    if (intervalCount.interval !== 0) {
      // Convert an interval to tempo
      var theoreticalTempo = 60 / (intervalCount.interval / sampleRate );

      // Adjust the tempo to fit within the 90-180 BPM range
      while (theoreticalTempo < 90) theoreticalTempo *= 2;
      while (theoreticalTempo > 180) theoreticalTempo /= 2;

      theoreticalTempo = Math.round(theoreticalTempo);
      var foundTempo = tempoCounts.some(function(tempoCount) {
        if (tempoCount.tempo === theoreticalTempo)
          return tempoCount.count += intervalCount.count;
      });
      if (!foundTempo) {
        tempoCounts.push({
          tempo: theoreticalTempo,
          count: intervalCount.count
        });
      }
    }
  });
  return tempoCounts;
}

function Getcurrentslicebuffer(thisslice){

      if(thisslice==undefined){
        var thisslice = lastsliceplayed
      }
      
      var newbufferlength = currentends[thisslice]-currentpeaks[thisslice]
      var tmp = context.createBuffer( currentbuffer.numberOfChannels, newbufferlength, currentbuffer.sampleRate );

      for (var i=0; i< currentbuffer.numberOfChannels; i++) {
        var channel = tmp.getChannelData(i);
        var slicedata = currentbuffer.getChannelData(i).slice(currentpeaks[thisslice],currentends[thisslice]);
        channel.set( slicedata, 0);
      }
      Jackdaw.Audioexport.download(tmp,"slice_"+thisslice,"audio/wav");
}

function Reverseslice(){

    var thisslice = lastsliceplayed

    var tmp = context.createBuffer( currentbuffer.numberOfChannels, currentbuffer.length, currentbuffer.sampleRate );

    for (var i=0; i< currentbuffer.numberOfChannels; i++) {
      var channel = tmp.getChannelData(i);
      var auddata = currentbuffer.getChannelData(i);
      var slicedata = currentbuffer.getChannelData(i).slice(currentpeaks[thisslice],currentends[thisslice]);
      var reversed = slicedata.reverse();
      var out = splicer(auddata,currentpeaks[thisslice],slicedata.length,reversed)
      channel.set( out, 0);
    }

    currentbuffer=tmp;
    Jackdaw.Waveformdisplay.drawbuffer(currentbuffer)
    addslicebuttons(currentpeaks,currentends,currentbuffer);
}

function Boostbass(){
    //fx applied to the whole file, but should only be the slice like above

    var offlineContext = new OfflineContext(1, currentbuffer.length, 44100);

    var fxbuffer = offlineContext.createBufferSource();
    fxbuffer.buffer = currentbuffer;

    // Create filter
    var filter = offlineContext.createBiquadFilter();
    filter.type = "lowpass";

    // Pipe the song into the filter, and the filter into the offline context
    fxbuffer.connect(filter);
    filter.connect(offlineContext.destination);
    fxbuffer.start(0);

    offlineContext.startRendering().then(function(renderedBuffer){
      currentbuffer=renderedBuffer;
      Jackdaw.Waveformdisplay.drawbuffer(currentbuffer)
      addslicebuttons(currentpeaks,currentends,currentbuffer);
    }).catch(function(err) {
          console.log('Rendering failed: ' + err);
    });
 
}


function Getallslices(){
  for (var i = 0; i < currentpeaks.length; i++) {
      Getcurrentslicebuffer(i);
  };
}


//this is used as ordinary js slice won't work with typedarray
function splicer(arr, starting, deleteCount, elements) {
  if (arguments.length === 1) {
    return arr;
  }
  starting = Math.max(starting, 0);
  deleteCount = Math.max(deleteCount, 0);
  elements = elements || [];

  const newSize = arr.length - deleteCount + elements.length;
  const splicedArray = new arr.constructor(newSize);

  splicedArray.set(arr.subarray(0, starting));
  splicedArray.set(elements, starting);
  splicedArray.set(arr.subarray(starting + deleteCount), starting + elements.length);
  return splicedArray;
};





return{
                    init:Init,
          calculatetempo:Calculatetempo,
                    calc:Calc,
             updatepeaks:Updatepeaks,
              updateends:Updateends,
   getcurrentslicebuffer:Getcurrentslicebuffer,
            getallslices:Getallslices,
            reverseslice:Reverseslice,
               boostbass:Boostbass
};


} )( window );
