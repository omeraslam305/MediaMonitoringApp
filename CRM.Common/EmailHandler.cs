using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace CRM.Common
{
    public class EmailHandler
    {
        private string smtpHost;
        private int smtpPort;
        public string SMTPHost
        {
            get
            {
                return smtpHost;
            }

        }
        public int SMTPPort
        {
            get
            {
                return smtpPort;
            }

        }
        public EmailHandler()
        {

        }
        public  SmtpClient EmailClient { get; set; }
        public EmailHandler(string host, string port)
        {
            this.smtpHost = host;
            this.smtpPort = Convert.ToInt32(port);
        }
        public Boolean SendEmail(string from, string recipients, string subject, string body, List<Attachment> attachmentList)
        {
            try
            {
                MailMessage mail = new MailMessage();

                mail.IsBodyHtml = true;
                mail.Subject = subject;

                MailAddress fromAdd = new MailAddress(from, from);
                mail.From = fromAdd;

                var tos = recipients.Split(";".ToCharArray());

                foreach (var to in tos)
                {
                    MailAddress toadd = new MailAddress(to);
                    mail.To.Add(toadd);
                }

                if (attachmentList != null)
                {
                    foreach (var atch in attachmentList)
                    {
                        mail.Attachments.Add(atch);
                    }
                }

                if (EmailClient == null)
                    EmailClient = InitilizeSMPT();
                EmailClient.Send(mail);
            }
            catch (Exception ex)
            {
                return false;
            }

            return true;
        }
        public Boolean SendEmail(string from, string recipients, string subject, string body)
        {
            try
            {
                MailMessage mail = new MailMessage();
                mail.IsBodyHtml = true;
                mail.Subject = subject;
                mail.Body = body;
                MailAddress fromAdd = new MailAddress(from, from);
                mail.From = fromAdd;
                var tos = recipients.Split(";".ToCharArray());
                foreach (var to in tos)
                {
                    MailAddress toadd = new MailAddress(to);
                    mail.To.Add(toadd);
                }
                if (EmailClient == null)
                    EmailClient = InitilizeSMPT();
                EmailClient.Send(mail);

            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }
        public Boolean SendEmail(string recipients, string subject, string body)
        {
            try
            {
                MailMessage mail = new MailMessage();
                mail.IsBodyHtml = true;
                mail.Subject = subject;
                mail.Body = body;
                var tos = recipients.Split(";".ToCharArray());
                foreach (var to in tos)
                {
                    MailAddress toadd = new MailAddress(to);
                    mail.To.Add(toadd);
                }
                var fromAddress = ConfigurationManager.AppSettings["EmailUserName"];
                MailAddress fromAdd = new MailAddress(fromAddress,"360 Insight CRM Team");
                mail.From = fromAdd;
                if (EmailClient == null)
                    EmailClient = InitilizeSMPT();
                EmailClient.Send(mail);

            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }
        private SmtpClient InitilizeSMPT()
        {

            var host = ConfigurationManager.AppSettings["SmtpHost"];
            var port = Convert.ToInt32(ConfigurationManager.AppSettings["SmtpPort"]);
            var userName = ConfigurationManager.AppSettings["EmailUserName"];
            var password = ConfigurationManager.AppSettings["EmailPassword"];
           return  new SmtpClient
            {
                Host = host,
                Port = port,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(userName, password)
            };
        }
    }
}
