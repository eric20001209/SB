using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Dto
{
    public class SalesInvoiceReportFilterDto : FilterDto
    {
        public int? invoice_number { get; set; }
        public TimeSpan start_time { get; set; } = new TimeSpan(0, 0, 0);
        public TimeSpan end_time { get; set; } = new TimeSpan(23, 59, 59);
    }
}
