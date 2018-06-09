using Microsoft.AspNet.Identity;
using SocialCRM.Web.Models.Common.User;
using SocialCRM.Web.Models.Media.Channel;
using SocialCRM.Web.Repositories.Core;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace SocialCRM.Web.Controllers.Common
{
    [System.Web.Http.RoutePrefix("api/User")]
    public class UserController : ApiController
    {
        IUserRepository repository;

        public UserController(IUserRepository userRepo)
        {
            repository = userRepo;
        }

        [HttpGet]
        [Route("GetMediaUsers/{type}/{pageNumber}")]
        public async Task<IHttpActionResult> GetMediaUsers(string type, int pageNumber)
        {
            var userId = User.Identity.GetUserId<int>();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var taskResult = await repository.GeMediaUserList(userId, type, pageNumber);
            return Ok(taskResult);
        }

        [Route("UpdatePersonalProfile")]
        [HttpPost]
        public async Task<IHttpActionResult> UpdatePersonalProfile(PersonalProfileModel model)
        {
            var userId = User.Identity.GetUserId<int>();
            if (!string.IsNullOrEmpty(model.ProfileUrl))
            {
                var uploadedImage = model.ProfileUrl.Split(new[] { ',' }, 2);
                if (uploadedImage.Count() > 1)
                {
                    var serverPath = string.Concat(ConfigurationManager.AppSettings["ProfilePath"] + userId);
                    var filePath = HttpContext.Current.Server.MapPath(serverPath);
                    if (!Directory.Exists(filePath))
                        Directory.CreateDirectory(filePath);
                    var imageInfo = uploadedImage[0];
                    var imageData = uploadedImage[1];

                    if (imageInfo.ToLower().Contains("base64") && imageInfo.ToLower().Contains("im"))
                    {
                        var fileExtension = "jpeg";
                        if (imageInfo.Contains(";"))
                        {
                            fileExtension = imageInfo.Split('/')[1].Split(';')[0];
                        }
                        // Save the uploaded file to server
                        model.ProfileUrl = string.Format("{0}/{1}.{2}", serverPath, userId, fileExtension);
                        var fileName = string.Format("{0}\\{1}.{2}", filePath, userId, fileExtension);
                        var bytes = Convert.FromBase64String(uploadedImage[1]);
                        using (MemoryStream ms = new MemoryStream(Convert.FromBase64String(imageData)))
                        {
                            using (System.Drawing.Bitmap bm2 = new System.Drawing.Bitmap(ms))
                            {
                                bm2.Save(fileName);
                            }
                        }
                    }
                }
            }
            var success = false;
            success = await repository.UpdatePersonalProfile(model);
            return Ok(success);
        }
        //[HttpPost]
        //public async Task<IHttpActionResult> SaveMediaEmail(MediaEmailSaveModel model)
        //{
        //    var userId = User.Identity.GetUserId<int>();
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }
        //    var taskResult = await repository.SaveMediaEmail(model);
        //    return Ok(taskResult);
        //}
    }
}
