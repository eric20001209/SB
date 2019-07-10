using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SB.Models
{
    public partial class TranInvoice
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int TranId { get; set; }
        public int? payment_method { get; set; }

        public decimal AmountApplied { get; set; }
        public bool Purchase { get; set; }

        public int invoice_number { get; set; }
        public Invoice invoice { get; set; }
        [ForeignKey("invoiceId")]
        public int invoiceId { get; set; }
    }
}
