using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using SocialCRM.Web.Models.Media.Form;
using CRM.Entities;
using System.Data.Entity;
using System.Globalization;
using SocialCRM.Web.Models.Media.Channel;
using System.IO;
using System.Data;
using System.Configuration;
using System.Data.OleDb;
using CRM.Common;
using System.Net.Mail;
using System.Net.Mime;
using System.Text.RegularExpressions;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;

namespace SocialCRM.Web.Repositories.Media
{
    public class MediaRepository : IMediaRepository
    {
        public async Task<MediaListModel> GeMediaList(int userId, int mediaTypeId, string newsTypeIds, string channelIds, string categoryIds, string sentimentIds, string relevanceIds, string createdBy, string script, bool getOptions, DateTime? fromDate, DateTime? toDate, int pageNumber)
        {
            MediaListModel result = new MediaListModel();
            result.MediaFormList = new List<MediaFormListModel>();
            int pageSize = 100;
            pageNumber = pageNumber * pageSize;
            newsTypeIds = newsTypeIds == "0" ? "" : newsTypeIds;
            channelIds = channelIds == "0" ? "" : channelIds;
            categoryIds = categoryIds == "0" ? "" : categoryIds;
            createdBy = createdBy == "0" ? "" : createdBy;
            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
                    {
                        var userRoles = db.AspNetUsers.Find(userId).AspNetRoles.ToList();
                        var tempList = new List<MediaNew>();
                        bool isAdmin = userRoles.Where(x => x.Name == "Media-Admin").Count() > 0;
                        List<int> rights = new List<int>();
                        foreach (var role in userRoles)
                        {
                            if (role.Name == "Media-TV")
                            {
                                rights.Add(1);
                            }
                            else if (role.Name == "Media-Radio")
                            {
                                rights.Add(2);
                            }
                            else if (role.Name == "Media-Print")
                            {
                                rights.Add(3);
                            }
                        }

                        var newsTypes = new List<int>();
                        if (!String.IsNullOrEmpty(newsTypeIds))
                            newsTypes = newsTypeIds.Split(',').Select(x => Convert.ToInt32(x)).ToList<int>();

                        var channels = new List<int>();
                        if (!String.IsNullOrEmpty(channelIds))
                            channels = channelIds.Split(',').Select(x => Convert.ToInt32(x)).ToList<int>();

                        var categories = new List<int>();
                        if (!String.IsNullOrEmpty(categoryIds))
                            categories = categoryIds.Split(',').Select(x => Convert.ToInt32(x)).ToList<int>();

                        var createdBys = new List<int>();
                        if (!String.IsNullOrEmpty(createdBy))
                            createdBys = createdBy.Split(',').Select(x => Convert.ToInt32(x)).ToList<int>();

                        var sentiments = new List<int>();
                        if (!String.IsNullOrEmpty(sentimentIds))
                            sentiments = sentimentIds.Split(',').Select(x => Convert.ToInt32(x)).ToList<int>();

                        var relevances = new List<int>();
                        if (!String.IsNullOrEmpty(relevanceIds))
                            relevances = relevanceIds.Split(',').Select(x => Convert.ToInt32(x)).ToList<int>();

                        tempList = db.MediaNews.Where(x => x.StatusId == 1 &&
                                                        (!isAdmin ? rights.Contains(x.MediaTypeId) : isAdmin) &&
                                                        (mediaTypeId > 0 ? (x.MediaTypeId == mediaTypeId) : true) &&
                                                        (newsTypes.Count > 0 ? (newsTypes.Contains(x.NewsTypeId)) : true) &&
                                                        ((channels.Count > 0 && x.ChannelId.HasValue) ? (channels.Contains(x.ChannelId.Value)) : true) &&
                                                        (sentiments.Count > 0 ? (sentiments.Contains(x.SentimentId)) : true) &&
                                                        (relevances.Count > 0 ? (relevances.Contains(x.NewsRelation)) : true) &&
                                                        ((createdBys.Count > 0 && x.CreatedBy.HasValue) ? (createdBys.Contains(x.CreatedBy.Value)) : true) &&
                                                        ((fromDate.HasValue) ? (x.NewsDate >= fromDate) : true) &&
                                                        ((toDate.HasValue) ? (x.NewsDate <= toDate) : true) &&
                                                        ((!String.IsNullOrEmpty(script)) ? ((!String.IsNullOrEmpty(x.Script)) ? x.Script.Contains(script) : (!String.IsNullOrEmpty(x.Script))) : true) &&
                                                        (categories.Count > 0 ? (x.Categories.Where(y => categories.Contains(y.Id)).Count() > 0) : true)).OrderByDescending(x => x.NewsDate).ThenByDescending(x => x.NewsTime).ThenByDescending(x => x.Id).ToList();
                        var channelScores = db.ChannelScores.ToList();

                        result.TotalRecords = tempList.Count;
                        tempList = tempList.OrderByDescending(x => x.NewsDate).ThenByDescending(x => x.NewsTime).ThenByDescending(x => x.Id).Skip(pageNumber).Take(pageSize).ToList();
                        foreach (var item in tempList)
                        {
                            MediaFormListModel model = new MediaFormListModel();
                            model.Id = item.Id;
                            model.MediaType = item.MediaType != null ? item.MediaType.TypeName : string.Empty;
                            model.NewsType = item.NewsType != null ? item.NewsType.NewsTypeName : string.Empty;
                            model.Channel = item.MediaChannel != null ? item.MediaChannel.ChannelName : string.Empty;
                            model.City = item.City != null ? item.City.CityName : string.Empty;
                            model.TransmissionDate = item.NewsDate.ToString("dd/MM/yyyy");
                            model.TransmissionTime = item.NewsTime.HasValue ? item.NewsTime.Value.ToString(@"hh\:mm") : string.Empty;
                            model.Categories = item.Categories != null ? string.Join(",", item.Categories.Select(x => x.CategoryName).ToArray()) : string.Empty;
                            model.Sentiment = item.Sentiment != null ? item.Sentiment.Name : string.Empty;
                            model.Script = item.Script;
                            if (item.MediaNewsAttachment != null)
                            {
                                model.IsAttachmentUploaded = true;
                                MediaAttachmentModel clip = new MediaAttachmentModel();
                                clip.FileName = item.MediaNewsAttachment.FileName;
                                model.ClippingAttachment = clip;
                            }
                            else
                            {
                                model.IsAttachmentUploaded = false;
                            }
                            model.PrValue = item.ParValue;
                            model.NoiseIndex = CommonRepository.CalculateNoiseIndex(item, channelScores);

                            model.CreatedBy = item.AspNetUser != null ? item.AspNetUser.Name : string.Empty;
                            model.CreatedDate = item.CreatedDate.Value.ToString("dd/MM/yyyy");

                            result.MediaFormList.Add(model);
                        }

                        if (getOptions)
                        {
                            result.MediaTypesList = new List<SelectItemList>();
                            db.MediaTypes.ToList().ForEach(delegate (MediaType obj)
                            {
                                result.MediaTypesList.Add(new SelectItemList()
                                {
                                    Value = obj.Id,
                                    Text = obj.TypeName,
                                    MediaTypeId = obj.Id
                                });
                            });
                            result.NewsTypeList = new List<SelectItemList>();
                            db.NewsTypes.OrderBy(x => x.NewsTypeName).ToList().ForEach(delegate (NewsType obj)
                            {
                                result.NewsTypeList.Add(new SelectItemList()
                                {
                                    Value = obj.Id,
                                    Text = obj.NewsTypeName,
                                    MediaTypeId = obj.MediaTypeId
                                });
                            });

                            result.ChannelsList = new List<SelectItemList>();
                            db.MediaChannels.OrderBy(x => x.ChannelName).ToList().ForEach(delegate (MediaChannel obj)
                            {
                                result.ChannelsList.Add(new SelectItemList()
                                {
                                    Value = obj.Id,
                                    Text = obj.ChannelName,
                                    MediaTypeId = obj.MediaTypeId
                                });
                            });

                            result.CategoriesList = new List<SelectItemList>();
                            db.Categories.OrderBy(x => x.CategoryName).ToList().ForEach(delegate (Category obj)
                            {
                                result.CategoriesList.Add(new SelectItemList()
                                {
                                    Value = obj.Id,
                                    Text = obj.CategoryName,
                                    MediaTypeId = 0
                                });
                            });

                            result.SentimentsList = new List<SelectItemList>();
                            db.Sentiments.ToList().ForEach(delegate (Sentiment obj)
                            {
                                result.SentimentsList.Add(new SelectItemList()
                                {
                                    Value = obj.Id,
                                    Text = obj.Name,
                                    MediaTypeId = 0
                                });
                            });

                            result.NewsRelatedToList = new List<SelectItemList>();
                            db.NewsRelatedToes.ToList().ForEach(delegate (NewsRelatedTo obj)
                            {
                                result.NewsRelatedToList.Add(new SelectItemList()
                                {
                                    Value = obj.Id,
                                    Text = obj.Name,
                                    MediaTypeId = 0
                                });
                            });

                            decimal[] roleArray = { 1, 2, 3, 4 };
                            result.CreatedByUsersList = new List<SelectItemList>();
                            db.AspNetUsers.ToList().Where(x => x.AspNetRoles.ToList().Where(y => roleArray.Contains(y.Id)).Count() > 0).ToList().ForEach(delegate (AspNetUser obj)
                            {
                                result.CreatedByUsersList.Add(new SelectItemList()
                                {
                                    Value = obj.Id,
                                    Text = obj.Name,
                                    MediaTypeId = 0
                                });
                            });
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                result = null;
            }
            return result;
        }

        public async Task<bool> DeleteMediaForm(int id)
        {
            bool result = false;
            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
                    {
                        var mediaForm = db.MediaNews.Find(id);
                        if (mediaForm != null)
                        {
                            mediaForm.StatusId = 3;
                            db.MediaNews.Attach(mediaForm);
                            db.Entry(mediaForm).State = EntityState.Modified;
                            db.SaveChanges();
                        }
                        result = true;
                    }
                });
            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;
        }

