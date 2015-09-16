var gameModule = angular.module('aot.game', ['ngWebSocket']);


gameModule.config(['$sceDelegateProvider', function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'http://*.arenaoftitans.com/**',
    'https://*.arenaoftitans.com/**',
    'http://*.arenaoftitans.fr/**',
    'https://*.arenaoftitans.fr/**',
    'http://localhost:8080/**'
  ]);

  $sceDelegateProvider.resourceUrlBlacklist([]);
}]);
