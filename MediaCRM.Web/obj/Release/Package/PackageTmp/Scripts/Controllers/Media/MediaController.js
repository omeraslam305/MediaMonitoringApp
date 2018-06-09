CRMApp.controller('MediaController', ['$rootScope', '$scope', '$window', '$location', '$stateParams', 'MediaService', 'GlobalService', 'notify', function ($rootScope, $scope, $window, $location, $stateParams, MediaService, GlobalService, notify) {
    $scope.init = function () {
        $scope.example5customTextsMediaType = { buttonDefaultText: 'Select Media Type' };
        $scope.example5customTextsNewsRelatedTo = { buttonDefaultText: 'Select Relevance' };
        $scope.example5customTextsNewsType = { buttonDefaultText: 'Select News Type' };
        $scope.example5customTextsChannel = { buttonDefaultText: 'Select Channel' };
        $scope.example5customTextsCategories = { buttonDefaultText: 'Select Category(s)' };
        $scope.example5customTextsCity = { buttonDefaultText: 'Select City' };
        $scope.example5customTextsSentiment = { buttonDefaultText: 'Select Sentiment' };
        $("input[type='file']").get(0).value = "";
        $scope.FilePathUpload = "Browse";

        $scope.MediaTypeListAll = new Array();
        $scope.NewsRelatedToListAll = new Array();
        $scope.NewsTypeListAll = new Array();
        $scope.ChannelsListAll = new Array();
        $scope.CategoriesListAll = new Array();

        $scope.MediaTypeList = new Array();
        $scope.NewsRelatedToList = new Array();
        $scope.NewsTypeList = new Array();
        $scope.ChannelsList = new Array();
        $scope.CitiesList = new Array();
        $scope.CategoriesList = new Array();
        $scope.SentimentsList = new Array();

        $scope.CategoryModel = [];
        $scope.mediaType = {};
        $scope.newsRelatedTo = {};
        $scope.newsType = {};
        $scope.ChanSelect = {};
        $scope.citySelect = {};
        $scope.sentimentSelect = {};
        $scope.IsKEActivity = false;

        $scope.Script = "";
        $scope.Subject = "";
        $scope.Repeatition = "";
        $scope.KeNews = true;
        $scope.PageNumber = "PG-";
        $scope.PrValue = "";
        $scope.Multiplier = 3.2;
        $scope.AdvertisingRate = "";
        $scope.ColumnHeight = "";
        $scope.ColumnNumber = "";
        $scope.ClippingUpload;
        var today = new Date();
        today.setTime(today.getTime());
        today.setDate(today.getDate());
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        $scope.NewsTime = today;
        $scope.NewsDate = dd + '/' + mm + '/' + yyyy;
        $scope.notValidated = true;
        $scope.errorMsg = "";

        $scope.fileName = "";
        $scope.contentType = "";
        $scope.base64String = "";

        $scope.fullEdit = true;
        $scope.Id = $location.search().id !== undefined ? parseInt($location.search().id) : 0;
        if ($scope.Id > 0)
            $scope.fullEdit = false;
        $scope.GetMedia($scope.Id);
    }

    $scope.singleSelectSettings = {
        keyboardControls: true,
        enableSearch: true,
        closeOnSelect: true,
        selectionLimit: 1,
        smartButtonMaxItems: 3,
        smartButtonTextConverter: function (itemText, originalItem) {
            return itemText;
        }
    };

    $scope.multiSelectSettings = { 
        keyboardControls: true, 
        enableSearch: true,
        smartButtonMaxItems: 3,
        smartButtonTextConverter: function (itemText, originalItem) {
            return itemText;
        }
    };

    //$scope.groupsettings = {
    //    selectionLimit: 1,
    //    closeOnSelect : true,
    //    smartButtonMaxItems: 2,
    //    scrollable: false,
    //    scrollableHeight: '300px',
    //    smartButtonTextConverter: function (itemText, originalItem) {
    //        return itemText;
    //    }
    //}       
    
    $scope.EnableEditFullForm = function () {
        $scope.fullEdit = true;
    }

    $scope.GetMedia = function (id) {
        MediaService.GetMediaForm(id).then(function (l) {
            $scope.MediaTypeListAll = l.data.MediaTypesList;
            $scope.NewsRelatedToListAll = l.data.NewsRelatedToList;
            $scope.NewsTypeListAll = l.data.NewsTypeList;
            $scope.ChannelsListAll = l.data.ChannelsList;
            $scope.CategoriesListAll = l.data.CategoriesList;
            $scope.CitiesListAll = l.data.CitiesList;
            $scope.SentimentsListAll = l.data.SentimentsList;

            var currentUserRoles = $rootScope.UserObject.UserRoles;
            var isAdmin = currentUserRoles.indexOf("Media-Admin") != -1;
            if (isAdmin) {
                $.each($scope.MediaTypeListAll, function (key, value) {
                    $scope.MediaTypeList.push({ "label": value.Text, "id": "" + value.Value });
                });
               
            } else {
                var mediaType = [];
                if (currentUserRoles.indexOf("Media-Print") != -1) {
                    mediaType = $.grep($scope.MediaTypeListAll, function (a) {
                        return a.MediaTypeId == 3;
                    });
                    $scope.MediaTypeList.push({ "label": mediaType[0].Text, "id": "" + mediaType[0].Value });
                }
                if (currentUserRoles.indexOf("Media-Radio") != -1) {
                    mediaType = $.grep($scope.MediaTypeListAll, function (a) {
                        return a.MediaTypeId == 2;
                    });
                    $scope.MediaTypeList.push({ "label": mediaType[0].Text, "id": "" + mediaType[0].Value });
                }
                if (currentUserRoles.indexOf("Media-TV") != -1) {
                    mediaType = $.grep($scope.MediaTypeListAll, function (a) {
                        return a.MediaTypeId == 1;
                    });
                    $scope.MediaTypeList.push({ "label": mediaType[0].Text, "id": "" + mediaType[0].Value });
                }
            }

            $.each(l.data.NewsRelatedToList, function (key, value) {
                $scope.NewsRelatedToList.push({ "label": value.Text, "id": "" + value.Value });
            });

            $.each(l.data.CitiesList, function (key, value) {
                $scope.CitiesList.push({ "label": value.Text, "id": "" + value.Value });
            });

            $.each(l.data.CategoriesList, function (key, value) {
                $scope.CategoriesList.push({ "label" : value.Text, "id": "" + value.Value });
            });

            $.each(l.data.SentimentsList, function (key, value) {
                $scope.SentimentsList.push({ "label": value.Text, "id": "" + value.Value });
            });

            if ($scope.Id > 0) {
                var response = l.data;
                var selectedItem = [];

                selectedItem = $.grep($scope.MediaTypeListAll, function (a) {
                    return a.MediaTypeId == response.MediaTypeId;
                })[0];
                $scope.mediaType = { "label": selectedItem.Text, "id": "" + selectedItem.Value }

                selectedItem = $.grep($scope.NewsRelatedToListAll, function (a) {
                    return a.Value == response.NewsRelation;
                })[0];
                $scope.newsRelatedTo = { "label": selectedItem.Text, "id": "" + selectedItem.Value }

                var newsTypeList = $.grep($scope.NewsTypeListAll, function (a) {
                    return a.MediaTypeId == response.MediaTypeId;
                });

                var channelList = $.grep($scope.ChannelsListAll, function (a) {
                    return a.MediaTypeId == response.MediaTypeId;
                });

                $.each(newsTypeList, function (key, value) {
                    $scope.NewsTypeList.push({ "label": value.Text, "id": "" + value.Value, "isKEActivity": value.IsKEActivity });
                });

                $.each(channelList, function (key, value) {
                    $scope.ChannelsList.push({ "label": value.Text, "id": "" + value.Value });
                });

                selectedItem = $.grep(newsTypeList, function (a) {
                    return a.Value == response.NewsTypeId;
                })[0];
                $scope.newsType = { "label": selectedItem.Text, "id": "" + selectedItem.Value, "isKEActivity": selectedItem.IsKEActivity }

                selectedItem = $.grep(channelList, function (a) {
                    return a.Value == response.ChannelId;
                })[0];

                if(selectedItem)
                    $scope.ChanSelect = { "label": selectedItem.Text, "id": "" + selectedItem.Value }

                selectedItem = $.grep($scope.CitiesListAll, function (a) {
                    return a.Value == response.CityId;
                })[0];
                $scope.citySelect = selectedItem !== undefined ? { "label": selectedItem.Text, "id": "" + selectedItem.Value } : { "label": "", "id": "" }

                $scope.NewsDate = response.TransmissionDate;

                var timeVal = response.TransmissionTime.split(":")
                var transTime = new Date();
                transTime.setHours(parseInt(timeVal[0]));
                transTime.setMinutes(parseInt(timeVal[1]));
                $scope.NewsTime = transTime;

                for (i = 0; i < response.CategoryIds.length; i++) {
                    var data = $.grep($scope.CategoriesListAll, function (a) {
                        return a.Value == response.CategoryIds[i];
                    })[0];
                    //var obj = { "label": data.Text, "id": "" + data.Value }
                    $scope.CategoryModel.push({ "label": data.Text, "id": "" + data.Value });
                }

                selectedItem = $.grep($scope.SentimentsListAll, function (a) {
                    return a.Value == response.SentimentId;
                })[0];
                $scope.sentimentSelect = { "label": selectedItem.Text, "id": "" + selectedItem.Value }

                $scope.Script = response.Script;
                $scope.PrValue = response.PrValue;
                $scope.AdvertisingRate = response.AdvertisingRate;
                $scope.ColumnHeight = response.ColumnHeight;
                $scope.ColumnNumber = response.ColumnNumber;
                $scope.Subject = response.Subject;
                $scope.Repeatition = response.NumOfRepetition;
                $scope.PageNumber = response.PageNumber;
                $scope.IsKEActivity = response.IsKEActivity;
                if (response.ClippingAttachment != null) {
                    $scope.fileName = response.ClippingAttachment.FileName;
                    $scope.contentType = response.ClippingAttachment.ContentType;
                    $scope.base64String = response.ClippingAttachment.Base64String;
                }
            }
            else if ($scope.prevMediaType) {
                $scope.mediaType = $scope.prevMediaType;
                onItemSelectMedia($scope.mediaType);
            }
            else{
                var selectedMedia = $.grep($scope.MediaTypeList, function (a) {
                    return a.label == $location.search().Media;
                });
                if (selectedMedia.length > 0) {
                    $scope.prevMediaType = angular.copy(selectedMedia[0]);
                    $scope.mediaType = $scope.prevMediaType;
                    onItemSelectMedia($scope.mediaType);
                }
            }

        }, function (err) {
            GlobalService.ErrorPopup("Error", err.data.Message);
        });
    };

    if ($rootScope.UserObject != undefined)
        $scope.init();

    $scope.newsEventListeners = {
        onItemSelect: onItemSelectNews
    };

    $scope.mediaEventListeners = {
        onItemSelect: onItemSelectMedia
    };

    function onItemSelectNews(property) {
        var newsTypeId = property.id;
        var news = $.grep($scope.NewsTypeList, function (a) {
            return a.id == newsTypeId;
        });

        $scope.IsKEActivity = news[0].isKEActivity;
    };

    $scope.toggleKEActivity = function () {
        $scope.IsKEActivity = !$scope.IsKEActivity;
    }

    function onItemSelectMedia(property) {
        var mediaTypeId = property.id;

        var newsTypeList = $.grep($scope.NewsTypeListAll, function (a) {
            return a.MediaTypeId == mediaTypeId;
        });

        var channelList = $.grep($scope.ChannelsListAll, function (a) {
            return a.MediaTypeId == mediaTypeId;
        });

        //var categoryList = $.grep($scope.CategoriesListAll, function (a) {
        //    return a.MediaTypeId == mediaTypeId;
        //});

        $scope.newsType = {};
        $scope.ChanSelect = {};
        $scope.NewsTypeList = new Array();
        $scope.ChannelsList = new Array();
        //$scope.CategoriesList = new Array();

        $.each(newsTypeList, function (key, value) {
            $scope.NewsTypeList.push({ "label": value.Text, "id": "" + value.Value, "isKEActivity": value.IsKEActivity });
        });

        $.each(channelList, function (key, value) {
            $scope.ChannelsList.push({ "label": value.Text, "id": "" + value.Value });
        });        

        //$.each(categoryList, function (key, value) {
        //    $scope.CategoriesList.push({ label: value.Text, id: value.Value });
        //});
        $scope.CitiesList = new Array();
        $.each($scope.CitiesListAll, function (key, value) {
            $scope.CitiesList.push({ "label": value.Text, "id": "" + value.Value });
        });

        $scope.IsKEActivity = false;
        if ($scope.Id == 0) {
            if (mediaTypeId == "1" || mediaTypeId == "2") {
                $scope.NewsTime = new Date();
                $scope.PrValue = "";
                $scope.AdvertisingRate = "";
                $scope.ColumnHeight = "";
                $scope.ColumnNumber = "";

                $scope.fileName = "";
                $scope.contentType = "";
                $scope.base64String = "";
            } else {
                //$scope.CitiesList = new Array();
                $scope.NewsTime = null;
                $scope.Script = "";
            }
        }
    }


    var that = this;
    this.picker2 = {
        date: new Date(),
        timepickerOptions: {
            readonlyInput: false,
            showMeridian: false
        },
        buttonBar: {
            show: false
        }
    };

    this.openCalendar = function (e, picker) {
        that[picker].open = true;
    };

    this.closeCalendar = function (e, picker) {
        that[picker].open = false;
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);

    $scope.events = [
      {
          date: tomorrow,
          status: 'full'
      },
      {
          date: afterTomorrow,
          status: 'partially'
      }
    ];

    function getDayClass(data) {
        var date = data.date,
          mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }

    $scope.IsFormValid = function () {
        $scope.notValidated = false;
        //$scope.notValidated = $scope.newsType.length != 0 || $scope.ChanSelect.length != 0 || $scope.sentimentSelect.length != 0 || $scope.CategoryModel.length != 0;
        if ($scope.newsType.id === undefined) {
            $scope.notValidated = true;
            $scope.errorMsg = "Please select News Type";
        }

        if ($scope.ChanSelect.id === undefined) {
            $scope.notValidated = true;
            $scope.errorMsg = "Please select Channel";
        }
        
        if ($scope.newsRelatedTo.id === undefined) {
            $scope.notValidated = true;
            $scope.errorMsg = "Please select News Related To";
        }

        if ($scope.sentimentSelect.id === undefined) {
            $scope.notValidated = true;
            $scope.errorMsg = "Please select Sentiment";
        }

        if ($scope.CategoryModel.id === undefined) {
            $scope.notValidated = true;
            $scope.errorMsg = "Please select Category";
        }

        if ($scope.mediaType.id == "1" || $scope.mediaType.id == "2") {
            if ($scope.citySelect.id === undefined) {
                $scope.notValidated = true;
                $scope.errorMsg = "Please select City";
            }

            if ($scope.Script == "") {
                $scope.notValidated = true;
                $scope.errorMsg = "Please enter the Script";
            }

            if ($scope.NewsTime == null) {
                $scope.notValidated = true;
                $scope.errorMsg = "Please select Time";
            }               
        } else {

            if ($scope.PageNumber == "PG-" || $scope.PageNumber == "") {
                $scope.notValidated = true;
                $scope.errorMsg = "Please enter the Page Number";
            }
            /*if ($scope.ColumnNumber == "") {
                $scope.notValidated = true;
                $scope.errorMsg = "Please enter the col. number";
            }

            if ($scope.ColumnHeight == "") {
                $scope.notValidated = true;
                $scope.errorMsg = "Please enter col. height";
            }

            if ($scope.AdvertisingRate == "") {
                $scope.notValidated = true;
                $scope.errorMsg = "Please enter the advertising rate";
            }

            if ($scope.PrValue == "") {
                $scope.notValidated = true;
                $scope.errorMsg = "Please enter PR Value";
            }*/
        }
    }
    
    $scope.SubmitMediaForm = function () {
        $scope.errorMsg = "";
        if ($scope.mediaType.id === undefined) {
            $scope.errorMsg = "Please select Media Type";
            return;
        }

        if ($scope.newsType.id === undefined) {
            $scope.errorMsg = "Please select News Type";
            return;
        }

        if ($scope.ChanSelect.id === undefined) {
            $scope.errorMsg = "Please select Channel";
            return;
        }

        if ($scope.newsRelatedTo.id === undefined) {
            $scope.errorMsg = "Please select News Related To";
            return;
        }

        if ($scope.sentimentSelect.id === undefined) {
            $scope.errorMsg = "Please select Sentiment";
            return;
        }

        if ($scope.CategoryModel.length == 0) {
            $scope.errorMsg = "Please select Category";
            return;
        }
        var mediaType = parseInt($scope.mediaType.id);
        if (mediaType == 1 || mediaType == 2) {
            if ($scope.citySelect.id === undefined) {
                $scope.errorMsg = "Please select City";
                return;
            }

            if ($scope.Script == "") {
                $scope.errorMsg = "Please enter the Script";
                return;
            }

            if ($scope.NewsTime == null) {
                $scope.errorMsg = "Please select Time";
                return;
            }

            if ($scope.fullEdit) {
                GlobalService.ConfirmPopup("Confirm", "Are you sure you want to submit the news record? On submission an email will be generated."
                    , function (selectedItem) {
                    //alert($window.location.hash.split('?')[0])
                    if (selectedItem) {
                        $scope.Submit();
                    }
                });
            }
            else {
                $scope.Submit();
            }
        }
        else {
            if ($scope.PageNumber == "PG-" || $scope.PageNumber == "") {
                $scope.errorMsg = "Please enter the Page Number";
                return;
            }

            /*if ($scope.ColumnNumber == "") {
                $scope.errorMsg = "Please enter the col. number";
                return;
            }

            if ($scope.ColumnHeight == "") {
                $scope.errorMsg = "Please enter col. height";
                return;
            }

            if ($scope.AdvertisingRate == "") {
                $scope.errorMsg = "Please enter the advertising rate";
                return;
            }

            if ($scope.PrValue == "") {
                $scope.errorMsg = "Please enter PR Value";
                return;
            }*/

            $scope.Submit();
        }
    }

    $scope.convertToBase64StringAndSend = function (file) {
        var reader = new FileReader();
        reader.addEventListener("loadend", function () {
            console.log(reader.result.length);

            $scope.$apply(function () {
                // every changes goes here
                $scope.fileName = file.name;
                $scope.contentType = file.type;
                $scope.base64String = reader.result;
            });
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    $scope.Submit = function () {
        var id = $scope.Id;
        var mediaType = parseInt($scope.mediaType.id);
        var newsType = parseInt($scope.newsType.id);
        var channel = parseInt($scope.ChanSelect.id);
        var city = $scope.citySelect.id !== undefined ? parseInt($scope.citySelect.id) : 0;
        var newsDate = $scope.NewsDate;
        var newsTime = $scope.NewsTime != null ? $scope.NewsTime.getHours() + ":" + $scope.NewsTime.getMinutes() : "";
        var categories = "";
        $scope.CategoryModel.forEach(function (i) {
            categories += i.id + ","
        });
        categories = categories.substring(0, categories.length - 1);
        var sentiment = parseInt($scope.sentimentSelect.id);
        var newsRelation = parseInt($scope.newsRelatedTo.id);
        var script = $scope.Script;
        var subject = $scope.Subject;
        var pageNumber = $scope.PageNumber;
        var isKEActivity = $scope.IsKEActivity;
        var fullEdit = $scope.fullEdit;
        var numOfRepeat = $scope.Repeatition;
        var colNum = $scope.ColumnNumber;
        var colHeight = $scope.ColumnHeight;
        var advertisingRate = $scope.AdvertisingRate;
        var prValue = $scope.PrValue;
        var multiplier = $scope.Multiplier;

        if (mediaType == 3) {
            city = 0;
            newsTime = "";
            script = "";
            subject = "";
            numOfRepeat = 0;
        }
        else {
            $scope.fileName = "";
            $scope.contentType = "";
            $scope.base64String = "";
            colNum = "";
            colHeight = "";
            advertisingRate = "";
            prValue = "";
            multiplier = "";
        }

        MediaService.SaveMediaForm(id, mediaType, newsType, channel, city, newsDate, newsTime, categories, sentiment, subject, script, $scope.base64String, $scope.contentType, $scope.fileName, colNum, colHeight, advertisingRate, multiplier, numOfRepeat, newsRelation, prValue, fullEdit, pageNumber, isKEActivity).then(function (l) {
            notify({
                message: "Record saved successfully",
                position: GlobalService.position,
                duration: GlobalService.duration
            });

            var response = l;
            $scope.prevMediaType = $scope.mediaType;
            if ($scope.Id > 0)
                $window.location.href = "#/Media/Dashboard";
            else
                $scope.init();    
        }, function (err) {
            GlobalService.ErrorPopup("Error", err.data.Message);
        });
        
    }

    $scope.CalculatePRValue = function () {
        var advertisingRate = 0, columnHeight = 0, columnNumber = 0;
        if ($scope.AdvertisingRate) {
            advertisingRate = parseFloat($scope.AdvertisingRate);
        }

        if ($scope.ColumnHeight) {
            columnHeight = parseFloat($scope.ColumnHeight);
        }

        if ($scope.ColumnNumber) {
            columnNumber = parseFloat($scope.ColumnNumber);
        }

        $scope.PrValue = parseFloat($scope.Multiplier * advertisingRate * columnHeight * columnNumber).toFixed(2);
    }

    $scope.SetFileName = function () {
        var allowedExtentions = ["png", "jpg", "jpeg"];
        var file = $("input[type='file']").get(0).files[0];

        if (file) {
            var uploadedFilesExtentions = file.type.split('/')[1];
            if (!allowedExtentions.includes(uploadedFilesExtentions)) {
                return;
            }
            $scope.convertToBase64StringAndSend(file);
        }
    };
    
    $scope.BackToDashboard = function (){
        $window.location.href = "#/Media/Dashboard?id=" + $scope.mediaType.id;
    }

    $scope.RestMediaForm = function () {
        $scope.init();
    }

    $scope.$on('$locationChangeSuccess', function (e, newLocation, oldLocation) {
        $scope.prevMediaType = undefined;
        $scope.init();
    });

}]);