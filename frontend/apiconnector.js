wolfgames.factory("services", ['$http', '$q', function ($http, $q) {
    let serviceBase = '/angularjs_fphp/api';
    let obj = {};
    
    obj.get = function (module, action, data = null) {
        var defered = $q.defer();
        var promise = defered.promise;
        
        
        $http({
            method: 'GET',
            url: serviceBase + '/' + module + '/' + action + '/' + (data ? data : '')
        }).success(function (data, status, headers, config) {
            console.log(data.content)
            defered.resolve(data.content);
        }).error(function (data, status, headers, config) {
            defered.reject(data.error);
        });
        return promise;
    };
    //api/home/carousel
    //data: data
    obj.post = function (module, action, data = {}) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http({
            method: 'POST',
            url: serviceBase + '/' + module + '/' + action,
            data: data
        }).success(function (data, status, headers, config) {
            defered.resolve(data.content);
        }).error(function (data, status, headers, config) {
            defered.reject(data.error);
        });
        return promise;
    }; 

    obj.put = function (module, functi, dada) {
        var defered = $q.defer();
        var promise = defered.promise;
        $http({
            method: 'PUT',
            url: serviceBase + module + '&op=' + functi,
            data: dada
        }).success(function (data, status, headers, config) {
            defered.resolve(data);
        }).error(function (data, status, headers, config) {
            defered.reject(data);
        });
        return promise;
    };

    obj.delete = function (module, functi, dada) {
        var defered = $q.defer();
        var promise = defered.promise;
        $http({
            method: 'DELETE',
            url: serviceBase + module + '&op=' + functi + '&param=' + dada
        }).success(function (data, status, headers, config) {
            //console.log(data);
            defered.resolve(data);
        }).error(function (data, status, headers, config) {
            defered.reject(data);
        });
        return promise;
    };

    return obj;
}]);
