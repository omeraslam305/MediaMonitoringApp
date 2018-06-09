using SocialCRM.Web.Repositories.Media;
using SocialCRM.Web.Repositories.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using System.Globalization;
using SocialCRM.Web.Models.Media.Form;
using System.Web;
using System.IO;
using System.Net.Http.Headers;
using System.Data;
using CRM.Common;
using SocialCRM.Web.Models.Media.Channel;
using SocialCRM.Web.Models.Media.Report;

namespace SocialCRM.Web.Controllers.Media
{
    [System.Web.Http.RoutePrefix("api/Media")]
    public class MediaController : ApiController
    {
        IMediaRepository repository;

        public MediaController(IMediaRepository mediaRepo)
        {
            repository = mediaRepo;
        }

        [HttpPost]
        //[Route("GetMediaFormsList/{mediaTypeId}/{newsTypeId}/{channelId}/{categoryIds}/{sentimentId}/{getOptions}")]
        [Route("GetMediaFormsList/")]
        public async Task<IHttpActionResult> GetMediaFormsList(MediaSearchModel model)
        {
            var userId = User.Identity.GetUserId<int>();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            DateTime? fromDate = null, toDate = null;

            if ((!String.IsNullOrEmpty(model.startDate)))
                fromDate = DateTime.ParseExact(model.startDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);

            if ((!String.IsNullOrEmpty(model.endDate)))
                toDate = DateTime.ParseExact(model.endDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);

            var taskResult = await repository.GeMediaList(userId, model.mediaTypeId, model.newsTypeIds, model.channelIds, model.categoryIds, model.sentimentIds, model.relevanceIds, model.createdBy, model.script, model.getOptions, fromDate, toDate,model.pageNumber);
            return Ok(taskResult);
        }

        [HttpPost]
        [Route("GetMediaTickerList/")]
        public async Task<IHttpActionResult> GetMediaTickerList(MediaSearchModel model)
        {
            var UserId = model.userId;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            DateTime? fromDate = null, toDate = null;

            if ((!String.IsNullOrEmpty(model.startDate)))
                fromDate = DateTime.ParseExact(model.startDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);

            if ((!String.IsNullOrEmpty(model.endDate)))
                toDate = DateTime.ParseExact(model.endDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);

            DateTime? dt1 = new DateTime(fromDate.Value.Year, fromDate.Value.Month, fromDate.Value.Day, 00, 00, 0);
            DateTime? dt2 = new DateTime(toDate.Value.Year, toDate.Value.Month, toDate.Value.Day, 23, 59, 59);

            var taskResult = await repository.GetMediaTickerList(UserId, dt1, dt2, model.mediaTypeIds, HttpContext.Current.Request);
            return Ok(taskResult);
        }
        [HttpPost]
        [Route("GetMediaPrintList/")]
        public async Task<IHttpActionResult> GetMediaPrintList(MediaSearchModel model)
        {
            var UserId = model.userId;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            DateTime? fromDate = null, toDate = null;

            if ((!String.IsNullOrEmpty(model.startDate)))
                fromDate = DateTime.ParseExact(model.startDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);

            if ((!String.IsNullOrEmpty(model.endDate)))
                toDate = DateTime.ParseExact(model.endDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);

            DateTime? dt1 = new DateTime(fromDate.Value.Year, fromDate.Value.Month, fromDate.Value.Day, 00, 00, 0);
            DateTime? dt2 = new DateTime(toDate.Value.Year, toDate.Value.Month, toDate.Value.Day, 23, 59, 59);

            var taskResult = await repository.GetMediaPrintList(UserId, fromDate, toDate, model.mediaTypeIds, HttpContext.Current.Request);
            return Ok(taskResult);
        }
        [HttpPost]
        public async Task<IHttpActionResult> SaveMediaForm(MediaFormSaveModel model)
        {
            var userId = User.Identity.GetUserId<int>();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await repository.SaveMediaForm(model, userId, HttpContext.Current.Request.PhysicalApplicationPath);
            return Ok(taskResult);
        }

        [HttpGet]
        [Route("DeleteMediaForm/{id}")]
        public async Task<IHttpActionResult> DeleteMediaForm(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await repository.DeleteMediaForm(id);
            return Ok(taskResult);
        }

        [HttpGet]
        [Route("GetMediaForm/{id}")]
        public async Task<IHttpActionResult> GetMediaForm(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await repository.GetMediaById(id, HttpContext.Current.Request.PhysicalApplicationPath);
            return Ok(taskResult);
        }

