CRMApp.controller('_ConfirmPopUpController', ['$rootScope', '$scope', '$window', '$location', '$uibModalInstance', '$window', 'items',  function ($rootScope, $scope, $window, $location, $uibModalInstance, $window, items) {

    $scope.ErrorTitle = items.ErrorTitle;
    $scope.ErrorMessage = items.ErrorMessage;
    // $scope.msg = items.msg;
   
    $scope.OK = function () {
        $uibModalInstance.close(true);
    };

    $scope.Cancel = function () {
        $uibModalInstance.close(false);
    };

}]);