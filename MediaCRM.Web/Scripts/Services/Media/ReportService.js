CRMApp.factory('ReportService', function ($http) {
    var reportService = {};

    reportService.GetMediaReport = function (mediaTypeId, newsTypeIds, channelIds, categoryIds, relavanceIds, fromDate, toDate, script, isKEActivity, reportType, filterType, isShift = false) {
        var _data = { mediaTypeId: mediaTypeId, newsTypeIds: newsTypeIds, channelIds: channelIds, categoryIds: categoryIds, relavanceIds: relavanceIds, fromDate: fromDate, toDate: toDate, script: script, isKEActivity: isKEActivity, reportType: reportType, filterType: filterType, isShift: isShift };

        var request = $http({
            method: 'POST',
            url: base_url + '/api/MediaReport/GetMediaReport',
            data: JSON.stringify(_data)
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
    }

   reportService.GetMediaReportFilters = function () {
       var requestUrl = base_url + '/api/MediaReport/GetMediaReportFilters';
        var request = $http({
            method: 'GET',
            url: requestUrl
        }).then(function successCallback(response) {
            return response;
        }, function errorCallback(response) {

        });
        return request;
   }

   reportService.EmailPdfReport = function (fileName, fileContent, contentType) {
       var _data = { fileName: fileName, fileContent: fileContent, contentType: contentType };
        var request = $http({
            method: 'POST',
            url: base_url + '/api/MediaReport/EmailPdfReport',
            data: JSON.stringify(_data)
        }).then(function (res) {
            return res;
        });
        return request;
    }

   reportService.EmailMediaMonitoringReport = function (data) {
       var requestUrl = base_url + '/api/MediaReport/EmailMediaMonitoringReport';
       var request = $http({
           method: 'POST',
           url: requestUrl,
           data: JSON.stringify(data)
       }).then(function (res) {
           return res;
       });
       return request;
   }

    return reportService;
});