        [HttpPost]
        [Route("ExportMediaNewsToExcel")]
        public async Task<IHttpActionResult> ExportMediaNewsToExcel(MediaSearchModel model)
        {
            var userId = User.Identity.GetUserId<int>();
            DateTime? fromDate = null, toDate = null;
            string pathnew = Request.RequestUri.AbsolutePath;
            if ((!String.IsNullOrEmpty(model.startDate)))
                fromDate = DateTime.ParseExact(model.startDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);

            if ((!String.IsNullOrEmpty(model.endDate)))
                toDate = DateTime.ParseExact(model.endDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);

            var taskResult = repository.GeMediaListAll(userId, model.mediaTypeId, model.newsTypeIds, model.channelIds, model.categoryIds, model.sentimentIds, model.relevanceIds, model.createdBy, model.script, fromDate, toDate);
            var excelData = taskResult.MediaFormList;

            string baseUrl = "";
            string excelFilename = "MediaNews" + DateTime.Now.Year + DateTime.Now.Month + DateTime.Now.Day + DateTime.Now.Hour + DateTime.Now.Minute + DateTime.Now.Second + DateTime.Now.Millisecond + ".xls";
            string SaveLocation = HttpContext.Current.Request.PhysicalApplicationPath + "Files\\" + excelFilename;
            DataTable dt = CreateExcelFile.ListToDataTable(excelData);
            CreateExcelFile file = new CreateExcelFile();
            string detail = file.CreateExcelSheet(dt, SaveLocation, new List<int>(), new List<int>(), new List<string>());
            baseUrl = "Files/" + excelFilename;
            return Ok(baseUrl);

        }

        [HttpGet]
        [Route("GetMediaChannels/{pageNumber}")]
        public async Task<IHttpActionResult> GetMediaChannels(int pageNumber)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await repository.GeMediaChannelList(pageNumber);
            return Ok(taskResult);
        }

        [HttpPost]
        public async Task<IHttpActionResult> SaveMediaChannel(MediaChannelSaveModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await repository.SaveMediaChannel(model);
            return Ok(taskResult);
        }

        [HttpGet]
        [Route("DeleteMediaChannel/{id}")]
        public async Task<IHttpActionResult> DeleteMediaChannel(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await repository.DeleteMediaChannel(id);
            return Ok(taskResult);
        }

        [HttpGet]
        [Route("DeleteCategory/{id}")]
        public async Task<IHttpActionResult> DeleteCategory(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await repository.DeleteCategory(id);
            return Ok(taskResult);
        }

        [HttpGet]
        [Route("GetCategoriesList/{pageNumber}")]
        public async Task<IHttpActionResult> GetCategoriesList(int pageNumber)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await repository.GetCategoriesList(pageNumber);
            return Ok(taskResult);
        }

        [HttpPost]
        public async Task<IHttpActionResult> SaveCategory(MediaChannelSaveModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await repository.SaveCategory(model);
            return Ok(taskResult);
        }

        [HttpPost]
        public async Task<IHttpActionResult> UploadMediaChannelFile(ChannelFileModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await repository.UploadMediaChannelFile(model, HttpContext.Current.Request.PhysicalApplicationPath);
            return Ok(taskResult);
        }

        [HttpPost]
        public async Task<IHttpActionResult> EmailMediaRecords(ConsolidateEmailModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //var taskResult = repository.GeMediaListByIds(ids);
            //var excelData = taskResult;

            //string baseUrl = "";
            //string excelFilename = "MediaNews" + DateTime.Now.Year + DateTime.Now.Month + DateTime.Now.Day + DateTime.Now.Hour + DateTime.Now.Minute + DateTime.Now.Second + DateTime.Now.Millisecond + ".xls";
            //string SaveLocation = HttpContext.Current.Request.PhysicalApplicationPath + "Files\\" + excelFilename;
            //DataTable dt = CreateExcelFile.ListToDataTable(excelData);
            //CreateExcelFile file = new CreateExcelFile();
            //string detail = file.CreateExcelSheet(dt, SaveLocation, new List<int>(), new List<int>(), new List<string>());
            //baseUrl = HttpContext.Current.Request.PhysicalApplicationPath + "Files\\" + excelFilename;

            var taskEmail = await repository.EmailRecords(model.ids, HttpContext.Current.Request, model.isEmail, User.Identity.GetUserId<int>());

            return Ok(taskEmail);
        }

        [HttpGet]
        [Route("GetAttachmentAsBase64String/{id}")]
        public async Task<IHttpActionResult> GetAttachmentAsBase64String(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await repository.GetAttachmentAsBase64String(id, HttpContext.Current.Request.PhysicalApplicationPath);
            return Ok(taskResult);
        }

        [HttpPost]
        public async Task<IHttpActionResult> SaveReportFilter(EDReportFilterModel model)
        {
            var userId = User.Identity.GetUserId<int>();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await repository.SaveReportFilter(model);
            return Ok(taskResult);
        }

    }
}