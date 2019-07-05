using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using SB.Services;
using SB.Data;
using Microsoft.EntityFrameworkCore;

namespace SB
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public static IConfiguration Configuration { get; private set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //manage my services container

            //add jwt authentication
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            { options.TokenValidationParameters = new TokenValidationParameters{
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "http//localhost:44398",
            ValidAudience = "http//localhost:44398",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Startup.Configuration["TokenSecretKey"]))
            };
            });

            services.AddMvc().AddJsonOptions(o =>
            {
                if (o.SerializerSettings.ContractResolver != null)
                {
                    var castedResolver = o.SerializerSettings.ContractResolver as DefaultContractResolver;
                    castedResolver.NamingStrategy = null;
                 }}).AddMvcOptions(o => o.OutputFormatters.Add(new XmlDataContractSerializerOutputFormatter()));

            services.AddScoped<IInvoicePaymentReporsitory, InvoicePaymentReporsitory>();
            services.AddTransient<iMailService,LocalMailService>();

            string connectionString = @"Server=localhost;Database=wucha_cloud;User Id=;password=;Trusted_Connection=True";
            services.AddDbContext<wucha_cloudContext>(option => option.UseSqlServer(connectionString));  //dependency injection
            //services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            //manage my pipeline
            app.UseAuthentication();
            app.UseStatusCodePages();

            app.UseDefaultFiles();
            app.UseStaticFiles(); //allow to access file in wwwroot folder

            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
