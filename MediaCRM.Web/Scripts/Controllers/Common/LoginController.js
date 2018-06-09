CRMApp.controller('LoginController', ['$rootScope', '$scope', 'AuthService', '$location', '$window', '$cookies', '$stateParams', 'GlobalService', 'notify', function ($rootScope, $scope, AuthService, $location, $window, $cookies, $stateParams, GlobalService, notify) {
    $scope.appType = $stateParams.appType;
   
    /*AuthService.VerifyCookies().then(function (l) {
        if (l.data == true) {
            if ($rootScope.IsAdmin == true)
                $window.location.href = "#/MembershipPackages";
            else
                $window.location.href = "#/PersonalProfile";
        }
    });*/

    $scope.currentDate = new Date();
    $scope.Login = function () {
        //ajax call for loggin in by using $scope.Login and $scope.Password and if $scope.Remember==true then remember credentials
        // alert("Signing In");
        AuthService.Login($scope.Email, $scope.Password, $scope.appType).then(function (l) {
            if (l != null) {
                AuthService.UserProfile($scope.Email, $scope.appType).then(function (l) {
                    if (l != null) {
                        $cookies.putObject("userSession", l.data, { path: '/' });

                        var MediaType = "";
                        if (l.data.UserRoles.indexOf("Media-Admin") !== -1 || l.data.UserRoles.indexOf("Media-TV") !== -1)
                            MediaType = "TV";
                        if (l.data.UserRoles.indexOf("Media-Print") !== -1)
                            MediaType = "Print";
                        if (l.data.UserRoles.indexOf("Media-Radio") !== -1)
                            MediaType = "Radio";

                        if ($scope.appType == "Media")
                            $window.location.href = "#/Media/AddMediaNews?Media=" + MediaType;
                        /*else if ($scope.appType == "Call")
                            $window.location.href = "#/CallCenter/Dashboard";
                        else if ($scope.appType == "Exec")
                            $window.location.href = "#/Executive/Dashboard";*/
                    }
                    else {
                       // alert('Error in fetching data, please try again.');
                        GlobalService.ErrorPopup("Error", "Error in fetching data, please try again.");

                    }
                }, function (err) {
                    //alert('Error in fetching data, please try again.');
                    GlobalService.ErrorPopup("Error", "Error in fetching data, please try again.");
                    console.log(err);
                });

            }
            else {
               // alert('Invalid Username or Password.');
                GlobalService.ErrorPopup("Error", "Invalid Username or Password, please try again.");

               
            }
        }, function (err) {
            //alert('Error in login, please try again.');
            GlobalService.ErrorPopup("Error", err.responseJSON.error_description);
            //GlobalService.ErrorPopup("Error", "The user Id or password you entered is incorrect. Kindly check caps lock and (or) enter correct user Id/password and try again.");
            console.log(err);
        });
    }

}]);