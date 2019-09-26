using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SB.Entities;

namespace SB.Dto
{
    public class AddItemDto
    {
        public int code { get; set; }
        public string name { get; set; }
        public string name_cn { get; set; }
        public decimal price { get; set; }
        public decimal cost { get; set; }
        public int categoryid { get; set; }
        public int unitid { get; set; }

    }
}
