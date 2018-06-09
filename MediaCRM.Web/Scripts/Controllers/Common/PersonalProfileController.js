CRMApp.controller('PersonalProfileController', ['$scope', '$window', '$location', '$stateParams', 'UserService', '$uibModal', '$rootScope', 'GlobalService', 'notify', function ($scope, $window, $location, $stateParams, UserService, $uibModal, $rootScope, GlobalService, notify) {
   
    $scope.ChangePassword=function()
    {
        $location.path("/Media/ChangePassword");
    }

    $scope.replaceTilda = function (label) {
        // str.replace("Microsoft", "W3Schools")
        return label.replace('~', '');
    };

    $scope.init = function () {
        $scope.Changed_UserName = $rootScope.UserObject.Name;
        $scope.Changed_UserEmail = $rootScope.UserObject.Email;
        $scope.errorMsg = "";
        $scope.htmlVariable = $rootScope.UserObject.SignHTML;

        var d = new Date();
        $scope.picModel = $rootScope.UserObject.ImageUrl;
        $scope.picModel = $scope.picModel == '' && "/Content/img/user_pic.jpg" || $scope.replaceTilda($scope.picModel);
        $scope.picModel = $scope.picModel + "?" + d.getTime();
        $scope.imageType = 'none';
        $scope.fbIcon = '/Content/images/fb_ico16.png';
        $scope.linkedinIcon = '/Content/images/in_ico16.png';
        $scope.twitterIcon = '/Content/images/t_ico16.png';
        $scope.googleIcon = '/Content/images/ana_ico16.png';
        $scope.instaIcon = '/Content/images/insta_ico16.png';
        $scope.outlookIcon = '/Content/images/outlook_ico16.png';
        $scope.User_Rights = $rootScope.UserObject.UserRoles;
    };

    $scope.init();

    $scope.imageUpload = function (element) {
        checkFileType({
            allowedExtensions: ['jpg', 'jpeg','png'],
            
            error: function () {
                $scope.errorMsg = "Only jpg,jpeg and png images can be uploaded.";
                
            },
            success: function () {
                $scope.errorMsg = "";
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(element.files[0]);
               
            }
        });
    }

    function checkFileType(options) {
        var defaults = {
            allowedExtensions: [],
            success: function () { },
            error: function () { }
        };
        options = $.extend(defaults, options);
     
        var value = $('#User_image').val(),
               file = value.toLowerCase(),
               extension = file.substring(file.lastIndexOf('.') + 1);

        if ($.inArray(extension, options.allowedExtensions) == -1) {
            
            options.error();
            $(this).focus();
        } else {
            return options.success();
        }
    }

    $scope.imageIsLoaded = function (e) {
        $scope.$apply(function () {
            $scope.picModel = e.target.result;
        });
        /*var image = new Image();
        image.src = e.target.result;

        image.onload = function () {
            if (image.width != image.height){
                $scope.$apply(function () {
                    $scope.picModel = e.target.result;
                    $scope.errorMsg = "Only Pictures with same width and height can be uploaded.";
                });
            }
            else {
                $scope.$apply(function () {
                    $scope.picModel = e.target.result;
                });
            }
        };*/
    }

    $scope.Save = function () {
        UserService.UpdatePersonalProfile($scope.Changed_UserName, $scope.Changed_UserEmail, $scope.Changed_UserPic, $scope.htmlVariable).then(function (l) {
            notify({
                message: "Successfully updated data.",
                position: GlobalService.position,
                duration: GlobalService.duration
            });
            $rootScope.$broadcast('Profile_Pic_Change', {});
        }, function (err) {
            // alert('Error in update, please try again.');
            GlobalService.ErrorPopup("Error", "Error in update, please try again.");

            console.log(err);
        });
    }

    $scope.Cancel = function () {
        //alert("cancelled");
        $scope.init();
    }

}]);