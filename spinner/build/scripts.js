(function(){
  var Countdown = function(duration, updateFrequency, onUpdate, onComplete) {    
    var timeout,
        startTime, 
        remaining = duration,
        timer = {
          pause: function pause(){
            window.clearTimeout(timeout);
            remaining -= new Date() - start;
          },
      
          resume: function resume(){
            window.clearTimeout(timeout);
            
            timeout = window.setTimeout(function(){
              remaining -= updateFrequency;
          
              if (remaining > 0){
                onUpdate(remaining);
                timer.resume();
              } else {
                onComplete();
              }
            }, updateFrequency);
          },
        
          start: function(){
            startTime = new Date();
            timer.resume();
          }
        };
        return timer;
  };
  
  var drawProgressArc = function(canvasElement, percentComplete) {
        var context = canvasElement.getContext('2d');
        context.lineWidth = 2;
        var posX = canvasElement.width / 2;
        var posY = canvasElement.height / 2;
        var radius = Math.min(canvasElement.width, canvasElement.height) / 2 - context.lineWidth;
        var progressStartAngle = 0.5 * Math.PI;

        // Clear the previously drawn content.
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);

        // Draw the gray circle.
        context.strokeStyle = '#666';
        context.beginPath();
        context.arc(posX, posY, radius, 0, 2 * Math.PI, false);
        context.stroke();

        // Draw the white progress arc.
        context.strokeStyle = '#fff';
        context.beginPath();
        context.arc(posX, posY, radius, progressStartAngle, percentComplete * (2 * Math.PI) + progressStartAngle, false);
        context.stroke();
    };

  var duration = 1000 * 7, // seconds
      updateFrequency = 20, // ms
      spinner = document.querySelector('canvas');
  
  var ct = new Countdown(duration, 500, function(timeRemaining){
    //console.log('time left: ' + timeRemaining);
    drawProgressArc(spinner, 1 - timeRemaining / (duration));
  }, function(){
    console.log('done');
  });
  
  ct.start();
})(); 

