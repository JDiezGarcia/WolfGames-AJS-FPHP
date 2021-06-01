wolfgames.factory("CommonService", ['services', '$uibModal', function (services, $uibModal) {
    var service = {};
    service.openModal = openModal;
    return service;

    function openModal(data, module, funct, ctrl) {

        let resolv;
        switch (module) {
            case 'details':
                resolv = {
                    details: async function (services, $route) {
                        giveData = await services.get(modul, funct, data);
                        return giveData; 
                    }
                };
        }

        if (data) {

        }
        var modalInstance = $uibModal.open({
            animation: 'true',
            templateUrl: 'frontend/modules/'+module+'/view/'+module+'Modal.html',
            controller: ctrl,
            windowClass: 'show',
            size: "lg",
            resolve: resolv
        });
    }

}]);
