wolfgames.factory("CommonService", ['services', '$uibModal', function (services, $uibModal) {
    
    //----------------[RETURN FUNCTION FROM SERVICES]-------------\\
    var service = {};
    service.openModal = openModal;
    return service;

    //----------------[MODAL INSTANCE]---------------\\
    function openModal(data, module, funct, ctrl) {

        let resolv;
        let templ;
        switch (module) {
            case 'shop':
                templ = 'view_' + module + 'Modal.html',
                resolv = {
                    gameDetails: async function (services, $route) {
                        givenData = await services.get(module, funct, data);
                        return givenData;
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
            templateUrl: 'frontend/module/' + module + '/view/'+ templ,
            controller: ctrl,
            windowClass: 'show',
            size: "md",
            resolve: resolv
        });
    }

}]);
