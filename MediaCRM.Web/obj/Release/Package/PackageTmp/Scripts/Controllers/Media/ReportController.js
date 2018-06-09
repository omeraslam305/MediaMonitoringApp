CRMApp.controller('ReportController', ['$rootScope', '$scope', '$window', '$location', '$stateParams', 'ReportService', 'GlobalService', 'notify', '$uibModal', function ($rootScope, $scope, $window, $location, $stateParams, ReportService, GlobalService, notify, $uibModal) {
    $scope.menuItems = [{
        textKey: 'downloadCSV',
        onclick: function () {
            this.downloadCSV();
        }
    }, {
        textKey: 'downloadXLS',
        onclick: function () {
            this.downloadXLS();
        }
    }, {
        textKey: 'downloadPDF',
        onclick: function () {
            this.exportChart({
                type: 'application/pdf'
            });
        }
    }, {
        textKey: 'downloadPNG',
        onclick: function () {
            this.exportChart();
        }
    }, {
        textKey: 'downloadJPEG',
        onclick: function () {
            this.exportChart({
                type: 'image/jpeg'
            });
        }
    }, {
        textKey: 'downloadSVG',
        onclick: function () {
            this.exportChart({
                type: 'image/svg+xml'
            });
        }
    }, {
        textKey: 'printChart',
        onclick: function () {
            this.print();
        }
    }];

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
        maxDate: moment(),
        eventHandlers: {
            'apply.daterangepicker': function (ev, picker) {
                $scope.startDate = $scope.date.startDate;
                $scope.endDate = $scope.date.endDate;
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

                $scope.GenerateFilterDropdown();
            }
        }
    };
    
    $scope.date = {
        startDate: moment().subtract(30, "days"),
        endDate: moment()
    };

    $scope.startDate = $scope.date.startDate;
    $scope.PrevStartDate = $scope.startDate;
    $scope.endDate = $scope.date.endDate;
    $scope.PrevEndDate = $scope.endDate;

    $scope.init = function () {
        $scope.MediaNewsList = new Array();

        $scope.MediaTypeListAll = new Array();
        $scope.NewsTypeListAll = new Array();
        $scope.ChannelsListAll = new Array();
        $scope.CategoriesListAll = new Array();
        $scope.RelevanceListAll = new Array();
        $scope.SentimentListAll = new Array();
        $scope.AgentListAll = new Array();

        $scope.MediaTypeList = new Array();
        $scope.NewsTypeList = new Array();
        $scope.ChannelsList = new Array();
        $scope.CategoriesList = new Array();
        $scope.RelevanceList = new Array();
        $scope.FilterListSentiment = new Array();
        $scope.FilterListSum = new Array();
        $scope.FilterListInd = new Array();
        $scope.FilterListMediaNews = new Array();
        $scope.FilterListRel = new Array();
        $scope.FilterListCat = new Array();
        $scope.FilterListNT = new Array();
        $scope.FilterListAgent = new Array();

        $scope.categoryModel = [];
        $scope.mediaType = [];
        $scope.newsType = [];
        $scope.channelType = [];
        $scope.relevanceModel = [];
        $scope.filterType = [];
        $scope.filterTypeRel = [];
        $scope.filterTypeCat = [];
        $scope.filterTypeNT = [];
        $scope.filterTypeAgent = [];
        $scope.filterTypeNFISum = [];
        $scope.filterTypeNFIInd = [];
        $scope.filterTypeMediaNews = [];
        $scope.script = "";
        $scope.TotalPRValue = 0;

        $scope.GetReportsFilter();
        $scope.GenerateFilterDropdown();
    }

    $scope.example5customTexts = { buttonDefaultText: 'Please Select' };

    $scope.example5customTextsMediaType = { buttonDefaultText: 'Select Media Type' };
    $scope.example5customTextsNewsType = { buttonDefaultText: 'Select News Type(s)' };
    $scope.example5customTextsChannel = { buttonDefaultText: 'Select Channel(s)' };
    $scope.example5customTextsCategories = { buttonDefaultText: 'Select Category(s)' };
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

    $scope.multiSelectSettings = {
        keyboardControls: true,
        enableSearch: true,
        smartButtonMaxItems: 2,
        scrollable: true,
        scrollableHeight: '300px',
        smartButtonTextConverter: function (itemText, originalItem) {
            return itemText;
        }
    };

    $scope.GenerateFilterDropdown = function () {
        var filterObjArray = new Array();
        //$scope.FilterList = new Array();
        $scope.FilterListSentiment = new Array();
        $scope.FilterListSum = new Array();
        $scope.FilterListInd = new Array();
        $scope.FilterListMediaNews = new Array();
        $scope.FilterListRel = new Array();
        $scope.FilterListCat = new Array();
        $scope.FilterListNT = new Array();
        $scope.FilterListAgent = new Array();
        
        var filterObject = new Object();
        filterObject.Id = 1;
        filterObject.Name = "Media";
        filterObjArray.push(filterObject);

        filterObject = new Object();
        filterObject.Id = 2;
        filterObject.Name = "News Type";
        filterObjArray.push(filterObject);

        filterObject = new Object();
        filterObject.Id = 3;
        filterObject.Name = "Channel";
        filterObjArray.push(filterObject);

        filterObject = new Object();
        filterObject.Id = 4;
        filterObject.Name = "Category";
        filterObjArray.push(filterObject);

        filterObject = new Object();
        filterObject.Id = 5;
        filterObject.Name = "Per Weekday";
        filterObjArray.push(filterObject);

        filterObject = new Object();
        filterObject.Id = 6;
        filterObject.Name = "Per Hour";
        filterObjArray.push(filterObject);

        filterObject = new Object();
        filterObject.Id = 7;
        filterObject.Name = "Evolution (Volume over time) - Datewise";
        filterObjArray.push(filterObject);

        if (moment.duration($scope.date.endDate.diff($scope.date.startDate)).asDays() <= 31) {
            filterObject = new Object();
            filterObject.Id = 8;
            filterObject.Name = "Evolution (Volume over time) - Hourwise";
            filterObjArray.push(filterObject);
        }

        $.each(filterObjArray, function (key, value) {
            $scope.FilterListSum.push({ "label": "" + value.Name, "id": "" + value.Id });
            $scope.FilterListSentiment.push({ "label": "" + value.Name, "id": "" + value.Id });
            $scope.FilterListInd.push({ "label": "" + value.Name, "id": "" + value.Id });
            $scope.FilterListMediaNews.push({ "label": "" + value.Name, "id": "" + value.Id });
            $scope.FilterListRel.push({ "label": "" + value.Name, "id": "" + value.Id });
            if(value.Id != 4)
                $scope.FilterListCat.push({ "label": "" + value.Name, "id": "" + value.Id });
            if (value.Id != 2)
                $scope.FilterListNT.push({ "label": "" + value.Name, "id": "" + value.Id });
        });
        $scope.FilterListAgent = [
                                    { "label": "No. of minutes lagging", "id": "1" },
                                    { "label": "No. of Entries made", "id": "2" },
                                    { "label": "No. of Entries made Evolution (Volume over time)", "id": "3" },
                                    { "label": "No. of Entries made by Media Type", "id": "4" },
                                    { "label": "No. of Edits made", "id": "5" },
                                    { "label": "No. of Edits made Evolution (Volume over time)", "id": "6" },
                                    { "label": "No. of Edits made by Media Type", "id": "7" }
                                 ];

        $scope.filterType = angular.copy($scope.FilterListSentiment[0]);
        $scope.filterTypeNFISum = angular.copy($scope.FilterListSum[0]);
        $scope.filterTypeNFIInd = angular.copy($scope.FilterListInd[0]);
        $scope.filterTypeMediaNews = angular.copy($scope.FilterListMediaNews[0]);
        $scope.filterTypeRel = angular.copy($scope.FilterListRel[0]);
        $scope.filterTypeCat = angular.copy($scope.FilterListCat[0]);
        $scope.filterTypeNT = angular.copy($scope.FilterListNT[0]);
        $scope.filterTypeAgent = angular.copy($scope.FilterListAgent[0]);

        $scope.filterMediaRecords();
    }

    $scope.ConvertPDF = function(isEmail) {
        var position = 0;
        var pageHeight = 295;
        var pageWidth = 180;
        var doc = new jsPDF('p', 'mm');

        var options = { doc: doc, canvas: '', position: position, pageHeight: pageHeight, heightLeft: pageHeight };
        var KELogo = 'data:image/jpeg;base64,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';
        options.doc.addImage(KELogo, 'JPEG', 0, position, 50, 15);
        position += 16;
        options.doc.line(2, position, 220, position);
        position += 15;
        doc.setFontSize(25);
        options.doc.text(2, position, "Summary Report");
        position += 5;

        var columns = [{ title: "Filters", dataKey: "Filters" },
                        { title: "Selected Values", dataKey: "Values" }];
        var rows = [];

        var dateFrom = $scope.startDate;
        var dateTo = $scope.endDate;
        rows.push({ "Filters": "Start Date", "Values": dateFrom.format('DD/MM/YYYY') });
        rows.push({ "Filters": "End Date", "Values": dateTo.format('DD/MM/YYYY') });

        var mediaType = "";
        if ($scope.mediaType.id !== undefined)
        {
            mediaType = $.grep($scope.MediaTypeList, function (a) {
                return a.id == $scope.mediaType.id;
            })[0].label;
            rows.push({ "Filters": "Media Type", "Values": mediaType });
        }

        var newsType = "";
        $scope.newsType.forEach(function (i) {
            newsType += $.grep($scope.NewsTypeList, function (a) {
                            return a.id == i.id;
                        })[0].label + ", "
        });
        if (newsType.length > 0) {
            newsType = newsType.substring(0, newsType.length - 2);
            rows.push({ "Filters": "News Types", "Values": newsType });
        }

        var channel = "";
        $scope.channelType.forEach(function (i) {
            channel += $.grep($scope.ChannelsList, function (a) {
                            return a.id == i.id;
                        })[0].label + ", "
        });
        if (channel.length > 0) {
            channel = channel.substring(0, channel.length - 2);
            rows.push({ "Filters": "Channel Types", "Values": channel });
        }

        var categories = "";
        $scope.categoryModel.forEach(function (i) {
            categories += $.grep($scope.CategoriesList, function (a) {
                            return a.id == i.id;
                        })[0].label + ", "
        });
        if (categories.length > 0) {
            categories = categories.substring(0, categories.length - 2);
            rows.push({ "Filters": "Categories", "Values": categories });
        }

        var relavances = "";
        $scope.relevanceModel.forEach(function (i) {
            relavances += $.grep($scope.RelevanceList, function (a) {
                            return a.id == i.id;
                        })[0].label + ", "
        });
        if (relavances.length > 0) {
            relavances = relavances.substring(0, relavances.length - 2);
            rows.push({ "Filters": "News Related To", "Values": relavances });
        }

        doc.autoTable(columns, rows, {
            theme: 'plain',
            styles: { fillColor: [233, 241, 245], overflow: 'linebreak' },
            headerStyles: { fillColor: [0, 176, 240], textColor: [255, 255, 255] },
            columnStyles: {
                Filters: { columnWidth: 50, fontStyle: 'bold' },
                Values: { columnWidth: 150 }
            },
            margin: { left: 2, top: position },
            tableWidth: 200
        });
        options.doc.addPage();

        AddHeadingInPDF("Total Print PR Value: " + $scope.TotalPRValue, options);
        options.canvas = CreateCanvasFromSVG(".news-chart");
        options = AddImageInPDF(options);

        //options = AddHtmlInPDF($('#AnnualVolumeTable').get(0), options, 150);

        options.canvas = CreateCanvasFromSVG(".sum-chart");
        options = AddImageInPDF(options);

        //options = AddHtmlInPDF($('#SentimentByPlatformTable').get(0), options, 180);


        options.canvas = CreateCanvasFromSVG(".ind-chart");
        options = AddImageInPDF(options);


        options.canvas = CreateCanvasFromSVG(".sentiment-chart");
        options = AddImageInPDF(options);
        //options = AddHtmlInPDF($('#TotalVolumeOverTimeTable').get(0), options, 180);

        options.canvas = CreateCanvasFromSVG(".relevance-chart");
        options = AddImageInPDF(options);

        options.canvas = CreateCanvasFromSVG(".category-chart");
        options = AddImageInPDF(options);

        options.canvas = CreateCanvasFromSVG(".newstype-chart");
        options = AddImageInPDF(options);

        if ($rootScope.MediaAdmin) {
            options.canvas = CreateCanvasFromSVG(".agent-chart");
            options = AddImageInPDF(options);
        }

        //options.canvas = CreateCanvasFromSVG("#VolumeByPlatform");
        //options = AddImageInPDF(options);

        //options.canvas = CreateCanvasFromSVG("#BrandConversation");
        //options = AddImageInPDF(options);

        //options = AddHtmlInPDF($('#BrandConversationTable').get(0), options, 180);


        //var doc = new jsPDF();

        //doc.addImage(canvas, 0, 0, canvas.width, canvas.height);

        var today = new Date();
        var fileName = 'SummaryReport-' + today.getDate() + '' + today.getMonth() + '' + today.getFullYear() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds() + '.pdf';
        if (isEmail) {
            var binary = options.doc.output('datauri');
            //var content = binary ? btoa(binary) : "";

            $scope.EmailPdfReport(fileName, binary, "application/pdf");
        }
        else
            options.doc.save(fileName);
    }

    $scope.GetReportsFilter = function () {        
        ReportService.GetMediaReportFilters().then(function (l) {
            $scope.MediaTypeListAll = l.data.MediaTypesList;            
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

            $scope.MediaTypeListAll = l.data.MediaTypesList;
            $scope.NewsTypeListAll = l.data.NewsTypeList;
            $scope.ChannelsListAll = l.data.ChannelsList;
            $scope.CategoriesListAll = l.data.CategoriesList;
            $scope.RelevanceListAll = l.data.NewsRelatedToList;
            $scope.SentimentListAll = l.data.SentimentList;
            $scope.AgentListAll = l.data.AgentList;

            $scope.CategoriesList = new Array();
            $.each($scope.CategoriesListAll, function (key, value) {
                $scope.CategoriesList.push({ label: value.Text, id: value.Value });
            });

            $scope.RelevanceList = new Array();
            $.each($scope.RelevanceListAll, function (key, value) {
                $scope.RelevanceList.push({ label: value.Text, id: value.Value });
            });
        }, function (err) {
            GlobalService.ErrorPopup("Error", err.data.Message);
        });
    };

    $scope.filterMediaRecords = function () {
        var sentimentFilter = parseInt($scope.filterType.id);
        var nfiSumFilter = parseInt($scope.filterTypeNFISum.id);
        var nfiIndFilter = parseInt($scope.filterTypeNFIInd.id);
        var newsFilter = parseInt($scope.filterTypeMediaNews.id);
        var relFilter = parseInt($scope.filterTypeRel.id);
        var catFilter = parseInt($scope.filterTypeCat.id);
        var ntFilter = parseInt($scope.filterTypeNT.id);
        var agentFilter = parseInt($scope.filterTypeAgent.id);
                
        $scope.GenerateReportWithFilter(1, newsFilter);
        $scope.GenerateReportWithFilter(2, nfiSumFilter);
        $scope.GenerateReportWithFilter(3, nfiIndFilter);
        $scope.GenerateReportWithFilter(4, sentimentFilter);
        $scope.GenerateReportWithFilter(5, relFilter);
        $scope.GenerateReportWithFilter(6, catFilter);
        $scope.GenerateReportWithFilter(7, ntFilter);
        $scope.GenerateReportWithFilter(8, agentFilter);
        $scope.GenerateReportWithFilter(9, 1);
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

        $scope.newsType = [];
        $scope.channelType = [];
        $scope.NewsTypeList = new Array();
        $scope.ChannelsList = new Array();
        

        $.each(newsTypeList, function (key, value) {
            $scope.NewsTypeList.push({ "label": value.Text, "id": "" + value.Value });
        });

        $.each(channelList, function (key, value) {
            $scope.ChannelsList.push({ "label": value.Text, "id": "" + value.Value });
        });

        $scope.filterMediaRecords();
    }    

    $scope.newsEventListeners = {
        onSelectionChanged: onItemSelectNews
    };

    function onItemSelectNews() {
        $scope.filterMediaRecords();
    }

    $scope.channelEventListeners = {
        onSelectionChanged: onItemSelectChannel
    };

    function onItemSelectChannel() {
        $scope.filterMediaRecords();
    }

    $scope.categoryEventListeners = {
        onSelectionChanged: onItemSelectCategory
    };

    function onItemSelectCategory() {
        $scope.filterMediaRecords();
    }

    
    $scope.relavanceEventListeners = {
        onSelectionChanged: onItemSelectRelavance
    };

    function onItemSelectRelavance() {
        $scope.filterMediaRecords();
    }

    $scope.GetHighChartConfig = function (chartType, xAxisType, reportTitle, filterTitle, categories, series, stacking) {
        return {
            options: {
                chart: {
                    type: chartType
                },
                xAxis: {
                    categories: categories,
                    type: xAxisType,
                    labels: {
                        formatter: function () {
                            if (xAxisType == "category")
                                return this.value;
                            else
                                return moment(this.value).format("DD-MM-YYYY HH:mm");
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: filterTitle
                    },
                    allowDecimals: false,
                    plotOptions: {
                        "series": {
                            "stacking": "",
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y}'
                            }
                        }
                    }
                },
                plotOptions: {
                    column: {
                        stacking: stacking,
                        dataLabels: {
                            stacking: 'normal',
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'black',
                            style: {
                                ////textShadow: '0 0 3px black, 0 0 3px black'
                                "font-size": '22px'
                            }
                        }
                    }
                },
                exporting: {
                    buttons: {
                        contextButton: {
                            menuItems: $scope.menuItems
                        }
                    }
                }
            },
            legend: {
                align: 'right',
                x: -70,
                verticalAlign: 'top',
                y: 20,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>' +
                        'Total: ' + this.point.stackTotal;
                }
            },
            series: series,
            title: {
                text: reportTitle + ' By ' + filterTitle
            },
            loading: false,
            "credits": {
                "enabled": false
            }
        };
    }

    $scope.GenerateReportWithFilter = function (reportType, filterType) {
        var colorCoding = [{ Name: "Positive", Value: "#00B050" }, { Name: "Neutral", Value: "#FFC000" }, { Name: "Negative", Value: "#C00000" }, { Name: "General", Value: "#4286f4" }, { Name: "KE", Value: "#f5931f" }, { Name: "Other Disco", Value: "#00b050" }];
        var mediaType = $scope.mediaType.id !== undefined ? parseInt($scope.mediaType.id) : 0;
        var newsType = "";
        $scope.newsType.forEach(function (i) {
            newsType += i.id + ","
        });
        if (newsType.length > 0)
            newsType = newsType.substring(0, newsType.length - 1);
        else
            newsType = "0";

        var channel = "";
        $scope.channelType.forEach(function (i) {
            channel += i.id + ","
        });
        if (channel.length > 0)
            channel = channel.substring(0, channel.length - 1);
        else
            channel = "0";

        var categories = "";
        $scope.categoryModel.forEach(function (i) {
            categories += i.id + ","
        });
        if (categories.length > 0)
            categories = categories.substring(0, categories.length - 1);
        else
            categories = "0";

        var relavances = "";
        $scope.relevanceModel.forEach(function (i) {
            relavances += i.id + ","
        });
        if (relavances.length > 0)
            relavances = relavances.substring(0, relavances.length - 1);
        else
            relavances = "0";

        var dateFrom = moment($scope.startDate).add(5, "hours");
        var dateTo = moment($scope.endDate).add(5, "hours");
        
        ReportService.GetMediaReport(mediaType, newsType, channel, categories, relavances, dateFrom, dateTo, $scope.script, false, reportType, filterType).then(function (l) {
            var response = l.data;
            var reportTitle, filterTitle, chartType, xAxisType = "";
            var mediaTypes = [];
            var series = [];
            
            if (filterType == 1) {
                filterTitle = "Media Type";
                chartType = "column";
                xAxisType = "category";
            }
            else if (filterType == 2) {
                filterTitle = "News Type";
                chartType = "column";
                xAxisType = "category";
            }
            else if (filterType == 3) {
                filterTitle = "Channel";
                chartType = "column";
                xAxisType = "category";
            }
            else if (filterType == 4) {
                filterTitle = "Category";
                chartType = "column";
                xAxisType = "category";
            }
            else if (filterType == 5) {
                filterTitle = "Per Weekday";
                chartType = "column";
                xAxisType = "category";
            }
            else if (filterType == 6) {
                filterTitle = "Per Hour";
                chartType = "column";
                xAxisType = "category";
            }
            else if (filterType == 7) {
                filterTitle = "Evolution over time (Date wise)";
                chartType = "line";
                xAxisType = "datetime";
            }
            else if (filterType == 8) {
                filterTitle = "Evolution over time (Hour wise)";
                chartType = "line";
                xAxisType = "datetime";
            }

            if (reportType == 1) {
                var recordsData = [];
                reportTitle = "Media News";

                if (filterType >= 1 && filterType <= 6) {
                    response.forEach(function (i) {
                        recordsData.push({
                            name: i.XAxis,
                            y: i.Value1
                        });
                        mediaTypes.push(i.XAxis);
                    });

                    series.push({
                        name: reportTitle,
                        colorByPoint: true,
                        data: recordsData
                    });
                }
                else if (filterType == 7 || filterType == 8) {
                    response.forEach(function (i) {
                        recordsData.push({
                            name: i.InsertionDate,
                            y: i.Value1
                        });
                        mediaTypes.push(i.InsertionDate);
                    });

                    series.push({
                        name: reportTitle,
                        data: recordsData
                    });
                }

                $scope.MediaNewsChartConfig = $scope.GetHighChartConfig(chartType, xAxisType, reportTitle, filterTitle, mediaTypes, series, false);
            }
            else if (reportType == 2) {
                var recordsData = [];
                reportTitle = "Noise Frequency";

                if (filterType >= 1 && filterType <= 6) {
                    response.forEach(function (i) {
                        recordsData.push({
                            name: i.XAxis,
                            y: i.Value1
                        });
                        mediaTypes.push(i.XAxis);
                    });

                    series.push({
                        name: reportTitle,
                        colorByPoint: true,
                        data: recordsData
                    });
                }
                else if (filterType == 7 || filterType == 8) {
                    response.forEach(function (i) {
                        recordsData.push({
                            name: i.InsertionDate,
                            y: i.Value1
                        });
                        mediaTypes.push(i.InsertionDate);
                    });

                    series.push({
                        name: reportTitle,
                        data: recordsData
                    });
                }

                $scope.NoiseFrequencySumChartConfig = $scope.GetHighChartConfig(chartType, xAxisType, reportTitle, filterTitle, mediaTypes, series, false);
            }
            else if (reportType == 3) {
                reportTitle = "Noise Frequency";
                var positiveData = [];
                var negativeData = [];

                if (filterType >= 1 && filterType <= 6) {
                    response.forEach(function (i) {
                        positiveData.push({
                            name: i.XAxis,
                            y: i.Value1
                        });
                        negativeData.push({
                            name: i.XAxis,
                            y: i.Value2
                        });
                        mediaTypes.push(i.XAxis);
                    });
                }
                else if (filterType == 7 || filterType == 8) {
                    response.forEach(function (i) {
                        positiveData.push({
                            name: i.InsertionDate,
                            y: i.Value1
                        });
                        negativeData.push({
                            name: i.InsertionDate,
                            y: i.Value2
                        });
                        mediaTypes.push(i.InsertionDate);
                    });
                }

                series.push({
                    name: 'Positive Index',
                    data: positiveData
                });
                series.push({
                    name: 'Negative Index',
                    data: negativeData
                });

                $scope.NoiseFrequencyIndividualChartConfig = $scope.GetHighChartConfig(chartType, xAxisType, reportTitle, filterTitle, mediaTypes, series, false);
            }
            else if (reportType == 4) {
                reportTitle = "Sentiment Analysis";
                var _2DData = [];

                response.forEach(function (i) {
                    var inc = 1;
                    var name;
                    if (filterType >= 1 && filterType <= 6)
                        name = i.XAxis;
                    else if (filterType == 7 || filterType == 8)
                        name = i.InsertionDate;
                    
                    $scope.SentimentListAll.forEach(function (j) {
                        if (_2DData[inc - 1] == undefined) {
                            _2DData.push([]);
                        }
                        if (i['Value' + inc] == null)
                            i['Value' + inc] = 0;
                        _2DData[inc - 1].push({
                            name: name,
                            y: i['Value' + inc]
                        });
                        inc++;
                    });
                    mediaTypes.push(name);
                });

                var inc = 0;
                _2DData.forEach(function (obj) {
                    series.push({
                        name: $scope.SentimentListAll[inc].Text,
                        color: colorCoding.filter(function (el) {
                                return el.Name == $scope.SentimentListAll[inc].Text;
                            })[0].Value,
                        data: obj
                    });
                    inc++;
                });

                $scope.SentimentAnalysisChartConfig = $scope.GetHighChartConfig(chartType, xAxisType, reportTitle, filterTitle, mediaTypes, series, false);
            }
            else if (reportType == 5) {
                reportTitle = "Relevance Analysis";
                var _2DData = [];

                response.forEach(function (i) {
                    var inc = 1;
                    var name;
                    if (filterType >= 1 && filterType <= 6)
                        name = i.XAxis;
                    else if (filterType == 7 || filterType == 8)
                        name = i.InsertionDate;

                    $scope.RelevanceListAll.forEach(function (j) {
                        if (_2DData[inc - 1] == undefined) {
                            _2DData.push([]);
                        }
                        if (i['Value' + inc] == null)
                            i['Value' + inc] = 0;
                        _2DData[inc - 1].push({
                            name: name,
                            y: i['Value' + inc]
                        });
                        inc++;
                    });
                    mediaTypes.push(name);
                });

                var inc = 0;
                _2DData.forEach(function (obj) {
                    series.push({
                        name: $scope.RelevanceListAll[inc].Text,
                        color: colorCoding.filter(function (el) {
                            return el.Name == $scope.RelevanceListAll[inc].Text;
                        })[0].Value,
                        data: obj
                    });
                    inc++;
                });

                $scope.RelevanceAnalysisChartConfig = $scope.GetHighChartConfig(chartType, xAxisType, reportTitle, filterTitle, mediaTypes, series, false);
            }
            else if (reportType == 6) {
                reportTitle = "Category Analysis";
                var _2DData = [];

                response.forEach(function (i) {
                    var inc = 1;
                    var name;
                    if (filterType >= 1 && filterType <= 6)
                        name = i.XAxis;
                    else if (filterType == 7 || filterType == 8)
                        name = i.InsertionDate;

                    $scope.CategoriesListAll.forEach(function (j) {
                        if (_2DData[inc - 1] == undefined) {
                            _2DData.push([]);
                        }
                        if (i['Value' + inc] == null)
                            i['Value' + inc] = 0;
                        _2DData[inc - 1].push({
                            name: name,
                            y: i['Value' + inc]
                        });
                        inc++;
                    });
                    mediaTypes.push(name);
                });

                var inc = 0;
                _2DData.forEach(function (obj) {
                    series.push({
                        name: $scope.CategoriesListAll[inc].Text,
                        data: obj
                    });
                    inc++;
                });

                $scope.CategoryAnalysisChartConfig = $scope.GetHighChartConfig(chartType, xAxisType, reportTitle, filterTitle, mediaTypes, series, true);
            }
            else if (reportType == 7) {
                reportTitle = "NewsType Analysis";
                var _2DData = [];
                var elementId = [];

                $scope.NewsTypeListAll.filter(el => {
                    if (elementId.indexOf(el.Text) === -1 && (el.MediaTypeId == mediaType || mediaType == 0)) {
                        // If not present in array, then add it
                        elementId.push(el.Text);
                    }
                });

                response.forEach(function (i) {
                    var inc = 1;
                    var name;
                    if (filterType >= 1 && filterType <= 6)
                        name = i.XAxis;
                    else if (filterType == 7 || filterType == 8)
                        name = i.InsertionDate;

                    elementId.forEach(function (j) {
                        if (_2DData[inc - 1] == undefined) {
                            _2DData.push([]);
                        }
                        if (i['Value' + inc] == null)
                            i['Value' + inc] = 0;
                        _2DData[inc - 1].push({
                            name: name,
                            y: i['Value' + inc]
                        });
                        inc++;
                    });
                    mediaTypes.push(name);
                });

                var inc = 0;
                _2DData.forEach(function (obj) {
                    series.push({
                        name: elementId[inc],
                        data: obj
                    });
                    inc++;
                });

                $scope.NewsTypeAnalysisChartConfig = $scope.GetHighChartConfig(chartType, xAxisType, reportTitle, filterTitle, mediaTypes, series, true);
            }
            else if (reportType == 8)
            {
                reportTitle = "Agent Performance Evaluation";
                var _2DData = [];
                var stacked = false;
                filterTitle = $.grep($scope.FilterListAgent, function (a) {
                    return a.id == $scope.filterTypeAgent.id;
                })[0].label;

                if (filterType == 1 || filterType == 2 || filterType == 5) {
                    response.forEach(function (i) {
                        _2DData.push({
                            name: i.XAxis,
                            y: i.Value1
                        });
                        mediaTypes.push(i.XAxis);
                    });

                    series.push({
                        name: reportTitle,
                        colorByPoint: true,
                        data: _2DData
                    });
                }
                else if (filterType == 3 || filterType == 4 || filterType == 6 || filterType == 7) {
                    response.forEach(function (i) {
                        var inc = 1;
                        var name;
                        if (filterType == 3 || filterType == 6) {
                            name = i.InsertionDate;
                            chartType = "line";
                            xAxisType = "datetime";
                        }
                        else if (filterType == 4 || filterType == 7) {
                            name = i.XAxis;
                            chartType = "column";
                            xAxisType = "category";
                            stacked = true;
                        }

                        $scope.AgentListAll.forEach(function (j) {
                            if (_2DData[inc - 1] == undefined) {
                                _2DData.push([]);
                            }
                            if (i['Value' + inc] == null)
                                i['Value' + inc] = 0;
                            _2DData[inc - 1].push({
                                name: name,
                                y: i['Value' + inc]
                            });
                            inc++;
                        });
                        mediaTypes.push(name);
                    });

                    var inc = 0;
                    _2DData.forEach(function (obj) {
                        series.push({
                            name: $scope.AgentListAll[inc].Text,
                            data: obj
                        });
                        inc++;
                    });
                }
                $scope.AgentPerformanceChartConfig = $scope.GetHighChartConfig(chartType, xAxisType, reportTitle, filterTitle, mediaTypes, series, stacked);
            }
            else if (reportType == 9) {
                $scope.TotalPRValue = response[0].Value1;
            }
        }, function (err) {
            GlobalService.ErrorPopup("Error", err.data.Message);
        });
    }

    $scope.filterEventListeners = {
        onItemSelect: onItemSelectFilter
    };

    function onItemSelectFilter(property) {
        $scope.GenerateReportWithFilter(4, property.id);
    }

    $scope.filterRelEventListeners = {
        onItemSelect: onItemSelectFilterRel
    };

    function onItemSelectFilterRel(property) {
        $scope.GenerateReportWithFilter(5, property.id);
    }

    $scope.filterCatEventListeners = {
        onItemSelect: onItemSelectFilterCat
    };

    function onItemSelectFilterCat(property) {
        $scope.GenerateReportWithFilter(6, property.id);
    }

    $scope.filterNTEventListeners = {
        onItemSelect: onItemSelectFilterNT
    };

    function onItemSelectFilterNT(property) {
        $scope.GenerateReportWithFilter(7, property.id);
    }

    $scope.filterNFISumEventListeners = {
        onItemSelect: onItemSelectFilterNFISum
    };

    function onItemSelectFilterNFISum(property) {
        $scope.GenerateReportWithFilter(2, property.id);
    }

    $scope.filterNFIIndEventListeners = {
        onItemSelect: onItemSelectFilterNFIInd
    };

    function onItemSelectFilterNFIInd(property) {
        $scope.GenerateReportWithFilter(3, property.id);
    }

    $scope.filterMediaNewsEventListeners = {
        onItemSelect: onItemSelectFilterMediaNews
    };

    function onItemSelectFilterMediaNews(property) {
        $scope.GenerateReportWithFilter(1, property.id);
    }

    $scope.filterAgentEventListeners = {
        onItemSelect: onItemSelectFilterAgents
    };

    function onItemSelectFilterAgents(property) {
        $scope.GenerateReportWithFilter(8, property.id);
    }

    //

    $scope.resetMediaRecords = function () {
        $scope.init();  
    }

    $scope.EmailPdfReport = function (fileName, content, type) {
        GlobalService.ConfirmPopup("Confirm", "Are you sure you want to email report?", function (selectedItem) {
            //alert($window.location.hash.split('?')[0])
            if (selectedItem) {
                ReportService.EmailPdfReport(fileName, content, type).then(function (l) {
                    var response = l.data;
                    if (response) {
                        var msg = "Media Report successfully sent by Email";
                        notify({
                            message: msg,
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


    if ($rootScope.UserObject != undefined)
        $scope.init();

}]);