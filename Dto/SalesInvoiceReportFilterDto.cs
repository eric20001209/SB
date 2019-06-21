using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Dto
{
    public class SalesInvoiceReportFilterDto : FilterDto
    {
        public int? invoice_number { get; set; }
        public DateTime start_time { get; set; }
        public DateTime end_time { get; set; }
        public decimal amount { get; set; }
    }
}
