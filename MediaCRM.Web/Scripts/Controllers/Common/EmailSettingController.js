CRMApp.controller('EmailSettingController', ['$rootScope', '$scope', '$window', '$location', '$stateParams', 'EmailService', 'GlobalService', 'notify', function ($rootScope, $scope, $window, $location, $stateParams, EmailService, GlobalService, notify) {
    
    $scope.init = function () {
        //$rootScope.$broadcast('Check_Routing', $stateParams.comingFrom);        
        $scope.LoadEmails();
    };

    $scope.validateEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    $scope.example5customTexts = { buttonDefaultText: 'Please Select' };
    $scope.EmailId = "";
    $scope.PageNumber = 0;
    $scope.Id = 0;
    $scope.EmailRightsList = new Array();
    $scope.RightModel = [];
    $scope.EmailsList = new Array();
    $scope.errorMsg = "";

    $scope.groupsettings = {
        selectionLimit: 1,
        closeOnSelect : true,
        smartButtonMaxItems: 2,
        smartButtonTextConverter: function (itemText, originalItem) {
            return itemText;
        }
    }

    $scope.LoadEmails = function () {
        var appType = 1;
        $scope.EmailRightsList = new Array();
        $scope.EmailsList = new Array();
        EmailService.GetEmails(appType,$scope.PageNumber).then(function (l) {
            if (l != null) {
                var response = l.data;
                $.each(response.RightsList, function (key, value) {
                    $scope.EmailRightsList.push({ "label": value.Text, "id": "" + value.Value });
                });
                $scope.EmailsList.push.apply($scope.EmailsList, response.EmailList);
            }            
        }, function (err) {
            GlobalService.ErrorPopup("Error", 'Error in fetching, please try again.');
            console.log(err);
        });
    };

    $scope.AddEmail = function () {
        $scope.errorMsg = "";
        if (!$scope.validateEmail($scope.EmailId)) {
            $scope.errorMsg = "Please enter a valid Email Address";
            return;
        }

        if ($scope.RightModel.length == 0) {
            $scope.errorMsg = "Please select Rights";
            return;
        }

        var email = $scope.EmailId;
        var rights = "";
        $scope.RightModel.forEach(function (i) {
            rights += i.id++ + ","
        });
        rights = rights.substring(0, rights.length - 1);
        
        EmailService.SaveMediaEmail($scope.Id, email, rights).then(function (l) {
            if (l != null) {
                var response = l.data;
                if (response) {
                    notify({
                        message: "Email saved successfully",
                        position: GlobalService.position,
                        duration: GlobalService.duration
                    });
                    $scope.Id = 0;
                    $scope.EmailId = "";
                    $scope.RightModel = new Array();
                    $scope.EmailsList = new Array();
                    $scope.LoadEmails();
                }
                else {
                    notify({
                        message: "Email saved failed",
                        position: GlobalService.position,
                        duration: GlobalService.duration
                    });
                }
                
            }
        }, function (err) {
            GlobalService.ErrorPopup("Error", 'Error in fetching, please try again.');
            console.log(err);
        });

    };

    $scope.GetStyle = function (index) {
        return index % 2 == 0 ? "" : "at_blkk";
    };

    $scope.DeleteEmail = function (id) {
        GlobalService.ConfirmPopup("Confirm", "Are you sure you want to delete?", function (selectedItem) {
            //alert($window.location.hash.split('?')[0])
            if (selectedItem) {
                EmailService.DeleteEmail(id).then(function (l) {
                    var response = l.data;
                    if (response) {
                        notify({
                            message: "Email deleted successfully",
                            position: GlobalService.position,
                            duration: GlobalService.duration
                        });
                        $scope.LoadEmails();
                    }
                    else {
                        notify({
                            message: "Email deleted failed",
                            position: GlobalService.position,
                            duration: GlobalService.duration
                        });
                    }
                }, function (err) {
                    GlobalService.ErrorPopup("Error", err.data.Message);
                });
            }
        });
    }

    $scope.EditEmail = function (id) {
        $scope.RightModel = [];
        var email = $.grep($scope.EmailsList, function (a) {
            return a.Id == id;
        });
        if (email) {
            $scope.Id = email[0].Id;
            $scope.EmailId = email[0].EmailId;

            //var rightsData = [];
            email[0].RightsArray.forEach(function (i) {
                debugger;
                var rightObj = $.grep($scope.EmailRightsList, function (a) {
                    return parseInt(a.id) == i;
                });
                console.log(rightObj)
                $scope.RightModel.push({ "label": rightObj[0].label, "id": "" + rightObj[0].id });
            });

        }
    }

    $scope.LoadMoreEmails = function () {
        $scope.PageNumber++;
        $scope.LoadEmails();
    };

    $scope.ResetEmail = function () {
        $scope.Id = 0;
        $scope.EmailId = "";
        $scope.RightModel = [];
        $scope.errorMsg = "";
    };

    if ($rootScope.UserObject != undefined)
        $scope.init();
}]);