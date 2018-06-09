CRMApp.controller('WeeklyReportController', ['$rootScope', '$scope', '$window', '$location', '$stateParams', 'ReportService', 'GlobalService', 'notify', '$uibModal', function ($rootScope, $scope, $window, $location, $stateParams, ReportService, GlobalService, notify, $uibModal) {
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
                }
                else {
                    $scope.PrevStartDate = $scope.startDate;
                    $scope.PrevEndDate = $scope.endDate;
                    $scope.dateFilterEnum = 5;
                }

                $scope.filterMediaRecords();
            }
        }
    };

    $scope.date = {
        startDate: moment().subtract(7, "days"),
        endDate: moment()
    };

    $scope.startDate = $scope.date.startDate;
    $scope.PrevStartDate = $scope.startDate;
    $scope.endDate = $scope.date.endDate;
    $scope.PrevEndDate = $scope.endDate;

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
    }

    $scope.example5customTexts = { buttonDefaultText: 'Please Select' };

    $scope.example5customTextsMediaType = { buttonDefaultText: 'Select Media Type' };
    $scope.example5customTextsNewsType = { buttonDefaultText: 'Select News Type(s)' };
    $scope.example5customTextsChannel = { buttonDefaultText: 'Select Channel(s)' };
    $scope.example5customTextsRelavance = { buttonDefaultText: 'Select Relevance(s)' };

    $scope.groupsettings = {
        selectionLimit: 1,
        closeOnSelect: true,
        smartButtonMaxItems: 3,
        scrollable: false,
        scrollableHeight: '300px',
        smartButtonTextConverter: function (itemText, originalItem) {
            return itemText;
        }
    }

    $scope.multiSelectSettings = {
        keyboardControls: true,
        enableSearch: true,
        smartButtonMaxItems: 8,
        scrollable: true,
        scrollableHeight: '300px',
        smartButtonTextConverter: function (itemText, originalItem) {
            return itemText;
        }
    };

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

            $scope.mediaType = angular.copy($scope.MediaTypeList[0]);
            onItemSelectMedia($scope.mediaType);
        }, function (err) {
            GlobalService.ErrorPopup("Error", err.data.Message);
        });
    };

    $scope.filterMediaRecords = function () {
        for (var i = 2; i < 7; i++) {
            $scope.FilterSentimentReport(i);
        }
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

    $scope.categoryEventListeners = {
        onSelectionChanged: onItemSelectCategory
    };

    function onItemSelectCategory() {
        $scope.FilterSentimentReport(4);
    }

    $scope.newsTypeEventListeners = {
        onSelectionChanged: onItemSelectNewsType
    };

    function onItemSelectNewsType() {
        $scope.FilterSentimentReport(5);
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
        mediaTypeName = $scope.MediaTypeListAll.filter(function (i) {
            return i.Value == parseInt($scope.mediaType.id)
        })[0].Text;
        var mediaType = $scope.mediaType.id !== undefined ? parseInt($scope.mediaType.id) : 0;
        var dateFrom = moment($scope.startDate).add(5, "hours");
        var dateTo = moment($scope.endDate).add(5, "hours");
            
        if (filterType == 2) {
            $scope.RelevanceList.forEach(function (rel) {
                if (rel.id != 3) {
                    var channelTypes = [];
                    var series = [];
                    var channel = "";
                    var _2DData = [];

                    $scope.channelType.forEach(function (i) {
                        channel += i.id + ","
                    });
                    if (channel.length > 0)
                        channel = channel.substring(0, channel.length - 1);

                    ReportService.GetMediaReport(mediaType, '0', channel, '0', rel.id, dateFrom, dateTo, '', false, 4, 3).then(function (l) {
                        var response = l.data;
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

                        if (rel.id == 1)
                            $scope.KEChannelWiseConfig = $scope.getBarChartConfig(channelTypes, series, "", rel.label + '- ' + mediaTypeName + ' Media Tonality');
                        if (rel.id == 2)
                            $scope.OtherDiscoChannelWiseConfig = $scope.getBarChartConfig(channelTypes, series, "", rel.label + '- ' + mediaTypeName + ' Media Tonality');

                    }, function (err) {
                        GlobalService.ErrorPopup("Error", err.data.Message);
                    });
                }
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

            ReportService.GetMediaReport(mediaType, '0', '0', '0', relavances, dateFrom, dateTo, '', false, 4, 9).then(function (l) {
                var response = l.data;

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
                $scope.SentimentAnalysisChartConfig = $scope.getBarChartConfig(relevanceTypes, series, "", mediaTypeName + ' Media Monitoring');

            }, function (err) {
                GlobalService.ErrorPopup("Error", err.data.Message);
            });
        }
        else if (filterType == 4) {
            var categoryTypes = [];
            var series = [];
            var _2DData = [];
            var categories = "";
            $scope.categoryModel.forEach(function (i) {
                categories += i.id + ","
            });
            if (categories.length > 0)
                categories = categories.substring(0, categories.length - 1);

            ReportService.GetMediaReport(mediaType, '0', '0', categories, '0', dateFrom, dateTo, '', false, 5, 4).then(function (l) {
                var response = l.data;

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
                    categoryTypes.push(name);
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
                $scope.CategoryAnalysisChartConfig = $scope.getBarChartConfig(categoryTypes, series, "", mediaTypeName + ' Media Category Monitoring');

            }, function (err) {
                GlobalService.ErrorPopup("Error", err.data.Message);
            });
        }
        else if (filterType == 5) {
            var newsTypeNames = [];
            var series = [];
            var _2DData = [];
            var newsType = "";
            $scope.newsType.forEach(function (i) {
                newsType += i.id + ","
            });
            if (newsType.length > 0)
                newsType = newsType.substring(0, newsType.length - 1);

            ReportService.GetMediaReport(mediaType, newsType, '0', '0', '0', dateFrom, dateTo, '', false, 5, 2).then(function (l) {
                var response = l.data;

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
                    newsTypeNames.push(name);
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
                $scope.NewsTypeAnalysisChartConfig = $scope.getBarChartConfig(newsTypeNames, series, "", mediaTypeName + ' Media NewsType Monitoring');

            }, function (err) {
                GlobalService.ErrorPopup("Error", err.data.Message);
            });

            ReportService.GetMediaReport(mediaType, newsType, '0', '0', '0', dateFrom, dateTo, '', true, 1, 2).then(function (l) {
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
                $('#KEActivityWiseConfig').highcharts($scope.getPieChartConfig(agentSeries, 'KE Activities'));

            }, function (err) {
                GlobalService.ErrorPopup("Error", err.data.Message);
            });
        }
        else if (filterType == 6) {
            ReportService.GetMediaReport(mediaType, '0', '0', '0', '0', dateFrom, dateTo, '', false, 9, 1).then(function (l) {
                var response = l.data;
                $scope.TotalPRValue = response[0].Value1;
            });
        }
    }

    $scope.ConvertPDF = function (isEmail) {
        var pageWidth = 500;
        var pageHeight = 300;
        var doc = new jsPDF('landscape', 'mm', [pageWidth, pageHeight]);

        var reportType = "Electronic Media";
        var pic3 = "data:image/png;base64,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";
        if ($scope.mediaType.id == "3") {
            reportType = "Print Media";
            pic3 = "data:image/png;base64,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";
        }
        var fromDate = $scope.date.startDate.format('MMM D, YYYY');
        var toDate = $scope.date.endDate.format('MMM D, YYYY');
        var title = 'Executive Report | ' + fromDate + ' – ' + toDate;
        var pic1 = "data:image/jpeg;base64,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";
        var pic2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAP5CAMAAADKUkT9AAAAAXNSR0ICQMB9xQAAAANQTFRFEZDPwAShpgAAAAlwSFlzAAAXEgAAFxIBZ5/SUgAAABl0RVh0U29mdHdhcmUATWljcm9zb2Z0IE9mZmljZX/tNXEAAAAvSURBVHja7cExAQAAAMKg9U9tDQ+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADg1wBfWAABkchlgAAAAABJRU5ErkJggg==";
        doc.addImage(pic1, 'JPEG', 5, 5, 40, 20);
        doc.addImage(pic2, 'JPEG', 1, 25, 5, 274);
        doc.addImage(pic3, 'JPEG', 70, 2, 360, 50);
        doc.setFont("helvetica");
        doc.setFontType("bold");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(25);
        if($scope.mediaType)
            doc.text(225, 21, reportType);
        doc.setFontSize(22);
        doc.text(185, 36, title);

        var columns = [
            { title: "Sentiment Analysis", dataKey: "RelName" },
            { title: "Positive", dataKey: "Positive" },
            { title: "Neutral", dataKey: "Neutral" },
            { title: "Negative", dataKey: "Negative" },
            { title: "Total", dataKey: "TotalSent" }
        ];

        var imgWidth = 220;
        canvas = CreateCanvasFromSVG(".activities-chart");
        imgData = canvas.toDataURL('image/png');
        imgHeight = canvas.height * (imgWidth + 100) / canvas.width;
        doc.addImage(imgData, 'PNG', 210, 50, (imgWidth + 100), imgHeight);

        doc.autoTable(columns, $scope.tabularRelSent, {
            theme: 'plain',
            styles: { fillColor: [233, 241, 245] },
            headerStyles: { fillColor: [0, 176, 240], textColor: [255, 255, 255] },
            margin: { left:30, top: 60 },
            tableWidth: imgWidth
        });

        canvas = CreateCanvasFromSVG(".total-sentiment-chart");
        var imgData = canvas.toDataURL('image/png');
        var imgHeight = canvas.height * imgWidth / canvas.width;
        doc.addImage(imgData, 'PNG', 30, 100, imgWidth, imgHeight);

        canvas = CreateCanvasFromSVG(".ke-sentiment-chart");
        imgData = canvas.toDataURL('image/png');
        imgHeight = canvas.height * imgWidth / canvas.width;
        doc.addImage(imgData, 'PNG', 30, 200, imgWidth, imgHeight);

        canvas = CreateCanvasFromSVG(".other-sentiment-chart");
        imgData = canvas.toDataURL('image/png');
        imgHeight = canvas.height * imgWidth / canvas.width;
        doc.addImage(imgData, 'PNG', 260, 200, imgWidth, imgHeight);

        doc.addPage();
        doc.addImage(pic1, 'JPEG', 5, 5, 40, 20);
        doc.addImage(pic2, 'JPEG', 1, 25, 5, 274);
        doc.addImage(pic3, 'JPEG', 70, 2, 360, 50);
        doc.setFont("helvetica");
        doc.setFontType("bold");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(25);
        if ($scope.mediaType)
            doc.text(225, 21, reportType);
        doc.setFontSize(22);
        doc.text(185, 36, title);

        if ($scope.mediaType.id == 3) {
            doc.setTextColor(0, 176, 240);
            doc.text(30, 70, "Total Print PR Value: " + $scope.TotalPRValue);
        }

        canvas = CreateCanvasFromSVG(".ke-category-chart");
        imgData = canvas.toDataURL('image/png');
        imgHeight = canvas.height * imgWidth / canvas.width;
        doc.addImage(imgData, 'PNG', 30, 80, imgWidth, imgHeight);

        canvas = CreateCanvasFromSVG(".ke-newstype-chart");
        imgData = canvas.toDataURL('image/png');
        imgHeight = canvas.height * imgWidth / canvas.width;
        doc.addImage(imgData, 'PNG', 260, 80, imgWidth, imgHeight);

        var today = new Date();
        var fileName = title + '.pdf';
        if (isEmail) {
            var binary = doc.output('datauri');
            //var content = binary ? btoa(binary) : "";

            $scope.EmailPdfReport(fileName, binary, "application/pdf");
        }
        else
            doc.save(fileName);
    }

    $scope.EmailPdfReport = function (fileName, content, type) {
        GlobalService.ConfirmPopup("Confirm", "Are you sure you want to email report?", function (selectedItem) {
            //alert($window.location.hash.split('?')[0])
            if (selectedItem) {
                ReportService.EmailPdfReport(fileName, content, type).then(function (l) {
                    var response = l.data;
                    console.log(response);
                }, function (err) {
                    GlobalService.ErrorPopup("Error", err.data.Message);
                });
            }
        });
    };

    if ($rootScope.UserObject != undefined)
        $scope.init();
}]);