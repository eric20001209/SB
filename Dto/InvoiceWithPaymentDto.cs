using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Dto
{
    public class InvoiceWithPaymentDto
    {
        public int? branch { get; set; }
        public int? inovice_number { get; set; }
        public decimal? tax { get; set; }
        public DateTime commit_date { get; set; }
        public decimal? total { get; set; }

        public ICollection<PaymentReportDto> payment = new List<PaymentReportDto>();
    }
}
