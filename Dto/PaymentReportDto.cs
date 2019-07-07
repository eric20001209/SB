using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SB.Dto
{
    public class PaymentReportDto
    {
        public string payment_method { get; set; }
        public decimal amount { get; set; }

        [ForeignKey("inovice_number")]
        public int? inovice_number { get; set; }
        public InvoiceWithPaymentDto invoice_with_payment { get; set; }



    }
}
