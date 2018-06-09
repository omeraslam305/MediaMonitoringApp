using CRM.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialCRM.Web.Repositories.Media
{
    public class CommonRepository
    {
        public static int CalculateNoiseIndex(MediaNew item, List<ChannelScore> channelScores)
        {
            int noiseIndex = 0;
            var score = channelScores.Where(x => x.MediaTypeId == item.MediaTypeId && x.NewsTypeId == item.NewsTypeId && x.ChannelId == item.ChannelId && x.SentimentId == item.SentimentId).FirstOrDefault();
            if (score != null)
            {
                noiseIndex = score.Score;

                if (item.MediaType.TypeName == "TV")
                {
                    TimeSpan from = new TimeSpan(19, 0, 0);
                    if (item.NewsTime.HasValue)
                        if(item.NewsTime.Value >= from)
                            noiseIndex = score.Score * 2;
                }
                else if (item.MediaType.TypeName == "Radio")
                {
                    TimeSpan slotOneFrom = new TimeSpan(7, 0, 0);
                    TimeSpan slotOneTo = new TimeSpan(9, 0, 0);
                    TimeSpan slotTwoFrom = new TimeSpan(17, 30, 0);
                    TimeSpan slotTwoTo = new TimeSpan(20, 0, 0);
                    if (item.NewsTime.HasValue) 
                        if((item.NewsTime.Value >= slotOneFrom && item.NewsTime.Value <= slotOneTo) || (item.NewsTime.Value >= slotTwoFrom && item.NewsTime.Value <= slotTwoTo))
                            noiseIndex = score.Score * 2;
                }
            }

            return noiseIndex;
        }
    }
}