using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;


namespace SB.Services
{
    public class JWT_Authentication
    {
        //add jwt authentication
        //JwtBearerOptions myJwtBO = new JwtBearerOptions();
        //TokenValidationParameters = new TokenValidationParameters
        //{
        //    ValidateLifetime = true,
        //    ValidateIssuerSigningKey = true,
        //    ValidIssuer = "http//localhost:44398",
        //    ValidAudience = "http//localhost:44398",
        //    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Startup.Configuration["TokenSecretKey"]))
        //};
    }
}
