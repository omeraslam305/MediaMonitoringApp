using CRM.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialCRM.Web.Models.Media.Form
{
    public class SelectItemList
    {
        public int Value { get; set; }
        public string Text { get; set; }
        public int MediaTypeId { get; set; }
        public bool IsKEActivity { get; set; }
    }
    public class SelectItemListFilter
    {
        public string Value { get; set; }
        public string Text { get; set; }
        public string FilterType { get; set; }
    }
    public class MediaAttachmentModel
    {
        public string Base64String { get; set; }
        public string ContentType { get; set; }
        public string FileName { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
    }
    public class MediaArchivePDFModel
    {
        public string html { get; set; }
        public List<MediaAttachmentModel> imageList { get; set; }
    }

    public class MediaFormModel
    {
        public decimal? Id { get; set; }
        public int MediaTypeId { get; set; }
        public int NewsTypeId { get; set; }
        public int ChannelId { get; set; }
        public int? CityId { get; set; }
        public string TransmissionDate { get; set; }
        public string TransmissionTime { get; set; }
        public List<decimal> CategoryIds { get; set; }
        public int SentimentId { get; set; }
        public string Script { get; set; }
        public string Subject { get; set; }
        public MediaAttachmentModel ClippingAttachment { get; set; }
        public int? ColumnNumber { get; set; }
        public int? ColumnHeight { get; set; }
        public string AdvertisingRate { get; set; }
        public double? Multiplier { get; set; }
        public double? PrValue { get; set; }
        public int? NumOfRepetition { get; set; }
        public int NewsRelation { get; set; }
        public string PageNumber { get; set; }
        public bool IsKEActivity { get; set; }
        public List<SelectItemList> MediaTypesList { get; set; }
        public List<SelectItemList> NewsTypeList { get; set; }
        public List<SelectItemList> ChannelsList { get; set; }
        public List<SelectItemList> CitiesList { get; set; }
        public List<SelectItemList> CategoriesList { get; set; }
        public List<SelectItemList> SentimentsList { get; set; }
        public List<SelectItemList> NewsRelatedToList { get; set; }
    }

    public class MediaFormSaveModel
    {
        public decimal? Id { get; set; }
        public int MediaTypeId { get; set; }
        public int NewsTypeId { get; set; }
        public int ChannelId { get; set; }
        public int? CityId { get; set; }
        public string TransmissionDate { get; set; }
        public string TransmissionTime { get; set; }
        public string CategoryIds { get; set; }
        public int SentimentId { get; set; }
        public string Subject { get; set; }
        public string Script { get; set; }
        public MediaAttachmentModel ClippingAttachment { get; set; }
        public int? ColumnNumber { get; set; }
        public int? ColumnHeight { get; set; }
        public string AdvertisingRate { get; set; }
        public double? Multiplier { get; set; }
        public int? NumOfRepeatition { get; set; }
        public int NewsRelation { get; set; }
        public double? PrValue { get; set; }
        public bool FullEdit { get; set; }
        public string PageNumber { get; set; }
        public bool IsKEActivity { get; set; }
    }

    public class MediaListModel
    {
        public int TotalRecords { get; set; }
        public List<SelectItemList> MediaTypesList { get; set; }
        public List<SelectItemList> NewsTypeList { get; set; }
        public List<SelectItemList> ChannelsList { get; set; }
        public List<SelectItemList> CategoriesList { get; set; }
        public List<SelectItemList> SentimentsList { get; set; }
        public List<SelectItemList> CreatedByUsersList { get; set; }
        public List<SelectItemList> NewsRelatedToList { get; set; }
        public List<MediaFormListModel> MediaFormList { get; set; }
    }

    public class MediaFormListModel
    {
        public decimal Id { get; set; }
        public string MediaType { get; set; }
        public string NewsType { get; set; }
        public string Channel { get; set; }
        public string City { get; set; }
        public string TransmissionDate { get; set; }
        public string TransmissionTime { get; set; }
        public string Categories { get; set; }
        public string Sentiment { get; set; }
        public string Script { get; set; }
        public string Subject { get; set; }
        public bool IsAttachmentUploaded { get; set; }
        public MediaAttachmentModel ClippingAttachment { get; set; }
        public string PrValue { get; set; }
        public string PageNumber { get; set; }
        public int Repetition { get; set; }
        public decimal NoiseIndex { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public string NewsRelevance { get; set; }

    }

    public class MediaRelevanceWiseListModel
    {
        public List<MediaFormListModel> KENMediaList { get; set; }
        public List<MediaFormListModel> KEPRMediaList { get; set; }
        public List<MediaFormListModel> KEPNMediaList { get; set; }
        public List<MediaFormListModel> OtherDiscoMediaList { get; set; }
        public List<MediaFormListModel> GeneralMediaList { get; set; }
    }
    public class EDReportFilterModel
    {
        public string ReportType { get; set; }
        public string ChannelIds { get; set; }
        public string FilterType { get; set; }
    }
}