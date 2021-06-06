wolfgames.factory("CommonService", ['services', '$uibModal', '$cookies', 'toastr', function (services, $uibModal, $cookies, toastr) {

    //----------------[RETURN FUNCTION FROM SERVICES]-------------\\
    var service = {};
    service.openModal = openModal;
    service.favs = favs;
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
                        fav: async function (services){
                            if($cookies.get('sessionToken')){
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
    //------(Update: Guardar en array e enviar cuando haya 'X' o cambio de pagina y hacer la animacion like dislike)-----\\
}]);
