using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace SB.Dto
{
    public class BuyerDto
    {
        public string name { get; set; }
        public string short_name { get; set; }
        public string trading_name { get; set; }
        [EmailAddress]
        public string email { get; set; }
        public string phone { get; set; }
        public string address { get; set; }
        public string suburb { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
    }
}
