using SocialCRM.Web.Models.Media.Form;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialCRM.Web.Models.Media.Channel
{
    public class MediaChannelModel
    {
        public int Id { get; set; }
        public string ChannelName { get; set; }
        public int MediaTypeId { get; set; }
        public string MediaTypeName { get; set; }
    }
    public class MediaChannelSaveModel
    {
        public int Id { get; set; }
        public string ChannelName { get; set; }
        public int MediaTypeId { get; set; }
    }
    public class MediaChannelListModel
    {
        public List<MediaChannelModel> ChannelList { get; set; }
        public List<SelectItemList> MediaTypeList { get; set; }
    }

    public class ChannelFileModel
    {
        public string Base64String { get; set; }
        public string ContentType { get; set; }
        public string FileName { get; set; }
    }

    public class MediaUserModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string UserRoles { get; set; }
    }
}