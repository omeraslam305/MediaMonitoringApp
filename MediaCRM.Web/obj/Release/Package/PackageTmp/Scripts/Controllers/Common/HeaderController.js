CRMApp.controller('HeaderController', ['$rootScope', '$scope', '$window', '$location', '$compile', '$uibModal', '$cookies', 'AuthService', 'GlobalService', 'notify', 'NotificationService', function ($rootScope, $scope, $window, $location, $compile, $uibModal, $cookies, AuthService, GlobalService, notify, NotificationService) {

    $scope.redirectTo = function (path) {
        $window.location.href = path;
    };

    $scope.replaceTilda = function (label) {
        // str.replace("Microsoft", "W3Schools")
        return label.replace('~', '');
    };

    $scope.init = function () {
        var d = new Date();
        $scope.UserImage = $rootScope.UserObject.ImageUrl;
        $scope.UserImage = $scope.UserImage == '' && "/Content/img/user_pic.jpg" || $scope.replaceTilda($scope.UserImage);
        $scope.UserImage = $scope.UserImage + "?" + d.getTime();
        $scope.SetNavLinks();
    };

    $scope.SendNotificationEmailUpdates = function()
    {
        NotificationService.SendNotificationEmailUpdates();
    }

    $scope.SetNavLinks = function () {
        if ($rootScope.UserObject.AppType == "Media") {
            $scope.subLinks = [
            {
                //Title: 'Unified Deck'
                Title: 'TV',
                url: '/#/Media/AddMediaNews?Media=',
                parameter: 'TV',
                hide: !$rootScope.MediaAdmin && !$rootScope.MediaTV
            },
            {
                Title: 'Print',
                url: '/#/Media/AddMediaNews?Media=',
                parameter: 'Print',
                hide: !$rootScope.MediaAdmin && !$rootScope.MediaPrint
            },
            {
                Title: 'Radio',
                url: '/#/Media/AddMediaNews?Media=',
                parameter: 'Radio',
                hide: !$rootScope.MediaAdmin && !$rootScope.MediaRadio
            }];

            $scope.navLinks = [
                {
                    Title: 'Data Archive',
                    url: '/#/Media/Dashboard',
                    parameter: '',
                    icon: 'fa-tachometer',
                    hide: !$rootScope.MediaAdmin && !$rootScope.MediaPrint && !$rootScope.MediaRadio && !$rootScope.MediaTV
                },
                {
                    Title: 'Reports',
                    url: '/#/Media/Reports',
                    parameter: '',
                    icon: 'fa-line-chart',
                    hide: !$rootScope.MediaAdmin && !$rootScope.MediaPrint && !$rootScope.MediaRadio && !$rootScope.MediaTV
                },
                {
                    Title: 'Executive Report',
                    url: '/#/Media/ExecutiveReport',
                    parameter: '',
                    icon: 'fa-calendar',
                    hide: !$rootScope.MediaAdmin && !$rootScope.MediaPrint && !$rootScope.MediaRadio && !$rootScope.MediaTV
                },
                {
                    Title: 'Media Monitoring',
                    url: '/#/Media/MediaMonitoringReport',
                    parameter: '',
                    icon: 'fa-desktop',
                    hide: !$rootScope.MediaAdmin && !$rootScope.MediaPrint && !$rootScope.MediaRadio && !$rootScope.MediaTV
                },
                {
                    Title: 'Email ID Settings',
                    url: '/#/Media/EmailSettings',
                    parameter: '',
                    icon: 'fa-envelope',
                    hide: !$rootScope.MediaAdmin
                },
                {
                    Title: 'User Creation',
                    url: '/#/Media/UserCreation',
                    parameter: '',
                    icon: 'fa-users',
                    hide: !$rootScope.MediaAdmin
                },
                {
                    Title: 'Media Channels',
                    url: '/#/Media/Channels',
                    parameter: '',
                    icon: 'fa-medium',
                    hide: !$rootScope.MediaAdmin
                },
                {
                    Title: 'Categories',
                    url: '/#/Media/Categories',
                    parameter: '',
                    icon: 'fa-tags',
                    hide: !$rootScope.MediaAdmin
                },
                {
                    Title: 'Profile Settings',
                    url: '/#/Media/ProfileSettings',
                    parameter: '',
                    icon: 'fa-cog',
                    hide: !$rootScope.MediaAdmin && !$rootScope.MediaPrint && !$rootScope.MediaRadio && !$rootScope.MediaTV
                }
            ];
        }
        /*else if ($rootScope.UserObject.AppType == "Call") {
            $scope.navLinks = [
                {
                    Title: 'Dashboard',
                    url: '/#/CallCenter/Dashboard',
                    parameter: '',
                    icon: 'fa-envelope',
                    hide: !$rootScope.CallAdmin && !$rootScope.CallUser
                },
                {
                    Title: 'Reports',
                    url: '/#/CallCenter/Reports',
                    parameter: '',
                    icon: 'fa-envelope',
                    hide: !$rootScope.CallAdmin && !$rootScope.CallUser
                },
                {
                    Title: 'Email ID Settings',
                    url: '/#/CallCenter/EmailSettings',
                    parameter: '',
                    icon: 'fa-envelope',
                    hide: !$rootScope.CallAdmin
                },
                {
                    Title: 'User Creation',
                    url: '/#/CallCenter/UserCreation',
                    parameter: '',
                    icon: 'fa-envelope',
                    hide: !$rootScope.CallAdmin
                }
            ];
        }
        else if ($rootScope.UserObject.AppType == "Exec") {
            $scope.navLinks = [
                {
                    Title: 'Dashboard',
                    url: '/#/Executive/Dashboard',
                    parameter: '',
                    icon: 'fa-envelope',
                    hide: !$rootScope.ExecAdmin && !$rootScope.ExecUser
                },
                {
                    Title: 'Email ID Settings',
                    url: '/#/Executive/EmailSettings',
                    parameter: '',
                    icon: 'fa-envelope',
                    hide: !$rootScope.ExecAdmin
                },
                {
                    Title: 'User Creation',
                    url: '/#/Executive/UserCreation',
                    parameter: '',
                    icon: 'fa-envelope',
                    hide: !$rootScope.ExecAdmin
                }
            ];
        }*/
    }

    $rootScope.$on('Profile_Pic_Change', function (evt, msg) {
        //alert("in broadcast")
        AuthService.UserProfile($rootScope.UserObject.Email, $scope.UserObject.AppType).then(function (l) {
            if (l != null) {
                var d = new Date();
                $cookies.putObject("userSession", l.data, { path: '/' });
                $rootScope.UserObject = l.data;
                $scope.UserImage = $rootScope.UserObject.ImageUrl;
                $scope.UserImage = $scope.UserImage == '' && "/Content/img/user_pic.jpg" || $scope.replaceTilda($scope.UserImage);
                $scope.UserImage = $scope.UserImage + "?" + d.getTime();
            }
            else {
                //  alert('Error in fetching data, please try again.');
                GlobalService.ErrorPopup("Error", "Error in fetching data, please try again.");
            }
        }, function (err) {
            // alert('Error in fetching data, please try again.');
            GlobalService.ErrorPopup("Error", "Error in fetching data, please try again.");
            console.log(err);
        });

    });

    $scope.navClass = function (page) {
        var currentRoute = page.substring(2) || 'home';
        //alert(currentRoute)
        var obj = ($location.url() === currentRoute || $location.path() === currentRoute) ? 'left_nav_subs_active' : '';

        return obj;
    }

    $scope.logout = function () {
        GlobalService.ConfirmPopup("Confirm", "Would you like to logout?", function (selectedItem) {
            //alert($window.location.hash.split('?')[0])
            if (selectedItem) {
                AuthService.LogOut().then(function (l) {
                //alert("group has been added")
                var appType = $rootScope.UserObject.AppType;
                $rootScope.UserObject = null;
                $rootScope.MediaAdmin = null;
                $rootScope.MediaPrint = null;
                $rootScope.MediaRadio = null;
                $rootScope.MediaTV = null;
                $cookies.remove("userSession", { path: '/' });

                if (appType == "Media")
                    $scope.redirectTo("#/Media/Login");
                /*else if(appType == "Call")
                    $scope.redirectTo("#/CallCenter/Login");
                else if (appType == "Exec")
                    $scope.redirectTo("#/Executive/Login");*/
                }, function (err) {
                 //   alert('Error in Logging out, please try again.');
                    GlobalService.ErrorPopup("Error", "Error in Logging out, please try again.");
                    console.log(err);
                });
                //alert("logging out");
            }
        });
    }

    $scope.MarkReadNotification = function () {
        NotificationService.MarkReadNotification($rootScope.selectedCompanyId).then(function (l) {
         
        }, function (err) {
           // GlobalService.ErrorPopup("Error", "Error in adding group, please try again.");


        });
    }

    $scope.MarkReadNotificationById = function (notif) {
        if(!notif.IsRead)
            NotificationService.MarkReadNotificationById(notif.MessageID).then(function (l) {

        }, function (err) {
            // GlobalService.ErrorPopup("Error", "Error in adding group, please try again.");


        });
    }

    $scope.init();
}]);