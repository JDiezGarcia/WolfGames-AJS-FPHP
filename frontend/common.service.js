wolfgames.factory("CommonService", ['services', '$uibModal', '$cookies', 'toastr', function (services, $uibModal, $cookies, toastr) {

    //----------------[RETURN FUNCTION FROM SERVICES]-------------\\
    var service = {};
    service.openModal = openModal;
    service.favs = favs;
    service.addGame = addGame;
    service.userCart = userCart;
    return service;

    //----------------[MODAL INSTANCE]---------------\\
    function openModal(data, module, funct, ctrl) {

        let resolv;
        let templ;
        switch (module) {
            case 'shop':
                templ = 'view_' + module + 'Modal.html',
                    resolv = {
                        gameDetails: async function (services) {
                            givenData = await services.get(module, funct, data);
                            return givenData;
                        },
                        fav: async function (services) {
                            if ($cookies.get('sessionToken')) {
                                givenData = await services.get('shop', 'single_fav', data);
                                return givenData;
                            }
                        }
                    };
                break;
            case 'log':
                templ = 'view_' + funct + 'Modal.html'
                break;
        };

        var modalInstance = $uibModal.open({
            animation: false,
            backdropClass: "grey-backdrop",
            templateUrl: 'frontend/module/' + module + '/view/' + templ,
            controller: ctrl,
            windowClass: 'show',
            size: "md",
            resolve: resolv
        });
    }

    //----------------[FAVS SYSTEM]---------------\\
    async function favs(gameCod) {
        if ($cookies.get('sessionToken')) {
            await services.get('shop', 'fav_action', gameCod)
                .then(function (data) {
                    if (data.operation == 0) {
                        toastr.success("You like the game " + gameCod);
                    } else {
                        toastr.error("You dislike the game " + gameCod);
                    }
                });
        } else {
            toastr.warning("You need to be login a account to fav a game");
            openModal('null', 'log', 'login', 'controller_login');
        }
    }

    //------------[ADD A GAME TO CART ]--------------\\
    function addGame(game) {
        if (localStorage.cartGames) {
            let cartList = JSON.parse(localStorage.cartGames);
            let newCart = [];
            let i = 0;
            let match = false;
            let quantity = game.quantity;
            while (cartList[i]) {
                if (cartList[i]['gameCod'] === game['gameCod']) {
                    game.quantity += cartList[i].quantity;
                    newCart.push(game);
                    toastr.success(quantity+' more '+game['gameName']+' added to the cart');
                    match = true;
                } else {
                    newCart.push(cartList[i]);
                }
                i++
            }
            if (!match) {
                newCart.push(game);
                toastr.success('The game '+game['gameName']+' added to the cart')
            }
            localStorage.cartGames = JSON.stringify(newCart);
        } else {
            let arr = [];
            arr.push(game);
            toastr.success('The game '+game['gameName']+' added to the cart')
            localStorage.cartGames = JSON.stringify(arr);
        }
    }

    //---------[LOAD THE CART FROM THE SERVER]---------\\
    function userCart() {
        services.get('cart', 'list').then(function (data) {
            games = data;
            for (let i = 0; i < games.length; i++) {
                addGame(games[i]);
            }
        });
    }

}]);
