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
using SocialCRM.Web.Models.Common.Email;

namespace SocialCRM.Web.Controllers.Media
{
    [System.Web.Http.RoutePrefix("api/Email")]
    public class EmailController : ApiController
    {
        IEmailRepository repository;

        public EmailController(IEmailRepository emailRepo)
        {
            repository = emailRepo;
        }

        [HttpGet]
        [Route("GetEmails/{type}/{pageNumber}")]
        public async Task<IHttpActionResult> GetEmails(int type, int pageNumber)
        {
            var userId = User.Identity.GetUserId<int>();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await repository.GeEmailList(type, pageNumber);
            return Ok(taskResult);
        }

        [HttpPost]
        public async Task<IHttpActionResult> SaveMediaEmail(MediaEmailSaveModel model)
        {
            var userId = User.Identity.GetUserId<int>();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await repository.SaveMediaEmail(model);
            return Ok(taskResult);
        }

        [HttpGet]
        [Route("DeleteMediaEmail/{id}")]
        public async Task<IHttpActionResult> DeleteMediaEmail(int id)
        {
            var userId = User.Identity.GetUserId<int>();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await repository.DeleteMediaEmail(id);
            return Ok(taskResult);
        }
    }
}