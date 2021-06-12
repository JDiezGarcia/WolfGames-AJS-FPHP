wolfgames.factory('SocialServices', ['services', function (services) {

    let service = {
        initialize: initialize,
        socialLoginSendData: socialLoginSendData

    };
    return service

    function initialize() {
        let firebase = services.json("firebase","config.json","/angularjs_fphp/");
        let firebaseConfig = firebase.values;
        console.log(firebaseConfig);
          if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
         }else {
            firebase.app(); // if already initialized, use that one
         }
    } // end_initialize



    function socialLoginSendData(dataUser) {

        console.log("aqui el post",dataUser);
    }


}]);

wolfgames.factory('services_Google', ['SocialServices', function (SocialServices) {
    let service = {
        logIn: logIn
    };
    return service;

    function logIn(getUser) {
        SocialServices.initialize()

        let provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('email');
        let authService = firebase.auth();

        authService.signInWithPopup(provider)
            .then(function (result) {
                console.log(result)
                let dataUser = [("GM-" + result.user.uid), result.user.email, result.user.displayName, result.user.photoURL];
                SocialServices.socialLoginSendData(dataUser);
                getUser();
            }).catch(function (error) {
                console.log(error);
            });
    } // end_logIn
}]); // end_services_Google

wolfgames.factory('services_GitHub', ['SocialServices', function (SocialServices) {
    let service = {
        logIn: logIn
    };
    return service;

    function logIn() {
        SocialServices.initialize()

        let provider = new firebase.auth.GithubAuthProvider();
        provider.addScope('email');
        let authService = firebase.auth();

        authService.signInWithPopup(provider)
            .then(function (result) {
                let dataUser = [("GH-" + result.user.uid), result.user.email, result.user.displayName, result.user.photoURL];
                console.log(result);
                SocialServices.socialLoginSendData(dataUser);
            }).catch(function (error) {
                console.log(error);
            });
    } // end_logIn
}]);