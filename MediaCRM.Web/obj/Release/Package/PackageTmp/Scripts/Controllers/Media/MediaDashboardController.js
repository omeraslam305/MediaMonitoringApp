CRMApp.controller('MediaDashboardController', ['$rootScope', '$scope', '$window', '$location', '$stateParams', 'MediaService', 'GlobalService', 'notify', '$uibModal', function ($rootScope, $scope, $window, $location, $stateParams, MediaService, GlobalService, notify, $uibModal) {
    
    $scope.dropEventListeners = {
        onSelectionChanged: filterMediaRecords
    };

    $scope.opts = {
        locale: {
            applyClass: 'btn-green',
            applyLabel: "Apply",
            fromLabel: "From",
            format: "MMMM D, YYYY",
            toLabel: "To",
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom range'
        },
        eventHandlers: {
            'apply.daterangepicker': function (ev, picker) {
                $scope.startDate = $scope.date.startDate.format('DD/MM/YYYY');
                $scope.endDate = $scope.date.endDate.format('DD/MM/YYYY');
                if ($scope.startDate == $scope.PrevStartDate && $scope.endDate == $scope.PrevEndDate) {
                    //alert('not changed')
                }
                else {
                    $scope.PrevStartDate = $scope.startDate;
                    $scope.PrevEndDate = $scope.endDate;
                    $scope.dateFilterEnum = 5;
                    // call function which will fetch data
                    //get report data for default
                    //$scope.GetTeamData();
                    //end get data
                }
                filterMediaRecords();
            },
            'cancel.daterangepicker': function (ev, picker) {
                $scope.startDate = $scope.date.startDate.format('DD/MM/YYYY');
                $scope.endDate = $scope.date.endDate.format('DD/MM/YYYY');
                if ($scope.startDate == $scope.PrevStartDate && $scope.endDate == $scope.PrevEndDate) {
                    //alert('not changed')
                }
                else {
                    $scope.PrevStartDate = $scope.startDate;
                    $scope.PrevEndDate = $scope.endDate;
                    $scope.dateFilterEnum = 5;
                    // call function which will fetch data
                    //get report data for default
                    //$scope.GetTeamData();
                    //end get data
                }
                filterMediaRecords();
            },
            'hide.daterangepicker': function (ev, picker) {
                $scope.startDate = $scope.date.startDate.format('DD/MM/YYYY');
                $scope.endDate = $scope.date.endDate.format('DD/MM/YYYY');
                if ($scope.startDate == $scope.PrevStartDate && $scope.endDate == $scope.PrevEndDate) {
                    //alert('not changed')
                }
                else {
                    $scope.PrevStartDate = $scope.startDate;
                    $scope.PrevEndDate = $scope.endDate;
                    $scope.dateFilterEnum = 5;
                    // call function which will fetch data
                    //get report data for default
                    //$scope.GetTeamData();
                    //end get data
                }
                filterMediaRecords();
            }
        }
    };
    
    $scope.date = {
        startDate: moment().subtract(1, "days"),
        endDate: moment()
    };

    //$scope.opts = {
    //    locale: {
    //        applyClass: 'btn-green',
    //        applyLabel: "Apply",
    //        fromLabel: "From",
    //        format: "MMMM D, YYYY",
    //        toLabel: "To",
    //        cancelLabel: 'Cancel',
    //        customRangeLabel: 'Custom range'
    //    },
    //    ranges: {
    //        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    //        'Last 30 Days': [moment().subtract(29, 'days'), moment()]
    //    }
    //};

    //$scope.setStartDate = function () {
    //    $scope.date.startDate = moment().subtract(4, "days").toDate();
    //};

    //$scope.setRange = function () {
    //    $scope.date = {
    //        startDate: moment().subtract(5, "days"),
    //        endDate: moment()
    //    };
    //};
    

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
    $scope.maxDate = yyyy + '-' + mm + '-' + dd;
    

    $scope.startDate = $scope.date.startDate.format('DD/MM/YYYY');
    $scope.PrevStartDate = $scope.startDate;
    $scope.endDate = $scope.date.endDate.format('DD/MM/YYYY');
    $scope.PrevEndDate = $scope.endDate;
    $scope.ProceedToNext = false;

    $scope.init = function () {
        $scope.MediaTypeListAll = new Array();
        $scope.NewsTypeListAll = new Array();
        $scope.ChannelsListAll = new Array();
        $scope.CategoriesListAll = new Array();
        $scope.RelevanceListAll = new Array();

        $scope.MediaTypeList = new Array();
        $scope.NewsTypeList = new Array();
        $scope.ChannelsList = new Array();
        $scope.CategoriesList = new Array();
        $scope.RelevanceList = new Array();
        $scope.SentimentsList = new Array();
        $scope.CreatedByUsersList = new Array();
        $scope.script = "";

        $scope.relevanceModel = [];
        $scope.categoryModel = [];
        $scope.mediaType = [];
        $scope.newsType = [];
        $scope.channelType = [];
        $scope.sentimentType = [];
        $scope.createdBy = [];
        $scope.TotalRecords = new Array();
        $scope.RecordsCount = 0;
        $scope.pageNumber = 0;
        if($scope.MediaId == undefined)
            $scope.MediaId = $location.search().id !== undefined ? parseInt($location.search().id) : 0;

        $scope.GetMediaNewsList(0, "", "", "", "", "", 0, "", $scope.startDate, $scope.endDate, true, $scope.pageNumber);
    }

    $scope.example5customTexts = { buttonDefaultText: 'Please Select' };

    $scope.example5customTextsMediaType = { buttonDefaultText: 'Select Media Type' };
    $scope.example5customTextsNewsType = { buttonDefaultText: 'Select News Type' };
    $scope.example5customTextsChannel = { buttonDefaultText: 'Select Channel' };
    $scope.example5customTextsCategory = { buttonDefaultText: 'Select Category(s)' };
    $scope.example5customTextsSentiment = { buttonDefaultText: 'Select Sentiment' };
    $scope.example5customTextsCreatedBy = { buttonDefaultText: 'Select Created By' };
    $scope.example5customTextsRelavance = { buttonDefaultText: 'Select Relavance(s)' };

    $scope.groupsettings = {
        selectionLimit: 1,
        closeOnSelect : true,
        smartButtonMaxItems: 2,
        scrollable: false,
        scrollableHeight: '300px',
        smartButtonTextConverter: function (itemText, originalItem) {
            return itemText;
        }
    }

    $scope.MediaNewsList = new Array();    

    $scope.GetMediaNewsList = function (mediaTypeId, newsTypeIds, channelIds, categoryIds, sentimentIds, relevanceIds, createdBy, script, startDate, endDate, getOptions, pageNumber) {
        $scope.MediaNewsList = new Array();
        MediaService.GetMediaFormsList(mediaTypeId, newsTypeIds, channelIds, categoryIds, sentimentIds, relevanceIds, createdBy, script, startDate, endDate, getOptions, pageNumber).then(function (l) {
            //$scope.MediaNewsList.push.apply($scope.MediaNewsList, l.data.MediaFormList);
            $scope.MediaNewsList = l.data.MediaFormList;
            $scope.MediaTypeListAll = l.data.MediaTypesList;
            $scope.RecordsCount = l.data.TotalRecords;
            if ($scope.RecordsCount == 0) {
                $scope.RecordsCount = "No Record found";
            }
            $scope.ProceedToNext = l.data.MediaFormList.length == 100;
            //var records = l.data.TotalRecords / 5;

            //if (records > Math.floor(records))
            //{
            //    var length = Math.floor(records) + 1
            //    for(var i = 0; i<length; i++)
            //        $scope.TotalRecords.push(i);
            //}
            //else
            //{
            //    var length = Math.floor(records);
            //    for(var i = 0; i<length; i++)
            //        $scope.TotalRecords.push(i);
            //}

            //if ($scope.TotalRecords.length == 1) {
            //    $scope.TotalRecords = new Array();
            //}

            console.log($scope.MediaNewsList);

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

            if (getOptions) {
                $scope.MediaTypeListAll = l.data.MediaTypesList;
                $scope.NewsTypeListAll = l.data.NewsTypeList;
                $scope.ChannelsListAll = l.data.ChannelsList;
                $scope.CategoriesListAll = l.data.CategoriesList;
                $scope.SentimentsListAll = l.data.SentimentsList;
                $scope.RelevanceListAll = l.data.NewsRelatedToList;

                $.each(l.data.CategoriesList, function (key, value) {
                    $scope.CategoriesList.push({ label: value.Text, id: value.Value });
                });

                $.each(l.data.SentimentsList, function (key, value) {
                    $scope.SentimentsList.push({ label: value.Text, id: value.Value });
                });

                $.each(l.data.CreatedByUsersList, function (key, value) {
                    $scope.CreatedByUsersList.push({ label: value.Text, id: value.Value });
                });

                $.each(l.data.NewsRelatedToList, function (key, value) {
                    $scope.RelevanceList.push({ label: value.Text, id: value.Value });
                });
            }

            if ($scope.MediaId > 0) {
                var selectedItem = $.grep($scope.MediaTypeListAll, function (a) {
                    return a.MediaTypeId == $scope.MediaId;
                })[0];
                if (selectedItem) {
                    $scope.mediaType = { "label": selectedItem.Text, "id": "" + selectedItem.Value }
                    onItemSelectMedia($scope.mediaType);
                    filterMediaRecords();
                }
                $scope.MediaId = 0;
            }

        }, function (err) {
            GlobalService.ErrorPopup("Error", err.data.Message);
        });
    };

    

    $scope.GetStyle = function (index) {
        return index % 2 == 0 ? "" : "at_blkk";
    };

    $scope.GetSentimentStyle = function (type) {
        if (type == "Positive") {
            return "fa-thumbs-up pos";
        }
        else if (type == "Negative") {
            return "fa-thumbs-down neg";
        }
        else if (type == "Neutral") {
            return "fa-thumbs-up neu";
        }
    };

    $scope.AddMediaNews = function () {
        $window.location.href = "#/Media/AddMediaNews";
    };

    $scope.mediaEventListeners = {
        onItemSelect: onItemSelectMedia
    };

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

        $scope.NewsTypeList = new Array();
        $scope.ChannelsList = new Array();
        //$scope.CategoriesList = new Array();

        $.each(newsTypeList, function (key, value) {
            $scope.NewsTypeList.push({ "label": value.Text, "id": "" + value.Value });
        });

        $.each(channelList, function (key, value) {
            $scope.ChannelsList.push({ "label": value.Text, "id": "" + value.Value });
        });

        filterMediaRecords();
    }

    $scope.GetMediaNewsAfterFilteration = function () {
        var mediaType = $scope.mediaType.id !== undefined ? parseInt($scope.mediaType.id) : 0;
        //var newsType = $scope.newsType.id !== undefined ? parseInt($scope.newsType.id) : 0;
        var newsType = "";
        $scope.newsType.forEach(function (i) {
            newsType += i.id + ","
        });
        if (newsType.length > 0)
            newsType = newsType.substring(0, newsType.length - 1);

        //var channel = $scope.channelType.id !== undefined ? parseInt($scope.channelType.id) : 0;
        var channel = "";
        $scope.channelType.forEach(function (i) {
            channel += i.id + ","
        });
        if (channel.length > 0)
            channel = channel.substring(0, channel.length - 1);

        var createdBy = "";
        $scope.createdBy.forEach(function (i) {
            createdBy += i.id + ","
        });
        if (createdBy.length > 0)
            createdBy = createdBy.substring(0, createdBy.length - 1);
        var categories = "";
        $scope.categoryModel.forEach(function (i) {
            categories += i.id + ","
        });
        if (categories.length > 0)
            categories = categories.substring(0, categories.length - 1);
        var sentiments = "";
        $scope.sentimentType.forEach(function (i) {
            sentiments += i.id + ","
        });
        if (sentiments.length > 0)
            sentiments = sentiments.substring(0, sentiments.length - 1);
        var relavances = "";
        $scope.relevanceModel.forEach(function (i) {
            relavances += i.id + ","
        });
        if (relavances.length > 0)
            relavances = relavances.substring(0, relavances.length - 1);
        var dateFrom = $scope.startDate;
        var dateTo = $scope.endDate;
        var script = $scope.script;

        $scope.MediaNewsList = new Array();
        $scope.TotalRecords = new Array();

        $scope.GetMediaNewsList(mediaType, newsType, channel, categories, sentiments, relavances, createdBy, script, dateFrom, dateTo, false, $scope.pageNumber);
    }

    $scope.filterMediaRecords = function () {
        filterMediaRecords();
    }

    function filterMediaRecords() {
        $scope.pageNumber = 0;
        $scope.GetMediaNewsAfterFilteration();
    }

    $scope.downloadAttachment = function (id) {
        $scope.items = { MediaNewsId: id };
        
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/Scripts/Views/Common/Shared/_ViewAttachment.html',
            controller: '_ViewAttachmentController',

            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            //$scope.selected = selectedItem;
            //alert($scope.selected)
        }, function () {
            //  $log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.ExportToExcel = function () {
        var mediaType = $scope.mediaType.id !== undefined ? parseInt($scope.mediaType.id) : 0;
        //var newsType = $scope.newsType.id !== undefined ? parseInt($scope.newsType.id) : 0;
        var newsType = "";
        $scope.newsType.forEach(function (i) {
            newsType += i.id + ","
        });
        if (newsType.length > 0)
            newsType = newsType.substring(0, newsType.length - 1);

        //var channel = $scope.channelType.id !== undefined ? parseInt($scope.channelType.id) : 0;
        var channel = "";
        $scope.channelType.forEach(function (i) {
            channel += i.id + ","
        });
        if (channel.length > 0)
            channel = channel.substring(0, channel.length - 1);

        var createdBy = "";
        $scope.createdBy.forEach(function (i) {
            createdBy += i.id + ","
        });
        if (createdBy.length > 0)
            createdBy = createdBy.substring(0, createdBy.length - 1);

        var categories = "";
        $scope.categoryModel.forEach(function (i) {
            categories += i.id + ","
        });
        if (categories.length > 0)
            categories = categories.substring(0, categories.length - 1);
        var sentiments = "";
        $scope.sentimentType.forEach(function (i) {
            sentiments += i.id + ","
        });
        if (sentiments.length > 0)
            sentiments = sentiments.substring(0, sentiments.length - 1);
        var relavances = "";
        $scope.relevanceModel.forEach(function (i) {
            relavances += i.id + ","
        });
        if (relavances.length > 0)
            relavances = relavances.substring(0, relavances.length - 1);
        var dateFrom = $scope.startDate;
        var dateTo = $scope.endDate;

        MediaService.ExportMediaNewsAll(mediaType, newsType, channel, categories, sentiments, relavances, createdBy, dateFrom, dateTo, false, $scope.pageNumber).then(function (l) {
            var response = l.data;
            //
            var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                if (urlCreator) {
                    // Try to use a download link
                    var link = document.createElement('a');
                    if ('download' in link) {
                        // Try to simulate a click
                        try {
                            // Prepare a blob URL
                            console.log("Trying download link method with simulated click ...");
                            link.setAttribute('href', response);

                            // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                            var fpath = response.replace(/\\/g, '/');
                            var filename = fpath.substring(fpath.lastIndexOf('/') + 1, fpath.lastIndexOf('.'));
                            link.setAttribute("download", filename);

                            // Simulate clicking the download link
                            var event = document.createEvent('MouseEvents');
                            event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                            link.dispatchEvent(event);
                            console.log("Download link method with simulated click succeeded");
                            success = true;

                        } catch (ex) {
                            console.log("Download link method with simulated click failed with the following exception:");
                            console.log(ex);
                        }
                    }

                }
            //


        }, function (err) {
            GlobalService.ErrorPopup("Error", err.data.Message);
        });
    }

    $scope.deleteMediaNews = function (id) {
        GlobalService.ConfirmPopup("Confirm", "Are you sure you want to delete?", function (selectedItem) {
            //alert($window.location.hash.split('?')[0])
            if (selectedItem) {
                MediaService.DeleteMediaForm(id).then(function (l) {
                    var response = l.data;
                    if (response) {
                        notify({
                            message: "Form deleted successfully",
                            position: GlobalService.position,
                            duration: GlobalService.duration
                        });
                        $scope.init();
                    }
                    else {
                        notify({
                            message: "Form deleted failed",
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

    $scope.loadMoreNews = function (pageNumber) {
        $scope.pageNumber = pageNumber;
        $scope.GetMediaNewsAfterFilteration();
    };

    $scope.checkUncheckAll = function (check) {
        $("#grplists").find("input[name='selected-item']").each(function(){
            $(this).prop("checked",check)
        });
    }

    $scope.resetMediaRecords = function (check) {
        $scope.init();
    }

    $scope.DownloadEmailRecords = function (isEmail) {
        var ids = "";
        var recordCount = 0;
        $("#grplists").find(".action-div").each(function () {
            if ($($(this).find("input")[0]).prop("checked")) {
                ids += $(this).find("span#news-id").text() + ",";
                recordCount++;
            }
        });

        if (recordCount > 100) {
            GlobalService.ErrorPopup("Max Limit Reached", "You have selected " + recordCount + " records. Not more than 100 records can be emailed at one time");
            return;
        }

        ids = ids.substring(0, ids.length - 1);

        if (ids.length == 0) {
            GlobalService.ErrorPopup("Error", "Please select at least one record.");
            return;
        }

        if (isEmail) {
            GlobalService.ConfirmPopup("Confirm", "Are you sure you want to email the selected records?", function (selectedItem) {
                //alert($window.location.hash.split('?')[0])
                if (selectedItem) {
                    MediaService.EmailMediaRecords(ids, isEmail).then(function (l) {
                        var response = l.data;
                        if (response) {
                            var msg = recordCount + " record(s) successfully sent by Email";
                            notify({
                                message: msg,
                                position: GlobalService.position,
                                duration: GlobalService.duration
                            });
                        }
                        else {
                            notify({
                                message: "Email send failed",
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
        else {
            MediaService.EmailMediaRecords(ids, isEmail).then(function (l) {
                var response = l.data;
                if (response) {
                    $scope.ConvertPDF(response);
                }
                else {
                    notify({
                        message: "Export PDF failed",
                        position: GlobalService.position,
                        duration: GlobalService.duration
                    });
                }
            }, function (err) {
                GlobalService.ErrorPopup("Error", err.data.Message);
            });
        }
    }
    
    $scope.ConvertPDF = function (response) {
        var position = 0;
        var pageHeight = 800;
        var pageWidth = 550;
        var doc = new jsPDF('p', 'pt');
        var dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        var today = new Date();

        var KELogo = 'data:image/jpeg;base64,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';
        doc.addImage(KELogo, 'JPEG', 0, position, 165, 50);
        position += 55;

        doc.line(10, position, 1010, position);
        var docName = 'KE Media Monitoring ' + today.toLocaleDateString("en-US", dateOptions);
        position += 25;
        doc.text(10, position, docName);

        var htmlArr = response.html.split('~');
        var txtSize = 0;
        var imgWidth = 0;
        var imgHeight = 0;
        var imgCount = 0;
        htmlArr.forEach(function (html) {
            html = html.replace(/(<br\s*\/?>){2,}/gi, '<br />');
            var imageObj = response.imageList[imgCount];
            if (imageObj != null) {
                txtSize = html.split("<br />").length * 30;
                imgWidth = imageObj.Width;
                imgHeight = imageObj.Height;

                var percent = 0;
                if (imgHeight > (pageHeight - 50)) {
                    percent = (pageHeight - 50) / imgHeight;
                    imgWidth = imgWidth * percent;
                    imgHeight = imgHeight * percent;
                }

                if (imgWidth > pageWidth) {
                    percent = pageWidth / imgWidth;
                    imgWidth = imgWidth * percent;
                    imgHeight = imgHeight * percent;
                }

                if ((position + txtSize + imgHeight) > pageHeight) {
                    doc.addPage();
                    position = 0;
                }

                doc.fromHTML(html, 15, position, { 'width': pageWidth, 'margin': 1, 'pagesplit': true });
                position += txtSize;
                var imageType = (imageObj.ContentType == "image/jpeg") ? "JPEG" : "PNG";
                try {
                    doc.addImage(imageObj.Base64String, imageType, 15, position, imgWidth, imgHeight);
                }
                catch (err) {
                    console.log(err.message);
                }
                imgCount++;
                position += imgHeight;
            }
            else {
                doc.fromHTML(html, 15, position, { 'width': pageWidth, 'margin': 1, 'pagesplit': true });
                doc.addPage();
                position = 0;
            }
        });

        var fileName = docName + '.pdf';
        doc.save(fileName);
    }

    $scope.goToNextPage = function () {
        if ($scope.ProceedToNext) {
            $scope.pageNumber++;
            $scope.GetMediaNewsAfterFilteration();
        }
    }

    $scope.goToPreviousPage = function () {
        if ($scope.pageNumber > 0) {
            $scope.pageNumber--;
            $scope.GetMediaNewsAfterFilteration();
        }
    }

    $scope.openScript = function (id) {
        var script = $.grep($scope.MediaNewsList, function (a) {
                        return a.Id == id;
                    })[0];
        $scope.items = { Script: script.Script };

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/Scripts/Views/Common/Shared/_ViewScript.html',
            controller: '_ViewScriptController',

            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            //$scope.selected = selectedItem;
            //alert($scope.selected)
        }, function () {
            //  $log.info('Modal dismissed at: ' + new Date());
        });
    }

    if ($rootScope.UserObject != undefined)
        $scope.init();

}]);