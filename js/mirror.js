(function(window, navigator, document){

	navigator.getUserMedia = (navigator.getUserMedia || 
		navigator.webkitGetUserMedia || 
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia);

	var constraints = {audio: false, video: true},
		video = document.querySelector('video'),
		button = document.querySelector('button'),
		canvas = document.querySelector('canvas'),
		photo = document.querySelector('photo'),
		width = 320,
		height = 0,
		isStreaming = false;


	function successCallback(stream){
		if (window.URL){
			video.src = window.URL.createObjectURL(stream);
		} else {
			video.src = stream;
		}

		video.play();

	}

	function errorCallback(err){
		console.log('getUserMedia Errror', err);
	}


	// when ready attach video stream onto canvas element
	video.addEventListener('canplay', function(ev){
		if (!isStreaming){
			height = video.videoHeight / (video.videoWidth/width)
			video.setAttribute('width', width);
			video.setAttribute('height', height);
			canvas.setAttribute('width', width);
			canvas.setAttribute('height', height);
			isStreaming = true;
		}
	}, false);

	// onClick capture canvas as dataURL & set as img src attr
	button.addEventListener('click', function(ev){
		canvas.getContext('2d').drawImage(video, 0, 0, width, height);
		photo.setAttribute('src', canvas.toDataURL('image/png'));

		ev.preventDefault();
	}, false);


	// kick things off
	navigator.getUserMedia(constraints, successCallback, errorCallback);

})(window, navigator, document);