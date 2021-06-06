wolfgames.controller('controller_shopDetails', function($scope, game, fav, CommonService, $route) {
    $scope.data = game;
    console.log(fav)
    
    if(fav){
        $scope.data.fav = true;
    }
    $scope.fav = function (gameCod) {
        CommonService.favs(gameCod);
        $route.reload();
    };
    /*$scope.cart = services_shop.setArray(cart);*/
});