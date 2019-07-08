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
        public int? PaymentMethod { get; set; }
        public decimal AmountApplied { get; set; }
        public bool Purchase { get; set; }

        [ForeignKey("invoice_number")]
        public int InvoiceNumber { get; set; }
        Invoice invoice { get; set; }
    }
}
