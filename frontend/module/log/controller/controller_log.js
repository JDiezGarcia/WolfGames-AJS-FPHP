wolfgames.controller('controller_login', function ($scope, $route, $uibModalInstance, services, CommonService, toastr, $rootScope, services_Google, services_GitHub) {

    //-------[MODAl ACTIONS]-------\\
    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.openLogModal = function () {
        CommonService.openModal(null, 'log', 'register', 'controller_register');
    };

    $scope.recoverPassModal = function () {
        CommonService.openModal(null, 'log', 'recover', 'controller_recover');
    }
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
                if (data == 2) {
                    toastr.warning("Se ha enviado un nuevo enlace a tu correo", "Verificacion");
                } else if (data) {
                    localStorage.dataSession = JSON.stringify(data);
                    $rootScope.userProfile = data;
                    toastr.success('Welcome ' + data.user);
                    $scope.closeModal();
                    CommonService.userCart();
                } else {
                    toastr.error("Error: This account doesn't exist.");
                }
            }, function (error) {
                console.log(error);
                toastr.error("Server Error: " + error);
            });
    };

    //----------[SOCIAL LOGIN]----------\\
    $scope.googleSign = function () {
        services_Google.logIn()
    }

    $scope.githubSign = function () {
        services_GitHub.logIn()
    }

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
        console.log(pass.$viewValue, pass2.$viewValue)
        if (pass.$viewValue != pass2.$viewValue) {
            pass2.$invalid = true;
            pass2.$error.match = true;
        } else {
            pass2.$invalid = false;
            delete pass2.$error['match'];
        }
    }
    $scope.genders = [
        { name: "Male" },
        { name: "Female" },
        { name: "Other" }
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

wolfgames.controller('controller_recover', function ($scope, $uibModalInstance, services, toastr,$location, CommonService, $rootScope, $cookies, $route) {

    //--------[REGULAR EXPRESIONS]---------\\
    $scope.regPass = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    $scope.regUser = /^([a-zA-Z]+|[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3}))$/;
    
    //-------[MODAl ACTIONS]-------\\
    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    $scope.setMatchError = function (pass, pass2) {
        if (pass.$viewValue != pass2.$viewValue) {
            pass2.$invalid = true;
            pass2.$error.match = true;
        } else {
            pass2.$invalid = false;
            delete pass2.$error['match'];
        }
    }

    $scope.checkKey = function () {
        let token = {
            "token": $scope.recoverSend.codeKey.$viewValue
        }
        services.post('log', 'check_token', token)
            .then(function (data) {
                if (data.result == 0) {
                    toastr.success("The Code Key is Valid", "Valid:")
                    $scope.recoverSend.codeKey.$invalid = false;
                    delete $scope.recoverSend.codeKey.$error['verify'];                    
                }else{
                    $scope.recoverSend.codeKey.$error.verify = true;
                    $scope.recoverSend.codeKey.$invalid = true;
                }
            }, function (error) {
                toastr.error(error);
            });
    }

    //-------[RECOVER SEND]-------\\
    $scope.sendRecover = function () {
        let user = $scope.user;
        services.get('log', 'recover_send', user)
            .then(function (data) {
                if (data.result == 0) {
                    toastr.success('We send you a link to restore your password.');
                    $scope.recoverInfo = true;  
                    $scope.recoverSend.codeKey.$invalid = true;             
                } else {
                    toastr.error("This account don't exist.");
                }
            }, function (error) {
                toastr.error(error);
            });      
    };

    $scope.sendChange = function () {
        let user = {
            'pass': CryptoJS.MD5($scope.password).toString(),
            'user': $scope.user
        };
        services.post('log', 'change_pass', user)
            .then(function (data) {
                if (data.result == 0) {
                    $scope.closeModal();
                    toastr.success('You change successfuly the password.', 'Success:');
                } else {
                    toastr.error("We couldn't change the password.", 'Error');
                }
            }, function (error) {
                toastr.error(error);
            });
    };
});