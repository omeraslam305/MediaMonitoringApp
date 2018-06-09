using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialCRM.Web.Models.Media.Form
{
    public class MediaSearchModel
    {
        public int userId { get; set; }
        public int mediaTypeId { get; set; }
        public string mediaTypeIds { get; set; }
        public string newsTypeIds { get; set; }
        public string channelIds { get; set; }
        public string categoryIds { get; set; }
        public string sentimentIds { get; set; }
        public string relevanceIds { get; set; }
        public string createdBy { get; set; }
        public string script { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public bool getOptions { get; set; }
        public int pageNumber { get; set; }
    }
}