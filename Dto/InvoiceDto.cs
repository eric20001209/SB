﻿using System;
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
        public decimal? tax { get; set; }
        public DateTime commit_date { get; set; }
        public decimal? total { get; set; }
        public BuyerDto Buyer { get; set; }
        public SellerDto Seller { get; set; }
        public List<SalesInvoiceItemDto> sales_items = new List<SalesInvoiceItemDto>();
    }
}