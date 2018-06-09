CRMApp.controller('CategoriesController', ['$rootScope', '$scope', '$window', '$location', '$stateParams', 'MediaService', 'GlobalService', 'notify', function ($rootScope, $scope, $window, $location, $stateParams, MediaService, GlobalService, notify) {
    
    $scope.init = function () {
        $scope.LoadChannels();
    };
    
    $scope.example5customTexts = { buttonDefaultText: 'Please Select' };
    $scope.ChannelName = "";
    $scope.PageNumber = 0;
    $scope.Id = 0;
    $scope.ChannelsList = new Array();
    $scope.errorMsg = "";

    $scope.groupsettings = {
        selectionLimit: 1,
        closeOnSelect: true,
        smartButtonMaxItems: 2,
        smartButtonTextConverter: function (itemText, originalItem) {
            return itemText;
        }
    }

    $scope.LoadChannels = function () {     
        MediaService.GetCategories($scope.PageNumber).then(function (l) {
            if (l != null) {
                var response = l.data;
                $scope.ChannelsList.push.apply($scope.ChannelsList, response);
            }            
        }, function (err) {
            GlobalService.ErrorPopup("Error", 'Error in fetching, please try again.');
            console.log(err);
        });
    };

    $scope.addChannel = function () {
        $scope.errorMsg = "";
        if ($scope.ChannelName == "") {
            $scope.errorMsg = "Please enter category name";
            return;
        }

        var name = $scope.ChannelName;
        
        MediaService.SaveCategory($scope.Id, name).then(function (l) {
            if (l != null) {
                var response = l.data;
                if (response) {
                    var msg = $scope.Id > 0 ? "Category edited successfully" : "Category saved successfully";
                    notify({
                        message: msg,
                        position: GlobalService.position,
                        duration: GlobalService.duration
                    });
                    $scope.Id = 0;
                    $scope.ChannelName = "";
                    $scope.PageNumber = 0;
                    $scope.ChannelsList = new Array();
                    $scope.LoadChannels();
                }
                else {
                    notify({
                        message: "Category saved failed",
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

    $scope.deleteChannel = function (id) {
        GlobalService.ConfirmPopup("Confirm", "Are you sure you want to delete?", function (selectedItem) {
            //alert($window.location.hash.split('?')[0])
            if (selectedItem) {
                MediaService.DeleteCategory(id).then(function (l) {
                    var response = l.data;
                    if (response) {
                        notify({
                            message: "Category deleted successfully",
                            position: GlobalService.position,
                            duration: GlobalService.duration
                        });
                        $scope.ChannelsList = new Array();
                        $scope.PageNumber = 0;
                        $scope.LoadChannels();
                    }
                    else {
                        notify({
                            message: "Category deleted failed",
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

    $scope.editChannel = function (id) {
        var channel = $.grep($scope.ChannelsList, function (a) {
            return a.Id == id;
        });
        if (channel) {
            $scope.Id = channel[0].Id;
            $scope.ChannelName = channel[0].ChannelName;
        }
    }

    $scope.loadMoreChannels = function () {
        $scope.PageNumber++;
        $scope.LoadChannels();
    };

    if ($rootScope.UserObject != undefined)
        $scope.init();
}]);