var nameSpace = angular.module("ligne", []);

nameSpace.controller("MyFormCtrl", ['$scope', '$http', function ($scope, $http) {
    $scope.color = "black";
    $scope.ping = true;
    $scope.click = function () {
      $scope.ping = !$scope.ping;
      $http.get('/fileuploadrest/rest/hello?ping=' + $scope.ping).success(function (data) {
        angular.element("#rect2985bis").attr("style", "fill: " + data['color']);
      });
    };
  }
]);