CRMApp.controller('UserController', ['$rootScope', '$scope', '$window', '$location', '$stateParams', 'UserService', 'GlobalService', 'notify', function ($rootScope, $scope, $window, $location, $stateParams, UserService, GlobalService, notify) {
        
    $scope.pageNumber = 0;
    $scope.Id = 0;
    $scope.errorMsg = "";

    $scope.init = function () {        
        $scope.GetUsersList("Media", $scope.pageNumber);
    }

    $scope.validateEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    $scope.replaceTilda = function (label) {
        // str.replace("Microsoft", "W3Schools")
        return label.replace('~', '');
    };

    $scope.example5customTexts = { buttonDefaultText: 'Please Select' };

    $scope.groupsettings = {
        selectionLimit: 1,
        closeOnSelect : true,
        smartButtonMaxItems: 2,
        smartButtonTextConverter: function (itemText, originalItem) {
            return itemText;
        }
    }

    $scope.UsersList = new Array();

    $scope.MediaTypeList = new Array();
    $scope.UserRightList = new Array();

    $scope.mediaType = [];
    $scope.userRight = [];
    $scope.name = "";
    $scope.email = "";
    $scope.TotalRecords = 0;
    $scope.ProceedToNext = false;

    $scope.GetUsersList = function (type, pageNumber) {
        $scope.UsersList = new Array();
        $scope.mediaType = new Array();
        $scope.userRight = new Array();
        $scope.UsersList = new Array();
        $scope.MediaTypeList = new Array();
        $scope.UserRightList = new Array();
        UserService.GetMediaUsers(type, pageNumber).then(function (l) {
            $scope.ProceedToNext = l.data.UserList.length == 5;
            $scope.UsersList.push.apply($scope.UsersList,l.data.UserList);
            $.each(l.data.MediaTypesList, function (key, value) {
                $scope.MediaTypeList.push({ "label": value.Text, "id": "" + value.Value });
            });
            $scope.TotalRecords = l.data.TotalRecords;

            $scope.UserRightList.push({ "label": "Admin", "id": "" + 1 });
            $scope.UserRightList.push({ "label": "User", "id": "" + 2 });

        }, function (err) {
            GlobalService.ErrorPopup("Error", err.data.Message);
        });
    };
    
    $scope.GetStyle = function (index) {
        return index % 2 == 0 ? "" : "at_blkk";
    };

    $scope.SaveUser = function () {
        var id =$scope.Id 
        var email = $scope.email;
        var name = $scope.name;
        var roles = "";
        if (!$scope.validateEmail(email)) {
            $scope.errorMsg = "Please enter a valid email address"
            return;
        }
        if (name == "") {
            $scope.errorMsg = "Please enter a name"
            return;
        }

        if ($scope.userRight.id === undefined) {
            $scope.errorMsg = "Please select a user right"
            return;
        }

        if ($scope.userRight.id == "1") {
            roles = "Media-Admin";
        }
        else {
            $scope.mediaType.forEach(function (i) {
                var type = $.grep($scope.MediaTypeList, function (a) {
                    return parseInt(a.id) == parseInt(i.id);
                })[0];
                roles += type.label + ",";
            });
            if (roles == "") {
                $scope.errorMsg = "Please select user type"
                return;
            }
            roles = roles.substring(0, roles.length - 1);
        }
        if (id > 0) {
            UserService.UpdateUser(id, name, email, roles).then(function (l) {
                var response = l.data;
                if (response) {
                    notify({
                        message: "User saved successfully",
                        position: GlobalService.position,
                        duration: GlobalService.duration
                    });
                    $scope.Id = 0;
                    $scope.email = "";
                    $scope.name = "";
                    $scope.GetUsersList("Media", $scope.pageNumber);
                }
                else {
                    notify({
                        message: "User saved failed",
                        position: GlobalService.position,
                        duration: GlobalService.duration
                    });
                }

            }, function (err) {
                GlobalService.ErrorPopup("Error", err.data.Message);
            });
        }
        else {
            UserService.CreateNewUser(id, name, email, roles).then(function (l) {
                var response = l.data;
                if (response) {
                    notify({
                        message: "User saved successfully",
                        position: GlobalService.position,
                        duration: GlobalService.duration
                    });
                    $scope.Id = 0;
                    $scope.email = "";
                    $scope.name = "";                    
                    $scope.pageNumber = 0;
                    $scope.GetUsersList("Media", $scope.pageNumber);
                }
                else {
                    notify({
                        message: "User saved failed",
                        position: GlobalService.position,
                        duration: GlobalService.duration
                    });
                }

            }, function (err) {
                GlobalService.ErrorPopup("Error", err.data.Message);
            });
        }
        angular.element("#email").removeAttr("disabled");       

    };

    $scope.EditUser = function (id) {
        $scope.mediaType = [];
        $scope.userRight = [];
        var user = $.grep($scope.UsersList, function (a) {
            return a.Id == id;
        });
        if (user) {
            $scope.Id = user[0].Id;
            $scope.email = user[0].Email;
            $scope.name = user[0].Name;
            angular.element("#email").attr("disabled", "disabled");

            //var rightsData = [];
            user[0].RightsArray.forEach(function (i) {
                var rightObj = $.grep($scope.MediaTypeList, function (a) {
                    return parseInt(a.id) == i;
                });
                console.log(rightObj)
                $scope.mediaType.push({ "label": rightObj[0].label, "id": "" + rightObj[0].id });
            });
            if (user[0].RightName == "Admin") {
                $scope.userRight = { "label": "Admin", "id": "" + 1 };
            }
            else {
                $scope.userRight = { "label": "User", "id": "" + 2 };
            }

        }
    };

    $scope.ChangeUserStatus = function (email, status) {
        GlobalService.ConfirmPopup("Confirm", "Are you sure you want to change?", function (selectedItem) {
            //alert($window.location.hash.split('?')[0])
            if (selectedItem) {
                UserService.ChangeUserStatus(email, status).then(function (l) {
                    var response = l.data;
                    if (response) {
                        notify({
                            message: "User status changed successfully",
                            position: GlobalService.position,
                            duration: GlobalService.duration
                        });
                        $scope.Id = 0;
                        $scope.email = "";
                        $scope.name = "";
                        $scope.mediaType = new Array();
                        $scope.userRight = new Array();
                        $scope.UsersList = new Array();
                        $scope.MediaTypeList = new Array();
                        $scope.UserRightList = new Array();
                        $scope.GetUsersList("Media", $scope.pageNumber);
                    }
                    else {
                        notify({
                            message: "User status changed failed",
                            position: GlobalService.position,
                            duration: GlobalService.duration
                        });
                    }

                }, function (err) {
                    GlobalService.ErrorPopup("Error", err.data.Message);
                });
            }
        });
    };

    

    $scope.DeleteUser = function (id) {
        GlobalService.ConfirmPopup("Confirm", "Are you sure you want to delete?", function (selectedItem) {
            //alert($window.location.hash.split('?')[0])
            if (selectedItem) {
                var user = $.grep($scope.UsersList, function (a) {
                    return parseInt(a.Id) == id;
                })[0];

                if (user) {
                    UserService.DeleteUser(user.Id, user.Name, user.Email, "").then(function (l) {
                        var response = l.data;
                        if (response) {
                            notify({
                                message: "User deleted successfully",
                                position: GlobalService.position,
                                duration: GlobalService.duration
                            });
                            $scope.Id = 0;
                            $scope.email = "";
                            $scope.name = "";
                            $scope.mediaType = new Array();
                            $scope.userRight = new Array();
                            $scope.UsersList = new Array();
                            $scope.MediaTypeList = new Array();
                            $scope.UserRightList = new Array();
                            $scope.GetUsersList("Media", $scope.pageNumber);
                        }
                        else {
                            notify({
                                message: "User deleted failed",
                                position: GlobalService.position,
                                duration: GlobalService.duration
                            });
                        }

                    }, function (err) {
                        GlobalService.ErrorPopup("Error", err.data.Message);
                    });
                }
            }
        });
    };

    $scope.Cancel = function () {
        $scope.Id = 0;
        $scope.email = "";
        $scope.name = "";
        $scope.mediaType = new Array();
        $scope.userRight = new Array();
        angular.element("#email").removeAttr("disabled");
    };


    //$scope.loadMoreUsers = function () {
    //    $scope.pageNumber++;
    //    $scope.GetUsersList("Media", $scope.pageNumber);
    //};

    $scope.goToNextPage = function () {
        if ($scope.ProceedToNext) {
            $scope.pageNumber++;
            $scope.GetUsersList("Media", $scope.pageNumber);
        }
    }

    $scope.goToPreviousPage = function () {
        if ($scope.pageNumber > 0) {
            $scope.pageNumber--;
            $scope.GetUsersList("Media", $scope.pageNumber);
        }
    }

    if ($rootScope.UserObject != undefined)
        $scope.init();

}]);