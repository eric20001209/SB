using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Dto
{
    public class PaymentReportDto
    {
        //public string class_type { get; set; }
        public string payment_method { get; set; }
        public decimal amount { get; set; }
    }
}
