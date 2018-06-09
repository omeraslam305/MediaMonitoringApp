using CRM.Entities;
using SocialCRM.Web.Models.Media.Form;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialCRM.Web.Models.Common.Email
{
    public class EmailModel
    {
        public List<MediaEmailModel> EmailList { get; set; }
        public List<SelectItemList> RightsList { get; set; }
    }
    public class MediaEmailModel
    {
        public int Id { get; set; }
        public string EmailId { get; set; }
        public List<int> RightsArray { get; set; }
        public string TvRightCss { get; set; }
        public string RadioRightCss { get; set; }
        public string PrintRightCss { get; set; }
        public string ConsolidatedRightCss { get; set; }
    }

    public class MediaEmailSaveModel
    {
        public int? Id { get; set; }
        public string EmailId { get; set; }
        public string Rights { get; set; }
    }

}