using Microsoft.Practices.Unity;
using SocialCRM.Web.Repositories;
using SocialCRM.Web.Repositories.Core;
using SocialCRM.Web.Repositories.Media;
using System.Web.Http;
using Unity.WebApi;
using WebAPIDemo.Controllers;

namespace SocialCRM.Web
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
			var container = new UnityContainer();            
            // register all your components with the container here
            //container.RegisterType<ICompanyRepository, CompanyRepository>();
            container.RegisterType<AccountController>(new InjectionConstructor(new UserRepository()));//Only for Account Controller.
            container.RegisterType<IMediaRepository, MediaRepository>();
            container.RegisterType<IEmailRepository, EmailRepository>();
            container.RegisterType<IReportRepository, ReportRepository>();
            container.RegisterType<IUserRepository, UserRepository>();
            GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);
        }
    }
}