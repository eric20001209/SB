using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Dto
{
    public class ItemReportDto
    {
        public string description { get; set; }
        public double qty { get; set; }
        public double sales { get; set; }
        public double profit { get; set; }
    }
}
