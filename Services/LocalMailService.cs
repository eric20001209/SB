using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.Net.Mail;
using System.Net;

namespace SB.Services
{
    public class LocalMailService:iMailService
    {
        [EmailAddress]
        public string email { get; set; }
        public string password { get; set; }

        public void sendEmail(string email, string password)
        {
            try
            {
                MailMessage message = new MailMessage();
                SmtpClient smtp = new SmtpClient();
                message.From = new MailAddress("eric2000.c@gmail.com");
                message.To.Add(new MailAddress(email));
                message.Subject = "Test";
                message.IsBodyHtml = true; //to make message body as html  
                message.Body = "Hi, this is your new password<br>";
                message.Body += "<b>NEW PASSWORD</b> is (" + password + ") !!";
                smtp.Port = 587;
                smtp.Host = "smtp.gmail.com"; //for gmail host  
                smtp.UseDefaultCredentials = false;
                smtp.EnableSsl = true;
                smtp.Credentials = new NetworkCredential("eric2000.c@gmail.com", "rfibgxxwgnlrdbyg");

                smtp.Send(message);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return;
            }
        }
    }
        
}
