// ons.disableAutoStatusBarFill(); - Disable the status bar margin.
var app = angular.module('app', ['onsen', 'ngAudio']);

// tweet Controller
/*
*  AngularJS Directive for Twitter's Embedded Timeline with support for custom CSS.
*  https://github.com/userapp-io/twitter-timeline-angularjs
*/


// Radio Controller
var radio = null;
var isPlaying = false;

app.controller('radioController', function($scope, $sce, ngAudio){
	
	$scope.radioURL = 'http://91.121.165.88:8116/stream'; // http://streams.kqed.org/kqedradio.m3u
	$scope.buttonIcon = '<span class="ion-ios7-play"></span>';

	if (radio!==null) {		
	    $scope.radio = radio;
	    
	    if(isPlaying){
	    	$scope.buttonIcon = '<span class="ion-ios7-pause"></span>';
	    } else {
	    	$scope.buttonIcon = '<span class="ion-ios7-play"></span>';
	    }
	} else {
		
		isPlaying = false;
	    $scope.radio = ngAudio.load($scope.radioURL);
	    radio = $scope.radio;
	}

	$scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.startRadio = function(){

    	if(!isPlaying){
    		// Let's play it
    		isPlaying = true;
			$scope.radio.play();

			$scope.buttonIcon = '<span class="ion-ios7-pause"></span>';
			$scope.isFetching = true;

    	} else {
    		// Let's pause it
    		isPlaying = false;
			$scope.radio.pause();
			$scope.buttonIcon = '<span class="ion-ios7-play"></span>';

    	}

    }

    // Check if is Offline
	document.addEventListener("offline", function(){

		isPlaying = false;
		$scope.radio.stop();
		$scope.buttonIcon = '<span class="ion-ios7-play"></span>';
		$scope.radio = null;
		modal.show();
		setTimeout('modal.hide()', 8000);				

	}, false);

	document.addEventListener("online", function(){
		$scope.radio = ngAudio.load($scope.radioURL);
		radio = $scope.radio;
	});

});

var pad2 = function(number){
	return (number<10 ? '0' : '') + number;
}

app.filter('SecondsToTimeString', function() {
	return function(seconds) {
		var s = parseInt(seconds % 60);
		var m = parseInt((seconds / 60) % 60);
		var h = parseInt(((seconds / 60) / 60) % 60);
		if (seconds > 0) {
			return pad2(h) + ':' + pad2(m) + ':' + pad2(s);
		} else {
			return '00:00:00';
		}
	}
});

// News Controller

// News Controller

app.filter('htmlToPlaintext', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }
  }
);

app.controller('newsController', [ '$http', '$scope', '$rootScope', function($http, $scope, $rootScope){

	$scope.yourAPI = 'http://hugeclan.com/api/get_recent_posts/';
	$scope.items = [];
	$scope.totalPages = 0;
	$scope.currentPage = 1;
	$scope.pageNumber = 1;
	$scope.isFetching = true;

	$scope.getAllRecords = function(pageNumber){

		$scope.isFetching = true;

        $http.jsonp($scope.yourAPI+'/?page='+$scope.pageNumber+'&callback=JSON_CALLBACK').success(function(response) {

			$scope.items = $scope.items.concat(response.posts);
			$scope.totalPages = response.pages;
			$scope.isFetching = false;
			if($scope.currentPage==$scope.totalPages){
				$('.news-page #moreButton').fadeOut('fast');	
			}
    	});
	 
	};

	$scope.showPost = function(index){
			
		$rootScope.postContent = $scope.items[index];
	    $scope.ons.navigator.pushPage('post.html');

	};

	$scope.nextPage = function(){
		
		$scope.pageNumber = ($scope.currentPage + 1);
		if($scope.pageNumber <= $scope.totalPages){
			$scope.getAllRecords($scope.pageNumber);
			$scope.currentPage++;
		}

	}


}]);

app.controller('postController', [ '$scope', '$rootScope', '$sce', function($scope, $rootScope, $sce){
	
	$scope.item = $rootScope.postContent;

	$scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

}]);
