using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using SocialCRM.Web.Models.Media.Report;
using CRM.Entities;
using SocialCRM.Web.Models.Media.Form;
using System.Runtime.InteropServices;
using CRM.Common.Extensions;
using System.Net.Mail;
using System.IO;
using System.Net.Mime;
using CRM.Common;
using Microsoft.Win32;
using System.Data.Entity;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace SocialCRM.Web.Repositories.Media
{
    public class ReportRepository : IReportRepository
    {
        [DllImport("shell32.dll", CharSet = CharSet.Unicode)]
        static extern int SHGetKnownFolderPath([MarshalAs(UnmanagedType.LPStruct)] Guid rfid, uint dwFlags, IntPtr hToken, out string pszPath);

        public async Task<List<MediaFormListModel>> GetMediaReportDrillDown(MediaNewsReportFilterSearchModel model)
        {
            List<MediaFormListModel> result = new List<MediaFormListModel>();
            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
                    {
                        result = db.GetMediaReportDrillDown(model.userId, model.mediaTypeId, model.newsTypeIds, model.channelIds, model.categoryIds,
                                                    model.relavanceIds, model.fromDate, model.toDate, model.script, model.isKEActivity,
                                                    model.reportType, model.filterType, model.xAxis1, model.xAxis2, model.pageNumber,
                                                    model.pageSize).Select(x => new MediaFormListModel()
                                                    {
                                                        Id = x.Id,
                                                        MediaType = x.MediaType,
                                                        NewsType = x.NewsType,
                                                        Channel = x.Channel,
                                                        Sentiment = x.Sentiment,
                                                        NewsRelevance = x.NewsRelation,
                                                        TransmissionDate = x.NewsDate.ToString(),
                                                        TransmissionTime = x.NewsTime.ToString(),
                                                        NoiseIndex = Convert.ToDecimal(x.NoiseIndex),
                                                        CreatedBy = x.CreatedBy,
                                                        PrValue = x.ParValue,
                                                        CreatedDate = x.CreatedDate.ToString(),
                                                        Script = x.Script,
                                                        ClippingAttachment = new MediaAttachmentModel()
                                                        {
                                                            FileName = x.FileName,
                                                            ContentType = x.FileType
                                                        }
                                                    }).ToList();
                    }
                });
            }
            catch (Exception ex)
            {
                result = null;
            }
            return result;
        }
        public async Task<List<MediaCustomizedReportModel>> GetMediaReport(MediaNewsReportFilterSearchModel model)
        {
            List<MediaCustomizedReportModel> result = new List<MediaCustomizedReportModel>();
            try
            {
                await Task.Run(() =>
                {
                    DataTable table = new DataTable();
                    using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
                    using (var cmd = new SqlCommand("GetMediaReport", con))
                    using (var da = new SqlDataAdapter(cmd))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@UserId", SqlDbType.Int).Value = model.userId;
                        cmd.Parameters.Add("@MediaTypeIds", SqlDbType.VarChar).Value = model.mediaTypeId;
                        cmd.Parameters.Add("@NewsTypeIds", SqlDbType.VarChar).Value = model.newsTypeIds;
                        cmd.Parameters.Add("@ChannelIds", SqlDbType.VarChar).Value = model.channelIds;
                        cmd.Parameters.Add("@CategoryIds", SqlDbType.VarChar).Value = model.categoryIds;
                        cmd.Parameters.Add("@RelevanceIds", SqlDbType.VarChar).Value = model.relavanceIds;
                        cmd.Parameters.Add("@FromDate", SqlDbType.DateTime).Value = model.fromDate;
                        cmd.Parameters.Add("@ToDate", SqlDbType.DateTime).Value = model.toDate;
                        cmd.Parameters.Add("@Script", SqlDbType.VarChar).Value = model.script;
                        cmd.Parameters.Add("@IsKEActivity", SqlDbType.Bit).Value = model.isKEActivity;
                        cmd.Parameters.Add("@ReportType", SqlDbType.Int).Value = model.reportType;
                        cmd.Parameters.Add("@FilterType", SqlDbType.Int).Value = model.filterType;
                        da.Fill(table);

                        foreach(DataRow row in table.Rows)
                        {
                            MediaCustomizedReportModel temp = new MediaCustomizedReportModel();
                            temp.XAxis = row.Field<string>(0);
                            temp.InsertionDate = row.Field<DateTime?>(1);
                            temp.Value1 = row.Field<int?>(2);
                            temp.Value2 = row.Field<int?>(3);
                            temp.Value3 = row.Field<int?>(4);
                            temp.Value4 = row.Field<int?>(5);
                            temp.Value5 = row.Field<int?>(6);
                            temp.Value6 = row.Field<int?>(7);
                            temp.Value7 = row.Field<int?>(8);
                            temp.Value8 = row.Field<int?>(9);
                            temp.Value9 = row.Field<int?>(10);
                            temp.Value10 = row.Field<int?>(11);
                            temp.Value11 = row.Field<int?>(12);
                            temp.Value12 = row.Field<int?>(13);
                            temp.Value13 = row.Field<int?>(14);
                            temp.Value14 = row.Field<int?>(15);
                            temp.Value15 = row.Field<int?>(16);
                            temp.Value16 = row.Field<int?>(17);
                            temp.Value17 = row.Field<int?>(18);
                            temp.Value18 = row.Field<int?>(19);
                            temp.Value19 = row.Field<int?>(20);
                            temp.Value20 = row.Field<int?>(21);
                            temp.Value21 = row.Field<int?>(22);
                            temp.Value22 = row.Field<int?>(23);
                            temp.Value23 = row.Field<int?>(24);
                            temp.Value24 = row.Field<int?>(25);
                            temp.Value25 = row.Field<int?>(26);
                            temp.Value26 = row.Field<int?>(27);
                            temp.Value27 = row.Field<int?>(28);
                            temp.Value28 = row.Field<int?>(29);
                            temp.Value29 = row.Field<int?>(30);
                            temp.Value30 = row.Field<int?>(31);
                            temp.Value31 = row.Field<int?>(32);
                            temp.Value32 = row.Field<int?>(33);
                            temp.Value33 = row.Field<int?>(34);
                            temp.Value34 = row.Field<int?>(35);
                            temp.Value35 = row.Field<int?>(36);

                            result.Add(temp);
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
        
        public async Task<ReportFilterModel> GetMediaReportFilters(int userId)
        {
            ReportFilterModel result = new ReportFilterModel();
            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
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

                        result.NewsRelatedToList = new List<SelectItemList>();
                        db.NewsRelatedToes.OrderBy(x => x.Name).ToList().ForEach(delegate (NewsRelatedTo obj)
                        {
                            result.NewsRelatedToList.Add(new SelectItemList()
                            {
                                Value = obj.Id,
                                Text = obj.Name,
                                MediaTypeId = 0
                            });
                        });

                        result.SentimentList = new List<SelectItemList>();
                        db.Sentiments.OrderBy(x => x.Name).ToList().ForEach(delegate (Sentiment obj)
                        {
                            result.SentimentList.Add(new SelectItemList()
                            {
                                Value = obj.Id,
                                Text = obj.Name,
                                MediaTypeId = 0
                            });
                        });

                        result.AgentList = new List<SelectItemList>();
                        db.AspNetUsers.OrderBy(x => x.Name).ToList().ForEach(delegate (AspNetUser obj)
                        {
                            result.AgentList.Add(new SelectItemList()
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

        public async Task<string> EmailPdfReport(string fileName, string fileContent, string contentType, string applicationPath)
        {
            string result = "";

            try
            {
                await Task.Run(() =>
                {
                using (SocialCRMEntities db = new SocialCRMEntities())
                {
                        List<Attachment> attachmentCollection = new List<Attachment>();
                        var pdfBinary = Convert.FromBase64String(fileContent.Split(',')[1]);
                        System.Web.Mvc.FileContentResult fileContentResult = new System.Web.Mvc.FileContentResult(pdfBinary, "application/octet-stream");
                        MemoryStream ms = new MemoryStream(fileContentResult.FileContents);
                        ContentType ct = new ContentType(fileContentResult.ContentType);
                        Attachment attachment = new Attachment(ms, ct);
                        attachment.Name = fileName;
                        attachmentCollection.Add(attachment);
                        List<string> emailIds = db.Emails.Where(x => x.EmailRights.Where(y => y.EmailRightName == "Consolidated").Count() > 0).Select(e => e.EmailId).Distinct().ToList<string>();
                        EmailSender.SendEmailInThread(emailIds, null, "KE - Automated Communications System Report", "Please find the attached Automated Communications System Report", attachmentCollection);
                        result = "success";
                    }
                });
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public async Task<string> EmailMediaMonitoringReport(EmailMonitoringReportModel model, HttpContext current)
        {
            string result = "";

            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
                    {
                        string tvTemplate = System.IO.File.ReadAllText(current.Server.MapPath(@"~/Content/EmailTemplates/KE_1.html"));
                        string printTemplate = System.IO.File.ReadAllText(current.Server.MapPath(@"~/Content/EmailTemplates/KE_2.html"));
                        List<string> emailIds = new List<string>();
                        emailIds = db.Emails.Where(x => x.EmailRights.Where(y => y.EmailRightName == "Consolidated").Count() > 0).Select(e => e.EmailId).Distinct().ToList<string>();
                        
                        if (model.isPrint)
                        {
                            string body = printTemplate;
                            body = body.Replace("##TotalMediaRecords##", model.totalMediaRecords.ToString());
                            body = body.Replace("##TopThreeChannels##", model.top3Areas);
                            body = body.Replace("##BottomThreeChannels##", model.bot3Areas);
                            body = body.Replace("##TotalPRValue##", model.totalPRValue.ToString());
                            for(int i = 1; i < 4; i++)
                            {
                                string sentiment = "", positive = "", neutral = "", negative = "", total = "";
                                if(i <= model.totalSentimentData.Count)
                                {
                                    sentiment = model.totalSentimentData[i - 1].RelName;
                                    positive = model.totalSentimentData[i - 1].Positive.ToString();
                                    neutral = model.totalSentimentData[i - 1].Neutral.ToString();
                                    negative = model.totalSentimentData[i - 1].Negative.ToString();
                                    total = model.totalSentimentData[i - 1].TotalSent.ToString();
                                }
                                body = body.Replace("##Sentiment" + i + "##", sentiment);
                                body = body.Replace("##Positive" + i + "##", positive);
                                body = body.Replace("##Neutral" + i + "##", neutral);
                                body = body.Replace("##Negative" + i + "##", negative);
                                body = body.Replace("##Total" + i + "##", total);
                            }

                            AlternateView av1 = AlternateView.CreateAlternateViewFromString(body, null, MediaTypeNames.Text.Html);
                            var bytes = Convert.FromBase64String(model.totalSentimentImg.Split(',')[1]);
                            LinkedResource logoPhoto = new LinkedResource(new MemoryStream(bytes), "image/jpeg");
                            logoPhoto.ContentId = "shiftReport1";
                            av1.LinkedResources.Add(logoPhoto);

                            bytes = Convert.FromBase64String(model.keTotalChannelImg.Split(',')[1]);
                            logoPhoto = new LinkedResource(new MemoryStream(bytes), "image/jpeg");
                            logoPhoto.ContentId = "shiftReport2";
                            av1.LinkedResources.Add(logoPhoto);

                            bytes = Convert.FromBase64String(model.keSentimentImg.Split(',')[1]);
                            logoPhoto = new LinkedResource(new MemoryStream(bytes), "image/jpeg");
                            logoPhoto.ContentId = "shiftReport3";
                            av1.LinkedResources.Add(logoPhoto);

                            bytes = Convert.FromBase64String(model.activitiesImg.Split(',')[1]);
                            logoPhoto = new LinkedResource(new MemoryStream(bytes), "image/jpeg");
                            logoPhoto.ContentId = "shiftReport4";
                            av1.LinkedResources.Add(logoPhoto);

                            string subject = "Print Monitoring Report (" + model.date.ToString("dd MMMM yyyy") + ")";
                            List<Attachment> attachmentList = new List<Attachment>();
                            EmailSender.SendEmailInThreadWithAlternateView(emailIds, null, subject, body, attachmentList, av1);
                        }
                        else
                        {
                            string body = tvTemplate;
                            body = body.Replace("##TotalMediaRecords##", model.totalMediaRecords.ToString());
                            body = body.Replace("##TopThreeChannels##", model.top3Areas);
                            body = body.Replace("##BottomThreeChannels##", model.bot3Areas);
                            body = body.Replace("##OnDutyAgents##", model.onDutyAgents);
                            for (int i = 1; i < 4; i++)
                            {
                                string sentiment = "", positive = "", neutral = "", negative = "", total = "";
                                if (i <= model.totalSentimentData.Count)
                                {
                                    sentiment = model.totalSentimentData[i - 1].RelName;
                                    positive = model.totalSentimentData[i - 1].Positive.ToString();
                                    neutral = model.totalSentimentData[i - 1].Neutral.ToString();
                                    negative = model.totalSentimentData[i - 1].Negative.ToString();
                                    total = model.totalSentimentData[i - 1].TotalSent.ToString();
                                }
                                body = body.Replace("##Sentiment" + i + "##", sentiment);
                                body = body.Replace("##Positive" + i + "##", positive);
                                body = body.Replace("##Neutral" + i + "##", neutral);
                                body = body.Replace("##Negative" + i + "##", negative);
                                body = body.Replace("##Total" + i + "##", total);
                            }

                            AlternateView av1 = AlternateView.CreateAlternateViewFromString(body, null, MediaTypeNames.Text.Html);
                            var bytes = Convert.FromBase64String(model.keEvolutionImg.Split(',')[1]);
                            LinkedResource logoPhoto = new LinkedResource(new MemoryStream(bytes), "image/jpeg");
                            logoPhoto.ContentId = "shiftReport1";
                            av1.LinkedResources.Add(logoPhoto);

                            bytes = Convert.FromBase64String(model.totalSentimentImg.Split(',')[1]);
                            logoPhoto = new LinkedResource(new MemoryStream(bytes), "image/jpeg");
                            logoPhoto.ContentId = "shiftReport2";
                            av1.LinkedResources.Add(logoPhoto);

                            bytes = Convert.FromBase64String(model.keSentimentImg.Split(',')[1]);
                            logoPhoto = new LinkedResource(new MemoryStream(bytes), "image/jpeg");
                            logoPhoto.ContentId = "shiftReport3";
                            av1.LinkedResources.Add(logoPhoto);

                            bytes = Convert.FromBase64String(model.keCategoryImg.Split(',')[1]);
                            logoPhoto = new LinkedResource(new MemoryStream(bytes), "image/jpeg");
                            logoPhoto.ContentId = "shiftReport4";
                            av1.LinkedResources.Add(logoPhoto);

                            bytes = Convert.FromBase64String(model.keNIChannelImg.Split(',')[1]);
                            logoPhoto = new LinkedResource(new MemoryStream(bytes), "image/jpeg");
                            logoPhoto.ContentId = "shiftReport5";
                            av1.LinkedResources.Add(logoPhoto);

                            bytes = Convert.FromBase64String(model.activitiesImg.Split(',')[1]);
                            logoPhoto = new LinkedResource(new MemoryStream(bytes), "image/jpeg");
                            logoPhoto.ContentId = "shiftReport6";
                            av1.LinkedResources.Add(logoPhoto);

                            string subject = "Electronic & Radio Monitoring - " + model.shift + " (" + model.date.ToString("dd MMMM yyyy") + ")";
                            List<Attachment> attachmentList = new List<Attachment>();
                            EmailSender.SendEmailInThreadWithAlternateView(emailIds, null, subject, body, attachmentList, av1);
                        }
                        result = "success";
                    }

                });
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }

        public async Task<EDReportModel> GetMediaReportChannelList(int userId)
        {
            EDReportModel result = new EDReportModel();
            try
            {
                await Task.Run(() =>
                {
                    using (SocialCRMEntities db = new SocialCRMEntities())
                    {
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

                        result.EDReportFilterList = new List<SelectItemListFilter>();
                        db.EDReportFilters.ToList().ForEach(delegate (EDReportFilter obj)
                        {
                            result.EDReportFilterList.Add(new SelectItemListFilter()
                            {
                                Value = obj.ReportType,
                                Text = obj.ChannelIds,
                                FilterType = obj.FilterType
                            });
                        });

                        result.SentimentList = new List<SelectItemList>();
                        db.Sentiments.OrderBy(x => x.Name).ToList().ForEach(delegate (Sentiment obj)
                        {
                            result.SentimentList.Add(new SelectItemList()
                            {
                                Value = obj.Id,
                                Text = obj.Name,
                                MediaTypeId = 0
                            });
                        });
                        result.NewsRelatedToList = new List<SelectItemList>();
                        db.NewsRelatedToes.OrderBy(x => x.Name).ToList().ForEach(delegate (NewsRelatedTo obj)
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
    }
}