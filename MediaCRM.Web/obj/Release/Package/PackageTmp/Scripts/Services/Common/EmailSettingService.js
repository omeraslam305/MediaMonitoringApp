CRMApp.factory('EmailService', function ($http) {
    var emailService = {};

    emailService.GetEmails = function (type,pageNumber) {
        var requestUrl = base_url + '/api/Email/GetEmails/' + type + '/' + pageNumber;
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {
            
        });
        return request;
    }

    emailService.SaveMediaEmail = function (Id, EmailId, Rights) {

        var _data = { Id: Id, EmailId: EmailId, Rights: Rights};

        var request = $http({
            method: 'POST',
            url: base_url + '/api/Email/SaveMediaEmail',
            data: JSON.stringify(_data)
        }).then(function (res) {

            return res;
        });
        return request;
    }

    emailService.DeleteEmail = function (id) {
        var requestUrl = base_url + '/api/Email/DeleteMediaEmail/' + id;
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
    }
   
    return emailService;
});