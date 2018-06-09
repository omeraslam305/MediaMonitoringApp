CRMApp.controller('_ViewAttachmentController', ['$rootScope', '$scope', '$window', '$location', '$uibModalInstance', '$window', 'items', 'MediaService', function ($rootScope, $scope, $window, $location, $uibModalInstance, $window, items, MediaService) {

    $scope.commentsLength = {
        height: '380px',//350
        disableFadeOut: true
    }

    $scope.init = function () {
        MediaService.GetAttachmentAsBase64String($scope.Id).then(function (l) {
            var response = l;
            $scope.ImgSrc = response.data;
            console.log(response);
        }, function (err) {
            GlobalService.ErrorPopup("Error", err.data.Message);
        });
    },

    $scope.Id = items.MediaNewsId;
    $scope.ImgSrc = "C:\Users\moaslam\Downloads\ddtyduhm8atyhdyiu7ol.jpg";
   
    
    $scope.cancel = $scope.OK = function () {        
        $uibModalInstance.close('cancel');
    };

    $scope.init();

}]);