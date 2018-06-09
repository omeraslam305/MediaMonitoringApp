using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using SocialCRM.Web.Models;
using SocialCRM.Web.Providers;
using SocialCRM.Web.Results;
using SocialCRM.Web;
using SocialCRM.Web.Models.User;
using CRM.Common;
using SocialCRM.Web.Repositories.Core;
using System.Web.Http.Description;
using System.Net;
using CRM.Common.Extensions;
using System.IO;
using System.Configuration;
using SocialCRM.Web.Models.Media.Channel;
using System.Web.Security;
using CRM.Common.Enum;

namespace WebAPIDemo.Controllers
{
    [Authorize]
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        private const string LocalLoginProvider = "Local";
        private ApplicationUserManager _userManager;
        IUserRepository userRepository;
        string baseUrl = HttpContext.Current.Request.Url.Scheme + "://" + HttpContext.Current.Request.Url.Authority;// ConfigurationManager.AppSettings["WebUrl"];

        public AccountController(IUserRepository userRepo)
        {
            userRepository = userRepo;
        }

        public AccountController()
        {
        }

        public AccountController(ApplicationUserManager userManager,
            ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            UserManager = userManager;
            AccessTokenFormat = accessTokenFormat;
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }

        [Route("CreateNewUser")]
        [ResponseType(typeof(RequestStatus))]
        public async Task<IHttpActionResult> CreateNewUser(MediaUserModel model)
        {
            var response = new RequestStatus();
            var passwd = CodeGenerator.ConfirmationString(6);
            var user = new ApplicationUser { ConfirmationCode = string.Empty, EmailConfirmed = true, UserName = model.Email, Email = model.Email, Name = model.Name };//, ProfileImage = model.ImageUrl };
            IdentityResult result = await UserManager.CreateAsync(user, passwd);
            string[] roles = model.UserRoles.Split(',');
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }
            else
            {
                foreach (string role in roles)
                {
                    await UserManager.AddToRoleAsync(user.Id, role);
                }
                var message = new IdentityMessage
                {
                    Destination = model.Email,
                    Body = string.Format("Dear <b>{0}</b>,<br/><br/>Your account has been created in KE Automated Communications System tool.<br/><br/>Use the following information to log in the system: <br/><br/>Website url: <b>{1}</b><br/>UserName: <b>{2}</b><br/>Password: <b>{3}</b><br/><br/>Once logged in the system, you are allowed to change your password.<br/><br/> Sincerely,<br/>Automated Communications Team", user.Name, baseUrl, model.Email, passwd),
                    Subject = "KE Automated Communications System- Invitation to Access"
                };
                await UserManager.EmailService.SendAsync(message);
                response.StatusCode = "0"; response.Message = "Success";
                return Ok(response);
            }
        }

        [Route("UpdateUser")]
        [ResponseType(typeof(RequestStatus))]
        public async Task<IHttpActionResult> UpdateUser(MediaUserModel model)
        {
            var response = new RequestStatus();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await UserManager.FindByEmailAsync(model.Email);
            string[] roles = model.UserRoles.Split(',');
            if (user == null)
            {
                response.StatusCode = "1";
                response.Message = "User not Found.";
                return BadRequest("Invalid User");
            }
            else
            {
                //User is Authenticated!
                user.Name = model.Name;
                user.Roles.Clear();

                foreach (string role in roles)
                {
                    await UserManager.AddToRoleAsync(user.Id, role);
                }
                await UserManager.UpdateAsync(user);

                response.StatusCode = "0";
                response.Message = "Success";
                return Ok(response);
            }
        }

        [HttpPost]
        [Route("DeleteUser")]
        [ResponseType(typeof(RequestStatus))]
        public async Task<IHttpActionResult> DeleteUser(MediaUserModel model)
        {
            var response = new RequestStatus();
            ApplicationDbContext context = new ApplicationDbContext();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await UserManager.FindByEmailAsync(model.Email);
            var resp = await userRepository.DeleteUserReference(user.Id);
            if (resp)
            {
                await UserManager.DeleteAsync(user);
            }
            response.StatusCode = "0";
            response.Message = "Success";
            return Ok(response);
        }

        [HttpGet]
        [Route("ChangeUserStatus/{email}/{status}")]
        [ResponseType(typeof(RequestStatus))]
        public async Task<IHttpActionResult> ChangeUserStatus(string email, bool status)
        {
            var response = new RequestStatus();
            ApplicationDbContext context = new ApplicationDbContext();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await UserManager.FindByEmailAsync(email);
            user.EmailConfirmed = status;
            await UserManager.UpdateAsync(user);
            response.StatusCode = "0";
            response.Message = "Success";
            return Ok(response);
        }

        [AllowAnonymous]
        [Route("Register")]
        [ResponseType(typeof(RequestStatus))]
        public async Task<IHttpActionResult> Register(RegisterViewModel model)
        {
            var response = new RequestStatus();
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                /*if(await userRepository.GetUserByEmailId(model.Email, model.CompanyId) != null)
                {
                    response.StatusCode = "1"; response.Message = "Fail";
                    return InternalServerError();
                }
                else
                {*/
                    var httpProfileImage = HttpContext.Current.Request.Files["ProfileImage"];
                    model.ImageUrl = string.Empty;
                    if (httpProfileImage != null)
                    {
                        // Get the complete file path
                        var serverPath = string.Concat(ConfigurationManager.AppSettings["ProfilePath"] + model.UserId);
                        var filePath = HttpContext.Current.Server.MapPath(serverPath);
                        if (!Directory.Exists(filePath))
                            Directory.CreateDirectory(filePath);
                        // Save the uploaded file to server
                        httpProfileImage.SaveAs(filePath);
                        model.ImageUrl = string.Format("{0}/{1}.jpeg", serverPath, model.UserId);
                    }
                    //model.ConfirmationCode = CodeGenerator.ConfirmationString(10);
                    HttpContext.Current.Session["SignUpModel"] = model;

                    response.StatusCode = "0"; response.Message = "Success";

                    return Ok(response);
                //}
                
            }
            catch(Exception ex)
            {
                response.StatusCode = "1"; response.Message = "Fail";
                return InternalServerError();
            }
        }
        
        // POST api/Account/Logout
        [Route("Logout")]
        public IHttpActionResult Logout()
        {
            Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            return Ok();
        }

        [HttpPost]
        [Route("ForgotPassword")]
        [AllowAnonymous]
        [ResponseType(typeof(RequestStatus))]
        public async Task<IHttpActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            var response = new RequestStatus();
            if (!ModelState.IsValid)
            {
               return BadRequest(ModelState);
            }

            var user = await UserManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                response.StatusCode = "1";
                response.Message = "User not Found.";
                return BadRequest("Invalid User");
            }
            else
            {
                //User is Authenticated!
                var securityCode = CodeGenerator.ConfirmationString(10);
                user.ConfirmationCode = securityCode;
                await UserManager.UpdateAsync(user);
                response.StatusCode = "0";
                response.Message = "Success";
                var message = new IdentityMessage
                {
                    Destination = model.Email,
                    Body = string.Format("Dear <b>{0}</b>,<br/><br/>Please enter the below code to reset your KE Automated Communications System account password <br/><br/>Code: <b>{1}</b><br/><br/> Sincerely,<br/>Automated Communications Team", user.Name, user.ConfirmationCode), //string.Format("<a href=\"" + baseUrl + "/#/SetPassword\" target=\"_blank\">Reset Password link</a>"), 
                    Subject = "KE Automated Communications System- Password Reset Code"
                };
                await UserManager.EmailService.SendAsync(message);
                return Ok(response);
            }
        }
        [HttpPost]
        [Route("ResetPassword")]
        [AllowAnonymous]
        [ResponseType(typeof(RequestStatus))]
        public async Task<IHttpActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            var response = new RequestStatus();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await UserManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                response.StatusCode = "1";
                response.Message = "User not Found.";
                return BadRequest("Invalid User");
            }
            else if (string.Compare(user.ConfirmationCode, model.Code) != 0)
            {
                response.StatusCode = "1";
                response.Message = "Invalid code.";
                return BadRequest("Invalid code");
            }
            else
            {
                //User is Authenticated!
                user.EmailConfirmed = true;
                user.ConfirmationCode = string.Empty;
                UserManager.RemovePassword(user.Id);
                UserManager.AddPassword(user.Id, model.Password);
                await UserManager.UpdateAsync(user);
                response.StatusCode = "0";
                response.Message = "Success";
                var message = new IdentityMessage
                {
                    Destination = model.Email,
                    Body = string.Format("Dear <b>{0}</b>,<br/><br/>Your KE Automated Communications System account {1} password has been reset successfully.<br/><br/>{2}<br/><br/>Sincerely,<br/>Automated Communications Team", user.Name, user.Email, string.Format("<a href=\"" + baseUrl + "/#/Login\" target=\"_blank\">Login to 360 Insight CRM</a>")),
                    Subject = "KE Automated Communications System- Account Password Changed"
                };
                await UserManager.EmailService.SendAsync(message);
                return Ok(response);
            }
        }

        [HttpGet]
        [Route("SignupCode/{code}")]
        [AllowAnonymous]
        [ResponseType(typeof(RegisterViewModel))]
        public async Task<IHttpActionResult> SignupCode(string code)
        {
            /*var user = await userRepository.GetUserByConfirmationCodeAsync(code);
            user.ImageUrl =string.IsNullOrEmpty(user.ImageUrl)?"":HttpContext.Current.Request.GetFullUrl(user.ImageUrl);*/
            return Ok();
        }
        [HttpGet]
        [Route("UserProfile/{email}/{appType}")]
        [AllowAnonymous]
        [ResponseType(typeof(RegisterViewModel))]
        public async Task<IHttpActionResult> UserProfile(string email, string appType)
        {
            var a = HttpContext.Current.Request.Cookies[".AspNet.MediaCookies"].Value;
            var user = await userRepository.GetUserByEmailId(email, appType);
            user.ImageUrl = string.IsNullOrEmpty(user.ImageUrl) ? "" : HttpContext.Current.Request.GetFullUrl(user.ImageUrl);
            return Ok(user);
        }

        [HttpGet]
        [Route("VerifyCookies")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> VerifyCookies()
        {
            var userId = User.Identity.GetUserId<int>();
            if(userId == 0)
            {
                Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
                return Ok(false);
            }
            else
            {
                return Ok(true);
            }
        }
        // GET api/Account/UserInfo
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("UserInfo")]
        public UserInfoViewModel GetUserInfo()
        {
            ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

            return new UserInfoViewModel
            {
                Email = User.Identity.GetUserName(),
                HasRegistered = externalLogin == null,
                LoginProvider = externalLogin != null ? externalLogin.LoginProvider : null
            };
        }
  
        // GET api/Account/ManageInfo?returnUrl=%2F&generateState=true
        //[Route("ManageInfo")]
        //public async Task<ManageInfoViewModel> GetManageInfo(string returnUrl, bool generateState = false)
        //{
        //    var userId = User.Identity.GetUserId();
        //    //IdentityUser user = await UserManager.FindByIdAsync(userId);
        //    var user = UserManager.FindById(userId);// FindByIdAsync(userId);
        //    if (user == null)
        //    {
        //        return null;
        //    }

        //    List<UserLoginInfoViewModel> logins = new List<UserLoginInfoViewModel>();

        //    foreach (IdentityUserLogin linkedAccount in user.Logins)
        //    {
        //        logins.Add(new UserLoginInfoViewModel
        //        {
        //            LoginProvider = linkedAccount.LoginProvider,
        //            ProviderKey = linkedAccount.ProviderKey
        //        });
        //    }

        //    if (user.PasswordHash != null)
        //    {
        //        logins.Add(new UserLoginInfoViewModel
        //        {
        //            LoginProvider = LocalLoginProvider,
        //            ProviderKey = user.UserName,
        //        });
        //    }

        //    return new ManageInfoViewModel
        //    {
        //        LocalLoginProvider = LocalLoginProvider,
        //        Email = user.UserName,
        //        Logins = logins,
        //        ExternalLoginProviders = GetExternalLogins(returnUrl, generateState)
        //    };
        //}

        // POST api/Account/ChangePassword
        [Route("ChangePassword")]
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userId=User.Identity.GetUserId();
            IdentityResult result = await UserManager.ChangePasswordAsync(Convert.ToInt32(userId), model.OldPassword,
                model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok(result);
        }

        // POST api/Account/SetPassword
        [Route("SetPassword")]
        public async Task<IHttpActionResult> SetPassword(SetPasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userId = User.Identity.GetUserId();

            IdentityResult result = await UserManager.AddPasswordAsync(Convert.ToInt32(userId), model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // POST api/Account/AddExternalLogin
        [Route("AddExternalLogin")]
        public async Task<IHttpActionResult> AddExternalLogin(AddExternalLoginBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);

            AuthenticationTicket ticket = AccessTokenFormat.Unprotect(model.ExternalAccessToken);

            if (ticket == null || ticket.Identity == null || (ticket.Properties != null
                && ticket.Properties.ExpiresUtc.HasValue
                && ticket.Properties.ExpiresUtc.Value < DateTimeOffset.UtcNow))
            {
                return BadRequest("External login failure.");
            }

            ExternalLoginData externalData = ExternalLoginData.FromIdentity(ticket.Identity);

            if (externalData == null)
            {
                return BadRequest("The external login is already associated with an account.");
            }
            var userId = User.Identity.GetUserId();

            IdentityResult result = await UserManager.AddLoginAsync(Convert.ToInt32(userId),
                new UserLoginInfo(externalData.LoginProvider, externalData.ProviderKey));

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // POST api/Account/RemoveLogin
        [Route("RemoveLogin")]
        public async Task<IHttpActionResult> RemoveLogin(RemoveLoginBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result;
            var userId = User.Identity.GetUserId();                
            if (model.LoginProvider == LocalLoginProvider)
            {
               result = await UserManager.RemovePasswordAsync(Convert.ToInt32(userId));
            }
            else
            {
                result = await UserManager.RemoveLoginAsync(Convert.ToInt32(userId),
                    new UserLoginInfo(model.LoginProvider, model.ProviderKey));
            }

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // GET api/Account/ExternalLogin
        [OverrideAuthentication]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalCookie)]
        [AllowAnonymous]
        [Route("ExternalLogin", Name = "ExternalLogin")]
        public async Task<IHttpActionResult> GetExternalLogin(string provider, string error = null)
        {
            if (error != null)
            {
                return Redirect(Url.Content("~/") + "#error=" + Uri.EscapeDataString(error));
            }

            if (!User.Identity.IsAuthenticated)
            {
                return new ChallengeResult(provider, this);
            }

            ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

            if (externalLogin == null)
            {
                return InternalServerError();
            }

            if (externalLogin.LoginProvider != provider)
            {
                Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
                return new ChallengeResult(provider, this);
            }

            ApplicationUser user = await UserManager.FindAsync(new UserLoginInfo(externalLogin.LoginProvider,
                externalLogin.ProviderKey));

            bool hasRegistered = user != null;

            if (hasRegistered)
            {
                Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);

                ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync(UserManager,
                   OAuthDefaults.AuthenticationType);
                ClaimsIdentity cookieIdentity = await user.GenerateUserIdentityAsync(UserManager,
                    CookieAuthenticationDefaults.AuthenticationType);

                AuthenticationProperties properties = ApplicationOAuthProvider.CreateProperties(user.UserName);
                Authentication.SignIn(properties, oAuthIdentity, cookieIdentity);
            }
            else
            {
                IEnumerable<Claim> claims = externalLogin.GetClaims();
                ClaimsIdentity identity = new ClaimsIdentity(claims, OAuthDefaults.AuthenticationType);
                Authentication.SignIn(identity);
            }

            return Ok();
        }

        // GET api/Account/ExternalLogins?returnUrl=%2F&generateState=true
        [AllowAnonymous]
        [Route("ExternalLogins")]
        public IEnumerable<ExternalLoginViewModel> GetExternalLogins(string returnUrl, bool generateState = false)
        {
            IEnumerable<AuthenticationDescription> descriptions = Authentication.GetExternalAuthenticationTypes();
            List<ExternalLoginViewModel> logins = new List<ExternalLoginViewModel>();

            string state;

            if (generateState)
            {
                const int strengthInBits = 256;
                state = RandomOAuthStateGenerator.Generate(strengthInBits);
            }
            else
            {
                state = null;
            }

            foreach (AuthenticationDescription description in descriptions)
            {
                ExternalLoginViewModel login = new ExternalLoginViewModel
                {
                    Name = description.Caption,
                    Url = Url.Route("ExternalLogin", new
                    {
                        provider = description.AuthenticationType,
                        response_type = "token",
                        client_id = Startup.PublicClientId,
                        redirect_uri = new Uri(Request.RequestUri, returnUrl).AbsoluteUri,
                        state = state
                    }),
                    State = state
                };
                logins.Add(login);
            }

            return logins;
        }

       
        // POST api/Account/RegisterExternal
        [OverrideAuthentication]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("RegisterExternal")]
        public async Task<IHttpActionResult> RegisterExternal(RegisterExternalBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var info = await Authentication.GetExternalLoginInfoAsync();
            if (info == null)
            {
                return InternalServerError();
            }

            var user = new ApplicationUser() { UserName = model.Email, Email = model.Email };

            IdentityResult result = await UserManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            result = await UserManager.AddLoginAsync(user.Id, info.Login);
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }
            return Ok();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
                userRepository = null;
            }

            base.Dispose(disposing);
        }

        #region Helpers

        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        private class ExternalLoginData
        {
            public string LoginProvider { get; set; }
            public string ProviderKey { get; set; }
            public string UserName { get; set; }

            public IList<Claim> GetClaims()
            {
                IList<Claim> claims = new List<Claim>();
                claims.Add(new Claim(ClaimTypes.NameIdentifier, ProviderKey, null, LoginProvider));

                if (UserName != null)
                {
                    claims.Add(new Claim(ClaimTypes.Name, UserName, null, LoginProvider));
                }

                return claims;
            }

            public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
            {
                if (identity == null)
                {
                    return null;
                }

                Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

                if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer)
                    || String.IsNullOrEmpty(providerKeyClaim.Value))
                {
                    return null;
                }

                if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
                {
                    return null;
                }

                return new ExternalLoginData
                {
                    LoginProvider = providerKeyClaim.Issuer,
                    ProviderKey = providerKeyClaim.Value,
                    UserName = identity.FindFirstValue(ClaimTypes.Name)
                };
            }
        }

        private static class RandomOAuthStateGenerator
        {
            private static RandomNumberGenerator _random = new RNGCryptoServiceProvider();

            public static string Generate(int strengthInBits)
            {
                const int bitsPerByte = 8;

                if (strengthInBits % bitsPerByte != 0)
                {
                    throw new ArgumentException("strengthInBits must be evenly divisible by 8.", "strengthInBits");
                }

                int strengthInBytes = strengthInBits / bitsPerByte;

                byte[] data = new byte[strengthInBytes];
                _random.GetBytes(data);
                return HttpServerUtility.UrlTokenEncode(data);
            }
        }

        #endregion
    }
}