        public async Task<bool> SaveMediaForm(MediaFormSaveModel model, int userId, string applicationPath)
        {
            bool result = false;
            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
                    {
                        var form = new MediaNew();
                        if (model.Id > 0)
                        {
                            if (model.MediaTypeId == 3 || model.FullEdit)
                            {
                                form = db.MediaNews.Find(model.Id);
                                form.UpdatedBy = userId;
                                form.UpdatedDate = DateTime.Now;
                            }
                        }
                        else
                        {
                            form.MediaTypeId = model.MediaTypeId;
                            form.CreatedBy = userId;
                            form.CreatedDate = DateTime.Now;
                        }

                        form.NewsTypeId = model.NewsTypeId;
                        form.ChannelId = model.ChannelId;
                        form.CityId = model.CityId > 0 ? model.CityId : null;
                        form.NewsDate = DateTime.ParseExact(model.TransmissionDate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                        if (!String.IsNullOrEmpty(model.TransmissionTime))
                            form.NewsTime = TimeSpan.Parse(model.TransmissionTime);
                        form.SentimentId = model.SentimentId;

                        var categories = model.CategoryIds.Split(',').Select(x => Convert.ToInt32(x)).ToArray();
                        form.ColumnNumber = model.ColumnNumber;
                        form.ColumnHeight = model.ColumnHeight;
                        form.AdvertisingRate = Convert.ToString(model.AdvertisingRate);
                        form.ParValue = Convert.ToString(model.PrValue);
                        form.Multiplier = model.Multiplier;
                        form.Script = model.Script;
                        form.Subject = model.Subject;
                        form.NumOfRepetition = model.NumOfRepeatition;
                        form.NewsRelation = model.NewsRelation;
                        form.PageNumber = model.PageNumber;
                        form.StatusId = 1;
                        form.IsKEActivity = model.IsKEActivity;

                        if (model.ClippingAttachment != null)
                        {
                            if (!String.IsNullOrEmpty(model.ClippingAttachment.FileName))
                            {
                                if (model.ClippingAttachment.Base64String.Contains(','))
                                {
                                    model.ClippingAttachment.Base64String = model.ClippingAttachment.Base64String.Split(',')[1];
                                }

                                if (form.MediaNewsAttachment == null)
                                {
                                    form.MediaNewsAttachment = new MediaNewsAttachment();
                                }
                                form.MediaNewsAttachment.FileName = model.ClippingAttachment.FileName;
                                form.MediaNewsAttachment.ContentType = model.ClippingAttachment.ContentType;
                            }
                        }

                        if (model.Id > 0)
                        {
                            form.Categories.Clear();
                            foreach (var item in categories)
                            {
                                form.Categories.Add(db.Categories.Find(item));
                            }
                            db.MediaNews.Attach(form);
                            db.Entry(form).State = EntityState.Modified;
                        }
                        else
                        {
                            foreach (var item in categories)
                            {
                                form.Categories.Add(db.Categories.Find(item));
                            }
                            db.MediaNews.Add(form);
                        }

                        var responseId = db.SaveChanges();
                        if (form.MediaNewsAttachment != null)
                        {
                            if (!String.IsNullOrEmpty(form.MediaNewsAttachment.FileName))
                            {
                                byte[] byteArr = Convert.FromBase64String(model.ClippingAttachment.Base64String);
                                var imgPhoto = Image.FromStream(new MemoryStream(byteArr));
                                var imgLocalPath = applicationPath + "Content\\PrintClips\\Print-" + form.Id + GetFilenameExtension(form.MediaNewsAttachment.ContentType);

                                if (File.Exists(imgLocalPath))
                                    File.Delete(imgLocalPath);

                                if (imgPhoto.Width > 1024)
                                    imgPhoto = ScaleByPercent(imgPhoto, ((double)1024 / imgPhoto.Width) * 100);
                                imgPhoto.Save(imgLocalPath, ImageFormat.Jpeg);
                            }
                        }

                        if (model.MediaTypeId != 3 && model.FullEdit)
                        {
                            List<string> emailIds = new List<string>();
                            if (model.MediaTypeId == 1)
                                emailIds = db.Emails.ToList().Where(x => x.EmailRights.Where(y => y.EmailRightName == "TV").Count() > 0).Select(z => z.EmailId).Distinct().ToList<string>();
                            else if (model.MediaTypeId == 2)
                                emailIds = db.Emails.ToList().Where(x => x.EmailRights.Where(y => y.EmailRightName == "Radio").Count() > 0).Select(z => z.EmailId).Distinct().ToList<string>();
                            else if (model.MediaTypeId == 3)
                                emailIds = db.Emails.ToList().Where(x => x.EmailRights.Where(y => y.EmailRightName == "Print").Count() > 0).Select(z => z.EmailId).Distinct().ToList<string>();

                            var signHTML = db.AspNetUsers.Find(userId).SignHTML;
                            var dbChannel = db.MediaChannels.Find(form.ChannelId);
                            var newsType = db.NewsTypes.Find(form.NewsTypeId).NewsTypeName;
                            var transmissionDate = form.NewsDate.ToString("MMM-dd-yyyy");
                            var transmissionTime = form.NewsTime.HasValue ? form.NewsTime.Value.ToString(@"hh\:mm") : string.Empty;
                            string channel = dbChannel != null ? dbChannel.ChannelName : "N/A";
                            string city = db.Cities.Where(x => x.CityId == model.CityId).FirstOrDefault().CityName;
                            if (model.Subject != "")
                                model.Subject = ", " + model.Subject;
                            string body = string.Format("<p style='margin: 0in;margin-bottom:.0001pt;font-size:11.0pt;font-family:Calibri,sans-serif;'>" +
                                        "<b><u><span style='font-size:12.0pt; font-family:Cambria,serif'>" +
                                        "{0}{1}</span></u></b><br />" +
                                        "<span style='font-size:12.0pt; font-family:Cambria,serif;'> {2}</span></p>", city, model.Subject, Regex.Replace(model.Script, @"\r\n?|\n", "<br />"));
                            body += signHTML;
                            string subject = newsType + " - " + channel + " - " + city + " - (" + transmissionDate + ")";
                            if (model.Id > 0)
                                subject = subject + " UPDATE";
                            EmailSender.SendEmail(emailIds, null, subject, body, null);
                        }
                        result = true;
                    }
                });
            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;
        }

        public async Task<MediaFormModel> GetMediaById(int id, string appPath)
        {
            MediaFormModel result = new MediaFormModel();
            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
                    {
                        if (id > 0)
                        {
                            var mediaForm = db.MediaNews.Find(id);
                            if (mediaForm != null)
                            {
                                result.Id = mediaForm.Id;
                                result.MediaTypeId = mediaForm.MediaTypeId;
                                result.NewsTypeId = mediaForm.NewsTypeId;
                                result.ChannelId = mediaForm.ChannelId.HasValue ? mediaForm.ChannelId.Value : 0;
                                result.CityId = mediaForm.CityId;
                                result.TransmissionDate = mediaForm.NewsDate.ToString("dd/MM/yyyy");
                                result.TransmissionTime = mediaForm.NewsTime.HasValue ? mediaForm.NewsTime.Value.ToString(@"hh\:mm") : string.Empty;
                                result.CategoryIds = mediaForm.Categories.Select(x => Convert.ToDecimal(x.Id)).ToList();
                                result.SentimentId = mediaForm.SentimentId;
                                result.Script = mediaForm.Script;
                                if (mediaForm.MediaNewsAttachment != null)
                                {
                                    MediaAttachmentModel clip = new MediaAttachmentModel();
                                    clip.FileName = mediaForm.MediaNewsAttachment.FileName;
                                    clip.ContentType = mediaForm.MediaNewsAttachment.ContentType;
                                    var imgLocalPath = appPath + "Content\\PrintClips\\Print-" + mediaForm.Id + GetFilenameExtension(clip.ContentType);
                                    byte[] bytes = File.ReadAllBytes(imgLocalPath);
                                    clip.Base64String = "data:" + clip.ContentType + ";base64," + Convert.ToBase64String(bytes, 0, bytes.Length);
                                    result.ClippingAttachment = clip;
                                }

                                result.ColumnNumber = mediaForm.ColumnNumber;
                                result.ColumnHeight = mediaForm.ColumnHeight;
                                //result.AdvertisingRate = !String.IsNullOrEmpty(mediaForm.AdvertisingRate) ? Convert.ToInt32(mediaForm.AdvertisingRate) : 0;
                                result.AdvertisingRate = mediaForm.AdvertisingRate;
                                result.Multiplier = mediaForm.Multiplier;
                                result.PrValue = !String.IsNullOrEmpty(mediaForm.ParValue) ? Convert.ToDouble(mediaForm.ParValue) : 0;
                                result.Subject = mediaForm.Subject;
                                result.NewsRelation = mediaForm.NewsRelation;
                                result.PageNumber = mediaForm.PageNumber;
                                result.IsKEActivity = mediaForm.IsKEActivity;
                                result.NumOfRepetition = mediaForm.NumOfRepetition;
                            }
                        }
                        result.MediaTypesList = new List<SelectItemList>();
                        db.MediaTypes.ToList().ForEach(delegate (MediaType obj)
                        {
                            result.MediaTypesList.Add(new SelectItemList()
                            {
                                Value = obj.Id,
                                Text = obj.TypeName,
                                MediaTypeId = obj.Id
                            });
                        });
                        result.NewsTypeList = new List<SelectItemList>();
                        db.NewsTypes.OrderBy(x => x.NewsTypeName).ToList().ForEach(delegate (NewsType obj)
                        {
                            result.NewsTypeList.Add(new SelectItemList()
                            {
                                Value = obj.Id,
                                Text = obj.NewsTypeName,
                                MediaTypeId = obj.MediaTypeId,
                                IsKEActivity = obj.IsKEActivity
                            });
                        });

                        result.ChannelsList = new List<SelectItemList>();
                        db.MediaChannels.OrderBy(x => x.ChannelName).ToList().ForEach(delegate (MediaChannel obj)
                        {
                            result.ChannelsList.Add(new SelectItemList()
                            {
                                Value = obj.Id,
                                Text = obj.ChannelName,
                                MediaTypeId = obj.MediaTypeId
                            });
                        });

                        result.CitiesList = new List<SelectItemList>();
                        db.Cities.OrderBy(x => x.CityName).ToList().ForEach(delegate (City obj)
                        {
                            result.CitiesList.Add(new SelectItemList()
                            {
                                Value = obj.CityId,
                                Text = obj.CityName
                            });
                        });

                        result.CategoriesList = new List<SelectItemList>();
                        db.Categories.OrderBy(x => x.CategoryName).ToList().ForEach(delegate (Category obj)
                        {
                            result.CategoriesList.Add(new SelectItemList()
                            {
                                Value = obj.Id,
                                Text = obj.CategoryName,
                                MediaTypeId = 0
                            });
                        });

                        result.SentimentsList = new List<SelectItemList>();
                        db.Sentiments.ToList().ForEach(delegate (Sentiment obj)
                        {
                            result.SentimentsList.Add(new SelectItemList()
                            {
                                Value = obj.Id,
                                Text = obj.Name,
                                MediaTypeId = 0
                            });
                        });

                        result.NewsRelatedToList = new List<SelectItemList>();
                        db.NewsRelatedToes.ToList().ForEach(delegate (NewsRelatedTo obj)
                        {
                            result.NewsRelatedToList.Add(new SelectItemList()
                            {
                                Value = obj.Id,
                                Text = obj.Name,
                                MediaTypeId = 0
                            });
                        });
                    }
                });
            }
            catch (Exception ex)
            {
                result = null;
            }
            return result;
        }

        public MediaListModel GeMediaListAll(int userId, int mediaTypeId, string newsTypeIds, string channelIds, string categoryIds, string sentimentIds, string relevanceIds, string createdBy, string script, DateTime? fromDate, DateTime? toDate)
        {
            MediaListModel result = new MediaListModel();
            result.MediaFormList = new List<MediaFormListModel>();
            newsTypeIds = newsTypeIds == "0" ? "" : newsTypeIds;
            channelIds = channelIds == "0" ? "" : channelIds;
            categoryIds = categoryIds == "0" ? "" : categoryIds;
            createdBy = createdBy == "0" ? "" : createdBy;
            try
            {
                using (SocialCRMEntities db = new SocialCRMEntities())
                {
                    var userRoles = db.AspNetUsers.Find(userId).AspNetRoles.ToList();
                    var tempList = new List<MediaNew>();
                    bool isAdmin = userRoles.Where(x => x.Name == "Media-Admin").Count() > 0;
                    List<int> rights = new List<int>();
                    foreach (var role in userRoles)
                    {
                        if (role.Name == "Media-TV")
                        {
                            rights.Add(1);
                        }
                        else if (role.Name == "Media-Radio")
                        {
                            rights.Add(2);
                        }
                        else if (role.Name == "Media-Print")
                        {
                            rights.Add(3);
                        }
                    }

                    var newsTypes = new List<int>();
                    if (!String.IsNullOrEmpty(newsTypeIds))
                        newsTypes = newsTypeIds.Split(',').Select(x => Convert.ToInt32(x)).ToList<int>();

                    var channels = new List<int>();
                    if (!String.IsNullOrEmpty(channelIds))
                        channels = channelIds.Split(',').Select(x => Convert.ToInt32(x)).ToList<int>();

                    var categories = new List<int>();
                    if (!String.IsNullOrEmpty(categoryIds))
                        categories = categoryIds.Split(',').Select(x => Convert.ToInt32(x)).ToList<int>();

                    var createdBys = new List<int>();
                    if (!String.IsNullOrEmpty(createdBy))
                        createdBys = createdBy.Split(',').Select(x => Convert.ToInt32(x)).ToList<int>();

                    var sentiments = new List<int>();
                    if (!String.IsNullOrEmpty(sentimentIds))
                        sentiments = sentimentIds.Split(',').Select(x => Convert.ToInt32(x)).ToList<int>();

                    var relevances = new List<int>();
                    if (!String.IsNullOrEmpty(relevanceIds))
                        relevances = relevanceIds.Split(',').Select(x => Convert.ToInt32(x)).ToList<int>();

                    tempList = db.MediaNews.Where(x => x.StatusId == 1 &&
                                                        (!isAdmin ? rights.Contains(x.MediaTypeId) : isAdmin) &&
                                                        (mediaTypeId > 0 ? (x.MediaTypeId == mediaTypeId) : true) &&
                                                        (newsTypes.Count > 0 ? (newsTypes.Contains(x.NewsTypeId)) : true) &&
                                                        ((channels.Count > 0 && x.ChannelId.HasValue) ? (channels.Contains(x.ChannelId.Value)) : true) &&
                                                        (sentiments.Count > 0 ? (sentiments.Contains(x.SentimentId)) : true) &&
                                                        (relevances.Count > 0 ? (relevances.Contains(x.NewsRelation)) : true) &&
                                                        ((createdBys.Count > 0 && x.CreatedBy.HasValue) ? (createdBys.Contains(x.CreatedBy.Value)) : true) &&
                                                        ((fromDate.HasValue) ? (x.NewsDate >= fromDate) : true) &&
                                                        ((toDate.HasValue) ? (x.NewsDate <= toDate) : true) &&
                                                        ((!String.IsNullOrEmpty(script)) ? ((!String.IsNullOrEmpty(x.Script)) ? x.Script.Contains(script) : (!String.IsNullOrEmpty(x.Script))) : true) &&
                                                        (categories.Count > 0 ? (x.Categories.Where(y => categories.Contains(y.Id)).Count() > 0) : true)).OrderByDescending(x => x.NewsDate).ThenByDescending(x => x.NewsTime).ThenByDescending(x => x.Id).Include(x => x.Categories).Include(x => x.MediaNewsAttachment).ToList();
                    var channelScores = db.ChannelScores.ToList();

                    result.TotalRecords = tempList.Count;

                    foreach (var item in tempList)
                    {
                        MediaFormListModel model = new MediaFormListModel();
                        model.Id = item.Id;
                        model.MediaType = item.MediaType.TypeName;
                        model.NewsType = item.NewsType.NewsTypeName;
                        model.Channel = item.MediaChannel.ChannelName;
                        model.City = item.City != null ? item.City.CityName : string.Empty;
                        model.TransmissionDate = item.NewsDate.ToString("dd/MM/yyyy");
                        model.TransmissionTime = item.NewsTime.HasValue ? item.NewsTime.Value.ToString(@"hh\:mm") : string.Empty;
                        model.Categories = string.Join(",", item.Categories.Select(x => x.CategoryName).ToArray());
                        model.Sentiment = item.Sentiment.Name;
                        model.Script = item.Script;
                        if (item.MediaTypeId == 3)
                            model.PageNumber = item.PageNumber;
                        model.NewsRelevance = item.NewsRelatedTo != null ? item.NewsRelatedTo.Name : string.Empty;
                        if (item.MediaNewsAttachment != null)
                            model.IsAttachmentUploaded = true;
                        else
                            model.IsAttachmentUploaded = false;

                        model.PrValue = item.ParValue;
                        model.Repetition = item.NumOfRepetition.HasValue ? item.NumOfRepetition.Value : 0;
                        model.NoiseIndex = CommonRepository.CalculateNoiseIndex(item, channelScores);
                        //model.NoiseIndex = item.MediaChannel.ChannelScores.Count > 0 ? item.MediaChannel.ChannelScores.FirstOrDefault().Score : 0;
                        model.CreatedBy = item.AspNetUser.Name;
                        model.CreatedDate = item.CreatedDate.Value.ToString("dd/MM/yyyy");

                        result.MediaFormList.Add(model);
                    }

                }
            }
            catch (Exception ex)
            {
                result = null;
            }
            return result;
        }

        public async Task<MediaChannelListModel> GeMediaChannelList(int pageNumber)
        {
            MediaChannelListModel result = new MediaChannelListModel();
            result.ChannelList = new List<MediaChannelModel>();
            int pageSize = 10;
            pageNumber = pageNumber * pageSize;
            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
                    {
                        var channels = db.MediaChannels.OrderBy(x => x.ChannelName).Skip(pageNumber).Take(pageSize).ToList();
                        foreach (var channel in channels)
                        {
                            MediaChannelModel model = new MediaChannelModel();
                            model.Id = channel.Id;
                            model.ChannelName = channel.ChannelName;
                            model.MediaTypeId = channel.MediaTypeId;
                            model.MediaTypeName = channel.MediaType.TypeName;

                            result.ChannelList.Add(model);
                        }

                        result.MediaTypeList = new List<SelectItemList>();
                        db.MediaTypes.ToList().ForEach(delegate (MediaType obj)
                        {
                            result.MediaTypeList.Add(new SelectItemList()
                            {
                                Value = obj.Id,
                                Text = obj.TypeName
                            });
                        });
                    }
                });
            }
            catch (Exception ex)
            {
                result = null;
            }
            return result;
        }

        public async Task<bool> SaveMediaChannel(MediaChannelSaveModel model)
        {
            bool result = false;
            try
            {
                await Task.Run(() =>
                {
                    using (var context = new SocialCRMEntities())
                    {
                        MediaChannel channelObj = new MediaChannel();
                        if (model.Id > 0)
                        {
                            channelObj = context.MediaChannels.Find(model.Id);
                        }

                        channelObj.ChannelName = model.ChannelName;
                        channelObj.MediaTypeId = model.MediaTypeId;

                        if (model.Id > 0)
                        {
                            context.MediaChannels.Attach(channelObj);
                            context.Entry(channelObj).State = EntityState.Modified;
                            context.SaveChanges();
                            result = true;
                        }
                        else
                        {
                            if (context.MediaChannels.Where(x => x.MediaTypeId == model.MediaTypeId && x.ChannelName == model.ChannelName).Count() <= 0)
                            {
                                context.MediaChannels.Add(channelObj);
                                context.SaveChanges();
                                result = true;
                            }
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

        public async Task<bool> DeleteMediaChannel(int id)
        {
            bool result = false;
            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
                    {
                        var channel = db.MediaChannels.Find(id);
                        if (channel != null)
                        {
                            var list = db.MediaNews.Where(x => x.ChannelId.HasValue ? (x.ChannelId.Value == id) : false).ToList();
                            foreach (var news in list)
                            {
                                news.ChannelId = null;
                                db.MediaNews.Attach(news);
                                db.Entry(news).State = EntityState.Modified;
                                db.SaveChanges();
                            }

                            db.MediaChannels.Remove(channel);
                            db.SaveChanges();
                        }
                        result = true;
                    }
                });
            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;
        }

        public async Task<List<MediaChannelModel>> GetCategoriesList(int pageNumber)
        {
            List<MediaChannelModel> ChannelList = new List<MediaChannelModel>();
            int pageSize = 10;
            pageNumber = pageNumber * pageSize;
            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
                    {
                        var channels = db.Categories.OrderBy(x => x.CategoryName).Skip(pageNumber).Take(pageSize).ToList();
                        foreach (var channel in channels)
                        {
                            MediaChannelModel model = new MediaChannelModel();
                            model.Id = channel.Id;
                            model.ChannelName = channel.CategoryName;

                            ChannelList.Add(model);
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                ChannelList = null;
            }
            return ChannelList;
        }

        public async Task<bool> SaveCategory(MediaChannelSaveModel model)
        {
            bool result = false;
            try
            {
                await Task.Run(() =>
                {
                    using (var context = new SocialCRMEntities())
                    {
                        Category channelObj = new Category();
                        if (model.Id > 0)
                        {
                            channelObj = context.Categories.Find(model.Id);
                        }

                        channelObj.CategoryName = model.ChannelName;

                        if (model.Id > 0)
                        {
                            context.Categories.Attach(channelObj);
                            context.Entry(channelObj).State = EntityState.Modified;
                            context.SaveChanges();
                            result = true;
                        }
                        else
                        {
                            if (context.Categories.Where(x => x.CategoryName == model.ChannelName).Count() <= 0)
                            {
                                context.Categories.Add(channelObj);
                                context.SaveChanges();
                                result = true;
                            }
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

        public async Task<bool> DeleteCategory(int id)
        {
            bool result = false;
            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
                    {
                        var channel = db.Categories.Find(id);
                        if (channel != null)
                        {
                            var list = db.MediaNews.Where(x => x.Categories.Any(y => y.Id == id)).Include(x => x.Categories).ToList();
                            foreach (var news in list)
                            {
                                news.Categories.Remove(news.Categories.Where(x => x.Id == id).FirstOrDefault());
                            }
                            db.SaveChanges();

                            db.Categories.Remove(channel);
                            db.SaveChanges();
                        }
                        result = true;
                    }
                });
            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;
        }

        public async Task<bool> UploadMediaChannelFile(ChannelFileModel model, string applicationPath)
        {
            bool result = false;
            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
                    {
                        string saveLocation = applicationPath + "Files\\Channels\\" + model.FileName;
                        if (File.Exists(@saveLocation))
                        {
                            File.Delete(@saveLocation);
                        }
                        File.WriteAllBytes(saveLocation, Convert.FromBase64String(model.Base64String.Split(',')[1]));

                        //Removing previous records
                        int response = db.DeleteChannelScores();

                        var excelData = new LinqToExcel.ExcelQueryFactory(@saveLocation);
                        //var excelData = new LinqToExcel.ExcelQueryFactory(@"D:/KE-Project/KE-CRM-Media/MediaCRM.Web/Files/Channels/Media Noise Index (IBEX).xlsx");

                        string[] worksheets = { "Electronic Media", "Print Media", "FM Channels" };
                        List<ChannelScore> scores = new List<ChannelScore>();
                        int mediaTypeId = 1, id = 1;

                        var allChannels = db.MediaChannels.ToList();
                        var allNewsTypes = db.NewsTypes.ToList();
                        var allSentiments = db.Sentiments.ToList();

                        foreach (var workSheet in worksheets)
                        {
                            if (workSheet == "Print Media")
                            {
                                mediaTypeId = 3;
                            }
                            else if (workSheet == "FM Channels")
                            {
                                mediaTypeId = 2;
                            }
                            var query = (from c in excelData.Worksheet(workSheet)
                                         select c).ToList();

                            var columnNamesList = excelData.GetColumnNames(workSheet).ToList();
                            var mediaTypeObj = db.MediaTypes.Find(mediaTypeId);
                            int count = 0;
                            foreach (var channelOrig in columnNamesList)
                            {
                                var channel = channelOrig.Replace('#', '.');
                                if (count > 0)
                                {
                                    var channelObj = allChannels.Where(x => x.ChannelName.ToLower() == channel.ToLower()).FirstOrDefault() != null ? allChannels.Where(x => x.ChannelName.ToLower() == channel.ToLower()).FirstOrDefault() : new MediaChannel();
                                    if (channelObj.Id > 0)
                                    {
                                        foreach (var newsType in query)
                                        {
                                            string scoreVal = newsType[count].Value.ToString();
                                            if (!String.IsNullOrEmpty(scoreVal))
                                            {
                                                int[] scoresArray = scoreVal.Split(',').Select(y => Convert.ToInt32(y)).ToArray();
                                                var newsTypeObj = allNewsTypes.Where(x => x.MediaTypeId == mediaTypeId && x.NewsTypeName.ToLower() == newsType[0].Value.ToString().ToLower()).FirstOrDefault() != null ? allNewsTypes.Where(x => x.MediaTypeId == mediaTypeId && x.NewsTypeName.ToLower() == newsType[0].Value.ToString().ToLower()).FirstOrDefault() : new NewsType();
                                                if (newsTypeObj.Id > 0)
                                                {
                                                    for (int i = 0; i < scoresArray.Length; i++)
                                                    {
                                                        ChannelScore scoreObj = new ChannelScore();
                                                        scoreObj.Id = id++;
                                                        scoreObj.MediaTypeId = mediaTypeId;
                                                        //scoreObj.MediaTypeId = mediaTypeObj;
                                                        scoreObj.ChannelId = channelObj.Id;
                                                        //scoreObj.MediaChannel = channelObj;
                                                        scoreObj.NewsTypeId = newsTypeObj.Id;
                                                        scoreObj.NewsType = newsTypeObj;

                                                        switch (i)
                                                        {
                                                            case 0:
                                                                scoreObj.SentimentId = 1;
                                                                scoreObj.Sentiment = allSentiments.Where(x => x.Id == 1).FirstOrDefault();
                                                                break;
                                                            case 1:
                                                                scoreObj.SentimentId = 3;
                                                                scoreObj.Sentiment = allSentiments.Where(x => x.Id == 3).FirstOrDefault();
                                                                break;
                                                            case 2:
                                                                scoreObj.SentimentId = 2;
                                                                scoreObj.Sentiment = allSentiments.Where(x => x.Id == 2).FirstOrDefault();
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                        scoreObj.Score = scoresArray[i];
                                                        scores.Add(scoreObj);
                                                    }
                                                }
                                            }
                                        }
                                    }

                                }
                                count++;
                            }
                        }

                        db.ChannelScores.AddRange(scores);
                        db.SaveChanges();
                        result = true;
                    }
                });
            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;
        }

        /// <summary> 
        /// Saves an image as a jpeg image, with the given quality 
        /// </summary> 
        /// <param name="path"> Path to which the image would be saved. </param> 
        /// <param name="quality"> An integer from 0 to 100, with 100 being the highest quality. </param> 
        private static void ReduceQuality(Image imgPhoto, ref MemoryStream newMS, int quality, string contentType)
        {
            if (quality < 0 || quality > 100)
                throw new ArgumentOutOfRangeException("quality must be between 0 and 100.");

            // Encoder parameter for image quality 
            EncoderParameter qualityParam = new EncoderParameter(Encoder.Quality, quality);
            // JPEG image codec 
            ImageCodecInfo jpegCodec = GetEncoderInfo(contentType);
            EncoderParameters encoderParams = new EncoderParameters(1);
            MemoryStream ms = new MemoryStream();
            encoderParams.Param[0] = qualityParam;
            imgPhoto.Save(newMS, jpegCodec, encoderParams);
        }

        private static Image ScaleByPercent(Image imgPhoto, double Percent)
        {
            float nPercent = ((float)Percent / 100);

            int sourceWidth = imgPhoto.Width;
            int sourceHeight = imgPhoto.Height;
            int sourceX = 0;
            int sourceY = 0;

            int destX = 0;
            int destY = 0;
            int destWidth = (int)(sourceWidth * nPercent);
            int destHeight = (int)(sourceHeight * nPercent);

            Bitmap bmPhoto = new Bitmap(destWidth, destHeight,
                                     PixelFormat.Format24bppRgb);
            bmPhoto.SetResolution(imgPhoto.HorizontalResolution,
                                    imgPhoto.VerticalResolution);

            Graphics grPhoto = Graphics.FromImage(bmPhoto);
            grPhoto.InterpolationMode = InterpolationMode.HighQualityBicubic;

            grPhoto.DrawImage(imgPhoto,
                new Rectangle(destX, destY, destWidth, destHeight),
                new Rectangle(sourceX, sourceY, sourceWidth, sourceHeight),
                GraphicsUnit.Pixel);

            grPhoto.Dispose();
            return bmPhoto;
        }

        /// <summary> 
        /// Returns the image codec with the given mime type 
        /// </summary> 
        private static ImageCodecInfo GetEncoderInfo(string mimeType)
        {
            // Get image codecs for all image formats 
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageEncoders();

            // Find the correct image codec 
            for (int i = 0; i < codecs.Length; i++)
                if (codecs[i].MimeType == mimeType)
                    return codecs[i];

            return null;
        }
        public static string GetFilenameExtension(string mimeType)
        {
            if (mimeType == "image/jpeg")
                return ".jpg";
            else if (mimeType == "image/png")
                return ".png";
            else
                return ".jpg";
        }

        public async Task<MediaArchivePDFModel> EmailRecords(string ids, HttpRequest request, bool isEmail, int userId)
        {
            MediaArchivePDFModel result = new MediaArchivePDFModel();
            result.html = "";
            result.imageList = new List<MediaAttachmentModel>();

            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
                    {
                        var signHTML = db.AspNetUsers.Find(userId).SignHTML;
                        var allNewsList = GeMediaListByIds(ids, request.PhysicalApplicationPath);
                        List<string> emailIds = new List<string>();
                        emailIds = db.Emails.Where(x => x.EmailRights.Where(y => y.EmailRightName == "Consolidated").Count() > 0).Select(e => e.EmailId).Distinct().ToList<string>();
                        string body = "";
                        if (isEmail)
                            body = "<div style='mso-element:para-border-div; border: none; border-bottom:solid windowtext 1.0pt; padding: 0in 0in 1.0pt 0in'>" +
                                    "<p style='border:none;padding:0in'><span style = 'font-size:11.0pt;color:#1F497D'><img width='231' height='67' src='cid:KELogoEmail'></span></p>" +
                                    "</div><div>";

                        for (int i = 0; i < 5; i++)
                        {
                            List<MediaFormListModel> newsList;
                            string relevanceHeading = "";
                            if (i == 0)
                            {
                                newsList = allNewsList.KENMediaList;
                                relevanceHeading = "KE NEWS";
                            }
                            else if (i == 1)
                            {
                                newsList = allNewsList.KEPRMediaList;
                                relevanceHeading = "KE NEWS";
                            }
                            else if (i == 2)
                            {
                                newsList = allNewsList.KEPNMediaList;
                                relevanceHeading = "KE NEWS";
                            }
                            else if (i == 3)
                            {
                                newsList = allNewsList.OtherDiscoMediaList;
                                relevanceHeading = "OTHER DISCO NEWS";
                            }
                            else
                            {
                                newsList = allNewsList.GeneralMediaList;
                                relevanceHeading = "GENERAL NEWS";
                            }

                            if (newsList.Count > 0 && i != 1 && i != 2)
                            {
                                body += string.Format("<p style='mso-style-priority:1;margin:0in;margin-top:10pt;margin-bottom:.0001pt;font-size:11.0pt;font-family:Calibri,sans-serif;'>" +
                                        "<b><span style='font-size:14.0pt; text-decoration: underline;'>{0}</span></b></p><br />", relevanceHeading);
                            }

                            foreach (var item in newsList)
                            {

                                if (item.MediaType == "TV" || item.MediaType == "Radio")
                                {
                                    if (item.Subject != "")
                                        item.Subject = ", " + item.Subject;
                                    body += string.Format("<p style='margin: 0in;margin-bottom:.0001pt;font-size:11.0pt;font-family:Calibri,sans-serif;'>" +
                                            "<b><span style='font-size:12.0pt; font-family:Cambria,serif; text-decoration: underline;'>" +
                                            "{0}{1}</span></b><br />" +
                                            "<span style='font-size:12.0pt; font-family:Cambria,serif;'> {2}</span></p>"
                                            , item.City, item.Subject, Regex.Replace(item.Script, @"\r\n?|\n", "<br />"));
                                }
                                else
                                {
                                    body += string.Format("<p style='mso-style-priority:1;margin:0in;margin-bottom:.0001pt;font-size:11.0pt;font-family:Calibri,sans-serif;'>" +
                                                                "<b><span style='font-size:12.0pt; font-family: &quot;Times New Roman&quot;,serif;color:#0070C0'>{0}<br/>{1}", item.Channel, item.PageNumber);
                                    if (item.IsAttachmentUploaded)
                                    {
                                        var base64String = "";
                                        if (item.ClippingAttachment.Base64String.Contains(','))
                                        {
                                            base64String = item.ClippingAttachment.Base64String.Split(',')[1];
                                        }

                                        byte[] byteArr = Convert.FromBase64String(base64String);
                                        var imgPhoto = Image.FromStream(new MemoryStream(byteArr));
                                        item.ClippingAttachment.Width = imgPhoto.Width;
                                        item.ClippingAttachment.Height = imgPhoto.Height;

                                        if (isEmail)
                                        {
                                            var imgPath = request.UrlReferrer.AbsoluteUri + "Content/PrintClips/Print-" + item.Id + GetFilenameExtension(item.ClippingAttachment.ContentType);
                                            body += string.Format("<br/><img src='{0}' alt='{1}' />", imgPath, item.ClippingAttachment.FileName);
                                        }
                                        else
                                        {
                                            body += "~";
                                            result.imageList.Add(item.ClippingAttachment);
                                        }
                                    }
                                    body += "</span></b></p>";
                                }
                                body += "<br/>";
                            }
                        }
                        body += "</div>";

                        if (isEmail)
                        {
                            body += signHTML;
                            List<Attachment> attachmentList = new List<Attachment>();
                            AlternateView av1 = AlternateView.CreateAlternateViewFromString(body, null, MediaTypeNames.Text.Html);
                            string saveLocation = request.PhysicalApplicationPath + "Content\\images\\" + "KELogoEmail.jpg";
                            LinkedResource logoPhoto = new LinkedResource(new MemoryStream(File.ReadAllBytes(saveLocation)), "image/jpeg");
                            logoPhoto.ContentId = "KELogoEmail";
                            av1.LinkedResources.Add(logoPhoto);
                            string subject = "KE Media Monitoring " + DateTime.Now.ToString("MMM dd, yyyy");
                            EmailSender.SendEmailInThreadWithAlternateView(emailIds, null, subject, body, attachmentList, av1);
                        }
                        result.html = body;
                    }

                });
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public MediaRelevanceWiseListModel GeMediaListByIds(string ids, string appPath)
        {
            MediaRelevanceWiseListModel result = new MediaRelevanceWiseListModel();
            result.GeneralMediaList = new List<MediaFormListModel>();
            result.KENMediaList = new List<MediaFormListModel>();
            result.KEPNMediaList = new List<MediaFormListModel>();
            result.KEPRMediaList = new List<MediaFormListModel>();
            result.OtherDiscoMediaList = new List<MediaFormListModel>();
            try
            {
                using (SocialCRMEntities db = new SocialCRMEntities())
                {
                    int[] mediaNewsIds = ids.Split(',').Select(x => Convert.ToInt32(x)).ToArray();
                    var mediaList = db.MediaNews.Where(x => mediaNewsIds.Contains(x.Id) && x.StatusId == 1).ToList();
                    var channelScores = db.ChannelScores.ToList();

                    foreach (var item in mediaList)
                    {
                        MediaFormListModel model = new MediaFormListModel();
                        model.Id = item.Id;
                        model.MediaType = item.MediaType != null ? item.MediaType.TypeName : string.Empty;
                        model.NewsType = item.NewsType != null ? item.NewsType.NewsTypeName : string.Empty;
                        model.Channel = item.MediaChannel != null ? item.MediaChannel.ChannelName : string.Empty;
                        model.City = item.City != null ? item.City.CityName : string.Empty;
                        model.TransmissionDate = item.NewsDate.ToString("MMM-dd-yyyy");
                        model.TransmissionTime = item.NewsTime.HasValue ? item.NewsTime.Value.ToString(@"hh\:mm") : string.Empty;
                        model.Categories = item.Categories != null ? string.Join(",", item.Categories.Select(x => x.CategoryName).ToArray()) : string.Empty;
                        model.Sentiment = item.Sentiment != null ? item.Sentiment.Name : string.Empty;
                        model.Script = item.Script;
                        model.Subject = item.Subject;
                        model.PrValue = item.ParValue;
                        model.PageNumber = item.PageNumber;
                        model.NoiseIndex = CommonRepository.CalculateNoiseIndex(item, channelScores);
                        //model.NoiseIndex = item.MediaChannel.ChannelScores.Count > 0 ? item.MediaChannel.ChannelScores.FirstOrDefault().Score : 0;
                        model.CreatedBy = item.AspNetUser != null ? item.AspNetUser.Name : string.Empty;
                        model.CreatedDate = item.CreatedDate.Value.ToString("dd/MM/yyyy");
                        if (item.MediaNewsAttachment != null)
                        {
                            model.IsAttachmentUploaded = true;
                            MediaAttachmentModel clip = new MediaAttachmentModel();
                            clip.FileName = item.MediaNewsAttachment.FileName;
                            clip.ContentType = item.MediaNewsAttachment.ContentType;
                            
                            var imgLocalPath = appPath + "Content\\PrintClips\\Print-" + item.Id + GetFilenameExtension(clip.ContentType);
                            byte[] imgBytes = File.ReadAllBytes(imgLocalPath);
                            string base64String = Convert.ToBase64String(imgBytes, 0, imgBytes.Length);
                            clip.Base64String = "data:" + item.MediaNewsAttachment.ContentType + ";base64," + base64String;
                            model.ClippingAttachment = clip;
                        }
                        else
                        {
                            model.IsAttachmentUploaded = false;
                        }

                        if (item.Sentiment.Name == "Negative" && item.NewsRelatedTo.Name == "KE")
                            result.KENMediaList.Add(model);
                        else if (item.NewsType.NewsTypeName == "Press Release" && item.NewsRelatedTo.Name == "KE")
                            result.KEPRMediaList.Add(model);
                        else if ((item.Sentiment.Name == "Positive" || item.Sentiment.Name == "Neutral") && item.NewsRelatedTo.Name == "KE")
                            result.KEPNMediaList.Add(model);
                        else if (item.NewsRelatedTo.Name == "Other Disco")
                            result.OtherDiscoMediaList.Add(model);
                        else if (item.NewsRelatedTo.Name == "General")
                            result.GeneralMediaList.Add(model);
                    }

                }
            }
            catch (Exception ex)
            {
                result = null;
            }
            return result;
        }

        public async Task<string> GetAttachmentAsBase64String(int mediaNewsId, string appPath)
        {
            string result = "";
            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
                    {
                        var attachment = db.MediaNewsAttachments.Find(mediaNewsId);
                        if (attachment != null)
                        {
                            var imgLocalPath = appPath + "Content\\PrintClips\\Print-" + mediaNewsId + GetFilenameExtension(attachment.ContentType);
                            byte[] bytes = File.ReadAllBytes(imgLocalPath);
                            string base64String = Convert.ToBase64String(bytes, 0, bytes.Length);

                            result = "data:" + attachment.ContentType + ";base64," + base64String;
                        }

                    }
                });
            }
            catch (Exception ex)
            {
                result = "";
            }
            return result;
        }

        public async Task<MediaListModel> GetMediaTickerList(int userId, DateTime? fromDate, DateTime? toDate, string mediaTypeIds, HttpRequest request)
        {
            MediaListModel result = new MediaListModel();
            result.MediaFormList = new List<MediaFormListModel>();    

            mediaTypeIds = mediaTypeIds == "0" ? "" : mediaTypeIds;
            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
                    {
                        var userRoles = db.AspNetUsers.Find(userId).AspNetRoles.ToList();
                        var tempList = new List<MediaNew>();
                        bool isAdmin = userRoles.Where(x => x.Name == "Media-Admin").Count() > 0;
                        List<int> rights = new List<int>();
                        foreach (var role in userRoles)
                        {
                            if (role.Name == "Media-TV")
                            {
                                rights.Add(1);
                            }
                            else if (role.Name == "Media-Radio")
                            {
                                rights.Add(2);
                            }                           
                        }

                        var mediaTypes = new List<int>();
                        if (!String.IsNullOrEmpty(mediaTypeIds))
                            mediaTypes = mediaTypeIds.Split(',').Select(x => Convert.ToInt32(x)).ToList<int>();

                        tempList = db.MediaNews.Where(x => x.StatusId == 1 && x.NewsRelatedTo.Id == 1 &&
                                                    (!isAdmin ? rights.Contains(x.MediaTypeId) : isAdmin) &&
                                                    (mediaTypes.Count > 0 ? (mediaTypes.Contains(x.MediaTypeId)) : true) &&
                                                    ((fromDate.HasValue) ? (x.NewsDate >= fromDate) : true)).OrderByDescending(x => x.NewsDate).ThenByDescending(x => x.NewsTime).ThenByDescending(x => x.Id).ToList();


                        result.TotalRecords = tempList.Count;
                        foreach (var item in tempList)
                        {
                            MediaFormListModel model = new MediaFormListModel();
                            model.Id = item.Id;
                            model.TransmissionDate = item.NewsDate.ToString("dd/MM/yyyy");
                            model.TransmissionTime = item.NewsTime.HasValue ? item.NewsTime.Value.ToString(@"hh\:mm") : string.Empty;                         
                            model.Script = item.Script;      
                            result.MediaFormList.Add(model);
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                result = null;
            }
            return result;
        }
        public async Task<MediaListModel> GetMediaPrintList(int userId, DateTime? fromDate, DateTime? toDate, string mediaTypeIds, HttpRequest request)
        {
            MediaListModel result = new MediaListModel();
            result.MediaFormList = new List<MediaFormListModel>();         

            mediaTypeIds = mediaTypeIds == "0" ? "" : mediaTypeIds;
            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
                    {
                        var userRoles = db.AspNetUsers.Find(userId).AspNetRoles.ToList();
                        var tempList = new List<MediaNew>();
                        bool isAdmin = userRoles.Where(x => x.Name == "Media-Admin").Count() > 0;
                        List<int> rights = new List<int>();
                        foreach (var role in userRoles)
                        {
                            if (role.Name == "Media-Print")
                            {
                                rights.Add(3);
                            }
                        }
                        var mediaTypes = new List<int>();
                        if (!String.IsNullOrEmpty(mediaTypeIds))
                            mediaTypes = mediaTypeIds.Split(',').Select(x => Convert.ToInt32(x)).ToList<int>();

                        tempList = db.MediaNews.Where(x => x.StatusId == 1 &&
                                                    (!isAdmin ? rights.Contains(x.MediaTypeId) : isAdmin) &&
                                                    (mediaTypes.Count > 0 ? (mediaTypes.Contains(x.MediaTypeId)) : true) &&
                                                    ((fromDate.HasValue) ? (x.NewsDate >= fromDate) : true)).OrderByDescending(x => x.NewsDate).ThenByDescending(x => x.NewsTime).ThenByDescending(x => x.Id).Take(50).ToList();


                        result.TotalRecords = tempList.Count;
                        foreach (var item in tempList)
                        {
                            MediaFormListModel model = new MediaFormListModel();
                            model.Id = item.Id;                     
                            model.TransmissionDate = item.NewsDate.ToString("dd/MM/yyyy");
                            model.TransmissionTime = item.NewsTime.HasValue ? item.NewsTime.Value.ToString(@"hh\:mm") : string.Empty;                      
                            model.Script = item.Script;
                            model.NewsRelevance = item.NewsRelatedTo != null ? item.NewsRelatedTo.Name : string.Empty;
                            model.PageNumber = item.PageNumber;
                            model.Channel = item.MediaChannel.ChannelName;
                            if (item.MediaNewsAttachment != null)
                            {
                                model.IsAttachmentUploaded = true;
                                MediaAttachmentModel clip = new MediaAttachmentModel();
                                clip.FileName = item.MediaNewsAttachment.FileName;
                                clip.Base64String = request.UrlReferrer.AbsoluteUri + "Content//PrintClips//Print-" + item.MediaNewsAttachment.MediaNewsId + GetFilenameExtension(item.MediaNewsAttachment.ContentType);

                                model.ClippingAttachment = clip;
                            }
                            else
                            {
                                model.IsAttachmentUploaded = false;
                            }

                            result.MediaFormList.Add(model);
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                result = null;
            }
            return result;
        }
        public async Task<bool> SaveReportFilter(EDReportFilterModel model)
        {
            bool result = false;
            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
                    {
                        var form = new EDReportFilter();
                        form.ChannelIds = model.ChannelIds;
                        form.ReportType = model.ReportType;
                        form.FilterType = model.FilterType;
                        var data = db.EDReportFilters.Where(t =>t.ReportType.Contains(form.ReportType) && t.FilterType.Contains(form.FilterType)).FirstOrDefault();

                        if (data != null)
                        {
                            data.ChannelIds = model.ChannelIds;
                            db.EDReportFilters.Attach(data);
                            db.Entry(data).State = EntityState.Modified;
                        }
                        else
                        {                           
                            db.EDReportFilters.Add(form);
                        }

                        var responseId = db.SaveChanges();                        
                        result = true;
                    }
                });
            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;
        }

    }
}