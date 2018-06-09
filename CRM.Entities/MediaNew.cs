//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace CRM.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class MediaNew
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public MediaNew()
        {
            this.Categories = new HashSet<Category>();
        }
    
        public int Id { get; set; }
        public int MediaTypeId { get; set; }
        public int NewsTypeId { get; set; }
        public Nullable<int> ChannelId { get; set; }
        public Nullable<int> CityId { get; set; }
        public System.DateTime NewsDate { get; set; }
        public Nullable<System.TimeSpan> NewsTime { get; set; }
        public int SentimentId { get; set; }
        public string Script { get; set; }
        public Nullable<int> ColumnNumber { get; set; }
        public Nullable<int> ColumnHeight { get; set; }
        public string AdvertisingRate { get; set; }
        public string ParValue { get; set; }
        public Nullable<double> Multiplier { get; set; }
        public Nullable<int> StatusId { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> UpdatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedDate { get; set; }
        public string Subject { get; set; }
        public Nullable<int> NumOfRepetition { get; set; }
        public string PageNumber { get; set; }
        public int NewsRelation { get; set; }
        public bool IsKEActivity { get; set; }
    
        public virtual AspNetUser AspNetUser { get; set; }
        public virtual AspNetUser AspNetUser1 { get; set; }
        public virtual City City { get; set; }
        public virtual MediaChannel MediaChannel { get; set; }
        public virtual MediaType MediaType { get; set; }
        public virtual NewsRelatedTo NewsRelatedTo { get; set; }
        public virtual NewsType NewsType { get; set; }
        public virtual Sentiment Sentiment { get; set; }
        public virtual Status Status { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Category> Categories { get; set; }
        public virtual MediaNewsAttachment MediaNewsAttachment { get; set; }
    }
}