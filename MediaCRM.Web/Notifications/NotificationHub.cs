using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using SocialCRM.Web.Models.Notifications;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace SocialCRM.Web
{
    public class NotificationHub : Hub
    {
        //readonly string _connString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
        //public async Task<IEnumerable<Notification>> GetAllMessages(int RecipientUserId)
        //{
        //    List<Notification> messages = new List<Notification>();
        //    using (var connection = new SqlConnection(_connString))
        //    {
        //        connection.Open();
        //        using (var command = new SqlCommand(@"SELECT Top 15 [ID], [NotificationText], [NotificationType], [EntryDate] FROM [dbo].[UserNotification] where [RecipientUserId] = " + RecipientUserId + " Order By EntryDate desc", connection))
        //        {
        //            command.Notification = null;

        //            var dependency = new SqlDependency(command);
        //            dependency.OnChange += new OnChangeEventHandler(dependency_OnChange);

        //            if (connection.State == ConnectionState.Closed)
        //                connection.Open();

        //            var reader = command.ExecuteReader();

        //            while (reader.Read())
        //            {
        //                //messages.Add(item: new Notification { MessageID = (int)reader["ID"], Message = (string)reader["NotificationText"], EmptyMessage = reader["NotificationType"] != DBNull.Value ? (string)reader["NotificationType"] : "", MessageDate = Convert.ToDateTime(reader["EntryDate"]) });
        //            }
        //        }

        //    }
        //    return messages;


        //}
        public void Hello()
        {
            Clients.All.hello();
        }

        [HubMethodName("sendMessages")]
        public static void SendMessages()
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();
            context.Clients.All.updateMessages();
            //context.Clients.All.updateInbox();
        }

        [HubMethodName("emailUpdates")]
        public static void EmailUpdates()
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();
            context.Clients.All.emailUpdates();
            //context.Clients.All.updateInbox();
        }

        [HubMethodName("updateInboxItems")]
        public static void UpdateInboxItems()
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();
            context.Clients.All.updateInbox();
        }

        //private void dependency_OnChange(object sender, SqlNotificationEventArgs e)
        //{
        //    if (e.Type == SqlNotificationType.Change)
        //    {
        //        NotificationHub.SendMessages();
        //    }
        //}
    }
}