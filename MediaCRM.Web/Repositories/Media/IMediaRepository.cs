using SocialCRM.Web.Models.Media.Channel;
using SocialCRM.Web.Models.Media.Form;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace SocialCRM.Web.Repositories.Media
{
    public interface IMediaRepository
    {
        Task<MediaListModel> GeMediaList(int userId, int mediaTypeId, string newsTypeIds, string channelIds, string categoryIds, string sentimentIds, string relevanceIds, string createdBy, string script, bool getOptions, DateTime? fromDate, DateTime? toDate, int pageNumber);
        Task<bool> SaveMediaForm(MediaFormSaveModel model, int userId, string applicationPath);
        Task<bool> DeleteMediaForm(int id);
        Task<MediaFormModel> GetMediaById(int id, string appPath);
        MediaListModel GeMediaListAll(int userId, int mediaTypeIds, string newsTypeIds, string channelId, string categoryIds, string sentimentIds, string relevanceIds, string createdBy, string script, DateTime? fromDate, DateTime? toDate);
        Task<MediaChannelListModel> GeMediaChannelList(int pageNumber);
        Task<bool> SaveMediaChannel(MediaChannelSaveModel model);
        Task<bool> DeleteMediaChannel(int id);
        Task<bool> UploadMediaChannelFile(ChannelFileModel model, string applicationPath);
        MediaRelevanceWiseListModel GeMediaListByIds(string ids, string appPath);
        Task<MediaArchivePDFModel> EmailRecords(string ids, HttpRequest request, bool isEmail, int userId);
        Task<string> GetAttachmentAsBase64String(int mediaNewsId, string appPath);
        Task<List<MediaChannelModel>> GetCategoriesList(int pageNumber);
        Task<bool> SaveCategory(MediaChannelSaveModel model);
        Task<bool> DeleteCategory(int id);
        Task<MediaListModel> GetMediaTickerList(int userId, DateTime? fromDate, DateTime? toDate , string mediaTypeIds, HttpRequest request);
        Task<MediaListModel> GetMediaPrintList(int userId, DateTime? fromDate, DateTime? toDate, string mediaTypeIds, HttpRequest request);
        Task<bool> SaveReportFilter(EDReportFilterModel model);
    }
}
