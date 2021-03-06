var wolfgames = angular.module('wolfgames', ['ngRoute', 'ngAnimate', 'ngTouch', 'ngSanitize', 'toastr', 'ui.bootstrap', 'ngAria', 'ngMessages', 'ngCookies']);
//----- TRADUCTION I18N -----\\
//--- http://jsfiddle.net/arleray/pmbyst0n/ ---\\
wolfgames.run(function ($rootScope, services, CommonService, toastr, $cookies) {
    //---------[SEARCH-BAR]---------\\
    $rootScope.searchBar = function () {
        let query = encodeURIComponent($rootScope.searchQuery);
        if ($rootScope.searchQuery.length > 0) {
            services.get('search', 'search_bar', query)
                .then(function (games) {
                    $rootScope.noQuery = false;
                    if (typeof games == 'object') {
                        $rootScope.noMatch = false;
                        delete $rootScope.searchGames;
                        $rootScope.searchGames = games;
                    } else {
                        $rootScope.noMatch = true;
                    }
                }, function (error) {
                    toastr.error(error);
                    $rootScope.noMatch = true;
                })
        } else {
            $rootScope.noQuery = true;
        }
    };

    $rootScope.redirectSearchList = function () {
        if (!$rootScope.searchQuery) {
            location.href = "#/shop";
        } else {
            let query = encodeURIComponent($rootScope.searchQuery);
            delete $rootScope.searchQuery;
            delete $rootScope.searchGames;
            location.href = "#/shop?search=" + query;
        }
    };

    $rootScope.redirectSearchOne = function (game) {
        delete $rootScope.searchQuery;
        delete $rootScope.searchGames;
        location.href = "#/shop/details/" + game;
    };

    //----------[MODALS]----------\\
    $rootScope.openLogModal = function () {
        if ($cookies.get('sessionToken')) {
            CommonService.openModal('null', 'log', 'logout', 'controller_logout');
        } else {
            CommonService.openModal('null', 'log', 'login', 'controller_login');
        }
    };

    //----------[SESSION]-----------\\
    if ($cookies.get('sessionToken')) {
        $rootScope.userProfile = JSON.parse(localStorage.dataSession);
    } else {
        delete localStorage.dataSession;
        delete $rootScope.userProfile;
    }

    //----------[CART]----------\\
    if (localStorage.cartGames) {
        let count = JSON.parse(localStorage.cartGames);
        $rootScope.cartTotal = count.length;
    } else {
        $rootScope.cartTotal = 0;
    }

    //----------[UPDATE CART]-----------\\
    setInterval(function () {
        CommonService.updateCart();
    }, 20000)
});

wolfgames.config(['$routeProvider', '$locationProvider',
    function ($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "frontend/module/home/view/view_home.html",
                controller: "controller_home",
                resolve: {
                    viewedGames: async function (services) {
                        data = await services.get('home', 'carousel', '0');
                        return data;
                    },
                    allPlatforms: function (services) {
                        data = services.get('home', 'platforms_img');
                        return data;
                    }
                }// END_RESOLVE
            })
            .when("/shop", {
                templateUrl: "frontend/module/shop/view/view_shop.html",
                controller: "controller_shop",
                resolve: {
                    games: async function (services, $route) {
                        let params = $route.current.params;
                        let page = params.page;
                        let search = params.search;
                        for (var k of ['platforms', 'genres', 'search']) {
                            if (k in params && typeof params[k] !== 'object') {
                                params[k] = [params[k]];
                            }
                        }
                        if (!page) {
                            page = 0;
                        } else {
                            page = (page - 1) * 8;
                        }

                        if (search) {
                            search = encodeURIComponent(search);
                        }

                        if (Object.keys(params).length > 0) {
                            data = {
                                platforms: params.platforms,
                                genres: params.genres,
                                offset: page,
                                search: search
                            }
                            response = await services.post('shop', 'products', data);
                        } else {
                            response = await services.post('shop', 'products', { offset: 0 });
                        }
                        if (Object.keys(response.games).length <= 0) {
                            return null;
                        }
                        return response;
                    },
                    favs: async function (services, $cookies) {
                        if ($cookies.get('sessionToken')) {
                            let favs = await services.get('shop', 'multi_fav');
                            return favs;
                        }
                    }
                }// END_RESOLVE
            })
            .when('/shop/details/:gameCod', {
                templateUrl: "frontend/module/shop/view/view_shopDetails.html",
                controller: "controller_shopDetails",
                resolve: {
                    game: async function (services, $route) {
                        data = await services.get('shop', 'details_product', $route.current.params.gameCod);
                        return data;
                    },
                    fav: async function (services, $cookies, $route) {
                        if ($cookies.get('sessionToken')) {
                            let favs = await services.get('shop', 'single_fav', $route.current.params.gameCod);
                            return favs;
                        }
                    }
                }// END_RESOLVE
            }).when('/cart', {
                templateUrl: "frontend/module/cart/view/view_cart.html",
                controller: "controller_cart",
                resolve: {
                    games: function ($cookies) {
                        if (localStorage.cartGames) {
                            let data = JSON.parse(localStorage.cartGames);
                            if ($cookies.get('sessionToken')) {
                                return data;
                            } else {
                                return data;
                            }
                        }
                    }
                }// END_RESOLVE
            }).when("/verify", {
                resolve: {
                    activateUser: async function ($location, services, $route, toastr) {
                        let data = {
                            "user": $route.current.params.user,
                            "token": $route.current.params.token
                        }
                        await services.post('log', 'verify_user', data)
                            .then(function (response) {
                                if (response.result == 0) {
                                    toastr.success('Thank you for verifing your account.', 'Account verified:');
                                } else if (response.result == 1) {
                                    toastr.info('The user is already verify', 'Info:');
                                } else {
                                    toastr.error('The current token is invalid. Login to resend one', 'Warning:');
                                }
                            }, function (error) {
                                toastr.error('The current token is invalid. Login to resend one');
                            });
                            $location.search('user', null);
                            $location.search('token', null);
                            $location.path('/home');
                    },
                }// end_resolve
            }).when("/recover", {
                controller: "controller_recover",
                resolve: {
                    changePass: async function ($route) {
                        let data = {
                            "user": $route.current.params.user,
                            "token": $route.current.params.token
                        }
                        return data;
                    }
                }
            }).otherwise("/home", {
                templateUrl: "frontend/module/home/view/view_home.html",
                controller: "controller_home"
            });
    }]);
