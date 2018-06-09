CRMApp.controller('MediaMonitoringReportController', ['$rootScope', '$scope', '$window', '$location', '$stateParams', '$filter', 'ReportService', 'GlobalService', 'notify', '$uibModal', function ($rootScope, $scope, $window, $location, $stateParams, $filter, ReportService, GlobalService, notify, $uibModal) {
    $scope.colors = ['#3A3B7A', '#F57C4C', '#E8585C', '#0C7E00', '#02505F', '#7B9500', '#7C0046', '#007575', '#C2C200', '#FF7400',
                    '#8605AF', '#00A0A0', '#00B26F', '#9FEF00', '#FFE100', '#FF0000', '#1139B2', '#323459', '#421D0F', '#240A11', '#201D05',
                    '#09201A', '#212120', '#719B53', '#794A5F', '#1D1F72', '#8A6411', '#24221C', '#4F4500', '#003827', '#6B7225'];
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

    $scope.init = function () {
        $scope.MediaTypeListAll = new Array();
        $scope.NewsTypeListAll = new Array();
        $scope.ChannelsListAll = new Array();
        $scope.RelevanceListAll = new Array();
        $scope.SentimentListAll = new Array();
        $scope.CategoriesListAll = new Array();

        $scope.MediaTypeList = new Array();
        $scope.NewsTypeList = new Array();
        $scope.ChannelsList = new Array();
        $scope.RelevanceList = new Array();
        $scope.CategoriesList = new Array();

        $scope.tabularRelSent = [];
        $scope.mediaType = [];
        $scope.newsType = [];
        $scope.channelType = [];
        $scope.relevanceModel = [];
        $scope.categoryModel = [];
        $scope.GetReportsFilter();
        $scope.TotalPRValue = 0;
        $scope.selectedShift = "1";
        $scope.selectedShiftStartTime = "";
        $scope.selectedShiftEndTime = "";
        $scope.shiftText = "";
        $scope.shiftDisplay = "";
        $scope.isPrint = false;
        
        $scope.selectedDate = moment();
        $scope.opts = {
            locale: {
                format: "MMMM D, YYYY"
            },
            singleDatePicker: true,
             maxDate: moment(),
             eventHandlers: {
                'apply.daterangepicker': function (ev, picker) {
                    $scope.filterMediaRecords();
                }
             }
        };
    }

    $scope.example5customTexts = { buttonDefaultText: 'Please Select' };

    $scope.example5customTextsMediaType = { buttonDefaultText: 'Select Media Type(s)' };
    $scope.example5customTextsNewsType = { buttonDefaultText: 'Select News Type(s)' };
    $scope.example5customTextsChannel = { buttonDefaultText: 'Select Channel(s)' };
    $scope.example5customTextsRelavance = { buttonDefaultText: 'Select Relevance(s)' };

    $scope.groupsettings = {
        smartButtonMaxItems: 3,
        smartButtonTextConverter: function (itemText, originalItem) {
            return itemText;
        }
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
            $.each($scope.RelevanceListAll, function (key, value) {
                $scope.RelevanceList.push({ label: value.Text, id: value.Value });
            });

            $scope.relevanceModel = [];
            $scope.RelevanceList.forEach(function (rel) {
                $scope.relevanceModel.push(rel);
            });

            $scope.CategoriesList = new Array();
            $.each($scope.CategoriesListAll, function (key, value) {
                $scope.CategoriesList.push({ label: value.Text, id: value.Value });
            });

            $scope.categoryModel = [];
            $scope.CategoriesList.forEach(function (cat) {
                $scope.categoryModel.push(cat);
            });

            $scope.mediaType = [];
            $scope.mediaType.push($scope.MediaTypeList[0]);
            onItemSelectMedia();
        }, function (err) {
            GlobalService.ErrorPopup("Error", err.data.Message);
        });
    };

    $scope.filterMediaRecords = function () {
        if ($scope.selectedShift == "1") {
            $scope.shiftText = "Morning Shift";
            $scope.shiftDisplay = "8AM - 4PM";
            $scope.selectedShiftStartTime = "T08:00:00.000Z";
            $scope.selectedShiftEndTime = "T15:59:59.000Z";
        }
        if ($scope.selectedShift == "2") {
            $scope.shiftText = "Evening Shift";
            $scope.shiftDisplay = "4PM - 12AM";
            $scope.selectedShiftStartTime = "T16:00:00.000Z";
            $scope.selectedShiftEndTime = "T23:59:59.000Z";
        }
        if ($scope.selectedShift == "3") {
            $scope.shiftText = "Night Shift";
            $scope.shiftDisplay = "12AM - 8AM";
            $scope.selectedShiftStartTime = "T00:00:00.000Z";
            $scope.selectedShiftEndTime = "T07:59:59.000Z";
        }

        if ($scope.mediaType.findIndex(i => i.id == 3) !== -1) {
            $scope.isPrint = true;
        }
        else {
            $scope.isPrint = false;
        }

        for (var i = 1; i < 9; i++) {
            $scope.FilterSentimentReport(i);
        }
    };

    $scope.mediaEventListeners = {
        onSelectionChanged: onItemSelectMedia
    };

    function onItemSelectMedia() {
        var newsTypeList = new Array();
        $scope.NewsTypeListAll.filter(el => {
            var typeIndex = newsTypeList.findIndex(i => i.Text === el.Text);
            var mediaIndex = $scope.mediaType.findIndex(i => i.id == el.MediaTypeId);
            if (typeIndex !== -1 && mediaIndex !== -1) {
                // If not present in array, then add it
                newsTypeList[typeIndex].Value += ',' + el.Value;
            }
            else if (typeIndex === -1 && mediaIndex !== -1) {
                newsTypeList.push(angular.copy(el));
            }
        });

        var channelList = new Array();
        $scope.ChannelsListAll.filter(el => {
            var typeIndex = channelList.findIndex(i => i.Text === el.Text);
            var mediaIndex = $scope.mediaType.findIndex(i => i.id == el.MediaTypeId);
            if (typeIndex !== -1 && mediaIndex !== -1) {
                // If not present in array, then add it
                channelList[typeIndex].Value += ',' + el.Value;
            }
            else if (typeIndex === -1 && mediaIndex !== -1) {
                channelList.push(angular.copy(el));
            }
        });

        $scope.NewsTypeList = new Array();
        $scope.ChannelsList = new Array();

        $.each(newsTypeList, function (key, value) {
            $scope.NewsTypeList.push({ "label": value.Text, "id": "" + value.Value });
        });

        $.each(channelList, function (key, value) {
            $scope.ChannelsList.push({ "label": value.Text, "id": "" + value.Value });
        });

        $scope.newsType = [];
        $scope.NewsTypeList.forEach(function (news) {
            $scope.newsType.push(news);
        });

        $scope.channelType = [];
        $scope.ChannelsList.forEach(function (news) {
            $scope.channelType.push(news);
        });

        $scope.filterMediaRecords();
    }

    $scope.relevanceEventListeners = {
        onSelectionChanged: onItemSelectRelevance
    };

    function onItemSelectRelevance() {
        $scope.FilterSentimentReport(3);
    }

    $scope.channelEventListeners = {
        onSelectionChanged: onItemSelectChannel
    };

    function onItemSelectChannel() {
        $scope.FilterSentimentReport(2);
    }

    $scope.newsTypeEventListeners = {
        onSelectionChanged: onItemSelecNewsType
    };

    function onItemSelecNewsType() {
        $scope.FilterSentimentReport(1);
    }

    $scope.categoryEventListeners = {
        onSelectionChanged: onItemSelectCategory
    };

    function onItemSelectCategory() {
        $scope.FilterSentimentReport(4);
    }

    $scope.getBarChartConfig = function (categories, series, yTitle, chartTitle) {
        return {
            options: {
                chart: {
                    type: 'column'
                },
                xAxis: {
                    categories: categories
                },
                yAxis: {
                    title: {
                        text: yTitle
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
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}',
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            //textShadow: '0 0 3px black, 0 0 3px black'
                        }
                    }
                }
            },
            series: series,
            title: {
                text: chartTitle

            },
            loading: false,
            "credits": {
                "enabled": false
            }
        };
    }

    $scope.getPieChartConfig = function (series, title) {
        return {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: title
            },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b><br/>{series.name}: <b>{point.y}</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: "{point.y}<br/>{point.percentage:.1f}%"
                    },
                    showInLegend: true
                }
            },
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: $scope.menuItems
                    }
                }
            },
            series: series,
            "credits": {
                "enabled": false
            }
        };
    }

    $scope.FilterSentimentReport = function (filterType) {
        var colorCoding = [{ Name: "Positive", Value: "#00B050" }, { Name: "Neutral", Value: "#FFC000" }, { Name: "Negative", Value: "#C00000" }, { Name: "General", Value: "#4286f4" }, { Name: "KE", Value: "#f5931f" }, { Name: "Other Disco", Value: "#00b050" }];

        var mediaType = "";
        $scope.mediatypename = "";
        $scope.mediaType.forEach(function (i) {
            mediaType += i.id + ",";
            $scope.mediatypename += $scope.MediaTypeListAll.filter(function (j) {
                return j.Value == parseInt(i.id)
            })[0].Text + " & ";
        });

        if (mediaType.length > 0) {
            mediaType = mediaType.substring(0, mediaType.length - 1);
            $scope.mediatypename = $scope.mediatypename.substring(0, $scope.mediatypename.length - 3);
        }

        var dateFrom = $scope.selectedDate.format("YYYY-MM-DD") + $scope.selectedShiftStartTime;
        var dateTo = $scope.selectedDate.format("YYYY-MM-DD") + $scope.selectedShiftEndTime;
        var isShift = false;

        if (!$scope.isPrint) {
            isShift = true;
        }

        if (filterType == 1) {
            var newsType = "";
            $scope.newsType.forEach(function (i) {
                newsType += i.id + ","
            });
            if (newsType.length > 0)
                newsType = newsType.substring(0, newsType.length - 1);

            ReportService.GetMediaReport(mediaType, newsType, '0', '0', '0', dateFrom, dateTo, '', true, 1, 2, isShift).then(function (l) {
                var response = l.data;
                var rnd = [];
                var index = 0;
                response.forEach(function (i) {
                    rnd.push({
                        name: i.XAxis,
                        y: i.Value1,
                        color: $scope.colors[index]
                    });
                    index++;
                });

                var agentSeries = [{
                    name: "Activity Volume",
                    colorByPoint: true,
                    data: rnd
                }];

                // Build the chart
                $('#KEActivityWiseConfig').highcharts($scope.getPieChartConfig(agentSeries, 'KE Activity (' + $scope.mediatypename + ')'));

            }, function (err) {
                GlobalService.ErrorPopup("Error", err.data.Message);
            });
        }
        else if (filterType == 2) {
            var channel = "";

            $scope.channelType.forEach(function (i) {
                channel += i.id + ","
            });
            if (channel.length > 0)
                channel = channel.substring(0, channel.length - 1);

            ReportService.GetMediaReport(mediaType, '0', channel, '0', 1, dateFrom, dateTo, '', false, 4, 3, isShift).then(function (l) {
                var _2DData = [];
                var channelTypes = [];
                var series = [];
                var response = l.data;
                response.forEach(function (i) {
                    var inc = 1;
                    var name = i.XAxis;

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
                    channelTypes.push(name);
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

                $scope.KEChannelWiseSentConfig = $scope.getBarChartConfig(channelTypes, series, "", 'Channel Wise (Tonality): KE Related News (' + $scope.mediatypename + ')');
                       
            }, function (err) {
                GlobalService.ErrorPopup("Error", err.data.Message);
            });

            ReportService.GetMediaReport(mediaType, '0', channel, '0', 1, dateFrom, dateTo, '', false, 1, 3, isShift).then(function (l) {
                var channelTypes = [];
                var series = [];
                var rnd = [];
                var response = l.data;
                response.forEach(function (i) {
                    var name = i.XAxis;

                    rnd.push({
                        name: name,
                        y: i.Value1
                    });
                    channelTypes.push(name);
                });
                series.push({
                    name: "Media News",
                    colorByPoint: true,
                    data: rnd
                });

                $scope.KEChannelWiseTotalConfig = $scope.getBarChartConfig(channelTypes, series, "", 'KE Related News - Channel Wise Analysis (' + $scope.mediatypename + ')');

            }, function (err) {
                GlobalService.ErrorPopup("Error", err.data.Message);
            });

            ReportService.GetMediaReport(mediaType, '0', channel, '0', 1, dateFrom, dateTo, '', false, 2, 3, isShift).then(function (l) {
                var channelTypes = [];
                var series = [];
                var rnd = [];
                var response = l.data;
                response.forEach(function (i) {
                    var name = i.XAxis;

                    rnd.push({
                        name: name,
                        y: i.Value1
                    });
                    channelTypes.push(name);
                });
                series.push({
                    name: "Media News",
                    colorByPoint: true,
                    data: rnd
                });

                $scope.KEChannelWiseNIConfig = $scope.getBarChartConfig(channelTypes, series, "", 'KE Related - Noise Frequency (' + $scope.mediatypename + ')');
                var areas = $filter('orderBy')(rnd, "y", true);
                if (areas.length > 0) {
                    $scope.top3Areas = "";
                    $scope.bot3Areas = "";
                    var length = areas.length > 3 ? 3 : areas.length;
                    var maxLength = areas.length - 1;
                    for (var i = 0; i < length; i++) {
                        if (i == length - 1 && i > 0) {
                            $scope.top3Areas += "& " + areas[i].name;
                            $scope.bot3Areas += "& " + areas[maxLength - i].name;
                        } else if (i == length - 1) {
                            $scope.top3Areas += areas[i].name;
                            $scope.bot3Areas += areas[maxLength - i].name;
                        } else if (i == length - 2) {
                            $scope.top3Areas += areas[i].name + " ";
                            $scope.bot3Areas += areas[maxLength - i].name + " ";
                        } else {
                            $scope.top3Areas += areas[i].name + ", ";
                            $scope.bot3Areas += areas[maxLength - i].name + ", ";
                        }
                    }
                }
                else {
                    $scope.top3Areas = "None";
                    $scope.bot3Areas = "None";
                }
            }, function (err) {
                GlobalService.ErrorPopup("Error", err.data.Message);
            });
        }
        else if (filterType == 3) {
            var relevanceTypes = [];
            var series = [];
            var _2DData = [];
            $scope.tabularRelSent = new Array();
            var relavances = "";
            $scope.relevanceModel.forEach(function (i) {
                relavances += i.id + ","
            });
            if (relavances.length > 0)
                relavances = relavances.substring(0, relavances.length - 1);

            ReportService.GetMediaReport(mediaType, '0', '0', '0', relavances, dateFrom, dateTo, '', false, 4, 9, isShift).then(function (l) {
                var response = l.data;

                response.forEach(function (i) {
                    var inc = 1;
                    var name = i.XAxis;

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
                    relevanceTypes.push(name);

                    var obj = {};
                    obj.RelName = i.XAxis;
                    obj.Positive = i.Value1;
                    obj.Neutral = i.Value2;
                    obj.Negative = i.Value3;
                    obj.TotalSent = i.Value1 + i.Value2 + i.Value3;
                    $scope.tabularRelSent.push(obj);
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
                $scope.SentimentAnalysisChartConfig = $scope.getBarChartConfig(relevanceTypes, series, "", 'News Relevance Breakup (' + $scope.mediatypename + ')');

            }, function (err) {
                GlobalService.ErrorPopup("Error", err.data.Message);
            });
        }
        else if (filterType == 4) {
            var categories = "";
            $scope.categoryModel.forEach(function (i) {
                categories += i.id + ","
            });
            if (categories.length > 0)
                categories = categories.substring(0, categories.length - 1);
            ReportService.GetMediaReport(mediaType, '0', '0', categories, 1, dateFrom, dateTo, '', false, 1, 4, isShift).then(function (l) {
                var rnd = [];
                var categoryTypes = [];
                var series = [];
                var response = l.data;
                response.forEach(function (i) {
                    var name = i.XAxis;

                    rnd.push({
                        name: name,
                        y: i.Value1
                    });
                    categoryTypes.push(name);
                });
                series.push({
                    name: "Media News",
                    colorByPoint: true,
                    data: rnd
                });

                $scope.CategoryAnalysisChartConfig = $scope.getBarChartConfig(categoryTypes, series, "", 'KE Related - Media News by Category (' + $scope.mediatypename + ')');

            }, function (err) {
                GlobalService.ErrorPopup("Error", err.data.Message);
            });
        }
        else if (filterType == 5) {
            ReportService.GetMediaReport(mediaType, '0', '0', '0', 1, dateFrom, dateTo, '', false, 1, 8, isShift).then(function (l) {
                var rnd = [];
                var categoryTypes = [];
                var series = [];
                var response = l.data;
                response.forEach(function (i) {
                    var name = $filter('date')(i.InsertionDate, 'HH:mm');
                    rnd.push({
                        name: name,
                        y: i.Value1
                    });
                    categoryTypes.push(name);
                });
                series.push({
                    name: "Media News",
                    data: rnd,
                    type: 'line'
                });

                $scope.EvolutionChartConfig = $scope.getBarChartConfig(categoryTypes, series, "", 'Monitoring Report Traffic (' + $scope.mediatypename + ') - KE Related – 8 hourly');

            }, function (err) {
                GlobalService.ErrorPopup("Error", err.data.Message);
            });
        }
        else if (filterType == 6) {
            ReportService.GetMediaReport(mediaType, '0', '0', '0', '0', dateFrom, dateTo, '', false, 9, 1, isShift).then(function (l) {
                var response = l.data;
                $scope.TotalPRValue = response[0].Value1;
            });
        }
        else if (filterType == 7) {
            ReportService.GetMediaReport(mediaType, '0', '0', '0', '0', dateFrom, dateTo, '', false, 8, 1, isShift).then(function (l) {
                var response = l.data;
                $scope.OnDutyAgents = "";
                response.forEach(function (i) {
                    $scope.OnDutyAgents += i.XAxis + ", ";
                });
                if ($scope.OnDutyAgents.length > 0)
                    $scope.OnDutyAgents = $scope.OnDutyAgents.substring(0, $scope.OnDutyAgents.length - 2);
                else
                    $scope.OnDutyAgents = "None";
            });
        }
        else if (filterType == 8) {
            ReportService.GetMediaReport(mediaType, '0', '0', '0', '0', dateFrom, dateTo, '', false, 1, 1, isShift).then(function (l) {
                var response = l.data;
                $scope.TotalMediaRecords = 0;
                response.forEach(function (i) {
                    $scope.TotalMediaRecords += i.Value1;
                });
            });
        }
    }

    $scope.emailReport = function () {
        GlobalService.ConfirmPopup("Confirm", "Are you sure you want to email report?", function (selectedItem) {
            //alert($window.location.hash.split('?')[0])
            if (selectedItem) {
                var KEEvolutionImg = CreateCanvasFromSVG(".ke-evolution-chart").toDataURL('image/png');
                var TotalSentimentImg = CreateCanvasFromSVG(".total-sentiment-chart").toDataURL('image/png');
                var KESentimentImg = CreateCanvasFromSVG(".ke-sentiment-chart").toDataURL('image/png');
                var KETotalChannelImg = CreateCanvasFromSVG(".ke-totalchannel-chart").toDataURL('image/png');
                var KENIChannelImg = CreateCanvasFromSVG(".ke-nichannel-chart").toDataURL('image/png');
                var KECategoryImg = CreateCanvasFromSVG(".ke-category-chart").toDataURL('image/png');
                var ActivitiesImg = CreateCanvasFromSVG(".activities-chart").toDataURL('image/png');

                var data = {
                    shift: $scope.shiftText,
                    date: $scope.selectedDate.format("YYYY-MM-DD") + $scope.selectedShiftStartTime,
                    isPrint: $scope.isPrint,
                    totalMediaRecords: $scope.TotalMediaRecords,
                    top3Areas: $scope.top3Areas,
                    bot3Areas: $scope.bot3Areas,
                    onDutyAgents: $scope.OnDutyAgents,
                    totalPRValue: $scope.TotalPRValue,
                    totalSentimentData: $scope.tabularRelSent,
                    keEvolutionImg: KEEvolutionImg,
                    totalSentimentImg: TotalSentimentImg,
                    keSentimentImg: KESentimentImg,
                    keTotalChannelImg: KETotalChannelImg,
                    keNIChannelImg: KENIChannelImg,
                    keCategoryImg: KECategoryImg,
                    activitiesImg: ActivitiesImg
                };

                ReportService.EmailMediaMonitoringReport(data).then(function (l) {
                    var response = l.data;
                    if (response) {
                        var msg = "Monitoring Report successfully sent by Email";
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
    }

    if ($rootScope.UserObject != undefined)
        $scope.init();
}]);