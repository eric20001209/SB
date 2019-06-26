using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Dto
{
    public class SalesInvoiceItemDto
    {
        //public int? invoice_number { get; set; }
        public int code { get; set; }
        public string barcode { get; set; }
        public string name { get; set; }
        public string name_cn { get; set; }
        public decimal price { get; set; }
        public double qty { get; set; }
        public decimal? sales_total { get; set; }
    }
}
