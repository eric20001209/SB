using System;
using System.Collections.Generic;

namespace SB.Models
{
    public partial class OrderItem
    {
        public int Kid { get; set; }
        public int Id { get; set; }
        public int Code { get; set; }
        public double Quantity { get; set; }
        public string ItemName { get; set; }
        public string Supplier { get; set; }
        public string SupplierCode { get; set; }
        public decimal SupplierPrice { get; set; }
        public decimal CommitPrice { get; set; }
        public string Eta { get; set; }
        public string Note { get; set; }
        public bool System { get; set; }
        public bool SysSpecial { get; set; }
        public int Part { get; set; }
        public bool Kit { get; set; }
        public int? Krid { get; set; }
        public double DiscountPercent { get; set; }
        public decimal? OrderTotal { get; set; }
        public string StationId { get; set; }
        public string Cat { get; set; }
        public string SCat { get; set; }
        public string SsCat { get; set; }
        public string ItemNameCn { get; set; }
        public double? TaxRate { get; set; }
        public string TaxCode { get; set; }
        public int Points { get; set; }
    }
}
