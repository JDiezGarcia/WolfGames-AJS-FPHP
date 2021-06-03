wolfgames.controller('controller_login', function ($window, $scope, $routeParams, $route, $uibModalInstance, services, CommonService, toastr, $rootScope) {

    //-------[MODAl ACTIONS]-------\\
    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.openLogModal = function () {
        CommonService.openModal(null, 'log', 'register', 'controller_register');
    };

    //-------[LOGIN SECTION]-------\\

    $scope.regPass = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    $scope.regUser = /^([a-zA-Z]+|[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3}))$/;

    $scope.login = function() {
        
        let user = {'username': $scope.user, 'password': $scope.password};
        //CryptoJS.MD5($scope.password).toString() para despues del register
        services.post('log', 'userLog', user)
        .then(function(data){
            if (data) {
                localStorage.tokenSession = data.user;
                $rootScope.userProfile = data;
                toastr.success('Welcome '+data.user);
                $scope.closeModal();
            }else {
                toastr.error("Error: This account doesn't exist.");
            }
        }, function(error) {
            console.log(error);
            toastr.error("Server Error: "+ error);
        });
    };

});

wolfgames.controller('controller_register', function ($scope, $uibModalInstance, CommonService, services) {
    
    //-------[MODAl ACTIONS]-------\\
    $scope.openLogModal = function () {
        CommonService.openModal(null, 'log', 'login', 'controller_login');
    }
    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    //-------[REGISTER SECTION]-------\\
    $scope.regDir = /[A-Za-z0-9'\.\-\s\,]/;
    $scope.regName = /^([A-Za-zÀ-ÖØ-öø-ÿ'.]+(?: [A-Za-zÀ-ÖØ-öø-ÿ'.]+){0,2})$/;

    let user = {'username': $scope.user, 'password': $scope.password};
        //CryptoJS.MD5($scope.password).toString() para despues del register
        services.post('log', 'login', user)
        .then(function(data){
            if (data) {
                $scope.user = data.user;
                localStorage.tokenSession = data.JWT;
                $toastr.success('Log In succesfully.');
            }else {
                $toastr.error("This account doesn't exist.");
            }

        }, function(error) {
            console.log(error);
        });
        

});

wolfgames.controller('controller_logout', function ($scope, $uibModalInstance, $rootScope) {

    
    //-------[MODAl ACTIONS]-------\\
    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //-------[LOGOUT SECTION]-------\\
    $scope.logout = function () {
        delete localStorage.tokenSession;
        delete localStorage.userType;
        delete $rootScope.userProfile;
        $uibModalInstance.dismiss('cancel');
    }
});
