using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SB.Dto
{
    public class SalesInvoiceItemDto
    {
        public int code { get; set; }
        public string barcode { get; set; }
        public string description { get; set; }
        public decimal price { get; set; }
        public decimal qty { get; set; }
    }
}
