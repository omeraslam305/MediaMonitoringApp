using CRM.Entities;
using SocialCRM.Web.Models.Common.Email;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialCRM.Web.Repositories.Media
{
    public interface IEmailRepository
    {
        Task<EmailModel> GeEmailList(int appType, int pageNumber);
        Task<bool> SaveMediaEmail(MediaEmailSaveModel model);
        Task<bool> DeleteMediaEmail(int id);
    }
}
