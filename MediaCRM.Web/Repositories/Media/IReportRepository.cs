using SocialCRM.Web.Models.Media.Form;
using SocialCRM.Web.Models.Media.Report;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace SocialCRM.Web.Repositories.Media
{
    public interface IReportRepository
    {
        Task<ReportFilterModel> GetMediaReportFilters(int userId);
        Task<EDReportModel> GetMediaReportChannelList(int userId);
        Task<List<MediaCustomizedReportModel>> GetMediaReport(MediaNewsReportFilterSearchModel model);
        Task<List<MediaFormListModel>> GetMediaReportDrillDown(MediaNewsReportFilterSearchModel model);
        Task<string> EmailPdfReport(string fileName, string fileContent, string contentType, string applicationPath);
        Task<string> EmailMediaMonitoringReport(EmailMonitoringReportModel model, HttpContext current);
    }
}