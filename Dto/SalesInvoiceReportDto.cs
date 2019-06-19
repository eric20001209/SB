using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Dto
{
    public class SalesInvoiceReportDto
    {
        public string branch { get; set; }
        public string invoice_number { get; set; }
        public decimal total { get; set; }
    }
}
