using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Dto
{
    public class HourlyReportDto
    {
        public int hour { get; set; }
        public decimal amount { get; set; }
        public double transaction { get; set; }
        public decimal total_amount { get; set; }
        public double total_transaction { get; set; }
    }
}
