CRMApp.controller('_ViewScriptController', ['$rootScope', '$scope', '$window', '$location', '$uibModalInstance', '$window', 'items', function ($rootScope, $scope, $window, $location, $uibModalInstance, $window, items) {

    $scope.commentsLength = {
        height: '380px',//350
        disableFadeOut: true
    }
    
    $scope.Script = items.Script;   
    
    $scope.cancel = $scope.OK = function () {        
        $uibModalInstance.close('cancel');
    };

}]);