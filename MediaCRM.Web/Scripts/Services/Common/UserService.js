
CRMApp.factory('UserService', function ($http) {
    var userService = {};

    userService.GetMediaUsers = function (type, pageNumber) {
        var requestUrl = base_url + '/api/User/GetMediaUsers/' + type + '/' + pageNumber;
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {
        });
        return request;
    }


    userService.CreateNewUser = function (Id, Name, Email, UserRoles) {

        var _data = { Id: Id, Name: Name, Email: Email, UserRoles: UserRoles };

        var request = $http({
            method: 'POST',
            url: base_url + '/api/Account/CreateNewUser',
            data: JSON.stringify(_data)
        }).then(function (res) {
            return res;
        });
        return request;

    }

    userService.UpdateUser = function (Id, Name, Email, UserRoles) {

        var _data = { Id: Id, Name: Name, Email: Email, UserRoles: UserRoles };

        var request = $http({
            method: 'POST',
            url: base_url + '/api/Account/UpdateUser',
            data: JSON.stringify(_data)
        }).then(function (res) {
            return res;
        });
        return request;
    }

    userService.UpdatePersonalProfile = function (Name, Email, ProfileUrl, SignHTML) {

        var _data = { Name: Name, Email: Email, ProfileUrl: ProfileUrl, SignHTML: SignHTML };

        var request = $http({
            method: 'POST',
            url: base_url + '/api/User/UpdatePersonalProfile',
            data: JSON.stringify(_data)
        }).then(function (res) {

            return res;
        });
        return request;
    }

    userService.DeleteUser = function (Id, Name, Email, UserRoles) {

        var _data = { Id: Id, Name: Name, Email: Email, UserRoles: UserRoles };

        var request = $http({
            method: 'POST',
            url: base_url + '/api/Account/DeleteUser',
            data: JSON.stringify(_data)
        }).then(function (res) {
            return res;
        });
        return request;
    }

    userService.ChangeUserStatus = function (email, status) {
        var request = $http({
            method: 'GET',
            url: base_url + '/api/Account/ChangeUserStatus/' + email + '/' + status
        }).then(function (res) {
            return res;
        });
        return request;
    }

   
    return userService;
});