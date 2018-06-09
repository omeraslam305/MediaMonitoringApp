using SocialCRM.Web.Models.Media.Form;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialCRM.Web.Models.Common.User
{
    public class RightsModel
    {
        public string RightName { get; set; }
        public string CssClass { get; set; }
    }
    public class UserModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public bool IsEnabled { get; set; }
        public List<int> RightsArray { get; set; }
        public string RightName { get; set; }
        public string TvRightCss { get; set; }
        public string RadioRightCss { get; set; }
        public string PrintRightCss { get; set; }
        public string ProfileUrl { get; set; }
    }
    public class UserListModel
    {
        public int TotalRecords { get; set; }
        public List<UserModel> UserList { get; set; }
        public List<SelectItemList> MediaTypesList { get; set; }        
    }

    public class UserSaveModel
    {
        public decimal? Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int UserType { get; set; }
        public string Rights { get; set; }

    }

    public class PersonalProfileModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string ProfileUrl { get; set; }
        public string SignHtml { get; set; }
    }
}