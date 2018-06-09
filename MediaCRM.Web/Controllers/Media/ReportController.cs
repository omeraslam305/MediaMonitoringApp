using Microsoft.AspNet.Identity;
using SocialCRM.Web.Models.Media.Form;
using SocialCRM.Web.Models.Media.Report;
using SocialCRM.Web.Repositories.Media;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace SocialCRM.Web.Controllers.Media
{
    [System.Web.Http.RoutePrefix("api/MediaReport")]
    public class ReportController : ApiController
    {
        IReportRepository repository;
        public ReportController (IReportRepository reportRepository)
        {
            repository = reportRepository;
        }

        [HttpGet]
        [Route("GetMediaReportFilters")]
        public async Task<IHttpActionResult> GetMediaReportFilters()
        {
            var userId = User.Identity.GetUserId<int>();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await repository.GetMediaReportFilters(userId);
            return Ok(taskResult);
        }

        [HttpPost]
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [Route("GetMediaReport/")]
        public async Task<IHttpActionResult> GetMediaReport(MediaNewsReportFilterSearchModel model)
        {
            var userId = 0;
            if (model.userId.HasValue)
                userId = model.userId.Value;
            else
                userId = User.Identity.GetUserId<int>();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            model.userId = userId;
            if (!model.isShift)
            {
                model.fromDate = model.fromDate.Date;
                model.toDate = model.toDate.Date.Add(new TimeSpan(23, 59, 59));
            }

            var taskResult = await repository.GetMediaReport(model);
            return Ok(taskResult);
        }

        [HttpPost]
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [Route("GetMediaReportDrillDown/")]
        public async Task<IHttpActionResult> GetMediaReportDrillDown(MediaNewsReportFilterSearchModel model)
        {
            var userId = 0;
            if (model.userId.HasValue)
                userId = model.userId.Value;
            else
                userId = User.Identity.GetUserId<int>();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            model.userId = userId;
            model.fromDate = model.fromDate.Date;
            model.toDate = model.toDate.Date.Add(new TimeSpan(23, 59, 59));

            var taskResult = await repository.GetMediaReportDrillDown(model);
            return Ok(taskResult);
        }

        [HttpPost]
        [Route("EmailPdfReport/")]
        public async Task<IHttpActionResult> EmailPdfReport(FileToEmail model)
        {
            var userId = User.Identity.GetUserId<int>();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var taskResult = await repository.EmailPdfReport(model.fileName, model.fileContent, model.contentType, HttpContext.Current.Request.PhysicalApplicationPath);
            return Ok(taskResult);
        }

        [HttpGet]
        [Route("GetMediaReportChannelList")]
        public async Task<IHttpActionResult> GetMediaReportChannelList()
        {
            var userId = User.Identity.GetUserId<int>();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await repository.GetMediaReportChannelList(userId);
            return Ok(taskResult);
        }

        [HttpPost]
        [Route("EmailMediaMonitoringReport/")]
        public async Task<IHttpActionResult> EmailMediaMonitoringReport(EmailMonitoringReportModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var taskEmail = await repository.EmailMediaMonitoringReport(model, HttpContext.Current);

            return Ok(taskEmail);
        }
    }
}
