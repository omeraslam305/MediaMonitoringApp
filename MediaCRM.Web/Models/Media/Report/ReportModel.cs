using SocialCRM.Web.Models.Media.Form;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SocialCRM.Web.Models.Media.Report
{
    public class MediaCustomizedReportModel
    {
        public string XAxis { get; set; }
        public DateTime? InsertionDate { get; set; }
        public int? Value1 { get; set; }
        public int? Value2 { get; set; }
        public int? Value3 { get; set; }
        public int? Value4 { get; set; }
        public int? Value5 { get; set; }
        public int? Value6 { get; set; }
        public int? Value7 { get; set; }
        public int? Value8 { get; set; }
        public int? Value9 { get; set; }
        public int? Value10 { get; set; }
        public int? Value11 { get; set; }
        public int? Value12 { get; set; }
        public int? Value13 { get; set; }
        public int? Value14 { get; set; }
        public int? Value15 { get; set; }
        public int? Value16 { get; set; }
        public int? Value17 { get; set; }
        public int? Value18 { get; set; }
        public int? Value19 { get; set; }
        public int? Value20 { get; set; }
        public int? Value21 { get; set; }
        public int? Value22 { get; set; }
        public int? Value23 { get; set; }
        public int? Value24 { get; set; }
        public int? Value25 { get; set; }
        public int? Value26 { get; set; }
        public int? Value27 { get; set; }
        public int? Value28 { get; set; }
        public int? Value29 { get; set; }
        public int? Value30 { get; set; }
        public int? Value31 { get; set; }
        public int? Value32 { get; set; }
        public int? Value33 { get; set; }
        public int? Value34 { get; set; }
        public int? Value35 { get; set; }
    }

    public class ReportFilterModel
    {
        public List<SelectItemList> MediaTypesList { get; set; }
        public List<SelectItemList> NewsTypeList { get; set; }
        public List<SelectItemList> ChannelsList { get; set; }
        public List<SelectItemList> CategoriesList { get; set; }
        public List<SelectItemList> NewsRelatedToList { get; set; }
        public List<SelectItemList> SentimentList { get; set; }
        public List<SelectItemList> AgentList { get; set; }
    }
    public class EDReportModel
    {
        public List<SelectItemListFilter> EDReportFilterList { get; set; }
        public List<SelectItemList> ChannelsList { get; set; }
        public List<SelectItemList> SentimentList { get; set; }
        public List<SelectItemList> NewsRelatedToList { get; set; }
    }
    public class MediaReportSearchModel
    {
        public int mediaTypeId { get; set; }
        public int newsTypeId { get; set; }
        public int channelId { get; set; }
        public string categoryIds { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
    }

    public class Categories
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
    }

    public class MediaFormListReportModel
    {
        public decimal Id { get; set; }
        public int MediaTypeId { get; set; }
        public string MediaType { get; set; }
        public int NewsTypeId { get; set; }
        public string NewsType { get; set; }
        public string Channel { get; set; }
        public int ChannelId { get; set; }
        public List<Categories> Categories { get; set; }
        public int SentimentId { get; set; }
        public string SentimentName { get; set; }
        public string TransmissionDate { get; set; }
        public string TransmissionTime { get; set; }
        public decimal NoiseIndex { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public int NewsRelation { get; set; }
        public bool IsKEActivity { get; set; }
    }

    public class MediaNewsReportSearchModel
    {
        public int mediaTypeId { get; set; }
        public string newsTypeIds { get; set; }
        public string channelIds { get; set; }
        public string categoryIds { get; set; }
        public string relavanceIds { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string script { get; set; }
    }

    public class AgentPerformanceModel
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public double NumOfMinutes { get; set; }
    }

    public class AgentPerformanceSearchModel
    {
        public string startDate { get; set; }
        public string endDate { get; set; }
    }

    public class MediaNewsReportFilterSearchModel
    {
        public int? userId { get; set; }
        public bool isKEActivity { get; set; }
        public string mediaTypeId { get; set; }
        public string newsTypeIds { get; set; }
        public string channelIds { get; set; }
        public string categoryIds { get; set; }
        public string relavanceIds { get; set; }
        public DateTime fromDate { get; set; }
        public DateTime toDate { get; set; }
        public string script { get; set; }
        public int reportType { get; set; }
        public int filterType { get; set; }
        public string xAxis1 { get; set; }
        public string xAxis2 { get; set; }
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
        public bool isShift { get; set; }
    }

    public class SentimentCount
    {
        public int SentimentId { get; set; }
        public string SentimentName { get; set; }
        public int Count { get; set; }
    }

    public class SentimentReportWeekdayModel
    {
        public string Day { get; set; }
        public List<SentimentCount> SentimentCount { get; set; }
    }

    public class SentimentReportPerHourModel
    {
        public int Hour { get; set; }
        public List<SentimentCount> SentimentCount { get; set; }
    }

    public class SentimentReportEvolutionDateWiseModel
    {
        public string Date { get; set; }
        public List<SentimentCount> SentimentCount { get; set; }
    }

    public class SentimentReportEvolutionHourWiseModel
    {
        public string DateHour { get; set; }
        public List<SentimentCount> SentimentCount { get; set; }
    }

    public class NfiSumReportWeekdayModel
    {
        public string Day { get; set; }
        public int Frequency { get; set; }
    }

    public class NfiSumReportPerHourModel
    {
        public int Hour { get; set; }
        public int Frequency { get; set; }
    }

    public class NfiSumReportEvolutionDateWiseModel
    {
        public string Date { get; set; }
        public int Frequency { get; set; }
    }

    public class NfiSumHorWiseFrequency
    {
        public string name { get; set; }
        public List<int> data { get; set; }
    }

    public class NfiSumReportEvolutionHourWiseModel
    {
        public List<string> Date { get; set; }
        public List<NfiSumHorWiseFrequency> Frequency { get; set; }
    }

    //
    public class NfiIndReportWeekdayModel
    {
        public string Day { get; set; }
        public int PositiveFrequency { get; set; }
        public int NegativeFrequency { get; set; }
    }

    public class NfiIndReportPerHourModel
    {
        public int Hour { get; set; }
        public int PositiveFrequency { get; set; }
        public int NegativeFrequency { get; set; }
    }

    public class NfiIndReportEvolutionDateWiseModel
    {
        public string Date { get; set; }
        public int PositiveFrequency { get; set; }
        public int NegativeFrequency { get; set; }
    }

    public class NfiIndReportEvolutionHourWiseModel
    {
        public string DateHour { get; set; }
        public int PositiveFrequency { get; set; }
        public int NegativeFrequency { get; set; }
    }

    public class MediaNewsReportWeekdayModel
    {
        public string Day { get; set; }
        public int Frequency { get; set; }
    }

    public class MediaNewsReportPerHourModel
    {
        public int Hour { get; set; }
        public int Frequency { get; set; }
    }

    public class MediaNewsReportEvolutionDateWiseModel
    {
        public string Date { get; set; }
        public int Frequency { get; set; }
    }

    public class MediaNewsHorWiseFrequency
    {
        public string name { get; set; }
        public List<int> data { get; set; }
    }
    public class MediaNewReportEvolutionHourWiseModel
    {
        public List<string> Date { get; set; }
        public List<MediaNewsHorWiseFrequency> Frequency { get; set; }
    }

    public class FileToEmail
    {
        public string fileName { get; set; }
        public string fileContent { get; set; }
        public string contentType { get; set; }       
        
    }

    public class ConsolidateEmailModel
    {
        public string ids { get; set; }
        public bool isEmail { get; set; }
    }

    public class EmailMonitoringReportModel
    {
        [Required]
        public string shift { get; set; }
        [Required]
        public DateTime date { get; set; }
        [Required]
        public bool isPrint { get; set; }
        public int totalMediaRecords { get; set; }
        public string top3Areas { get; set; }
        public string bot3Areas { get; set; }
        public string onDutyAgents { get; set; }
        public int totalPRValue { get; set; }
        public string keEvolutionImg { get; set; }
        public string totalSentimentImg { get; set; }
        public string keSentimentImg { get; set; }
        public string keTotalChannelImg { get; set; }
        public string keNIChannelImg { get; set; }
        public string keCategoryImg { get; set; }
        public string activitiesImg { get; set; }
        public List<SentimentTableModel> totalSentimentData { get; set; }
    }

    public class SentimentTableModel
    {
        public string RelName { get; set; }
        public int Positive { get; set; }
        public int Neutral { get; set; }
        public int Negative { get; set; }
        public int TotalSent { get; set; }
    }
}