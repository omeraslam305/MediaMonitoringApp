using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using CRM.Entities;
using SocialCRM.Web.Models.Common.Email;
using System.Data.Entity;
using SocialCRM.Web.Models.Media.Form;

namespace SocialCRM.Web.Repositories.Media
{
    public class EmailRepository : IEmailRepository
    {
        public async Task<EmailModel> GeEmailList(int appType, int pageNumber)
        {
            EmailModel result = new EmailModel();
            result.EmailList = new List<MediaEmailModel>();
            int pageSize = 10;
            pageNumber = pageNumber * pageSize;
            try
            {
                using (SocialCRMEntities db = new SocialCRMEntities())
                {
                    var emails = db.Emails.ToList();//.Skip(pageNumber).Take(pageSize).ToList();
                    foreach (var email in emails)
                    {
                        MediaEmailModel model = new MediaEmailModel();
                        model.Id = email.Id;
                        model.EmailId = email.EmailId;
                        model.RightsArray = email.EmailRights.ToList().Select(x => x.Id).ToList<int>();
                        model.TvRightCss = model.RadioRightCss = model.PrintRightCss = model.ConsolidatedRightCss = "tick_grey";
                        foreach (var right in email.EmailRights)
                        {
                            if (right.Id == 1)
                                model.TvRightCss = "tick_green";
                            else if (right.Id == 2)
                                model.RadioRightCss = "tick_green";
                            else if (right.Id == 3)
                                model.PrintRightCss = "tick_green";
                            else if (right.Id == 4)
                                model.ConsolidatedRightCss = "tick_green";
                        }
                        result.EmailList.Add(model);
                    }

                    result.RightsList = new List<SelectItemList>();
                    db.EmailRights.ToList().ForEach(delegate (EmailRight obj)
                    {
                        result.RightsList.Add(new SelectItemList()
                        {
                            Value = obj.Id,
                            Text = obj.EmailRightName
                        });
                    });
                }
            }
            catch (Exception ex)
            {
                result = null;
            }
            return result;
        }

        public async Task<bool> SaveMediaEmail(MediaEmailSaveModel model)
        {
            bool result = false;
            try
            {
                await Task.Run(async () =>
                {
                    using (var context = new SocialCRMEntities())
                    {
                        if (model.Id > 0)
                        {
                            await DeleteMediaEmail(model.Id.Value);
                        }

                        if (context.Emails.Where(x => x.EmailId == model.EmailId).Count() <= 0)
                        {
                            Email emailObj = new Email();
                            emailObj.EmailId = model.EmailId;
                            if (!String.IsNullOrEmpty(model.Rights))
                            {
                                var rightIds = model.Rights.Split(',').Select(x => Convert.ToInt32(x)).ToArray();

                                foreach (var item in rightIds)
                                {
                                    emailObj.EmailRights.Add(context.EmailRights.Find(item));
                                }
                            }

                            context.Emails.Add(emailObj);
                            context.SaveChanges();
                            result = true;
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;
        }

        public async Task<bool> DeleteMediaEmail(int id)
        {
            bool result = false;
            try
            {
                using (SocialCRMEntities db = new SocialCRMEntities())
                {
                    var email = db.Emails.Find(id);
                    if (email != null)
                    {
                        email.EmailRights.Clear();
                        db.Emails.Remove(email);
                        db.SaveChanges();
                    }
                    result = true;
                }
            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;
        }
    }
}