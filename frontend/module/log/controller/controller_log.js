wolfgames.controller('controller_login', function ($scope, $route, $uibModalInstance, services, CommonService, toastr, $rootScope) {

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

    $scope.login = function () {

        let user = {
            'username': $scope.user,
            'password': CryptoJS.MD5($scope.password).toString()
        };
        services.post('log', 'userLog', user)
            .then(function (data) {
                if (data) {
                    localStorage.dataSession = JSON.stringify(data);
                    $rootScope.userProfile = data;
                    toastr.success('Welcome ' + data.user);
                    $scope.closeModal();
                    $route.reload();
                } else {
                    toastr.error("Error: This account doesn't exist.");
                }
            }, function (error) {
                console.log(error);
                toastr.error("Server Error: " + error);
            });
    };

});

wolfgames.controller('controller_register', function ($scope, $uibModalInstance, CommonService, services, toastr) {

    //-------[MODAl ACTIONS]-------\\
    $scope.openLogModal = function () {
        CommonService.openModal(null, 'log', 'login', 'controller_login');
    }
    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //-------[REGISTER SECTION]-------\\
    $scope.regUser = /^[a-zA-Z]*$/
    $scope.regEmail = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;
    $scope.regPass = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    $scope.regDir = /[A-Za-z0-9'\.\-\s\,]/;
    $scope.regName = /^([A-Za-zÀ-ÖØ-öø-ÿ'.]+(?: [A-Za-zÀ-ÖØ-öø-ÿ'.]+){0,2})$/;

    $scope.setMatchError = function (pass, pass2) {
        if (pass.$viewValue != pass2.$viewValue) {
            pass2.$error.match = true;
        } else {
            delete pass2.$error['match'];
        }
    }
    $scope.genders = [
        { name: "Male" },
        { name: "Female" },
        { name: "Other"}
    ];

    $scope.maxDate = new Date();
    $scope.minDate = new Date("1900-01-01");

    
    $scope.register = function () {
        let date = $scope.birth;
        let dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
        let MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
        let yyyy = date.getFullYear();
        date = yyyy + "/" + MM + "/" + dd;
        let user = {
            'user': $scope.user,
            'email': $scope.email,
            'pass': CryptoJS.MD5($scope.password).toString(),
            'name': $scope.name,
            'lastName': $scope.lastName,
            'dir': $scope.dir,
            'postCode': $scope.postCode,
            'city': $scope.city,
            'country': $scope.country,
            'sex': $scope.gender['name'],
            'birth': date
        };
        services.post('log', 'register', user)
            .then(function (data) {
                if (data.result == 0) {
                    $scope.closeModal();
                    toastr.success('We send you a mesage to verify your account.');
                } else {
                    toastr.error("This account already exist.");
                }
            }, function (error) {
                toastr.error(error);
            });
    };
});

wolfgames.controller('controller_logout', function ($scope, $uibModalInstance, $rootScope, $cookies, $route) {


    //-------[MODAl ACTIONS]-------\\
    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //-------[LOGOUT SECTION]-------\\
    $scope.logout = function () {
        $cookies.remove('sessionToken', { path: '/' });
        delete localStorage.dataSession;
        delete $rootScope.userProfile;
        $uibModalInstance.dismiss('cancel');
        $route.reload();
    }
});
