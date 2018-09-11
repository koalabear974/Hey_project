(function (){
	var app = angular.module("heyApp", ['ngRoute', 'ngCookies', 'ngAnimate','uiGmapgoogle-maps','geolocation']);

	

    // configure our routes
    app.config(function($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
        	.when('/', {
                templateUrl : 'view/home.html',
                controller  : 'mainController',
    			security: false
            })
            .when('/home', {
                templateUrl : 'view/home.html',
                controller  : 'mainController',
    			authorized: false
            })
            .when('/configuration', {
                templateUrl : 'view/configuration.html',
                controller  : 'configurationController',
    			authorized: true
            })
            .when('/signin', {
                templateUrl : 'view/login.html',
                controller  : 'loginController',
    			authorized: false
            })
            .when('/unauthorized', {
			    templateUrl: 'view/errors/unauthorized.html',
			    authorized: false
			})
			.when('/login', {  
			    templateUrl: 'view/login.html',
			    controller: 'loginController',
			    authorized: false
			})
			.when('/registration', {  
			    templateUrl: 'view/registration.html',
			    controller: 'registrationController',
			    authorized: false
			});;

			$httpProvider.interceptors.push(function ($location) {
	        return {
	            'responseError': function (rejection) {
	                if (rejection.status === 401) {
	                    $location.url('/login?returnUrl=' + $location.path());
	                }
	            }
	        };
	    });
    });

	app.run(function($rootScope, $location, userService) {
	    $rootScope.$on("$routeChangeStart", function (event, next, current) {
	        if (next.$$route.authorized  && !userService.isConnected()) {
	            $location.url("/login?returnUrl=" + $location.path());
	        }
	    });
	});

	app.config(function(uiGmapGoogleMapApiProvider) {
	    uiGmapGoogleMapApiProvider.configure({
	        //    key: 'your api key',
	        v: '3.17',
	        libraries: 'places' // Required for SearchBox.
	    });
	})
	

    app.service("userService", ['$rootScope','$http','$cookies','$cookieStore', function($rootScope, $http, $cookies, $cookieStore) {
	    return {
	        isConnected: function() {
	        	if($cookieStore.get("userStatus")!==undefined && $cookieStore.get("userStatus")){
	        		return $cookieStore.get("userStatus");
	        	}else {
	            	return false;
	        	}
	        },
	        signIn: function(user) {
	            $http.post('sys/user/getUserInfo.php', {"user": angular.toJson(user,false)}).
				success(function(data, status, headers, config) {
					if(data["error"]==="success"){
						$cookieStore.put('userInfo',angular.toJson(data["user"],false));
						$cookieStore.put('userStatus', true);
						$rootScope.$broadcast("connectionStateChanged");
						return true;
					}else{
						return false;
					}
				}).
				error(function(data, status, headers, config) {
					console.log(data+"\n"+status+"\n"+headers);
				});
	        },
	        signOut: function() {
	            $cookieStore.put('userStatus', false);
	            $cookieStore.put('userInfo', null);
	            $rootScope.$broadcast("connectionStateChanged");
	        },
	        getCurentUser: function() {
	        	if($cookieStore.get("userInfo")!==undefined && $cookieStore.get("userInfo")){
	        		return angular.fromJson($cookieStore.get("userInfo"));
	        	}else {
	            	return false;
	        	}
	        }
	    };
	}]);

	app.controller("mainController",  function($scope, $rootScope, $location, $routeParams, userService){
		this.isActive = function (val){
			return val === $location.path();
		};
		this.isConnected = function (){
			return userService.isConnected();
		}

		$rootScope.$on('connectionStateChanged', function(event) {
			if( $routeParams.returnUrl!== undefined){
				$location.path($routeParams.returnUrl);
				$location.url($location.path());
			}else{
		    	$location.path('/home');	
			}
		});
	});

	app.controller('configurationController', function($scope, $location, userService) {
		$scope.user=userService.getCurentUser();
		if($scope.user===false){
			userService.signOut();
			$location.url("/login?returnUrl=" + $location.path());
		}
		$scope.signOut = function() {
    		userService.signOut();
    	}
        
    });

    app.controller('loginController', function($scope, $location,$http, userService) {
    	if(userService.isConnected()){
    		$location.path('/home');
    	}
    	$scope.user={email:"qwe@qwe"};

    	$scope.registration = function (){
    		if($scope.registrationEmail!==undefined ){
				$location.url('/registration?email='+$scope.registrationEmail);
    		}
    	};
    	$scope.loginFormSubmit = function (){
    		var user=$scope.user;
    		$http.post('sys/user/checkUser.php', {"user": angular.toJson($scope.user,false)}).
			success(function(data, status, headers, config) {
				if(data["error"]==="success"){
					if(userService.signIn($scope.user)){
						$location.path('/home');
					}else{
						$scope.errorMessage="Une erreur est survenue du côté serveur. Veuillez réessayer.";
					}
				}else{
					$scope.errorMessage=data["error"];
				}
			}).
			error(function(data, status, headers, config) {
				$scope.errorMessage="Une erreur est survenue du côté serveur. Veuillez réessayer.";
				console.log(data+"\n"+status+"\n"+headers);
			});
    	};
    });

    app.controller("registrationController", function($rootScope, $scope, $location, $http, userService,geolocation){
    	if(userService.isConnected()){
    		$location.path('/home');
    	}

    	$scope.user={email: $location.search().email};
    	$scope.mapShow=false;
    	$rootScope.lastMarker=null;

	    function initialize() {
			var markers = [];
			var mapCanvas = document.getElementById('mapCanvas');
			var mapOptions = {
				center: new google.maps.LatLng(45.47, -73.57),
				zoom: 8,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			var map = new google.maps.Map(mapCanvas, mapOptions)

			  // Create the search box and link it to the UI element.
			var input = /** @type {HTMLInputElement} */(
			      document.getElementById('address'));
			map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

			var searchBox = new google.maps.places.SearchBox(
			    /** @type {HTMLInputElement} */(input));

			  // Listen for the event fired when the user selects an item from the
			  // pick list. Retrieve the matching places for that item.
			google.maps.event.addListener(searchBox, 'places_changed', function() {
				var places = searchBox.getPlaces();

			    if (places.length == 0) {
			      return;
			    }
			    for (var i = 0, marker; marker = markers[i]; i++) {
			      marker.setMap(null);
			    }

			    // For each place, get the icon, place name, and location.
			    markers = [];
			    var bounds = new google.maps.LatLngBounds();
			    for (var i = 0, place; place = places[i]; i++) {
			    	var image = {
			    		url: place.icon,
			    		size: new google.maps.Size(71, 71),
			    		origin: new google.maps.Point(0, 0),
			    		anchor: new google.maps.Point(17, 34),
			    		scaledSize: new google.maps.Size(25, 25)
			    	};

			    	// Create a marker for each place.
			    	var marker = new google.maps.Marker({
			    		map: map,
			    		icon: image,
			    		title: place.name,
			    		position: place.geometry.location
			    	});

			    	markers.push(marker);

			    	bounds.extend(place.geometry.location);
			    }

			    map.fitBounds(bounds);
			});

			  // Bias the SearchBox results towards places that are within the bounds of the
			  // current map's viewport.
			google.maps.event.addListener(map, 'bounds_changed', function() {
				var bounds = map.getBounds();
				searchBox.setBounds(bounds);
				$rootScope.lastMarker=map.getCenter();
				$scope.getLocationAddress();
			});
			return map;
		}

		      
    	$scope.displayMap=function (){
    		if(!$scope.mapShow){
		    	google.maps.event.addDomListener(window, 'load', initialize);
		    	var map= initialize();

    		}
    		$scope.mapShow=true;

    		return map;
    	}


    	$scope.getUserLocation=function () {
    		var map= $scope.displayMap();
    		geolocation.getLocation().then(function(data){
			    $scope.coords = {lat:data.coords.latitude, long:data.coords.longitude};
			    var marker = new google.maps.Marker({
				    position: new google.maps.LatLng($scope.coords.lat, $scope.coords.long),
				    map: map,
				    title: 'Votre position'
				});
				map.setZoom(17);
				map.panTo(marker.position);
				map.setCenter(marker.position);
				//
		    });

   		 	$scope.getLocationAddress();
    	}


		$scope.getLocationAddress=function (){
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode( { 'latLng': $rootScope.lastMarker}, function(results, status) {
		        if (status == google.maps.GeocoderStatus.OK) {
		        	if (results[0]) {
		        		$scope.user.address=results[0].formatted_address;
		        		
		        		angular.forEach(results[0].address_components, function(value, key) {
						  if(value.types[0]!=undefined && value.types[1]!=undefined && value.types[0]==="locality" && value.types[1]==="political"){
						  	$scope.user.city=value.long_name;
						  }
						});
		        		$scope.user.lat=$rootScope.lastMarker.A;
		        		$scope.user.long=$rootScope.lastMarker.F;
		        	}
		        }else{
		        	//console.log("Geocode was not successful for the following reason: " + status);
		        }
		    });

	    }

	    $scope.registrationFormSubmit = function () {
	    	console.log($scope.user);
	    	var user=$scope.user;
	    	if(user.lat !== undefined || user.long !==undefined || user.address !==undefined){
	    		if(user.password === user.password_confirmation){
	    			$scope.errorMessage=null;
	    			console.log(user);
	    			$http.post('sys/user/userRegistration.php', {"user": angular.toJson($scope.user,false)}).
	    			success(function(data, status, headers, config) {
	    				if(data["error"]==="success"){
	    					if(userService.signIn($scope.user)){
								$location.path('/home');
							}else{
								$scope.errorMessage="Une erreur est survenue du côté serveur.";
							}
	    				}else{
	    					$scope.errorMessage=data["error"];
	    				}
  					}).
	    			error(function(data, status, headers, config) {
	    				$scope.errorMessage="Une erreur est survenue du côté serveur. Veuillez réessayer.";
	    				console.log(data+"\n"+status+"\n"+headers);
  					});

	    		}else{
	    			$scope.errorMessage= "Mots de passe non identique.";
	    		}
	    	}else{
	    		$scope.errorMessage= "Veuillez remplir votre localisation.";
	    	}
	    }
	});
		
		



})();
