CRMApp.controller('MediaChannelController', ['$rootScope', '$scope', '$window', '$location', '$stateParams', 'MediaService', 'GlobalService', 'notify', function ($rootScope, $scope, $window, $location, $stateParams, MediaService, GlobalService, notify) {
    
    $scope.init = function () {
        $scope.LoadChannels();
    };
    
    $scope.example5customTexts = { buttonDefaultText: 'Please Select' };
    $scope.ChannelName = "";
    $scope.PageNumber = 0;
    $scope.Id = 0;
    $scope.ChannelsList = new Array();
    $scope.MediaTypeModel = [];
    $scope.MediaTypeList = new Array();
    $scope.errorMsg = "";
    $scope.fileName = "";
    $scope.contentType = "";
    $scope.base64String = "";

    $scope.groupsettings = {
        selectionLimit: 1,
        closeOnSelect: true,
        smartButtonMaxItems: 2,
        smartButtonTextConverter: function (itemText, originalItem) {
            return itemText;
        }
    }

    $scope.LoadChannels = function () {
        $scope.MediaTypeList = new Array();        
        MediaService.GetChannels($scope.PageNumber).then(function (l) {
            if (l != null) {
                var response = l.data;
                $.each(response.MediaTypeList, function (key, value) {
                    $scope.MediaTypeList.push({ "label": value.Text, "id": "" + value.Value });
                });
                $scope.ChannelsList.push.apply($scope.ChannelsList, response.ChannelList);
                //$scope.ChannelsList.push(response.ChannelList);
            }            
        }, function (err) {
            GlobalService.ErrorPopup("Error", 'Error in fetching, please try again.');
            console.log(err);
        });
    };

    $scope.addChannel = function () {
        $scope.errorMsg = "";
        if ($scope.ChannelName == "") {
            $scope.errorMsg = "Please enter channel name";
            return;
        }

        if ($scope.MediaTypeModel.id === undefined) {
            $scope.errorMsg = "Please select a type";
            return;
        }

        var name = $scope.ChannelName;
        var mediaTypeId = $scope.MediaTypeModel.id;
        
        MediaService.SaveMediaChannel($scope.Id, name, mediaTypeId).then(function (l) {
            if (l != null) {
                var response = l.data;
                if (response) {
                    var msg = $scope.Id > 0 ? "Channel edited successfully" : "Channel saved successfully";
                    notify({
                        message: msg,
                        position: GlobalService.position,
                        duration: GlobalService.duration
                    });
                    $scope.Id = 0;
                    $scope.ChannelName = "";
                    $scope.MediaTypeModel = new Array();
                    $scope.PageNumber = 0;
                    $scope.ChannelsList = new Array();
                    $scope.LoadChannels();
                }
                else {
                    notify({
                        message: "Channel saved failed",
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
                MediaService.DeleteChannel(id).then(function (l) {
                    var response = l.data;
                    if (response) {
                        notify({
                            message: "Channel deleted successfully",
                            position: GlobalService.position,
                            duration: GlobalService.duration
                        });
                        $scope.ChannelsList = new Array();
                        $scope.PageNumber = 0;
                        $scope.LoadChannels();
                    }
                    else {
                        notify({
                            message: "Channel deleted failed",
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

            var selectedItem = [];

            selectedItem = $.grep($scope.MediaTypeList, function (a) {
                return parseInt(a.id) == channel[0].MediaTypeId;
            })[0];
            $scope.MediaTypeModel = { "label": selectedItem.label, "id": "" + selectedItem.id }

            //var mediaType = $.grep($scope.MediaTypeList, function (a) {
            //    return parseInt(a.id) == channel[0].MediaTypeId;
            //});
            //$scope.MediaTypeModel.push({ "label": mediaType[0].label, "id": "" + mediaType[0].id });
        }
    }

    $scope.loadMoreChannels = function () {
        $scope.PageNumber++;
        $scope.LoadChannels();
    };

    $scope.uploadExcelFile = function () {
        $scope.errorMsg = "";
        var allowedExtentions = ["xls", "xlsx"];
        var file = $("input[type='file']").get(0).files[0];
        if (file) {
            var fileExtension = file.name.split('.')[1];
            if (!allowedExtentions.includes(fileExtension)) {
                $scope.errorMsg = "Invalid file";
                return;
            }
            $scope.fileName = file.name;
            $scope.contentType = file.type;
            $scope.convertToBase64StringAndSend(file);
        }
        else {
            $scope.errorMsg = "Please select an excel file";
            return;
        }
    };

    $scope.convertToBase64StringAndSend = function (file) {
        var reader = new FileReader();
        reader.addEventListener("loadend", function () {
            console.log(reader.result.length);
            $scope.base64String = reader.result;
            $scope.uploadChannelFile();

        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    $scope.uploadChannelFile = function () {

        MediaService.UploadChannelFile($scope.fileName, $scope.contentType, $scope.base64String).then(function (l) {
            if (l != null) {
                var response = l.data;
                if (response) {
                    notify({
                        message: "Channel saved successfully",
                        position: GlobalService.position,
                        duration: GlobalService.duration
                    });
                    $scope.PageNumber = 0;
                    $scope.Id = 0;
                    $scope.ChannelName = "";
                    $scope.MediaTypeModel = new Array();
                    $scope.ChannelsList = new Array();
                    $scope.LoadChannels();
                }
                else {
                    notify({
                        message: "Channel saved failed",
                        position: GlobalService.position,
                        duration: GlobalService.duration
                    });
                }

            }
        }, function (err) {
            GlobalService.ErrorPopup("Error", 'Error in saving, please try again.');
            console.log(err);
        });
    };

    $scope.SetFileName = function (el) {
        var fileName = el.files[0].name;
        angular.element(el).parent().find("span").html(fileName);
    };

    if ($rootScope.UserObject != undefined)
        $scope.init();
}]);