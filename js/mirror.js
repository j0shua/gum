(function(window, navigator, document){

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);

	var constraints = {audio: false, video: true},
		video = document.querySelector('video');

	function successCallback(stream){
		if (window.URL){
			video.src = window.URL.createObjectURL(stream);
		} else {
			video.src = stream;
		}

	}


	function errorCallback(err){
		console.log('getUserMedia Errror', err);
	}
	navigator.getUserMedia(constraints, successCallback, errorCallback);

})(window, navigator, document);