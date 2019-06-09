using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Services
{
    public interface iMailService
    {
        string email { get; set; }
        string password { get; set; }
        void sendEmail(string email, string password);
    }
}
