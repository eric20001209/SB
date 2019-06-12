using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Dto
{
    public class ItemReportFilterDto : FilterDto
    {
        public string keyword { get; set; }
        public string code { get; set; }
        public string cat { get; set; }
        //public string scat { get; set; }
        //public string sscat { get; set; }
    }
}
