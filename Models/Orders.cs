using System;
using System.Collections.Generic;

namespace SB.Models
{
    public partial class Orders
    {
        public int Id { get; set; }
        public int Branch { get; set; }
        public int Number { get; set; }
        public int Part { get; set; }
        public int CardId { get; set; }
        public string PoNumber { get; set; }
        public byte? Status { get; set; }
        public int? InvoiceNumber { get; set; }
        public DateTime RecordDate { get; set; }
        public string Contact { get; set; }
        public bool SpecialShipto { get; set; }
        public string Shipto { get; set; }
        public DateTime? DateShipped { get; set; }
        public int? Shipby { get; set; }
        public decimal Freight { get; set; }
        public string Ticket { get; set; }
        public int? Sales { get; set; }
        public int? SalesManager { get; set; }
        public string SalesNote { get; set; }
        public int? LockedBy { get; set; }
        public DateTime? TimeLocked { get; set; }
        public byte ShippingMethod { get; set; }
        public string PickUpTime { get; set; }
        public byte PaymentType { get; set; }
        public bool Paid { get; set; }
        public string TransFailedReason { get; set; }
        public string DebugInfo { get; set; }
        public bool System { get; set; }
        public bool NoIndividualPrice { get; set; }
        public bool GstInclusive { get; set; }
        public int Type { get; set; }
        public decimal QuoteTotal { get; set; }
        public int? PurchaseId { get; set; }
        public bool DealerDraft { get; set; }
        public bool ShipAsParts { get; set; }
        public string DealerCustomerName { get; set; }
        public decimal DealerTotal { get; set; }
        public bool? Unchecked { get; set; }
        public byte StatusOrderonly { get; set; }
        public int? CreditOrderId { get; set; }
        public int Agent { get; set; }
        public double CustomerGst { get; set; }
        public string StationId { get; set; }
        public bool? OrderDeleted { get; set; }
        public decimal? TotalDiscount { get; set; }
        public decimal? TotalSpecial { get; set; }
        public string TableName { get; set; }
        public string DeliveryNumber { get; set; }
        public bool IsRedeem { get; set; }
        public string ExpectingDate { get; set; }
        public int Points { get; set; }
    }
}
