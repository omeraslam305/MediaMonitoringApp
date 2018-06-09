using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Owin;
using SocialCRM.Web.Models.User;
using System.Configuration;
using System.Web;

[assembly: OwinStartupAttribute(typeof(SocialCRM.Web.Startup))]
namespace SocialCRM.Web
{
    public partial class Startup
    {
        string baseUrl = HttpContext.Current.Request.Url.Scheme + "://" + HttpContext.Current.Request.Url.Authority;// ConfigurationManager.AppSettings["WebUrl"];
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            CreateRolesandUsers();
        }
    }
}
