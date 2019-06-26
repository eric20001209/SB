using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace SB.Dto
{
    public class InvoiceDto
    {
        public int? inovice_number { get; set; }
        public int order_id { get; set; }
        public DateTime commit_date { get; set; }
        public string sales { get; set; }
        public string customer { get; set; }
        [EmailAddress]
        public string sutomer_email { get; set; }
        public string from { get; set; }
        public string to { get; set; }

        public List<SalesInvoiceItemDto> sales_items = new List<SalesInvoiceItemDto>();
    }
}
