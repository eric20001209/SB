using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SB.Data;
using SB.Dto;
using SB.Models;
using System.Security.Cryptography;
using System.Text;

namespace SB.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        wucha_cloudContext _context = new wucha_cloudContext();
        [AllowAnonymous]
        [HttpPost("MD5")]
        public IActionResult Register([FromBody] RegisterDto newUser)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            Card newCard = new Card();

            //check email exists or not!
            var email = newUser.email;
            bool hasemail = _context.Card.Any(e => e.Email == email);
            var errorMsg = new { error = "Sorry, this email exists already!!!" };
            if (hasemail)
                return BadRequest(errorMsg.error);
            var password = newUser.password;
            MD5 md5Hash = MD5.Create();
            byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
            StringBuilder sBuilder = new StringBuilder();
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }
            string md5password = sBuilder.ToString().ToUpper();
            newCard.Name = newUser.name;
            newCard.Email = newUser.email;
            newCard.Password = md5password; //newUser.password;
            newCard.Type = 4;// newUser.type;
            newCard.AccessLevel = 10;// newUser.accesslevel;

            _context.Card.Add(newCard);
            _context.SaveChanges();
            return Ok(
                new { newCard.Name, newCard.Email, newCard.Password, newCard.Type, newCard.AccessLevel }
                );
        }
    }
}