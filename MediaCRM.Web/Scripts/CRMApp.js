
var base_url = document.location.origin; + '';
var CRMApp = angular.module('CRMApp', ['ui.bootstrap', 'ngMaterial', 'ngMessages', 'ui.router', 'ngCookies', 'ngAnimate', 'ngLodash', 'ui.slimscroll', 'angularjs-dropdown-multiselect', 'highcharts-ng', 'angularjs-dropdown-multiselect1', 'angularjs-click', 'file_Upload', 'ngCookies', 'angularjs-expandCollapse', 'blockUI', 'cgNotify', 'ngAutocomplete', 'ui.bootstrap.datetimepicker', 'daterangepicker', 'angularFileUpload', 'ngSanitize', 'textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']);

CRMApp.config(function ($stateProvider, $urlRouterProvider, blockUIConfig, $provide) {
    $urlRouterProvider.otherwise("/Media");
    blockUIConfig.message = '';
    // blockUIConfig.defaults.overlayCSS.opacity = 0;
    //  blockUIConfig.templateUrl = '<b>asdasdsadasdas</b>';
    blockUIConfig.requestFilter = function (config) {
        // If the request starts with '/api/quote' ...
        if (config.url.indexOf("GetLatestUnifiedInboxDataForSelectedProfiles") > 0 ||
            config.url.indexOf("GetAllMessages") > 0 ||
            config.url.indexOf("MarkReadNotificationById") > 0 ||
            config.url.indexOf("GetAllScheduledMessages") > 0 ||
            config.url.indexOf("GetAllQueuedMessages") > 0 ||
            config.url.indexOf("FacebookGetAllPostInfo") > 0 ||
            config.url.indexOf("GetPostDetails") > 0 ||
            config.url.indexOf("GetTweetMinnedReplies") > 0 ||
            config.url.indexOf("GetTweetDirectReplies") > 0
           ){//window.location.hash == "#/UnifiedInbox") {
            return false; // ... don't block it.
        }
    };

    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) { // $delegate is the taOptions we are decorating
        // $delegate is the taOptions we are decorating
        // register the tool with textAngular

        taRegisterTool('backgroundColor', {
            display: "<div spectrum-colorpicker ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></div>",
            action: function (color) {
                var me = this;
                if (!this.$editor().wrapSelection) {
                    setTimeout(function () {
                        me.action(color);
                    }, 100)
                } else {
                    return this.$editor().wrapSelection('backColor', color);
                }
            },
            options: {
                replacerClassName: 'fa fa-paint-brush', showButtons: false
            },
            color: "#fff"
        });
        taRegisterTool('fontColor', {
            display: "<div style='padding:1px !important' spectrum-colorpicker ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></div>",
            action: function (color) {
                var me = this;
                if (!this.$editor().wrapSelection) {
                    setTimeout(function () {
                        me.action(color);
                    }, 100)
                } else {
                    return this.$editor().wrapSelection('foreColor', color);
                }
            },
            options: {
                replacerClassName: 'fa', showButtons: false
            },
            color: "#000"
        });


        taRegisterTool('fontName', {
            display: "<span class='bar-btn-dropdown dropdown' style='padding: 0px'><button class='btn btn-default dropdown-toggle' type='button' style='padding:5px !important' ng-disabled='showHtml()'><i style='font-size:13px' class='fa fa-font'></i><i class='fa fa-caret-down'></i></button><ul class='dropdown-menu'><li ng-repeat='o in options'><button class='btn btn-default checked-dropdown' ng-class='{active: o.active}' style='font-family: {{o.css}}; width: 100%' type='button' ng-click='action($event, o.css)'>{{o.name}}</button></li></ul></span>",
            action: function (event, font) {
                //Ask if event is really an event.
                if (!!event.stopPropagation) {
                    //With this, you stop the event of textAngular.
                    event.stopPropagation();
                    //Then click in the body to close the dropdown.
                    $("body").trigger("click");
                }
                return this.$editor().wrapSelection('fontName', font);
            },
            options: [
                { name: 'Sans-Serif', css: 'Arial, Helvetica, sans-serif' },
                { name: 'Serif', css: "'times new roman', serif" },
                { name: 'Wide', css: "'arial black', sans-serif" },
                { name: 'Narrow', css: "'arial narrow', sans-serif" },
                { name: 'Comic Sans MS', css: "'comic sans ms', sans-serif" },
                { name: 'Courier New', css: "'courier new', monospace" },
                { name: 'Garamond', css: 'garamond, serif' },
                { name: 'Georgia', css: 'georgia, serif' },
                { name: 'Tahoma', css: 'tahoma, sans-serif' },
                { name: 'Trebuchet MS', css: "'trebuchet ms', sans-serif" },
                { name: "Helvetica", css: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
                { name: 'Verdana', css: 'verdana, sans-serif' },
                { name: 'Proxima Nova', css: 'proxima_nova_rgregular' }
            ]
        });


        taRegisterTool('fontSize', {
            display: "<span class='bar-btn-dropdown dropdown' style='padding: 0px'><button class='btn btn-default dropdown-toggle' style='padding:5px !important' type='button' ng-disabled='showHtml()'><i style='font-size:13px' class='fa fa-text-height'></i><i class='fa fa-caret-down'></i></button><ul class='dropdown-menu'><li ng-repeat='o in options'><button class='btn btn-default checked-dropdown' ng-class='{active: o.active}' style='font-size: {{o.css}}; width: 100%' type='button' ng-click='action($event, o.value)'>{{o.name}}</button></li></ul></span>",
            action: function (event, size) {
                //Ask if event is really an event.
                if (!!event.stopPropagation) {
                    //With this, you stop the event of textAngular.
                    event.stopPropagation();
                    //Then click in the body to close the dropdown.
                    $("body").trigger("click");
                }
                return this.$editor().wrapSelection('fontSize', parseInt(size));
            },
            options: [
                { name: 'xx-small', css: 'xx-small', value: 1 },
                { name: 'x-small', css: 'x-small', value: 2 },
                { name: 'small', css: 'small', value: 3 },
                { name: 'medium', css: 'medium', value: 4 },
                { name: 'large', css: 'large', value: 5 },
                { name: 'x-large', css: 'x-large', value: 6 },
                { name: 'xx-large', css: 'xx-large', value: 7 }

            ]
        });

        taOptions.toolbar = [
          ['fontColor', 'fontName', 'fontSize', 'bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear', 'justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent', 'html', 'insertImage', 'insertLink', 'insertVideo']
        ];
        return taOptions;
    }]);

    var paths = {
        'KECRM': {
            url: "/KECRM",
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Common/Universal.html"
                }
            }

            //  controller: "UserController"
        },
        'Media': {
            url: "/Media",
            abstract: true,
            views: {
                'header': {
                    templateUrl: base_url + "/Scripts/Views/Common/Layout/Header.html"
                   // controller: 'HeaderCtrl'
                },
                'footer': {
                    templateUrl: base_url + "/Scripts/Views/Common/Layout/Footer.html"
                    //controller: 'FooterCtrl'
                }
            }
           // header:base_url + "/Scripts/Views/Layout/Header.html",
           // templateUrl: base_url + "/Scripts/Views/User/login.html",
            //  controller: "UserController"
        },
        'Call': {
            url: "/CallCenter",
            abstract: true,
            views: {
                'header': {
                    templateUrl: base_url + "/Scripts/Views/Common/Layout/Header.html"
                    // controller: 'HeaderCtrl'
                },
                'footer': {
                    templateUrl: base_url + "/Scripts/Views/Common/Layout/Footer.html"
                    //controller: 'FooterCtrl'
                }
            }
            // header:base_url + "/Scripts/Views/Layout/Header.html",
            // templateUrl: base_url + "/Scripts/Views/User/login.html",
            //  controller: "UserController"
        },
        'Exec': {
            url: "/Executive",
            abstract: true,
            views: {
                'header': {
                    templateUrl: base_url + "/Scripts/Views/Common/Layout/Header.html"
                    // controller: 'HeaderCtrl'
                },
                'footer': {
                    templateUrl: base_url + "/Scripts/Views/Common/Layout/Footer.html"
                    //controller: 'FooterCtrl'
                }
            }
            // header:base_url + "/Scripts/Views/Layout/Header.html",
            // templateUrl: base_url + "/Scripts/Views/User/login.html",
            //  controller: "UserController"
        },
        'MediaLogin': {
            url: "/Media/Login",
            params: { appType: "Media" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Common/User/login.html"
                }
            }
            
            //  controller: "UserController"
        },
        'MediaResetPassword': {
            url: "/Media/ResetPassword",
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Common/User/ResetPassword.html"
                }
            }
            
            //  controller: "UserController"
        },
        'MediaSetPassword': {
            url: "/Media/SetPassword",
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Common/User/SetPassword.html"
                }
            }

            //  controller: "UserController"
        },
        'MediaLogin': {
            url: "/Media/Login",
            params: { appType: "Media" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Common/User/login.html"
                }
            }

            //  controller: "UserController"
        },
        'CallLogin': {
            url: "/CallCenter/Login",
            params: { appType: "Call" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Common/User/login.html"
                }
            }

            //  controller: "UserController"
        },
        'ExecLogin': {
            url: "/Executive/Login",
            params: { appType: "Exec" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Common/User/login.html"
                }
            }

            //  controller: "UserController"
        },
        'MediaDashboard': {
            url: "/Dashboard",
            params: { appType: "Media" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Media/MediaDashboard.html"
                }
            }
        },
        'MediaReports': {
            url: "/Reports",
            params: { appType: "Media" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Media/MediaReports.html"
                }
            }
        },
        'MediaWeeklyReport': {
            url: "/ExecutiveReport",
            params: { appType: "Media" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Media/MediaWeeklyReport.html"
                }
            }
        },
        'MediaMonitoringReport': {
            url: "/MediaMonitoringReport",
            params: { appType: "Media" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Media/MediaMonitoringReport.html"
                }
            }
        },
        'MediaProfileSettings': {
            url: "/ProfileSettings",
            params: { appType: "Media" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Common/PersonalProfile/PersonalProfile.html"
                }
            }
        },
        'MediaChangePassword': {
            url: "/ChangePassword",
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Common/PersonalProfile/ChangePassword.html"
                }
            }
        },
        'MediaEmailSettings': {
            url: "/EmailSettings",
            params: { appType: "Media" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Common/Email/EmailSettings.html"
                }
            }
        },
        'MediaForm': {
            url: "/AddMediaNews",
            params: { appType: "Media" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Media/MediaForm.html"
                }
            }
        },
        'MediaUserCreation': {
            url: "/UserCreation",
            params: { appType: "Media" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Common/UserCreation/UserCreation.html"
                }
            }
        },
        'MediaChannels': {
            url: "/Channels",
            params: { appType: "Media" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Media/MediaChannels.html"
                }
            }
        },
        'MediaCategories': {
            url: "/Categories",
            params: { appType: "Media" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Media/Categories.html"
                }
            }
        },
        'CallDashboard': {
            url: "/Dashboard",
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Call/CallDashboard.html"
                }
            }
        },
        'CallReports': {
            url: "/Reports",
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Call/CallReports.html"
                }
            }
        },
        'CallEmailSettings': {
            url: "/EmailSettings",
            params: { appType: "Call" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Common/Email/EmailSettings.html"
                }
            }
        },
        'CallUserCreation': {
            url: "/UserCreation",
            params: { appType: "Call" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Common/UserCreation/UserCreation.html"
                }
            }
        },
        'ExecDashboard': {
            url: "/Dashboard",
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Exec/ExecDashboard.html"
                }
            }
        },
        'ExecEmailSettings': {
            url: "/EmailSettings",
            params: { appType: "Exec" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Common/Email/EmailSettings.html"
                }
            }
        },
        'ExecUserCreation': {
            url: "/UserCreation",
            params: { appType: "Exec" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Common/UserCreation/UserCreation.html"
                }
            }
        },
        'MediaErrorPage': {
            url: "/ErrorPage",
            params: { appType: "Media" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Common/User/ErrorPage.html"
                }
            }
        },
        'CallErrorPage': {
            url: "/ErrorPage",
            params: { appType: "Call" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Common/User/ErrorPage.html"
                }
            }
        },
        'ExecErrorPage': {
            url: "/ErrorPage",
            params: { appType: "Exec" },
            views: {
                'container@': {
                    templateUrl: base_url + "/Scripts/Views/Common/User/ErrorPage.html"
                }
            }
        }
    }

    $stateProvider.state('Media', paths.Media);
    $stateProvider.state('MediaLogin', paths.MediaLogin);
    $stateProvider.state('MediaResetPassword', paths.MediaResetPassword);
    $stateProvider.state('MediaSetPassword', paths.MediaSetPassword);
    $stateProvider.state('Media.MediaDashboard', paths.MediaDashboard);
    $stateProvider.state('Media.MediaForm', paths.MediaForm);
    $stateProvider.state('Media.MediaReports', paths.MediaReports);
    $stateProvider.state('Media.MediaWeeklyReport', paths.MediaWeeklyReport);
    $stateProvider.state('Media.MediaMonitoringReport', paths.MediaMonitoringReport);
    $stateProvider.state('Media.MediaProfileSettings', paths.MediaProfileSettings);
    $stateProvider.state('Media.MediaChangePassword', paths.MediaChangePassword);
    $stateProvider.state('Media.MediaEmailSettings', paths.MediaEmailSettings);
    $stateProvider.state('Media.MediaUserCreation', paths.MediaUserCreation);
    $stateProvider.state('Media.MediaChannels', paths.MediaChannels);
    $stateProvider.state('Media.MediaCategories', paths.MediaCategories);
    $stateProvider.state('Media.MediaErrorPage', paths.MediaErrorPage);
    //$stateProvider.state('KECRM', paths.KECRM);
    //$stateProvider.state('Call', paths.Call);
    //$stateProvider.state('Exec', paths.Exec);
    //$stateProvider.state('CallLogin', paths.CallLogin);
    //$stateProvider.state('ExecLogin', paths.ExecLogin);
    //$stateProvider.state('Call.CallDashboard', paths.CallDashboard);
    //$stateProvider.state('Call.CallReports', paths.CallReports);
    //$stateProvider.state('Call.CallEmailSettings', paths.CallEmailSettings);
    //$stateProvider.state('Call.CallUserCreation', paths.CallUserCreation);
    //$stateProvider.state('Exec.ExecDashboard', paths.ExecDashboard);
    //$stateProvider.state('Exec.ExecEmailSettings', paths.ExecEmailSettings);
    //$stateProvider.state('Exec.ExecUserCreation', paths.ExecUserCreation);
    //$stateProvider.state('Call.CallErrorPage', paths.CallErrorPage);
    //$stateProvider.state('Exec.ExecErrorPage', paths.ExecErrorPage);
});

