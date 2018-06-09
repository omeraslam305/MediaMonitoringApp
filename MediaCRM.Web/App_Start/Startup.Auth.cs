using System;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Google;
using Owin;
using SocialCRM.Web.Models.User;
using Microsoft.Owin.Security.OAuth;
using SocialCRM.Web.Providers;
using Microsoft.Owin.Security.Facebook;
using System.Security.Claims;
using Microsoft.Owin.Security.Twitter;
using Microsoft.Owin.Security;
using Owin.Security.Providers.LinkedIn;
using System.Configuration;
using Microsoft.AspNet.Identity.EntityFramework;
using CRM.Common.Enum;
using System.ComponentModel;
using CRM.Common.Extensions;

namespace SocialCRM.Web
{
    public partial class Startup
    {
        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }
        public static string PublicClientId { get; private set; }
        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            app.MapSignalR();
            // Configure the db context and user manager to use a single instance per request
            app.CreatePerOwinContext(ApplicationDbContext.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);

            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
            var opt = new CookieAuthenticationOptions();
            opt.CookieName = ".AspNet.MediaCookies";
            app.UseCookieAuthentication(opt);
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Configure the application for OAuth based flow
            PublicClientId = "self";
            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/Token"),
                Provider = new ApplicationOAuthProvider(PublicClientId),
                AuthorizeEndpointPath = new PathString("/api/Account/ExternalLogin"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(14),
                AllowInsecureHttp = true
            };

            // Enable the application to use bearer tokens to authenticate users
            app.UseOAuthBearerTokens(OAuthOptions);
        }
        
        private void CreateRolesandUsers()
        {
            ApplicationDbContext context = new ApplicationDbContext();

            //var UserManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            // var roleManager = new RoleManager<ApplicationRole>(new RoleStore<ApplicationRole>(context));
            var roleManager = new ApplicationRoleManager(new RoleStore<ApplicationRole, int, ApplicationUserRole>(context));
            var userManager = new ApplicationUserManager
                (
                new UserStore<ApplicationUser, ApplicationRole, int, ApplicationUserLogin, ApplicationUserRole, ApplicationUserClaim>(context)
                );
            userManager.EmailService = new EmailService();
            userManager.PasswordHasher = new ClearPassword();

            if (!roleManager.RoleExists(EnumExtensions.ToDescriptionString(UserRoles.MediaAdmin)))
            {
                foreach(int i in Enum.GetValues(typeof(UserRoles)))
                {
                    var description = EnumExtensions.ToDescriptionString((UserRoles)i);

                    var role = new ApplicationRole();
                    role.Name = description;
                    roleManager.Create(role);
                }


                // In Startup iam creating first Admin Role and creating a default Admin User 
                var UserName = ConfigurationManager.AppSettings["AdminUserName"];
                var Email = ConfigurationManager.AppSettings["AdminUserName"];
                var passwd = ConfigurationManager.AppSettings["AdminPassword"];
                var Name = ConfigurationManager.AppSettings["AdminName"];

                //Here we create a Admin super user who will maintain the website                  
                var user = new ApplicationUser { ConfirmationCode = string.Empty, EmailConfirmed = true, UserName = UserName, Email = Email, Name = Name };//, ProfileImage = model.ImageUrl };
                IdentityResult result = userManager.Create(user, passwd);
                if (result.Succeeded)
                {
                    userManager.AddToRole(user.Id, EnumExtensions.ToDescriptionString(UserRoles.MediaAdmin));
                    var message = new IdentityMessage
                    {
                        Destination = Email,
                        Body = string.Format("Dear <b>{0}</b>,<br/><br/>You are assigned as Admin in Automated Communications System tool.<br/><br/>Use the following information to log in the system: <br/><br/>Website url: <b>{1}</b><br/>UserName: <b>{2}</b><br/>Password: <b>{3}</b><br/><br/>Once logged in the system, you are allowed to change your password.<br/><br/> Sincerely,<br/>KE Automated Communications Team", user.Name, baseUrl, UserName, passwd),
                        Subject = "Automated Communications System- Invitation to Access"
                    };
                    userManager.EmailService.SendAsync(message);
                }
            }
        }
    }
}