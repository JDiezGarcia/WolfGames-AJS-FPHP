wolfgames.controller('controller_shopDetails', function($scope, game, fav, CommonService, $route, $rootScope) {
    $scope.data = game;
    
    if(fav){
        $scope.data.fav = true;
    }
    $scope.fav = function (gameCod) {
        CommonService.favs(gameCod);
        $route.reload();
    };

    $scope.addToCart = function (game) {
        game = {
            'gameCod': game['gameCod'],
            'gameImg': game['gameImg'],
            'gameName': game['gameName'],
            'quantity': 1,
            'price': game['price']
        }
        CommonService.addGame(game);
        $rootScope.cartTotal = JSON.parse(localStorage.cartGames).length
    };
});