// make back button handle closing the modal
CRMApp.run(['$rootScope', '$uibModalStack', '$location', '$uibModal', '$window', '$cookies', 'AuthService',
  function ($rootScope, $uibModalStack, $location, $uibModal, $window, $cookies, AuthService) {

      /*AuthService.VerifyCookies().then(function (l) {
          if (l.data == false) {
              $window.location.href = "#/KECRM";
          }
      });*/
      /*if ($rootScope.currentUser == undefined) {
          $window.location.href = "#/Login";
      }*/
    
      $rootScope.$on('$stateChangeStart', function () {
          var top = $uibModalStack.getTop();
          if (top) {
              $uibModalStack.dismiss(top.key);
          }
          //$rootScope.previousPage = location.pathname;
      });
      $rootScope.$on('$locationChangeSuccess', function (e, newLocation, oldLocation) {
          var userObject = $cookies.getObject("userSession");
          var newLocationArr = newLocation.split('#')[1].split('/');

          if (newLocationArr.length == 2) {
              if (newLocationArr[1].indexOf("Media") !== -1)
                  $location.path("/Media/Login");
              /*else if (newLocationArr[1].indexOf("CallCenter") !== -1)
                  $location.path("/CallCenter/Login");
              else if (newLocationArr[1].indexOf("Executive") !== -1)
                  $location.path("/Executive/Login");*/
          }
          else {
              $rootScope.MediaAdmin = false;
              $rootScope.MediaPrint = false;
              $rootScope.MediaRadio = false;
              $rootScope.MediaTV = false;
              if (userObject == null || userObject == undefined || userObject.UserId == undefined || userObject.UserId == "" || userObject.UserId == 0) {
                  if (newLocationArr[2].indexOf("SetPassword") == -1 && newLocationArr[2].indexOf("ResetPassword") == -1 && newLocationArr[2].indexOf("Login") == -1)
                      $location.path("/Media");
              }
              else {
                  $rootScope.UserObject = userObject;
                  $rootScope.previousPage = oldLocation.split('#')[1];

                  if (userObject.UserRoles.indexOf("Media-Admin") !== -1)
                      $rootScope.MediaAdmin = true;
                  if (userObject.UserRoles.indexOf("Media-Print") !== -1)
                      $rootScope.MediaPrint = true;
                  if (userObject.UserRoles.indexOf("Media-Radio") !== -1)
                      $rootScope.MediaRadio = true;
                  if (userObject.UserRoles.indexOf("Media-TV") !== -1)
                      $rootScope.MediaTV = true;

                  if (newLocationArr[2].indexOf("Login") !== -1) {
                      if (newLocationArr[1].indexOf("Media") !== -1 && userObject.AppType == "Media") {
                          var MediaType = "";
                          if ($rootScope.MediaAdmin || $rootScope.MediaTV)
                              MediaType = "TV";
                          if ($rootScope.MediaPrint)
                              MediaType = "Print";
                          if ($rootScope.MediaRadio)
                              MediaType = "Radio";

                          $location.path("/Media/AddMediaNews").search("Media", MediaType);
                      }
                      //else if (newLocationArr[1].indexOf("CallCenter") !== -1 && userObject.AppType == "Call")
                      //    $location.path("/CallCenter/Dashboard");
                      //else if (newLocationArr[1].indexOf("Executive") !== -1 && userObject.AppType == "Exec")
                      //    $location.path("/Executive/Dashboard");
                  }
                  else if (userObject.AppType == "Media") {
                      $("title").html("KE - Communications | " + newLocationArr[2]);
                      if (
                          (
                          newLocationArr[1].indexOf("Media") !== -1 &&
                          (
                              newLocationArr[2].indexOf("Dashboard") !== -1 ||
                              newLocationArr[2].indexOf("Reports") !== -1 ||
                              newLocationArr[2].indexOf("ExecutiveReport") !== -1 ||
                              newLocationArr[2].indexOf("MediaMonitoringReport") !== -1 ||
                              newLocationArr[2].indexOf("AddMediaNews") !== -1 ||
                              newLocationArr[2].indexOf("ProfileSettings") !== -1 ||
                              newLocationArr[2].indexOf("ChangePassword") !== -1
                          ) &&
                          userObject.UserRoles.length > 0) ||
                          (
                              newLocationArr[1].indexOf("Media") !== -1 &&
                              (
                                  newLocationArr[2].indexOf("EmailSettings") !== -1 ||
                                  newLocationArr[2].indexOf("UserCreation") !== -1 ||
                                  newLocationArr[2].indexOf("Channels") !== -1 ||
                                  newLocationArr[2].indexOf("Categories") !== -1
                              ) &&
                              $rootScope.MediaAdmin
                          )
                      ) {

                      }
                      else {
                          $location.path("/Media/ErrorPage");
                      }
                  }
                  /*else if (userObject.AppType == "Call") {
                      $("title").html("KE CallCenter CRM | " + newLocationArr[1]);
                      if (
                          (
                          newLocationArr[1].indexOf("CallCenter") !== -1 &&
                          (
                              newLocationArr[2].indexOf("Dashboard") !== -1 ||
                              newLocationArr[2].indexOf("Reports") !== -1
                          ) &&
                          userObject.UserRoles.length > 0) ||
                          (
                              newLocationArr[1].indexOf("CallCenter") !== -1 &&
                              (
                                  newLocationArr[2].indexOf("EmailSettings") !== -1 ||
                                  newLocationArr[2].indexOf("UserCreation") !== -1
                              ) &&
                              $rootScope.CallAdmin
                          )
                      ) {

                      }
                      else {
                          $location.path("/CallCenter/ErrorPage");
                      }
                  }
                  else if (userObject.AppType == "Exec") {
                      $("title").html("KE Executive CRM | " + newLocationArr[1]);
                      if (
                          (
                          newLocationArr[1].indexOf("Executive") !== -1 &&
                          (
                              newLocationArr[2].indexOf("Dashboard") !== -1
                          ) &&
                          userObject.UserRoles.length > 0) ||
                          (
                              newLocationArr[1].indexOf("Executive") !== -1 &&
                              (
                                  newLocationArr[2].indexOf("EmailSettings") !== -1 ||
                                  newLocationArr[2].indexOf("UserCreation") !== -1
                              ) &&
                              $rootScope.ExecAdmin
                          )
                      ) {

                      }
                      else {
                          $location.path("/Executive/ErrorPage");
                      }
                  }*/
                  else if (newLocationArr[1].indexOf("Media") !== -1)
                      $location.path("/Media/Login");
                  /*else if (newLocationArr[1].indexOf("CallCenter") !== -1)
                      $location.path("/CallCenter/Login");
                  else if (newLocationArr[1].indexOf("Executive") !== -1)
                      $location.path("/Executive/Login");*/
                  else
                      $location.path("/Media");
              }
          }

      });
    
      // error = SPE
      if ($location.search().error != undefined) {
          var error = $location.search().error;
          if (error == 'SPE')
              var items = { ErrorTitle: "Error Adding Profile", ErrorMessage: "The profile you are adding is already linked with some other user." };
          else if (error == 'TRP') {
              var profile = $location.search().profile;
              var packageName = $location.search().package;
              var profileLimit = $location.search().limit;
              var profileType = $location.search().type;
              var items = { ErrorTitle: "Error Adding Profile", ErrorMessage: packageName + " account allows only " + profileLimit + " " + profileType + " Profile for each platform. You have already connected a profile " + profile };
          }
              
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: '/Scripts/Views/Media/Shared/_ErrorPopUp.html',
              controller: '_ErrorPopUpController',

              resolve: {
                  items: function () {
                      return items;
                  }
              }
          });

          modalInstance.result.then(function (selectedItem) {
              //alert($window.location.hash.split('?')[0])
              $window.location.href = $window.location.hash.split('?')[0];
          }, function () {
              $log.info('Modal dismissed at: ' + new Date());
          });
      }
  }

]);

CRMApp.filter("trustUrl", ['$sce', function ($sce) {
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);