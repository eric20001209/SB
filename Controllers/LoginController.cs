using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SB.Data;
using SB.Dto;
using System.Security.Cryptography;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.JsonPatch;
using SB.Models;
using System.Net.Mail;
using System.Net;

namespace SB.Controllers
{
    [Authorize]
    [Route("api/login")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        wucha_cloudContext _context = new wucha_cloudContext();

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult login([FromBody] LoginDto mylogin)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var myUserlist = _context.Card
                        .Where(c => c.Type == 4)
                        .Where(c => c.AccessLevel > 7)
                        .Select(c => new
                        {
                            id = c.Id,
                            name = c.Name,
                            login_email = c.Email,
                            password = c.Password
                        }).OrderBy(c => c.id).ToList();

            //obtain login_email and pw
            string email = mylogin.login_email;
            string passowrd = mylogin.password;

            //encrypt with md5
            MD5 md5Hash = MD5.Create();
            byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(passowrd));
            StringBuilder sBuilder = new StringBuilder();
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }
            string md5password = sBuilder.ToString().ToUpper();
            foreach (var a in myUserlist)
            {
                if (a.password == md5password && a.login_email == email)
                {
                    var claims = new[]
                    {
                        new Claim(ClaimTypes.Name, a.login_email)
                    };
                    var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Startup.Configuration["TokenSecretKey"]));
                    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                    var token = new JwtSecurityToken(
                        issuer: "http//localhost:44398",
                        audience: "http//localhost:44398",
                        claims: claims,
                        expires: DateTime.Now.AddHours(1),
                        signingCredentials: creds
                        );

                    return Ok(
                        new
                        {
                            token = new JwtSecurityTokenHandler().WriteToken(token),
                            login_email = a.login_email,
                            id = a.id,
                            name = a.name,
                            password = mylogin.password
                        }
                        );
                }
                else
                {
                    continue;
                }
            }

            return BadRequest(
                new { error = "Account not exists!!" }
                );
        }
        [AllowAnonymous]
        [HttpPost("sendPw")]
        public IActionResult sendpw(string emailto)
        {
            //check if existing user
            var login_email = _context.Card
                .Where(c => c.Type == 4).Where(c => c.AccessLevel == 10);

            //if true, generate a new pw, update db, send to user
            if (login_email.Any(c => c.Email == emailto))
            {
                Card this_card = _context.Card.Where(c => c.Email == emailto).FirstOrDefault();
                var card_id = this_card.Id;
                string new_pw = GenerateRandomString(8);
                MD5 md5Hash = MD5.Create();
                byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(new_pw));
                StringBuilder sBuilder = new StringBuilder();
                for (int i = 0; i < data.Length; i++)
                {
                    sBuilder.Append(data[i].ToString("x2"));
                }
                string md5password = sBuilder.ToString().ToUpper();
                this_card.Password = md5password;

                _context.Card.Update(this_card);
                _context.SaveChanges();

                try
                {
                    MailMessage message = new MailMessage();
                    SmtpClient smtp = new SmtpClient();
                    message.From = new MailAddress("eric2000.c@gmail.com");
                    message.To.Add(new MailAddress(emailto));
                    message.Subject = "Test";
                    message.IsBodyHtml = true; //to make message body as html  
                    message.Body = "Hi, this is your new password";
                    message.Body += " (" + new_pw + ") !!";
                    smtp.Port = 587;
                    smtp.Host = "smtp.gmail.com"; //for gmail host  
                    smtp.UseDefaultCredentials = false;
                    smtp.EnableSsl = true;
                    smtp.Credentials = new NetworkCredential("eric2000.c@gmail.com", "rfibgxxwgnlrdbyg");

                    //smtp.DeliveryMethod = SmtpDeliveryMethod.Network;

                    smtp.Send(message);
                    return Ok(new
                    {
                        pw = new_pw,
                        md5password = md5password
                    });
                }
                catch (Exception e)
                {
                    return BadRequest(e);
                }
            }
            else
                return NotFound(); ;
        }

        private static char[] constant = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' };
        /// <summary>
        /// generate 0-z random string
        /// </summary>
        /// <param name="length">string length</param>
        /// <returns>Random String :)</returns>
        public static string GenerateRandomString(int length)
        {
            string checkCode = String.Empty;
            Random rd = new Random();
            for (int i = 0; i < length; i++)
            {
                checkCode += constant[rd.Next(36)].ToString();
            }
            return checkCode;
        }

        [HttpPatch("ResetPassword/{userId}")]
        public IActionResult checkpw([FromBody] JsonPatchDocument<LoginDto> patchMylogin, int userId)
        {
            if (patchMylogin == null)
                return BadRequest();

            var accountToPatch = _context.Card.FirstOrDefault(c => c.Id == userId);
            if (accountToPatch == null)
                return NotFound();

            var newAccountToPatch = new LoginDto()
            {
                id = accountToPatch.Id,
                password = accountToPatch.Password
            };

            patchMylogin.ApplyTo(newAccountToPatch, ModelState);
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            accountToPatch.Password = newAccountToPatch.password;

            MD5 md5Hash = MD5.Create();
            byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(accountToPatch.Password));
            StringBuilder sBuilder = new StringBuilder();
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }
            string md5password = sBuilder.ToString().ToUpper();

            accountToPatch.Password = md5password;
            _context.Card.Update(accountToPatch);
            _context.SaveChanges();


            //return NoContent();
            return Ok(new
            {
                password = newAccountToPatch.password,
                md5password = md5password
            });
        }
    }
}