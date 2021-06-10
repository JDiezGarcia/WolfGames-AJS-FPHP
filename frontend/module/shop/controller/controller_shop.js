wolfgames.controller('controller_shop', function ($scope, $routeParams, $route, games, CommonService, favs, toastr, $rootScope) {

    //-----[VARS DECLARATIONS]-----\\
    var arrGames = games.games;
    var arrPlatforms = games.platforms;
    var arrGenres = games.genres;
    var total = games.total;
    var allGenres = games.allGenres;
    var allPlatforms = games.allPlatforms;

    //----------[DATA INJECTION]----------\\
    $scope.arrGames = setUnsetFavs(arrGames, favs);
    $scope.arrPlatforms = arrPlatforms;
    $scope.arrGenres = arrGenres;
    $scope.allGenres = checkDisable(allGenres, arrGenres, "genres", "genreName");
    $scope.allPlatforms = checkDisable(allPlatforms, arrPlatforms, "platforms", "platformCod");
    $scope.total = pagination(total);

    //-----------[FILTER ROUTE APPLIES]------------\\
    $scope.filters = function (filter, type) {
        var k = ['platforms', 'genres']
        if (k.indexOf(type) !== -1) {
            let arr = $routeParams[type];
            if (arr) {
                let i = arr.indexOf(filter);
                if (i == -1) {
                    $routeParams[type].push(filter);
                } else {
                    $routeParams[type].splice(i, 1);

                    if (arr.length == 0) {
                        $routeParams[type] = null;
                    }
                }
            } else {
                $routeParams[type] = [filter];
            }
            $routeParams.page = 1;
            $route.updateParams($routeParams);
            $route.reload();
        }
    }

    function setUnsetFavs(games, favs) {
        if (favs) {
            for (let i = 0; i < games.length; i++) {
                let fav = '';
                //---------[ADDING CHECKED ATTR]---------\\
                for (let l = 0; l < favs.length; l++) {
                    if (games[i]['gameCod'] === favs[l]['gameCod']) {
                        fav = true;
                        games[i].fav = fav;
                    }
                }
            }
        }
        return games;
    }
    //-----------[FILTER CHECK AND DISABLE APPLIES]------------\\
    function checkDisable(allFilters, filters, type, key) {
        for (let i = 0; i < allFilters.length; i++) {
            let prop = '';
            //---------[ADDING CHECKED ATTR]---------\\
            if (type in $route.current.params) {
                if (typeof $route.current.params[type] == "object") {
                    for (let l = 0; l < $route.current.params[type].length; l++) {
                        if (allFilters[i][key] === $route.current.params[type][l]) {
                            prop = 'checked';
                            allFilters[i].prop = prop;
                        }
                    }
                } else {
                    if (allFilters[i][key] === $route.current.params[type]) {
                        prop = 'checked';
                        allFilters[i].prop = prop;
                    }
                }
            }
            //---------[ADDING TOTALS AND DISABLED ATTR]---------\\
            let newFilter;
            if (filters) {
                newFilter = filters.find(f => f[key] === allFilters[i][key]);
            }
            let newTotal = 0;
            if (newFilter) {
                newTotal = newFilter.total;
                allFilters[i].total = newTotal;
            } else {
                prop = 'disabled';
                allFilters[i].prop = prop;
                allFilters[i].total = newTotal;
            }
        }
        return allFilters;
    }

    //----------[PAGINATION]----------\\
    function pagination(total) {

        let actualPage = parseInt($route.current.params.page);
        let limit = 8;
        let totalOffset = Math.ceil(parseInt(total) / limit) - 1;
        let object = {};
        object.pages = totalOffset + 1;

        if (actualPage) {
            object.actualPage = actualPage;
            object.nextPage = actualPage + 1;
            object.previousPage = actualPage - 1;
        } else {
            object.previousPage = 0;
            object.actualPage = 1;
            object.nextPage = object.actualPage + 1;
        }
        return object;
    }
    //----------[PAGE REDIRECTION]-----------\\
    $scope.changePage = function (actualPage, action, pages) {
        actualPage = parseInt(actualPage);
        switch (action) {
            case 'First':
                actualPage = 1;
                break;
            case 'Last':
                actualPage = parseInt(pages);
                break;

            case 'Next':
                actualPage = actualPage + 1;
                break;

            case 'Previous':
                actualPage = actualPage - 1;
                break;
            default:
                break;
        }
        $routeParams.page = actualPage
        $route.updateParams($routeParams);
        $route.reload();
    };
    //----------[PAGE REDIRECTION]-----------\\
    $scope.redirectShopDetails = function (game) {
        location.href = "#/shop/details/" + game;
    };

    //----------[MODAL DETAILS]------------\\
    $scope.openModal = function (gameCod) {
        CommonService.openModal(gameCod, 'shop', 'details_product', 'details_controller');
    };

    //----------[FUNCTION SET OR UNSET FAV]----------\\
    $scope.fav = function (gameCod) {
        CommonService.favs(gameCod);
        $route.reload();
    };

    //----------[FUNCTION TO ADD INTO THE CART]----------\\
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

wolfgames.controller('details_controller', function ($scope, gameDetails, $uibModalInstance, CommonService, fav, $rootScope) {

    $scope.data = gameDetails;
    if(fav){
        $scope.data.fav = true;
    }

    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //----------[FUNCTION TO ADD INTO THE CART]----------\\
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