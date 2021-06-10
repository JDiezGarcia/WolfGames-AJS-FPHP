wolfgames.controller('controller_cart', function ($scope, games, $route, services, $cookies, toastr, CommonService, $rootScope) {

    //----------[DATA INJECTION]----------\\
    $scope.games = games;

    //-----------[CART INPUT LIMIT]------------\\
    $scope.limit = function (limit) {
        switch (true) {
            case limit == 0:
                return 1;
            case limit > 99:
                return 99;
            case limit < 1:
                return 1;
            case limit > 0 && limit < 100:
                return limit;
            default:
                return 1;
        }
    }
    //---------[CART BUTTONS QTY LIMIT]----------\\
    $scope.qty = function (op, limit) {
        switch (op) {
            case -1:
                if (limit == 1) {
                    return 1;
                } else {
                    return limit - 1;
                }
            case 1:
                if (limit == 99) {
                    return 99;
                } else {
                    return limit + 1;
                }
        }
    }
    //---------[UPDATE SHOPING CART]----------\\
    $scope.updateCart = function () {
        if ($scope.games) {
            localStorage.cartGames = JSON.stringify($scope.games);
        }
    }
    //----------[CALCULATE TOTAL PRICE]----------\
    $scope.total = function () {
        var total = 0;
        if($scope.games){
            for (var i = 0; i < $scope.games.length; i++) {
                var games = $scope.games[i];
                total += (games.price * games.quantity);
            }
        }
        return total;
    }

    $scope.removeGame = function (game) {
        let cartList = JSON.parse(localStorage.cartGames);
        let newCart = [];
        let i = 0;
        while (cartList[i]) {
            if (cartList[i]['gameCod'] !== game['gameCod']) {
                newCart.push(cartList[i]);
            } 
            i++
        }
        if(newCart.length > 0){
            localStorage.cartGames = JSON.stringify(newCart);
            $rootScope.cartTotal = newCart.length;
        }else{
            delete localStorage.cartGames;
            $rootScope.cartTotal = 0;
        }
        $route.reload();
    }

    $scope.checkOut = function (){
        let games = {
            games: JSON.parse(localStorage.cartGames)
        }
        if ($cookies.get('sessionToken')) {
            services.post('cart', 'insert_list', games);
            services.get('cart', 'checkout')
            .then(function (data) {
                console.log(data)
                toastr.success('Checkout Successful');
                delete localStorage.cartGames;
                $rootScope.cartTotal = 0;
                $route.reload();
            }, function () {
                toastr.error('Checkout Error');
            });
        } else {
            toastr.warning("You need to login a account to checkout");
            CommonService.openModal('null', 'log', 'login', 'controller_login');
        }
    }
});