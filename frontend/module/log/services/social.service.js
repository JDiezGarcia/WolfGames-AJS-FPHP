wolfgames.factory('SocialServices', ['services','CommonService', '$rootScope', 'toastr', function (services, CommonService, $rootScope, toastr) {

    let service = {
        initialize: initialize,
        sendData: sendData
    };
    return service


    async function initialize() {
        let firebaseData = await services.json("firebase", "config.json", "/angularjs_fphp/");
        let firebaseConfig = firebaseData;
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        } else {
            firebase.app(); // if already initialized, use that one
        }
    } // end_initialize

    function sendData(user) {
        services.post('log', 'social_login', user)
        .then(function (data) {
            if(data.result !=2){
                if (data.result == 0) {
                    toastr.success('Welcome to WolfGames ' + data.user);
    
                } else if (data.result == 1) {
                    toastr.success("Welcome again " + data.user);
                }
                localStorage.dataSession = JSON.stringify(data);
                $rootScope.userProfile = data;
                CommonService.userCart();
            }else{
                toastr.warning("The email is already in use");
            }
        }, function (error) {
            toastr.error("Server Error: " + error);
        });
    }

}]);

wolfgames.factory('GoogleServices', ['SocialServices', function (SocialServices) {
    let service = {
        login: login
    };
    return service;

    async function login() {
        await SocialServices.initialize()

        let provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('email');
        let authService = firebase.auth();

        authService.signInWithPopup(provider)
            .then(function (result) {
                result = result.additionalUserInfo.profile;
                let dataUser = {
                    userCod: "SOCIAL-GM-" + result.id,
                    user: "SOCIAL-" + result.email.replace(/[^A-Za-z0-9]/g, ""),
                    pass: CryptoJS.MD5(result.id).toString(),
                    email: result.email,
                    img: result.picture
                };
                SocialServices.sendData(dataUser);
            }).catch(function (error) {
            });
    } // end_logIn
}]); // end_services_Google

wolfgames.factory('GitHubServices', ['SocialServices', function (SocialServices) {
    let service = {
        login: login
    };
    return service;

    async function login() {
        await SocialServices.initialize()

        let provider = new firebase.auth.GithubAuthProvider();
        provider.addScope('user');
        let authService = firebase.auth();

        authService.signInWithPopup(provider)
            .then(function (result) {
                let dataUser = {
                    userCod: "SOCIAL-GH-" + result.additionalUserInfo.profile.node_id,
                    email: result.user.email,
                    user: result.additionalUserInfo.profile.login,
                    pass: CryptoJS.MD5(result.additionalUserInfo.profile.node_id).toString(),
                    img: result.additionalUserInfo.profile.avatar_url
                };
                SocialServices.sendData(dataUser);
            }).catch(function (error) {
            });
    } // end_logIn
}]);