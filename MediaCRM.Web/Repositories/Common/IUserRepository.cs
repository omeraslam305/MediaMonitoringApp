using SocialCRM.Web.Models.Common.User;
using SocialCRM.Web.Models.Media.Channel;
using SocialCRM.Web.Models.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialCRM.Web.Repositories.Core
{
    public interface IUserRepository
    {
        Task<UserListModel> GeMediaUserList(int userId, string appType, int pageNumber);
        Task<RegisterViewModel> GetUserByEmailId(string emailId, string appType);
        Task<bool> SaveUser(UserSaveModel model, int userId);
        Task<bool> DeleteUserReference(int id);
        Task<bool> UpdatePersonalProfile(PersonalProfileModel model);
    }
}
