using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Dto
{
    public class BranchReportDto
    {
        public string BranchName { get; set; }
        public double salesTotal { get; set; }
        public double profitTotal { get; set; }
        public double percent { get; set; }
        public double profitpercent { get; set; }
        public int TransQty { get; set; }
        public double consumPerTrans { get; set; }
        public double overallTotal { get; set; }
        public double overallProfit { get; set; }
        public double overallTrans { get; set; }
        public double overallConsumPerTrans { get; set; }
    }
}
