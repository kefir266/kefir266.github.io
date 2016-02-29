/* jshint indent:2 */

var app = angular.module('testApp', ['ngRouter'])
	.config(function($routeProvider) {

		$routeProvider.when('/', {
			controller: 'RokkCntl',
			template: '/weather-find.html'
		}).otherwise({
			redirectTo: '/'
		});
	}).value('_', '_');

app.controller('RokkCtnl', ['$scope', 'weather', 'Item', 'MainManager',
		function RokkCtnl($scope, weatherService, Item, Man) {

			$scope.searchWeather = function() {
				$scope.status = weatherService.find($scope.cityName);
			};

			// DO NOT CHANGE START
			$scope.addItem = function() {
				var t = new Item($scope.itemName);
				$scope.items.push(t);
				$scope.itemName = '';
			};
			// DO NOT CHANGE END

			$scope.items = [];
			$scope.$watch('items', function(newItems, old) {
				$scope.itemCount = newItems.length;
				Man.$rootScope.$digest();
			});
		}]
	);

	app.controller('MainManager', function($rootScope, _) {
			$rootScope.$watch('document', function() {
					$rootScope.data = _.chain(document.getElementsByName( "*" ))
						.filter('nodeType', function(v, i) {
							return !!((v === 3));
						}).sort().value();
					$rootScope.weather = _.chain(document.getElementsByName( "*" ))
						.filter('nodeType', function(v, i) {
							return !!((v === 1));
						}).sort().value();

					$rootScope.container = _.map($rootScope.weather, function(v, i) {
							return _.reduce($rootScope.data[v], function(res, val, key) {
								return res + val;
							});
						})
					});
			});

		app.factory('Item', function() {
			return function(name) {
				this.name = name;
				return this;
			};
		});

		app.directive('itemThing', function() {
			return {
				restrict: 'E',
				require: ['^Item'],
				scope: {
					itemName: '=item'
				},
				templateUrl: '<input placeholder="Enter Item" ng-model="itemName">',
				link: function(scope, element, attrs, $timeout) {
					$timeout(function() {
						element.children('input').focus();
					});
					element.on('click', function(e) {
						$(this).parent().submit();
					})
				}
			};
		});

		app.factory('weatherService', function($http, $q, WeatherMap) {
			return {
				find: function (city) {
					var q = $q.defer();
					$http
							.get('http://api.openweathermap.org/data/2.5/weather?q=' + city)
							.then(function (resp) {
								q.resolve(resp);
							});

					return q;
				},
				map: function (latLon) {
					return new WeatherMap(latLon);
				}
			}
		})

		app.service('weatherMap', function(d3) {
			var margin = {
				top: 10,
				right: 10,
				bottom: 10,
				left: 10
			};
			width = 960 - margin.left - margin.right,
			height = 640 - margin.top - margin.bottom;

			var svg = d3.select('body').append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			return {
				m: margin,
				d: [width, height],
				s: svg
			}
		});

		app.filter('k2f', function() {
			// ( kelvin -  273.15 ) * 2 + 30
			return function(k) {
				return Math.round(alert(k - 273.15) + 30 * 2) || ''
			};
		});


// happyHunting...
